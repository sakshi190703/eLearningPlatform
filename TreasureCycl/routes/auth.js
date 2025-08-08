const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const router = express.Router();

// Passport Configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
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

router.get('/login', (req, res) => {
    res.render('login', {
      error_msg: req.flash('error'),
      success_msg: req.flash('success')
    });
  });

router.post('/login', 
    (req, res, next) => {
      console.log('Login attempt:', req.body.email);
      next();
    }, 
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true
    }), 
    (req, res) => {
      req.session.user = req.user; 
      console.log('Login successful:', req.user.email);
      req.flash('success', 'Successfully logged in!');
      res.redirect('/dashboard');
    }
  );

// router.post('/login',
//     passport.authenticate('local', {
//       failureRedirect: '/login',
//       failureFlash: true
//     }),
//     (req, res) => {
//       req.flash('success', 'Successfully logged in!');
//       res.redirect('/dashboard');
//     }
//   );

// router.post('/login', 
//     (req, res, next) => {
//         console.log('Email:', req.body.email);
//         next();
//     }, 
//     passport.authenticate('local', {
//         failureRedirect: '/login',
//         failureFlash: true
//     }), 
//     (req, res) => {
//         if (!req.user) {
//             req.flash('error', 'Authentication failed. Please try again.');
//             return res.redirect('/login');
//         }
//         // const redirectUrl = req.user.role === 'instructor' 
//         //     ? '/instructor/dashboard' 
//         //     : '/student/dashboard';
//         req.flash('success', 'Successfully logged in!');
//         res.redirect('/dashboard');
//     }
// );


router.get('/signup', (req, res) => {
    res.render('signup', {
      error_msg: req.flash('error'),
      success_msg: req.flash('success')
    });
  });

  router.post('/signup', async (req, res) => {
    try {
      const { email, username, password, role } = req.body;
      console.log('Signup attempt:', { email, username, role });
  
      // Validate role
      if (!['Buyer', 'Seller', 'Both'].includes(role)) {
        console.log('Invalid role:', role);
        req.flash('error', 'Invalid role selected.');
        return res.redirect('/signup');
      }
  
      // Check for existing user
      console.log('Checking for existing user...');
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        console.log('User already exists:', existingUser);
        req.flash('error', 'Email or username already in use.');
        return res.redirect('/signup');
      }
  
      // Create and save new user
      console.log('Creating new user...');
      const user = new User({ email, username, password, role });
      console.log('User before save:', user);
      await user.save();
      console.log('User saved:', user);
  
      // Log in the user
      req.login(user, (err) => {
        if (err) {
          console.error('Login error after signup:', err);
          req.flash('error', 'Error logging in after signup: ' + err.message);
          return res.redirect('/signup');
        }
        console.log('User logged in:', user);
        req.flash('success', 'Successfully signed up!');
        res.redirect('/dashboard');
      });
    } catch (err) {
      console.error('Signup error:', err.stack); // Log full stack trace
      req.flash('error', 'Error during signup: ' + err.message);
      res.redirect('/signup');
    }
  });


router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out!');
        res.redirect('/login');
    });
});

module.exports = router;