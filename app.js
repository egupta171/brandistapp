var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./model/db');
var brand = require('./model/brands');
var offer = require('./model/offers');
var collection = require('./model/collections');
var user = require('./model/users');
var sponsored = require('./model/sponsored');

var routes = require('./routes/index');
var brands = require('./routes/brands');
var users = require('./routes/users');
var offers = require('./routes/offers');
var collections = require('./routes/collections');
var sponsoreds = require('./routes/sponsored');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/staticfiles/donotenter/', express.static(__dirname + '/public'));

app.use('/', routes);
app.use('/api/v4/users', users);
app.use('/api/v4/brands', brands);
app.use('/api/v4/offers', offers);
app.use('/api/v4/collections', collections);
app.use('/api/v4/sponsored', sponsoreds)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
