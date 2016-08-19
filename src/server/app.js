'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const Twilio = require('../../twilio-temp')
const isCallerMobile = require('./libs/mobiledetection');
const getToken = require('./sync.setup.js');
const config = require('../../config.js');
const app = express();

app.use(express.static('./client'));
app.use('/.well-known', express.static('../../.well-known')); // For Let's Encrypt
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    renderHome(req, res);
});

app.get('/kiosk', (req, res) => {
    renderHome(req, res, true);
});

app.get('/game/:phoneNumber', (req, res) => {
    res.render('mobile-joystick', {
        phoneNumber: req.params.phoneNumber
    });
});

app.get('/token/:phoneNumber', (request, response) => {
    sendMessage(request.params.phoneNumber);
    // Serialize the token to a JWT string and include it in a JSON response
    response.send(getToken(request.params.phoneNumber));
});

app.get('/token-mobile/:phoneNumber', (request, response) => {
    // Serialize the token to a JWT string and include it in a JSON response
    response.send(getToken(request.params.phoneNumber + '-mobile'));
});

http.createServer(app).listen(app.get('port'), () => {
    console.log('CommsQuest IV server listening on port ' + app.get('port'));
});


function renderHome(req, res, kiosk) {
    let isMobile = isCallerMobile(req);

    if (!isMobile) {
        res.render('desktop-index', {
            kiosk: !!kiosk
        });
    } else {
        res.render('mobile-index');
    }
}

function sendMessage(toNumber) {
    if (!config.sendTextMessages) {
        return;
    }

    let sms = {
        body: 'Are you ready for your quest? ' + config.domain + '/game/' + toNumber,
        to: toNumber
    };

    if (config.messagingServiceSid) {
        sms.messagingServiceSid = config.messagingServiceSid;
    } else {
        sms.from = config.twilioNumber;
    }

    let client = new Twilio.Twilio(config.accountSid, config.authToken);
    client.messages.create(sms, function (err, message) {
        if (err) {
            console.log(err);
        } else {
            console.log(message.sid);
        }
    });
}
