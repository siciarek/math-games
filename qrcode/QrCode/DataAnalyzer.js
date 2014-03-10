var DataAnalyzer = function () {
    this.config = new Config();
    this.encoder = new DataEncoder();
    this.modes = {
        numeric: function (message, self) {
            return message.match(/^\d+$/) !== null;
        },
        alphanumeric: function (message, self) {
            var chars = message.split('').sort().filter(function (el, i, a) {
                return (i == a.indexOf(el) && el.length > 0)
            });

            while (chars.length > 0) {
                if (typeof self.encoder.alphanumericCharsTable[chars.shift()] === 'undefined') {
                    return false;
                }
            }

            return true;
        }
    };
};

DataAnalyzer.prototype.constructor = DataAnalyzer;

DataAnalyzer.prototype.analyze = function (message, eclevel) {

    eclevel = eclevel || null;

    var result = {
        mode: 'binary',
        eclevel: null,
        version: 2
    };

    var clevels = Object.keys(this.config.correctionLevels).reverse();

    for (var mode in this.modes) {
        if (this.modes.hasOwnProperty(mode)) {
            var matches = this.modes[mode](message, this);
            if (matches) {
                result.mode = mode;
                break;
            }
        }
    }

    for (var version in this.config.characterCapacities) {
        if (this.config.characterCapacities.hasOwnProperty(version)) {
            var cap = this.config.characterCapacities[version];
            for (var c = 0; c < clevels.length; c++) {
                var clevel = clevels[c];
                if(eclevel !== null && clevel !== eclevel) {
                    continue;
                }
                if (message.length <= cap[clevel][result.mode]) {
                    result.eclevel = clevel;
                    result.version = parseInt(version);
                    return result;
                }
            }
        }
    }

    return result;
};
