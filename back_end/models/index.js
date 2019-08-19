//contain the BD models - Passport
/**
(use strict) declared variables
**/
"use strict";
//create folder
let fs        = require("fs");
let path      = require("path");
let Sequelize = require("sequelize");

//BD configuration
/** access the config file and configure the sequelize account
  the configuration data are identified by "MyQQL" in config.json
  inside the config folder
**/
let env       = "MySQL";
let config    = require(path.join(__dirname, '../', 'config', 'config.json'))[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);

//BD init - will go through all models
let db = {};
fs.
  readdirSync(__dirname).
  filter(function(file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
  }).forEach(function(file) {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
  });

//export BD
Object.keys(db).forEach(function(modelName) {
  if("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
module.exports = db;
