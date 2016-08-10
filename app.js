'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var Twilio = require('./twilio-temp')
var isCallerMobile = require('./mobiledetection');
var getToken = require('./syncSetup');
var config = require('./config.js');
var app = express();

app.use(express.static('public'));
app.use('/.well-known', express.static('.well-known')); // For Let's Encrypt
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  renderHome(req, res);
});

app.get('/kiosk', function (req, res) {
  renderHome(req, res, true);
});

function renderHome(req, res, kiosk) {
  var isMobile = isCallerMobile(req);

  if (!isMobile) {
    res.render('index', {kiosk: !!kiosk});
  } else {
    res.render('mobile-index');
  }
}

app.get('/game/:phoneNumber', function (req, res) {
  res.render('mobile', { phoneNumber: req.params.phoneNumber });
});

function sendMessage(toNumber) {
  if (!config.sendTextMessages) {
    return;
  }

  var sms = {
    body: 'Are you ready for your quest? ' + config.domain + '/game/' + toNumber,
    to: toNumber
  };

  if (config.messagingServiceSid) {
    sms.messagingServiceSid = config.messagingServiceSid;
  } else {
    sms.from = config.twilioNumber;
  }

  var client = new Twilio.Twilio(config.accountSid, config.authToken);
  client.messages.create(sms, function (err, message) {
    if (err) {
      console.log(err);
    } else {
      console.log(message.sid);
    }
  });
}

app.get('/token/:phoneNumber', (request, response) => {
  sendMessage(request.params.phoneNumber);
  // Serialize the token to a JWT string and include it in a JSON response
  response.send(getToken(request.params.phoneNumber));
});

app.get('/token-mobile/:phoneNumber', (request, response) => {
  // Serialize the token to a JWT string and include it in a JSON response
  response.send(getToken(request.params.phoneNumber + '-mobile'));
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
