// IMPORT DEPENDENCIES
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

// create noSQL database named KALVE at localhost
mongoose.connect('mongodb://localhost/kalve');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');
const orders = require('./routes/orders')

// INIT SERVER

const app = express();

// INIT VIEW engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// MIDDLEWARE BODY Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// EXPRESS SESSION
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    let namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// CONNECT FLASH middleware
app.use(flash());

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// attach routes controller for redirection to index
app.use('/', routes);
// attach users controller for model manipulation
app.use('/users', users);

app.use('/order', orders);

const PORT = 3030 || process.env.PORT;

app.listen(PORT, function(){
  console.log("Listening on Port "+ PORT);
});
