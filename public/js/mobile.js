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
});