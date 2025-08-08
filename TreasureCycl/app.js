require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const app = express();
const fs = require('fs');
//const User = require('../models/user');
const Listing = require('./models/listing');

//MongoDB Connection
const mongoUrl = process.env.MONGO_URL;
async function main() {
    if (!mongoUrl) {
        console.error('MongoDB URL not found in environment variables. Please set MONGO_URL in .env');
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoUrl); 
        writeConcern: { w: 1 }// Remove useNewUrlParser and useUnifiedTopology
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}
main();

// Express Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'Sakshi@123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
passport.use(new LocalStrategy({
    usernameField: 'email',    // because your form sends email
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'No user with that email address' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Password incorrect' });
        }

        return done(null, user); // success
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash and User Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.use('/', authRoutes);

// Debug Middleware for Redirects
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be signed in to access this page');
    res.redirect('/login');
}

// Routes
app.get('/', async (req, res) => {
    const listings = await Listing.find().populate('sellerId');
    res.render('index', { listings, user: req.session.user });
    //res.render('home');
});

// Profile Route
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const listings = await Listing.find({ sellerId: req.user._id });
        res.render('profile', { user, listings, mode: user.mode });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        req.flash('error', 'Unable to load profile');
        res.redirect('/');
    }
});

// app.get('/dashboard', async (req, res) => {
//     // if (!req.session.user) return res.redirect('/login');
//     const listings = req.session.mode === 'Seller' 
//       ? await Listing.find({ sellerId: req.session.user._id })
//       : await Listing.find();
//     res.render('dashboard', { 
//       user: req.session.user, 
//       listings, 
//       mode: req.session.mode || 'Buyer' 
//     });
// });
  
app.get('/dashboard', async (req, res) => {
  try {
      // Ensure the user is logged in
      if (!req.session.user) {
          req.flash('error', 'You must be logged in to access the dashboard.');
          return res.redirect('/login');
      }

      // Default mode to 'Buyer' if not set
      if (!req.session.mode) {
          req.session.mode = 'Buyer';
      }

      // Fetch listings based on the mode
      const listings = req.session.mode === 'Seller'
          ? await Listing.find({ sellerId: req.session.user._id })
          : await Listing.find();

      // Render the dashboard
      res.render('dashboard', {
          user: req.session.user,
          listings,
          mode: req.session.mode
      });
  } catch (err) {
      console.error('Error loading dashboard:', err);
      req.flash('error', 'Failed to load the dashboard.');
      res.redirect('/login');
  }
});
//   app.post('/toggle-mode', (req, res) => {
//     try{
//     req.session.mode = req.session.mode === 'Seller' ? 'Buyer' : 'Seller';
//     res.redirect('/dashboard');
  
// }catch (err){
//         console.error('Error toggling mode:', err);
//         req.flash('error', 'Failed to toggle mode.');
//         res.redirect('/dashboard');
// }
//   });

app.post('/toggle-mode', (req, res) => {
  try {
      // Ensure the user is logged in
      if (!req.session.user) {
          req.flash('error', 'You must be logged in to toggle mode.');
          return res.redirect('/login');
      }

      // Toggle the mode
      req.session.mode = req.session.mode === 'Seller' ? 'Buyer' : 'Seller';
      console.log('Mode switched to:', req.session.mode);

      // Redirect back to the dashboard
      res.redirect('/dashboard');
  } catch (err) {
      console.error('Error toggling mode:', err);
      req.flash('error', 'Failed to toggle mode.');
      res.redirect('/dashboard');
  }
});
  
  app.get('/listing/new', (req, res) => {
    if (!req.session.user || !['Seller', 'Both'].includes(req.session.user.role)) {
      return res.redirect('/dashboard');
    }
    res.render('new-listing', { user: req.session.user });
  });
  
  app.post('/listing/new', async (req, res) => {
    if (!req.session.user || !['Seller', 'Both'].includes(req.session.user.role)) {
      return res.redirect('/dashboard');
    }
    const { title, description, price, category } = req.body;
    const listing = new Listing({
      sellerId: req.session.user._id,
      title,
      description,
      price,
      category,
      images: [] // Add image handling logic if needed
    });
    await listing.save();
    res.redirect('/dashboard');
  });

  app.post('/listing/delete/:id', async (req, res) => {
    if (!req.session.user || !['Seller', 'Both'].includes(req.session.user.role)) {
      return res.redirect('/dashboard');
    }
    await Listing.findOneAndDelete({ _id: req.params.id, sellerId: req.session.user._id });
    res.redirect('/dashboard');
  });

  // app.get('/test-save', async (req, res) => {
  //   try {
  //     const testUser = new User({
  //       email: 'test@example.com',
  //       username: 'testuser',
  //       password: 'password123',
  //       role: 'Buyer'
  //     });
  //     console.log('Test user before save:', testUser);
  //     await testUser.save();
  //     console.log('Test user saved:', testUser);
  //     res.send('Test user saved successfully');
  //   } catch (err) {
  //     console.error('Error saving test user:', err);
  //     res.status(500).send('Error saving test user: ' + err.message);
  //   }
  // });

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong! Check the console for details.');
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});