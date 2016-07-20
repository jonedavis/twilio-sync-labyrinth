var express = require('express');
var http = require('http');
var path = require('path');
var mobileDetection = require('./mobiledetection');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
    var isMobile = mobileDetection.isCallerMobile(req);
    
    if (!isMobile) {
    
    } else {
        res.redirect('/mobile');
    }
});

app.get('/mobile', function(req, res) {
    res.write('mobile');
});

app.get('/game', function(req, res) {
    res.write('game');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});