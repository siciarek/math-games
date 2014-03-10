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

            while(chars.length > 0) {
                if(typeof self.encoder.alphanumericCharsTable[chars.shift()] === 'undefined') {
                    return false;
                }
            }

            return true;
        }
    };
};

DataAnalyzer.prototype.constructor = DataAnalyzer;

DataAnalyzer.prototype.analyze = function (message) {

    var result = {
        mode: 'binary',
        eclevel: null,
        version: 0
    };

    for(var mode in this.modes) {
        if(this.modes.hasOwnProperty(mode)) {
            var matches = this.modes[mode](message, this);
            if(matches) {
                result.mode = mode;
                break;
            }
        }
    }

    for(var version in this.config.characterCapacities) {
        if(this.config.characterCapacities.hasOwnProperty(version)) {
            var cap = this.config.characterCapacities[version];

            if(message.length <= cap.H[result.mode]) {
                result.version = version;
                result.eclevel = 'H';
                break;
            }

            if(result.version > 0) {
                break;
            }

            if(message.length <= cap.Q[result.mode]) {
                result.version = version;
                result.eclevel = 'Q';
                break;
            }

            if(result.version > 0) {
                break;
            }

            if(message.length <= cap.M[result.mode]) {
                result.version = version;
                result.eclevel = 'M';
                break;
            }

            if(result.version > 0) {
                break;
            }

            if(message.length <= cap.L[result.mode]) {
                result.version = version;
                result.eclevel = 'L';
                break;
            }

            if(result.version > 0) {
                break;
            }
        }
    }

    result.version = parseInt(result.version);

    return result;
};
