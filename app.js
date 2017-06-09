var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var request = require('request');

var index = require('./routes/index');
var users = require('./routes/users');
var registration = require('./routes/registration');
var profile = require('./routes/profile');
var visitProfile = require('./routes/visitProfile');
var editProfile = require('./routes/editProfile');

// Connect to the DB
// Increase the connection timeout requests
var options = {
    server: {
        socketOptions: {
            keepAlive: 300000, connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS : 30000
        }
    }
};
var mongoose = require('mongoose');
var fs = require("fs");
var pic = require("mongoose/lib/model.js");
var Schema = mongoose.Schema;
mongoose.connect('mongodb://matanan:Matan123@ds052819.mlab.com:52819/worktowork', options);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connection succeeded');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
app.use('/registration', registration);
app.use('/profile', profile);
app.use('/visitProfile', visitProfile);
app.use('/editProfile', editProfile);

// Schema for Users
var userSchema = new Schema({
  sirName: String,
  familyName: String,
  location: String,
  businessName: String,
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
  owner: String,
  rank: Number,
  description: String,
  name: String,
  email: String
});
var Recommendation = mongoose.model('Recommendations', recSchema);

// Schema for contact
var contactSchema = new Schema ({
  description: String,
  mail: String
});
var Contact = mongoose.model('Contact', contactSchema);

// Posting contact to DB
app.post('/addContact', function (req, res) {
  console.log(req.body);
  new Contact({
    description: req.body.description,
    mail: req.body.mail
  }).save(function (err) {
    if (err)
        console.log(err);
    else {
      res.json('saved');
      console.log('Contact added successfully');
    }
  });
});

// Posting a new recommendation to the DB
app.post('/addRec', function (req, res) {
    console.log(req.body);
  new Recommendation({
    owner: req.body.owner,
    rank: req.body.rank,
    description: req.body.description,
    name: req.body.name,
    email: req.body.email
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
    businessName: req.body.businessName,
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

// Get function - pull data about recommendation from DB
app.get('/getRec', function (req,res) {
  console.log(req.body);
  Recommendation.find(function(err, recommendation){
    res.json(recommendation);
  });
});

// Get function - pull data about Contacts from DB
app.get('/getContact', function (req,res) {
  console.log(req.body);
  Contact.find(function(err, contact){
    res.json(contact);
  });
});

app.post('/updateUser', function (req, res){
  User.findOne({email: req.body.mail}, function (err, user) {
    if (!err) {
      console.log(user);
      if (!user) { console.log('User update error.1'); }
      else {
        user.sirName = req.body.firstname;
        user.familyName = req.body.lastname;
        user.phoneNumber = req.body.phoneNumber;
        user.location = req.body.location;
        user.businessName = req.body.businessName;
        user.subject = req.body.subject;
        user.seniority = req.body.seniority;
        user.pass = req.body.passnew;
        user.save(function (err) {
          if (!err) {
            console.log('User updated');
            res.json('User updated');
          } else {
            console.log('User update error.2');
          }
        })
      }
    }
  })
});

app.post('/updateContact', function(req, res){
  Contact.findOne({ mail: req.body.mail }, function(err, contact){
    if(!err) {
      console.log(contact);
      if(!contact) { console.log('Contact update error.1'); }
      else {
        contact.description = req.body.description;
        contact.mail = req.body.mail;
        contact.save(function(err){
          if(!err) {
            console.log('Contact updated');
            res.json('Contact updated');
          }
          else
            console.log('Contact update error.2');
        });
      }
    }
  });
});

// Update the password field in the User collection in DB
app.post('/updatePassword', function(req, res){
    User.findOne({ email: req.body.email }, function(err, user){
        if(!err) {
            console.log(user);
            if(!user) { console.log('User password update error.1'); }
            else {
                user.pass = req.body.passnew;
                user.save(function(err){
                    if(!err) {
                        console.log('User password updated');
                        res.json('User password updated');
                    }
                    else
                        console.log('User password update error.2');
                });
            }
        }
    });
});

// Schema for Recommendations
var pictureSchema = new Schema ({
    owner: String,
    title: String,
    data: String
});
var Picture = mongoose.model('Picture', pictureSchema);

app.post('/uploadPic', multipartMiddleware, function(req, res) {
    var file = req.files.file;
    console.log("file = " + file);
    var pic = new Picture;
    var bitmap = fs.readFileSync(file.path);
    //pic.data = bitmap.toString('base64');
    pic.data = bitmap;
    pic.title = req.body.title;
    pic.owner = req.body.owner;
    console.log("pic.title = " +pic.title);
    console.log("pic.data = " + pic.data);
    pic.save(function(err){
        if(err)
            throw err;
        });
    res.json('Picture saved.');
});
// {owner: req.body},
app.get('/getPic', function (req, res) {
   Picture.find(function (err, content) {
       console.log("content = " + content);
       res.json(content);
   });
});



app.post('/deletePic', function (req, res) {
   Picture.findOne({_id: req.body._id }, function (err, content) {
       console.log(content);
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


