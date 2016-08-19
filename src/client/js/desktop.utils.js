var utils = {
    math: {
        lerp: function lerp(start, end, percent) {
            return (start + percent * (end - start));
        }
    },
    colors: {
        rgbToString: function(prop) {
            return 'rgb(' + parseInt(prop.r) + ',' + parseInt(prop.g) + ',' + parseInt(prop.b) + ')';
        },
        // 5% step default
        transition: function(startColor, endColor, step) {
            var currentColor = {};
            var total = 0.0;
            step = step || 0.05;
            
            var updateColor = function () {
                if (total >= 1.0) return utils.colors.rgbToString(endColor);

                currentColor = {
                    r: parseFloat(utils.math.lerp(startColor.r, endColor.r, total)),
                    g: parseFloat(utils.math.lerp(startColor.g, endColor.g, total)),
                    b: parseFloat(utils.math.lerp(startColor.b, endColor.b, total))
                };

                total += step;

                return utils.colors.rgbToString(currentColor);
            }

            return updateColor;
        }
    }
};

jQuery.fn.centerv = function () {
    var wh = window.innerHeight;
    var h = this.outerHeight();
    this.css('position', 'absolute');
    this.css('top', Math.max(0, (wh - h) / 2) + 'px');
    return this;
}

jQuery.fn.centerh = function () {
    var ww = window.innerWidth;
    var w = this.outerWidth();
    this.css('position', 'absolute');
    this.css('left', Math.max(0, (ww - w) / 2) + 'px');
    return this;
}

jQuery.fn.center = function () {
    this.centerv();
    this.centerh();
    return this;
}