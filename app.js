var express = require('express');
var http = require('http');
var path = require('path');
var isCallerMobile = require('./mobiledetection');
var getToken = require('./syncSetup');
var app = express();

app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var isMobile = isCallerMobile(req);

    if (!isMobile) {
        res.render('index');
    } else {
        res.redirect('/mobile');
    }
});

app.get('/mobile', function(req, res) {
    res.send('mobile');
});

app.get('/game', function(req, res) {
    res.send('game');
});

app.get('/token/:phoneNumber', (request, response) => {
    // Serialize the token to a JWT string and include it in a JSON response
    response.send(getToken(request.params.phoneNumber));
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
