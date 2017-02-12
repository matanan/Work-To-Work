var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var registration = require('./routes/registration');
var profile = require('./routes/profile');

// Connect to the DB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://matanan:Matan123@ds052819.mlab.com:52819/worktowork');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connection succeded');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
app.use('/registration', registration);
app.use('/profile', profile);

// Schema for Users
var userSchema = new Schema({
  sirName: String,
  familyName: String,
  location: String,
  phoneNumber: Number,
  email: String,
  pass: String,
  subject: String,
  seniority: Number,
  bDate : Date
});
var User = mongoose.model('User', userSchema);

// Schema for Recommendations
var recSchema = new Schema ({
  rank: Number,
  description: String,
  mail: String
});
var Recommendation = mongoose.model('Recommendations', recSchema);

// Posting a new recommendation to the DB
app.post('/addRec', function (req, res) {
    console.log(req.body);
  new Recommendation({
    rank: req.body.rank,
    description: req.body.description,
    mail: req.body.mail
    }).save(function (err) {
    if(err)
      console.log(err);
    else {
      res.json('saved');
      console.log('Recommendation added successfully');
    }
  });
});

// Posting a new user to the DB
app.post('/addUser',function (req, res) {
  new User({
    sirName: req.body.firstname,
    familyName: req.body.lastname,
    location: req.body.location,
    phoneNumber: req.body.phoneNumber,
    email: req.body.emailnew,
    pass: req.body.passnew,
    subject: req.body.subject,
    seniority: req.body.seniority,
    bDate: req.body.bDate
  }).save(function(err){
    if(err)
      console.log(err);
    else {
      res.json('saved');
      console.log('USER added successfully');
    }
  });
});

// Get function - pull data about user from DB
app.get('/getUser', function (req,res) {
  console.log(req.body);
  User.find(function(err, user){
    res.json(user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
