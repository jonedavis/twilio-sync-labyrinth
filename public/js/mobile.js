// Audio player for Android & iOS
var audioPlayer = new simpleWebAudioPlayer();
audioPlayer.load({
    name: 'collision',
    src: '/audio/Hammering-Collision_TTX024702.wav'
});

function startGame() {
    audioPlayer.play('collision');
    $('#controller-tips').hide();
    $('#controller-controls').show();
    startCountdown();
}

// Countdown timer defaults to 1 min no callback
function startCountdown(minutes, callback) {
    var seconds = minutes != undefined ? (minutes * 60) : 30;
    function tick() {
        seconds--;
        var itsTheFinalCountdown = seconds < 10;
        var countdown = '0:' + (itsTheFinalCountdown ? '0' : '') + seconds;
        
        // Add some danger
        if (!$time.hasClass('redish') && itsTheFinalCountdown) {
            $time.addClass('redish');
        }
        
        $time.text(countdown);
        
        if (seconds > 0) {
            setTimeout(tick, 1000);
        } else {
            $time.text('ツ'); // ¯\_(ツ)_/¯
            // Game over -> tell the server?
            if (callback != undefined) {
                callback();
            }
        }
    }
    tick();
}

$(function () {
    var syncClient, gameStateDoc, controllerStateDoc;
    // Server url to request for an auth token
    var url = '/token-mobile/' + phoneNumber;
    $('#controller-controls').hide(); //check
    $time = $('#time');
    
    // Get a Sync client (with auth token from provided url)
    Twilio.Sync.CreateClient(url).then(function (client) {
        syncClient = client;

        // Setup the game state document
        syncClient.document('game-state-' + phoneNumber).then(function (doc) {
            gameStateDoc = doc;

            // Listen for changes in the game state to update the mobile UI
            gameStateDoc.on('updated', function(data) {
                //TODO: Update UI from data parameter
            });

            // Setup the controller state document
            syncClient.document('controller-state-' + phoneNumber).then(function (ctrlDoc) {
                controllerStateDoc = ctrlDoc;
                // Set frequency of updates to 100ms
                gyro.frequency = 100;
                // Fire up the gyro tracking
                // only send what we use
                gyro.startTracking(function(axis) {
                    // Send the gyro data to Sync
                    controllerStateDoc.set(axis);
                });
            });

            // Wall collisions from game
            syncClient.list('wall-collision-list-' + phoneNumber).then(function (wallCollisionList) {
                wallCollisionList.on('itemAdded', function (collisionItem) {
                    var collisionImpulse = collisionItem.value.impulse;

                    // These ranges can be tweaked
                    if (collisionImpulse >= 1.20 && collisionImpulse < 1.5) {
                        triggerVibration(100);
                    } else if (collisionImpulse >= 1.5 && collisionImpulse < 1.9) {
                        triggerVibration(200);
                    } else if (collisionImpulse >= 2.0) {
                        triggerVibration(300);
                    }

                    // Trigger the sound
                    audioPlayer.play('collision');

                    wallCollisionList.remove(collisionItem.index);
                })
            }).catch(function (err) {
                console.log(err);
            })
        });
    });

    /**
     * Trigger vibration
     * Only works on Chrome
     * @param {number|number[]} value
     */
    function triggerVibration(value) {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(value);
        }
    }
});
