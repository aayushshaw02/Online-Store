const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const User = require('./models/user'); // Create this model
const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017', {
});
mongoose.connection.on('connected',()=>console.log('connected'));
// Configure Express
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));

// Configure Passport
passport.use('local',User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up your routes for login, registration, etc.
app.get('/login', (req, res) => {
  res.render('login'); // Create a login form (login.ejs)
});

app.post(
  '/login',
  function(req,res,next){
    console.log(req.body);
    next()
  },
  passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/login',
  })
);

// Add a logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password} = req.body;
    const user = new User({ username:email, name});
    await user.setPassword(password);
    await user.save();
    res.redirect('/success'); // Redirect to a success page
  } catch (error) {
    console.error(error);
    res.redirect('/signup'); // Redirect back to the signup page in case of an error
  }
});

app.get('/success', (req, res) => {
  res.send('Signup Successful');
});

// Add more routes for registration, dashboard, etc.

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
