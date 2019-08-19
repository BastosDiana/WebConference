/* contais the routes operations that translate into DB operations */
/** related with Passport route **/

const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
var exports = module.exports = {};

exports.signup = function(req, res) {
  res.status(jsonMessages.user.duplicate.status).send(jsonMessages.user.duplicate);
};

exports.signupSuccess = function(req, res) {
  res.status(jsonMessages.user.signupSuccess.status).send(jsonMessages.user.signupSuccess);
};

exports.signin = function(req, res) {
  res.status(jsonMessages.user.invalid.status).send(jsonMessages.user.invalid);
};

exports.signinSuccess = function(req, res) {
  res.status(jsonMessages.user.signinSuccess.status).send(jsonMessages.user.signinSuccess);
};

//Logout - end and destroy the session
exports.logout = function(req, res, err) {
  req.session.destroy(function(err) {
    if(err) {
      console.log('logout err: ', err);
    } else {
      res.status(jsonMessages.user.logoutError.status).send(jsonMessages.user.logoutError);
    }
    res.status(jsonMessages.user.logoutSuccess.status).send(jsonMessages.user.logoutSuccess);
  });
};
