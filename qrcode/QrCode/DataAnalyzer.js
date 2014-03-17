var DataAnalyzer = function (version) {
    this.config = new Config();
    this.encoder = new DataEncoder();
    this.version = version || null;
    this.version = parseInt(this.version);
    this.version = isNaN(this.version) ? null : parseInt(this.version);

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
        },
        kanji: function (data, self) {
            return false; // TODO: implement
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
        capacity: 0,
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

        if(this.version !== null && parseInt(version) !== this.version) {
            continue;
        }

        if (this.config.characterCapacities.hasOwnProperty(version)) {

            for (var c = 0; c < eclevels.length; c++) {
                var eclevel = eclevels[c];
                var capacity = this.config.characterCapacities[version][eclevel][result.mode];

                if (data.length <= capacity) {
                    result.capacity = capacity;
                    result.eclevel = eclevel;
                    result.version = parseInt(version);
                    break;
                }
            }

            if (result.capacity > 0) {
                break;
            }
        }
    }

    return result;
};
