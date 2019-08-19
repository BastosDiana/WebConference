const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8080;

//Define express module
const express = require('express');
const app = express();
//CORS - To controll access - permittedLinker (keep the authorized domains)
const cors = require("cors");
// const permittedLinker = ['localhost', '127.0.0.1',
// 'http://eventos.esmad.ipp.pt/webconference', 'http://eventos.esmad.ipp.pt/', process.env.IP];
app.use(cors());
app.use(cors({
  exposedHeaders: ['Location'],
}));

//define static routes
app.use('/assets', express.static("assets"));
app.use('/views', express.static("views"));
app.listen(port, function(err) {
  if(!err) {
    console.log('Your app is listening on ' + host + ' and port ' + port);
  } else {
    console.log('err: ', err);
  }
});

module.exports = app;
//loader contain all essencial modules to server
require('./loader.js');
