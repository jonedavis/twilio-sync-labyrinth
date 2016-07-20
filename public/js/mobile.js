$(function() {
    var syncClient, gameStateDoc, controllerStateDoc;

    var url = '/token-mobile/' + phoneNumber;
    Twilio.Sync.CreateClient(url).then(function (client) {
        syncClient = client;
        syncClient.document('game-state-' + phoneNumber).then(function (doc) {
            gameStateDoc = doc;
            syncClient.document('controller-state-' + phoneNumber).then(function (ctrlDoc) {
                controllerStateDoc = ctrlDoc;
                
                // TODO: setup controller?
            });
        });
    });

    gyro.frequency = 100;
    gyro.startTracking(function(o) {
        // x coord = o.x
        // y coord = o.y
        if (controllerStateDoc) {
            controllerStateDoc.set(o);
        }
    });
    
  /**
   * Trigger vibration
   * Only works on Chrome
   * @param {number|number[]} value
   */
  function triggerVibration(value) {
    if ('vibrate' in window.navigator) {
      window.navigator.vibrate(value)
    }
  }

  /**
   * Play a sound
   * @param {string} path
   */
  function playSound(path) {
    new Audio(path).play()
  }
});
