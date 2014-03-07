var QrCodeDataEncoder = function () {
    this.config = new QrCodeConfig();
    this.ec = new QrCodeErrorCorrection();
};

QrCodeDataEncoder.prototype.constructor = QrCodeDataEncoder;

QrCodeDataEncoder.prototype.encode = function (message, version, mod, eccLevel) {
    var data = [];
    var bitdata = [];

    this.mode = mod;
    this.eccLevel = eccLevel;

    var terminator = '0000';
    var padBytes = ['11101100', '00010001'];

    var wordSize = 0;
    var modeIndicator = this.config.dataModeBitStrings[this.mode];
    var wordSizes = this.config.wordSizes[this.mode];
    var numberOfDataCodewords = parseInt(this.config.dataSizeInfo['' + version + '-' + this.eccLevel][0]);
    var numberOfEcCodewords = parseInt(this.config.dataSizeInfo['' + version + '-' + this.eccLevel][1]);
    var numberOfDataBits = numberOfDataCodewords * 8;

    for (var key in wordSizes) {
        if (wordSizes.hasOwnProperty(key)) {
            wordSize = wordSizes[key];
            var range = key.split('-').map(function (e) {
                return parseInt(e);
            });
            if (range[0] <= version && range[1] >= version) {
                break;
            }
        }
    }

    var characterCountIndicator = message.length.toString(2);

    while (characterCountIndicator.length < wordSize) {
        characterCountIndicator = '0' + characterCountIndicator;
    }

    console.log({
        'Number of Data Bits': numberOfDataBits,
        'Total Number of Data Codewords for this Version and EC Level': numberOfDataCodewords,
        'EC Codewords Per Block': numberOfEcCodewords,
        'Character Count Indicator': characterCountIndicator,
        'Mode': this.mode,
        'Mode Indicator': modeIndicator,
        'Word Size': wordSize,
        'Version': version,
        'Error Correction Level': this.eccLevel
    });

    bitdata = bitdata.concat([modeIndicator, characterCountIndicator]);

    if (this.mode === 'alphanumeric') {
        var characters = message.split('');
        var numbers = characters.map(function (e) {
            return this.config.valuesTable[this.mode][e]
        }, this);
        var alphanumericWordLength = 11;

        for (var n = 0; n < numbers.length; n += 2) {
            var encoded = 0;
            var bin = null;

            if (n + 1 < numbers.length) {
                encoded = 45 * numbers[n] + numbers[n + 1];
                bin = encoded.toString(2);
                while (bin.length < alphanumericWordLength) {
                    bin = '0' + bin;
                }
            }
            else {
                encoded = numbers[n];
                bin = encoded.toString(2);
                while (bin.length < Math.ceil(alphanumericWordLength / 2)) {
                    bin = '0' + bin;
                }
            }
            bitdata.push(bin);
        }
    }

    var bitstring = bitdata.join('');
    var codewords = [];
    var diff = numberOfDataBits - bitstring.length;

    if(diff > 4) {
        bitstring += terminator;
    }
    else {
        while(diff > 0) {
            bitstring += '0';
            diff--;
        }
    }

    // Add More 0s to Make the Length a Multiple of 8
    while(bitstring.length % 8 > 0) {
        bitstring += '0';
    }

    // Add Pad Bytes if the String is Still too Short
    var b = 0;
    while(bitstring.length / 8 < numberOfDataCodewords) {
        bitstring += padBytes[b++ % padBytes.length];
    }

    var start = 0;
    var octet = null;

    while(codewords.length < numberOfDataCodewords) {
        octet = bitstring.substring(start, start + 8);
        start += 8;
        codewords.push(octet);
    }

    while(codewords.length) {
        octet = codewords.shift();
        data.push(parseInt(octet, 2));
    }

    var ecc = this.ec.getCode(data, numberOfEcCodewords);

    return data.concat(ecc);
};
