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


    var $ball = $('#ball');
    var ball = {
        width: 100, 
        height: 100,
        minX: 0,
        maxX: function () { return $(window).width() - this.width },
        minY: 0,
        maxY: 250
    };

    gyro.frequency = 100;
    gyro.startTracking(function(o) {
        var $offset = $ball.offset();
        var dY = $offset.top - o.y * 10;
        var dX = $offset.left + (o.x * 10);

        $ball.offset({ top: dY, left: dX });
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
