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
        transition: function(startColor, endColor, step = 0.05) {
            var currentColor = {};
            var total = 0.0;

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