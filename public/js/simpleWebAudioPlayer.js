// Updated efforts by William Malone
// http://www.williammalone.com/posts/ios-9-web-audio-api-safari-mobile-issue/
// Create audio context
var webAudioPlayer = {};
if (typeof AudioContext !== 'undefined') {
    webAudioPlayer.ctx = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
    webAudioPlayer.ctx = new webkitAudioContext();
}

var simpleWebAudioPlayer = function() {
    var player = {},
        sounds = [],
        masterGain;

    player.load = function(sound) {
        sounds[sound.name] = sound;
        // Load the sound
        var request = new window.XMLHttpRequest();
        request.open('GET', sound.src, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            webAudioPlayer.ctx.decodeAudioData(request.response, function(buffer) {
                sounds[sound.name].buffer = buffer;
                if (sounds[sound.name].callback) {
                    sounds[sound.name].callback();
                }
            });
        };
        request.send();
    };

    player.play = function(name) {
        var inst = {};
        if (sounds[name]) {
            inst.source = webAudioPlayer.ctx.createBufferSource();
            inst.source.buffer = sounds[name].buffer;
            inst.source.connect(masterGain);
            inst.source.start(0);
        }
    };
    
    masterGain = (typeof webAudioPlayer.ctx.createGain === 'undefined') ? webAudioPlayer.ctx.createGainNode() : webAudioPlayer.ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(webAudioPlayer.ctx.destination);

    return player;
};
