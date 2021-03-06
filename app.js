var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var flash = require('express-flash');
var session = require('express-session');

var hbs = require('hbs');
var helpers = require('./hbshelpers/helpers');

var index = require('./routes/index');
var users = require('./routes/users');

var db_url = process.env.BIRD_DB_URL;

mongoose.connect(db_url)
  .then( () => { console.log('Connected to mLab'); })
  .catch( (err) => { console.log('Error connecting to mLab', err); })


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper(helpers);

// Configure flash messaging, which requires sessions
app.use(session( { secret: 'top secret', resave: false, saveUninitialized: false}));
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.status)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Check for invalid ObjectId errors, and respond with 404 error
  if (err.kind === 'ObjectId' && err.name === 'CastError') {
    err.status = 404;
  }

  if (err.status === 404) {
    res.render('404');  // render custom 404 page
  }

  else {
    res.status(err.status || 500);
    res.render('error');      // render the error page
  }

});

module.exports = app;
