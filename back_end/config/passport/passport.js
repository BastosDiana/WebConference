//bcrypt - to encryt password
var bCrypt = require('bcrypt-nodejs');
const jsonMessagesPath = __dirname + "/../../assets/jsonMessages/";
var jsonMessages = require(jsonMessagesPath + "login");
module.exports = function(passport, user) {
  //User - contain all data from user model
  var User = user;
  //authentication by username and password
  var LocalStrategy = require('passport-local').Strategy;
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //verify if user exists
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if(user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  //REGISTER (local-signup) - verify data to insertion on the form
  //associate the form fields with passport
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  //receive data sent by form, through the route, and encrypted the password
  function(req, email, password, done) {
    const generateHash = function(password) {
      return bCrypt.hasSync(password, bCrypt.genSaltSync(8), null);
    };
    //verify if the email that is being registered already exists. If so, will be sent a message,
    //otherwise, will be created a a new user
    User.findOne({ where: { email: email } }).then(function(user) {
      if(user) {
          return done(null, false, jsonMessages.user.duplicate);
      } else {
        const userPassword = generateHash(password);
        const data = {
          email: email,
          password: userPassword,
          nome: req.body.firstname,
          apelido: req.body.lastName
        };
        //new user is created from the data filled in on the form (data)
        User.create(data).then(function(newUser, created) {
          if(!newUser) {
            return done(null, false);
          } else {
            if(newUser) {
              return done(null, newUser);
            }
          }
        });
      }
    });
  }
));

//LOGIN (local-signup) - verify data to authenticate on the form
passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
//get the data from the user model and do your verification
function(req, email, password, done) {
  const User = user;
  /**(compareSync) compare the password filled in the form with the encrypted password saved in DB **/
  const isValidPassword = function(userpass, password) {
    return bCrypt.compareSync(password, userPassword);
  }
  //find for any user that has the email entered
  User.findOne({ where: { email: email } }).then(function(user) {
    if(!user) {
      return done(null, false, jsonMessages.user.email);
    }
    //if the email entered it's found, the password will be searched and the comparison done.
    if(!isValidPassword(user.password, password)) {
      return done(null, false, jsonMessages.user.password);
    }
    const userinfo = user.get();
    return done(null, userinfo);
  }).catch(function(err) {
    console.log('err: ', err);
    return done(null, false, jsonMessages.user.error);
  });
}
));
}
