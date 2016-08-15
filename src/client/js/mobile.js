(function () {
    // audio player for Android & iOS
    var audioPlayer = new simpleWebAudioPlayer();
    var isGamePaused = false;
    var timeInterval = undefined;
    
    audioPlayer.load([
        {
            name: 'collision',
            src: '/audio/collision.mp3'
        },
        {
            name: 'positive',
            src: '/audio/positive.mp3'
        },
        {
            name: 'win',
            src: '/audio/win.mp3'
        }    
    ]);

    function startGame() {
        audioPlayer.play('positive');
        $('#controller-tips').hide();
        $('#controller-controls').show();
        // 3:00 countdown
        startTimer(3 * 60);
    }

    // End of game screen
    function showEndOfGameControls() {
        // Stop the timer 
        clearTimeout(timeInterval);
        // Play winning sound
        audioPlayer.play('win');
        // Toggle UI Controls
        $time.hide();
        $twilioLogo.show();
        $btnLearnAbout.show();
        $pauseButton.hide();        
    }
    
    // Countdown timer
    function startTimer(duration) {
        var timer = duration;
        var minutes = undefined;
        var seconds = undefined;
        timeInterval = setInterval(function () {
            if (!isGamePaused) {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? '' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;

                $time.text(minutes + ':' + seconds);
                timer--;
                
                if (timer < 10 && !$time.hasClass('redish')) {
                    // Add some danger
                    $time.addClass('redish');
                }
                
                if (timer < 0) {
                    clearTimeout(timeInterval);
                    // Pause game at end of timer
                    togglePauseState();
                    showEndOfGameControls();
                }
            }
        }, 1000);    
    }

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

    $(function () {
        var syncClient, gameStateDoc, controllerStateDoc;
        var gyroData = { x: 0, y: 0, beta: 0, gamma: 0 };
        $pauseButton = $('#btnPause');
        var pauseState = 'PAUSE_STATE';
        // Server url to request for an auth token
        var url = '/token-mobile/' + phoneNumber;
        $('#controller-controls').hide();
        $time = $('#time');
        $twilioLogo = $('#twilio-logo');
        $btnLearnAbout = $('#btnLearnAbout').hide();

        // Setup button click event
        $('#btnReady').on('click', function() {
            startGame();
        });
        
        // Setup pause button events
        $pauseButton.on('click', function() {
            togglePauseState();
            var text = isGamePaused ? '(UNPAUSE)' : '(PAUSE)';
            $pauseButton.text(text);
            setPauseState();
        })
        
        // Set gyro data
        function setGyro(data) {
            gyroData.x = data.x;
            gyroData.y = data.y;
            gyroData.beta = data.beta;
            gyroData.gamma = data.gamma;
        }
        
        // Toggle pause
        function togglePauseState() {
            isGamePaused = !isGamePaused;
        }
        
        // Send pause state top Sync
        function setPauseState() {
            // Send it to the Desktop
            gyroData.isGamePaused = isGamePaused;
            controllerStateDoc.set(gyroData);
        }
        
        // Get a Sync client (with auth token from provided url)
        Twilio.Sync.CreateClient(url).then(function (client) {
            syncClient = client;

            // Setup the game state document
            syncClient.document('game-state-' + phoneNumber).then(function (doc) {
                gameStateDoc = doc;

                // Listen for changes in the game state to update the mobile UI
                gameStateDoc.on('updated', function(data) {
                    // Check if game is over
                    if (data.isGameOver) {
                        showEndOfGameControls();
                    }
                });

                // Setup the controller state document
                syncClient.document('controller-state-' + phoneNumber).then(function (ctrlDoc) {
                    controllerStateDoc = ctrlDoc;
                    // Set frequency of updates to 100ms
                    gyro.frequency = 100;
                    // Fire up the gyro tracking
                    gyro.startTracking(function(axis) {
                        // Don't send gryo data to Sync if paused
                        if (!isGamePaused) {
                            setGyro(axis);
                            // Send only what we use of the gyro data to Sync
                            controllerStateDoc.set(gyroData);
                        }
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
    });
})();
