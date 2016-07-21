var express = require('express');
var http = require('http');
var path = require('path');
var Twilio = require('./twilio-temp')
var isCallerMobile = require('./mobiledetection');
var getToken = require('./syncSetup');
var config = require('./config.js');
var app = express();

app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    var isMobile = isCallerMobile(req);

    if (!isMobile) {
        res.render('index');
    } else {
        res.render('mobile-index');
    }
});

app.get('/game/:phoneNumber', function(request, response) {
    response.render('mobile', { phoneNumber: request.params.phoneNumber });
});

function sendMessage(toNumber) {
    if (!config.sendTextMessages) {
        return;
    }

  var client = new Twilio.Twilio(config.accountSid, config.authToken);
  client.messages.create({
    body: 'Are you ready for your quest? ' + config.domain + '/game/' + toNumber,
    to: toNumber,  // Text this number
    from: config.twilioNumber // From a valid Twilio number
  }, function(err, message) {
    console.log(message.sid);
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
  console.log("Express server listening on port " + app.get('port'));
});
