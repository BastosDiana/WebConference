/** connectMySQL - found in config folder -
to perform DB operations on the conferences table
**/
const connect = require('../config/connectMySQL');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");

//functions - to change BD according to route request

/** read all data from BD **/
function readConference(req, res) {
  //(con) - to query BD
  const query = connect.con.query('SELECT idConference, acronimo, nome, descrição, local, data FROM conference order by data desc',
  //analize data from rows
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(err){
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if(rows.length == 0) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
      } else {
        res.send(rows);
      }
    }
  });
};

/** only returns data from a specific conference(id) **/
function readConferenceID(req, res) {
  //sanitize the received data
  const idConf = req.sanitize('idconf').escape();
  const post = { idConference: idConf };
  const query = connect.con.query('SELECT idConference, acronimo, nome, descrição, local, data FROM conference where idConference = ? order by data desc',
  post,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(err){
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if(rows.length == 0) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
      } else {
        res.send(rows);
      }
    }
  });
};

/** read all participats registered in a given conference(idConf) **/
function readParticipant(req, res) {
  const idConference = req.sanitize('idconf').escape();
  const post = { idConference: idConference };
  const query = connect.con.query('SELECT idParticipant, nomeParticipante FROM conf_participant where ? order by idParticipant desc',
  post,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(err){
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if(rows.length == 0) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
      } else {
        res.send(rows);
      }
    }
  });
};

/** allow to register a participant (idParticipant and nomeParticipant)
in a given conference **/
//(idParticipant) is identified by email
function saveParticipant(req, res) {
  req.sanitize('idParticipant').escape();
  req.sanitize('idConf').escape();
  req.sanitize('nomeParticipant').escape();
  req.checkParams("idParticipant", "Insert a valide email.").isEmail();
  const errors = req.validationErrors();
  if(errors){
    req.send(errors);
    return;
  } else {
    const idParticipant = req.params.idparticipant;
    const idConf = req.params.idconf;
    const nome = req.body.nomeParticipant;
    if(idParticipant != "NULL" && idConf != "NULL" && typeof(idParticipant) != 'undefined' && typeof(idConf) != 'undefined') {
      const post = {
        idParticipant: idParticipant,
        idConference: idConf,
        nomeParticipant: nome
      };
      const query = connect.con.query('INSERT INTO conf_participant SET ?', post, function(err, rows, fields) {
        console.log('query: ', query.sql);
        if(!err){
          res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
        } else {
          console.log('err: ', err);
          if(err.code == "ER_DUP_ENTRY") {
            res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
          } else {
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
          }
        }
      });
    } else {
    res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
  }
};

/**
to delete a given participat in BD
**/
function deleteConfParticipant(req, res) {
    //create and execute the read query in BD
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insert a valide email.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idconference = req.params.idconf;
        const idparticipant = req.params.idparticipant;
        const params = [idconference, idparticipant];
        const query = connect.con.query('DELETE FROM conf_participant where idConference = ? and idParticipant = ?',
        params,
        function(err, rows, fields) {
            console.log('query: ', query.sql);
            if (!err) {
                res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
            }
            else {
                console.log('err: ', err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
}

/**
sponsors
**/
function readConfSponsor(req, res) {
  const idConference = req.sanitize('idconf').escape();
  const post = { idConference: idConference };
  const query = connect.con.query('SELECT idSponsor FROM conf_sponsor where ? order by idSponsor desc',
  post,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(err){
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if(rows.length == 0) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
      } else {
        res.send(rows);
      }
    }
  });
};

function saveConfSponsor(req, res) {
  //receive form data sent by post
  const idSponsor = req.sanitize('idsponsor').escape();
  const idConf = req.sanitize('idconf');
  if (idSponsor != "NULL" && idConf != "NULL" && typeof(idSponsor) != 'undefined' && typeof(idConf) != 'undefined') {
    const post = {
      idSponsor: idSponsor,
      idConference: idConf
    };
    //create and execute the write query in BD to insert the data present in post
    const query = connect.con.query('INSERT INTO conf_sponsor SET ?', post, function(err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
      }
      else {
        console.log(err);
        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      }
    });
  }
  else
  res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
};

function deleteConfSponsor(req, res) {
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf').escape();
    const params = [idConf, idSponsor];
    const query = connect.con.query('DELETE FROM conf_sponsor where idConference = ? and idSponsor = ?',
    params,
    function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

/**
speakers
**/
function readConfSpeaker(req, res) {
  const idConference = req.sanitize('idconf').escape();
  const post = { idConference: idConference };
  const query = connect.con.query('SELECT idSpeaker FROM conf_speaker where ? order by idSpeaker desc',
  post,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(err){
      console.log(err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    } else {
      if(rows.length == 0) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
      } else {
        res.send(rows);
      }
    }
  });
};

function saveConfSpeaker(req, res) {
  //receive form data sent by post
  const idSpeaker = req.sanitize('idspeaker').escape();
  const idConf = req.sanitize('idconf');
  if (idSpeaker != "NULL" && idConf != "NULL" && typeof(idSpeaker) != 'undefined' && typeof(idConf) != 'undefined') {
    const post = {
      idSpeaker: idSpeaker,
      idConference: idConf
    };
    //create and execute the write query in BD to insert the data present in post
    const query = connect.con.query('INSERT INTO conf_sponsor SET ?', post, function(err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
      }
      else {
        console.log(err);
        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      }
    });
  }
  else
  res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
};

function deleteConfSpeaker(req, res) {
    //create the read query in BD
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    const params = [idConf, idSpeaker];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_speaker where idConference = ? and idSpeaker = ?',
    params,
    function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
};

/** export all functions to be accessible via routes **/
module.exports = {
  readConference: readConference,
  readConferenceID: readConferenceID,
  readParticipant: readParticipant,
  saveParticipant: saveParticipant,
  readSponsor: readConfSponsor,
  saveSponsor: saveConfSponsor,
  readSpeaker: readConfSpeaker,
  saveSpeaker: saveConfSpeaker,
  deleteSpeaker: deleteConfSpeaker,
  deleteSponsor: deleteConfSponsor,
  deleteParticipant: deleteConfParticipant
}
