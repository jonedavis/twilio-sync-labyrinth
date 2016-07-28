$(function () {
    var syncClient, gameStateDoc, controllerStateDoc;

    // Server url to request for an auth token
    var url = '/token-mobile/' + phoneNumber;

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
     * @param {string} path
     */
    function playSound(path) {
        new Audio(path).play();
    }
});
