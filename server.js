var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const methodOverride = require('method-override');


require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const groupsRouter = require('./routes/groups');
const gamesRouter = require('./routes/games');
const pollsRouter = require('./routes/polls');

var app = express();

require('./config/database');
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


app.use(session({
  secret: 'SEIProject2',
  resave: false,
  saveUninitialized: true
 }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', gamesRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/groups', groupsRouter);
app.use('/polls', pollsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
