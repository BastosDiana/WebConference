const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8080;
const express = require('express');
const app = express();

//define static routes
app.use('/assets', express.static("assets"));
app.use('/views', express.static("views"));

//CORS - permittedLinker (keep the authorized domains)
const cors = require("cors");
app.use(cors());
app.use(cors({
  exposedHeaders: ['Location'],
}));
const permittedLinker = ['localhost', '127.0.0.1',
'http://eventos.esmad.ipp.pt/webconference', 'http://eventos.esmad.ipp.pt/', process.env.IP];

app.listen(port, function(err) {
  
})
