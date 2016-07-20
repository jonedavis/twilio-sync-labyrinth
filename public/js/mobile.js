$(function() {
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
