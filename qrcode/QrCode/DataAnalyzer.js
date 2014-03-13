var DataAnalyzer = function () {
    this.config = new Config();
    this.encoder = new DataEncoder();
    this.modes = {
        numeric: function (data, self) {
            return data.match(/^\d+$/) !== null;
        },
        alphanumeric: function (data, self) {
            var chars = data.split('').sort().filter(function (el, i, a) {
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

DataAnalyzer.prototype.analyze = function (data, eclevels) {

    data = data || 'QRCODE';
    eclevels = eclevels || ['H', 'Q', 'M', 'L'];

    var result = {
        data: data,
        mode: 'binary',
        eclevel: null,
        version: 2
    };

    for (var mode in this.modes) {
        if (this.modes.hasOwnProperty(mode)) {
            var matches = this.modes[mode](data, this);
            if (matches) {
                result.mode = mode;
                break;
            }
        }
    }

    for (var version in this.config.characterCapacities) {
        if (this.config.characterCapacities.hasOwnProperty(version)) {
            for (var c = 0; c < eclevels.length; c++) {
                var eclevel = eclevels[c];

                if (data.length <= this.config.characterCapacities[version][eclevel][result.mode]) {
                    result.eclevel = eclevel;
                    result.version = parseInt(version);
                    break;
                }
            }

            if(result.eclevel !== null) {
                break;
            }
        }
    }

    return result;
};
