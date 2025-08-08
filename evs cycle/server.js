// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config(); // Load environment variables

// const app = express();
// const port = 3000;

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // MongoDB connection
// const mongoUser = encodeURIComponent(process.env.MONGO_USER);
// const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD); // Encode password to handle special characters like @
// const mongoDB = process.env.MONGO_DB;
// const mongoURI = `mongodb://${mongoUser}:${mongoPassword}@localhost:27017/${mongoDB}?authSource=admin`;

// mongoose.connect(mongoURI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Listing Schema
// const listingSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String, default: '' },
//   status: { type: String, default: 'pending' } // pending, approved
// });

// const Listing = mongoose.model('Listing', listingSchema);

// // Routes
// // Homepage
// app.get('/', async (req, res) => {
//   const listings = await Listing.find({ status: 'approved' });
//   res.render('index', { listings, isAdmin: req.query.isAdmin === 'true' });
// });

// // Post item form
// app.get('/post', (req, res) => {
//   res.render('post');
// });

// app.post('/post', async (req, res) => {
//   const { title, description, price, image } = req.body;
//   const newListing = new Listing({
//     title,
//     description,
//     price: parseFloat(price),
//     image: image || '',
//     status: 'pending'
//   });
//   await newListing.save();
//   res.redirect('/');
// });

// // Admin panel
// app.get('/admin', async (req, res) => {
//   const listings = await Listing.find();
//   res.render('admin', { listings });
// });

// // Manage listing (approve/delete)
// app.post('/manage/:id', async (req, res) => {
//   const { id } = req.params;
//   const { action } = req.body;

//   if (action === 'approve') {
//     await Listing.findByIdAndUpdate(id, { status: 'approved' });
//   } else if (action === 'delete') {
//     await Listing.findByIdAndDelete(id);
//   }

//   res.redirect('/admin');
// });

// // Mock buy action
// app.post('/buy/:id', (req, res) => {
//   res.send(`<script>alert('Thank you for your interest in item ${req.params.id}! (Mock checkout)'); window.location.href='/';</script>`);
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'Sakshi@123', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// MongoDB connection
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoDB = process.env.MONGO_DB;
const mongoURI = `mongodb://${mongoUser}:${mongoPassword}@localhost:27017/${mongoDB}?authSource=admin`;

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Stored as plain text
});

const User = mongoose.model('User', userSchema);

// Listing Schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  status: { type: String, default: 'pending' } // pending, approved
});

const Listing = mongoose.model('Listing', listingSchema);

// Routes
// Homepage
app.get('/', async (req, res) => {
  const listings = await Listing.find({ status: 'approved' });
  res.render('index', {
    listings,
    isAdmin: req.query.isAdmin === 'true',
    user: req.session.user || null
  });
});

// Signup
app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('signup', { error: 'Username or email already exists' });
    }
    const user = new User({ username, email, password }); // Store password as plain text
    await user.save();
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/');
  } catch (err) {
    res.render('signup', { error: 'Error creating account' });
  }
});

// Login
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) { // Compare plain text passwords
      return res.render('login', { error: 'Invalid username or password' });
    }
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/');
  } catch (err) {
    res.render('login', { error: 'Error logging in' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Post item form
app.get('/post', (req, res) => {
  res.render('post');
});

app.post('/post', async (req, res) => {
  const { title, description, price, image } = req.body;
  const newListing = new Listing({
    title,
    description,
    price: parseFloat(price),
    image: image || '',
    status: 'pending'
  });
  await newListing.save();
  res.redirect('/');
});

// Admin panel
app.get('/admin', async (req, res) => {
  const listings = await Listing.find();
  res.render('admin', { listings });
});

// Manage listing (approve/delete)
app.post('/manage/:id', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  if (action === 'approve') {
    await Listing.findByIdAndUpdate(id, { status: 'approved' });
  } else if (action === 'delete') {
    await Listing.findByIdAndDelete(id);
  }
  res.redirect('/admin');
});

// Buy action (only for logged-in users)
app.post('/buy/:id', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.send(`<script>alert('Thank you for your interest in item ${req.params.id}! (Mock checkout)'); window.location.href='/';</script>`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});