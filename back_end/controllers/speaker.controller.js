//import mySQL connection - connect, and jsonMessages
const connect = require('../config/connectMySQL');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/"
const jsonMessages = require(jsonMessagesPath + "bd");

//read all data from sponsor table
function read(req, res) {
  const query = connect.con.query('SELECT idSponsor, nome, logo, categoria, active FROM sponsor order by idSponsor desc',
  function(err, rows, fiels) {
    console.log('query: ', query.sql);
    if(err) {
      console.log('err: ', err);
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

function readID(req, res) {
  const idsponsor = req.sanitize('id').escape();
  const post = {
    idSponsor: idsponsor
  };
  const query = connect.con.query('SELECT idSponsor, nome, logo, categoria, active FROM sponsor where idSponsor = ? order by idSponsor desc',
  post,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(err) {
      console.log('err: ', err);
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

/** save the data sent(req) in sponsor table **/
function save(req, res) {
  const nome = req.sanitize('nome').escape();
  const logo = req.sanitize('logo').escape();
  const categoria = req.sanitize('categoria').escape();
  req.checkBody("nome", "insert text only").matches(/^[a-z ]+$/i);
  req.checkBody("categoria", "insert text only").optional({ checkFalsy: true }).matches(/^[a-z ]+$/i);
  req.checkBody("logo", "insert a valide url").optional({ checkFalsy: true }).isURL();
  const errors = req.validationErrors();
  if(errors) {
    res.send(errors);
    return;
  }
  if(nome != "NULL" && categoria != "NULL" && typeof(nome) != 'undefined') {
    const post = {
      nome: nome,
      logo: logo,
      categoria: categoria
    };
    const query = connect.con.query('INSERT INTO sponsor SET ?',
    post,
    function(err, rows, fields) {
      console.log('query: ', query.sql);
      if(!err) {
        res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
      } else {
        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      }
    });
  } else {
    //if data sent by form were null
    res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
  }
};

function update(req, res) {
  const nome = req.sanitize('nome').escape();
  const logo = req.sanitize('logo').escape();
  const categoria = req.sanitize('categoria').escape();
  const idsponsor = req.sanitize('id').escape();
  req.checkBody("nome", "insert text only").matches(/^[a-z ]+$/i);
  req.checkBody("categoria", "insert text only").optional({ checkFalsy: true }).matches(/^[a-z ]+$/i);
  req.checkBody("logo", "insert a valide url").optional({ checkFalsy: true }).isURL();
  const errors = req.validationErrors();
  if(errors) {
    res.send(errors);
    return;
  } else {
    if(idSponsor != "NULL" && categoria != "NULL" && typeof(nome) != 'undefined' && typeof(idsponsor) != "undefined") {
      const uppdate = [nome, categoria, logo, idsponsor];
      const query = connect.con.query('UPDATE sponsor SET nome =?, categoria =?, logo =?, WHERE idSponsor =?',
      update,
      function(err, rows, fields) {
        console.log('query: ', query.sql);
        if(!err) {
          res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
        } else {
          res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
      });
    }
  }
};

/** logic delete **/
//active variable is updated to 0 value to a particular idSponsor
function deleteL(req, res) {
  const update = [0, req.sanitize('id').escape()];
  const query = connect.con.query('UPDATE sponsor SET active = ? WHERE idSponsor =?',
  update,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(!err) {
      res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
    } else {
      console.log('err: ', err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    }
  });
};

/** fisic delete - delete permanently **/
function deleteF(req, res) {
  const update = req.sanitize('id').escape();
  const query = connect.con.query('DELETE FROM sponsor WHERE idSponsor =?',
  update,
  function(err, rows, fields) {
    console.log('query: ', query.sql);
    if(!err) {
      res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
    } else {
      console.log('err: ', err);
      res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
    }
  });
};

module.exports = {
  read: read,
  readID: readID,
  save: save,
  update: update,
  deleteL: deleteL,
  deleteF: deleteF
}
