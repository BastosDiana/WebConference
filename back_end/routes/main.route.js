/** Contain the app routes **/

//express route module must be associated with a constant
const router = require('express').Router();

//evoke all controllers in folder controllers
const controllerSpeaker = require('../controllers/speaker.controller.js');
const controllerSponsor = require('../controllers/sponsor.controller.js');
const controllerConference = require('../controllers/conference.controller.js');
const controllerParticipant = require('../controllers/participant.controller.js');
const controllerMail = require('../controllers/mail.controller.js');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");

//root route
router.get('/', function(req, res) {
  res.send("FCA Book");
  res.end();
});

//End points
//read
router.get('/speakers/', controllerSpeaker.read);
router.get('/speakers/:id', controllerSpeaker.readID);
//insert
router.post('/speakers/', isLoggedIn, controllerSpeaker.save);
//update
router.put('/speakers/:id', isLoggedIn, isLoggedIn, controllerSpeaker.update);
//logic delete (put/del)
router.put('/speakers/del/:id', isLoggedIn, controllerSpeaker.deleteL);
//fisic delete
router.delete('/speakers/:id', isLoggedIn, controllerSpeaker.deleteF);

router.get('/sponsors/', controllerSponsor.read);
router.get('/sponsors/:id', controllerSponsor.readID);
router.post('/sponsors/', isLoggedIn, controllerSponsor.save);
router.put('/sponsors/:id', isLoggedIn, controllerSponsor.update);
router.put('/sponsors/del/:id', isLoggedIn, controllerSponsor.deleteL);
router.delete('/sponsors/:id', isLoggedIn, controllerSponsor.deleteF);

//conferences route - only allow reading the conferences
router.get('/conferences', controllerConference.readConference);
router.get('/conferences/:id', controllerConference.readConferenceID);

/**
participants
**/
router.get('/conferences/:idconf/participants', controllerConference.readParticipant);
router.post('/conferences/:idconf/participants/:idparticipant/', controllerConference.saveParticipant);
router.delete('/conferences/:idconf/participants/:idparticipant', controllerConference.deleteParticipant);

/**
sponsors
**/
router.get('/conferences/:idconf/sponsors/', controllerConference.readSponsor);
router.post('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.saveSponsor);
router.delete('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.deleteSponsor);

/**
speakers
**/
router.get('/conferences/:idconf/speakers/', controllerConference.readSpeaker);
router.post('/conferences/:idconf/speakers/:idspeaker', isLoggedIn, controllerConference.saveSpeaker);
router.delete('/conferences/:idconf/speakers/:idspeaker', controllerConference.deleteSpeaker);

//contacts route - with a sub-route emails, to allow email to be sent
router.post('/contacts/emails', controllerMail.send);

//Export router to be used in all application
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
        return next();
    }
}
