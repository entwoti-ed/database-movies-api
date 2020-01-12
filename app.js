let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose')

let authRouter = require('./routes/auth');
let apiRouter = require('./routes/api');
let USER_DB = require('./DB/USER_DB')
mongoose.set('useFindAndModify', false)
mongoose.connect(`mongodb+srv://${USER_DB.username}:${USER_DB.password}@${USER_DB.username}-jppyj.mongodb.net/data-movies?retryWrites=true&w=majority`, {useNewUrlParser: true});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
    status: false,
    message: 'errors, endpoint not found'
  })
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
