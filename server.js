'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var dotenv = require('dotenv').config();
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
var mongoose = require('mongoose');
var helmet = require('helmet');

var CONNECTION_STRING = process.env.DB;

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

mongoose.connect(CONNECTION_STRING);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database Connection Error.'));

db.once('open', function(){
  console.log('Sucessful database connection');
  //Start our server and tests!
  app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);

    //Routing for API
    apiRoutes(app);

    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 1500);
    }
  });
});
module.exports = app; //for unit/functional testing
