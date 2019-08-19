/*  Loader.js to customize server */
const app = require('./server');
//create a Router
const router = require('./routes/main.route');
/* all modules required for project implementation */
//cookieParser - analize the transactions headers between client-server
const cookieParser = require('cookie-parser');
//passport - is an authentication midleware for node
const passport = require('passport');
//express-session - autenticate the transaction between client-server
const session = require('express-session');
//sanitizer - validate and sanitize data
const expressSanitizer = require('express-sanitizer');
//validator use body-parser to access data
const bodyParser = require('body-parser');
//express-validator - validate on servar side
// const expressValidator = require('express-validator'); //TODO:descomentar

/* create a connection to models folder*/
const models = require('./models/');

//create a session that will expire in an hour
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
  secret: 'webbook',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60000,
    httpOnly: true,
  }
}));
// app.use(expressValidator()); //TODO: descomentar

//to be possible to use the session, it must be associated with a global variable
app.use( function(req, res, next) {
  if(glogal.sessData === undefined) {
    global.sessData = req.session;
    global.sessData.ID = req.sessionID;
  } else {
    console.log('session exists: ', global.sessData.ID);
  }
  next();
});

//to allow login we must force the use of the passport module
app.use(passport.initialize());
app.use(passport.session());
require('./routes/auth.route.js') (app, passport);
require('./config/passport/passport.js') (passport, models.user);

//syncronize the server models (that are in models folder) with BD
models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine.');
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database update!");
});

//to force the use of router and export the application(app)
app.use('/', router);
module.exports = app;
