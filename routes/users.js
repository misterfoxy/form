const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// __when the client clicks register or accesses /users/register
router.get('/register', function(req, res) {
  res.render('register');
});

// __when the client clicks login or accesses /users/login
router.get('/login', function(req, res) {
  res.render('login');
});

// __when client registers a new user, add it to users DB
router.post('/register', function(req, res) {
  // store bodyParsed data as individual variables
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password2;

  // use method to ensure information is not null, and password is confirmed
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // variable to hold possible errors
  let errors = req.validationErrors();

  // if errors exist, update the view for the user
  if (errors) {
    res.render('register', {errors: errors});
  } else {
    // use model to create new user in database
    let newUser = new User({name: name, email: email, username: username, password: password});

    //execute the models 'create user' function,
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      // log user information to terminal
      console.log(user);
    });

    // update view with success message
    req.flash('success_msg', 'You are registered and can log in!');
    // redirect to login page
    res.redirect('/users/login');
  }
});
// Gets username, finds if username exists, and compares the passwords
passport.use(new LocalStrategy(
// function that passes parameters of username, password, and callback function
function(username, password, done) {
  // User is looked up in refernece table
  User.getUserByUsername(username, function(err, user) {
    if (err)
      throw err;
    if (!user) {
      // if it doesn't exist, let the client know
      return done(null, false, {message: 'Unknown User'});
    }

    // entered password is compared against database password
    User.comparePassword(password, user.password, function(err, isMatch) {
      if (err)
        throw err;
      if (isMatch) {
        // return positive if password was correct
        return done(null, user);
      } else {
        // if not correct, kickback and return negative
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//on post to login, run the local passport authenticate method 
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})

module.exports = router;
