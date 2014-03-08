var QrCodeDataAnalyzer = function () {
    this.config = new QrCodeConfig();
    this.encoder = new QrCodeDataEncoder();
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

QrCodeDataAnalyzer.prototype.constructor = QrCodeDataAnalyzer;

QrCodeDataAnalyzer.prototype.analyze = function (message) {
    var result = {
        mode: null
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

    return result;
};

