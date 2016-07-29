$(function () {
    var syncClient, gameStateDoc, controllerStateDoc;

    // Server url to request for an auth token
    var url = '/token-mobile/' + phoneNumber;

    // Grab the crash sound
    var audioContext = new AudioContext()
    var crashSound = undefined
    var getSound = new XMLHttpRequest()
    getSound.open('GET', '/audio/Hammering-Collision_TTX024702.wav', true)
    getSound.responseType = 'arraybuffer';
    getSound.onload = function() {
        audioContext.decodeAudioData(getSound.response, function(buffer) {
            crashSound = buffer;
        });
    }
    getSound.send();

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
                gyro.startTracking(function(o) {
                    // Send the gyro data to Sync
                    controllerStateDoc.set(o);
                });
            });

            // Wall collisions from game
            syncClient.list('wall-collision-list').then(function (wallCollisionList) {
                wallCollisionList.on('itemAdded', function (collisionItem) {
                    var collisionImpulse = collisionItem.value.impulse

                    // These ranges can be tweaked
                    if (collisionImpulse >= 0.80 && collisionImpulse < 1.0) {
                        triggerVibration(200)
                    } else if (collisionImpulse >= 1.0 && collisionImpulse < 1.5) {
                        triggerVibration(500)
                    } else if (collisionImpulse >= 1.5) {
                        triggerVibration(900)
                    }

                    // Trigger the sound
                    playSound(crashSound, audioContext)

                    wallCollisionList.remove(collisionItem.index)
                })
            }).catch(function (err) {
                console.log(err)
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

    /**
     * Play a sound
     * @param {arraybuffer} sound decoded sound
     * @param {AudioContext} context
     */
    function playSound(sound, context) {
        var playSound = context.createBufferSource(); // Declare a New Sound
        playSound.buffer = sound; // Attatch our Audio Data as it's Buffer
        playSound.connect(context.destination);  // Link the Sound to the Output
        playSound.start(0); 
    }
});
