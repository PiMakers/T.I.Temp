/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var app = express();
var vlc = require('vlc')(['--no-video']);
var player = vlc.mediaplayer;

var media = [vlc.mediaFromFile('./videos/loopvideo.mp4'), vlc.mediaFromFile('./videos/oncevideo.mp4')];
var mediaString = ['szünet', 'műsor'];

var mode = 0;

var status = -1;
var currently = -1;

var poller = setInterval(function() {
    if (status === player.position) {
        startNewVideo();
    } else {
        status = player.position;
    }
}, 500);


var startNewVideo = function() {
    player.media = media[mode];
    currently = mode;
    player.play();
    mode = 0;
};


app.use(express.static('public'));

// Configure our HTTP server to respond with Hello World to all requests.
app.get('/control', function(request, response) {
    var command = request.query.command;
    if (command === 'start') {
        if (currently === 0) {
            mode = 1;
        }
    } else if (command === 'stop') {
        if (currently === 1) {
            player.position = 1;
        }
        mode = 0;
    }
    var responseJson = {};
    responseJson.statusMessage = 'Pillanatnyilag fut: ' + mediaString[currently] + ' (' + (Math.round(player.position * 100)) + '%)\n' +
            'Következő: ' + mediaString[mode];
    responseJson.mode = mode;
    responseJson.currently = currently;
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(responseJson));
    response.end();
});


app.get('*', function(req, res) {
    res.redirect('index.html');
});

// Listen on port 8000, IP defaults to 127.0.0.1
app.listen(8080);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8080/");

startNewVideo();
    