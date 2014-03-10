var DataEncoder = function () {
    this.config = new Config();
    this.ec = new ErrorCorrection();
};

DataEncoder.prototype.constructor = DataEncoder;

DataEncoder.prototype.alphanumericCharsTable = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15,
    'G': 16,
    'H': 17,
    'I': 18,
    'J': 19,
    'K': 20,
    'L': 21,
    'M': 22,
    'N': 23,
    'O': 24,
    'P': 25,
    'Q': 26,
    'R': 27,
    'S': 28,
    'T': 29,
    'U': 30,
    'V': 31,
    'W': 32,
    'X': 33,
    'Y': 34,
    'Z': 35,
    ' ': 36,
    '$': 37,
    '%': 38,
    '*': 39,
    '+': 40,
    '-': 41,
    '.': 42,
    '/': 43,
    ':': 44
};

DataEncoder.prototype.encodeNumeric = function (message) {
    var wordSize = 10;
    var characters = message.split('');
    var word = null;
    var data = [];

    for (var i = 0; i < characters.length; i += 3) {
        var slice = characters.slice(i, i + 3).join('');
        wordSize = slice.length * 3 + 1;
        word = parseInt(slice);

        var binary = word.toString(2);
        while(binary.length < wordSize) {
            binary = '0' + binary;
        }
        data.push(binary);
    }

    return data;
};

DataEncoder.prototype.encodeAlphanumeric = function (message) {
    var wordSize = 11;
    var characters = message.split('');
    var word = null;
    var data = [];

    var numbers = characters.map(function (e) {
        return this.alphanumericCharsTable[e];
    }, this);

    for (var i = 0; i < numbers.length; i += 2) {
        if (i + 1 < numbers.length) {
            word = 45 * numbers[i] + numbers[i + 1];
        }
        else {
            word = numbers[i];
            wordSize = Math.ceil(wordSize / 2);
        }

        var binary = word.toString(2);
        while (binary.length < wordSize) {
            binary = '0' + binary;
        }
        data.push(binary);
    }

    return data;
};

DataEncoder.prototype.encodeBinary = function (message) {
    var wordSize = 8;
    var characters = message.split('');
    var word = null;
    var data = [];

    for (var i = 0; i < characters.length; i += 1) {
        var character = characters[i];
        word = character.charCodeAt(0);

        var binary = word.toString(2);
        while (binary.length < wordSize) {
            binary = '0' + binary;
        }
        data.push(binary);
    }

    return data;
};

DataEncoder.prototype.encode = function (message, version, mod, eccLevel) {
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

    bitdata = bitdata.concat([modeIndicator, characterCountIndicator]);

    if (this.mode === 'numeric') {
        bitdata = bitdata.concat(this.encodeNumeric(message));
    }
    if (this.mode === 'alphanumeric') {
        bitdata = bitdata.concat(this.encodeAlphanumeric(message));
    }
    else if (this.mode === 'binary') {
        bitdata = bitdata.concat(this.encodeBinary(message));
    }
    else {

    }

    var bitstring = bitdata.join('');
    var codewords = [];
    var diff = numberOfDataBits - bitstring.length;

    if (diff < 4) {
        terminator = '';
        for (var d = 0; d < diff; d++) {
            terminator += '0';
        }
    }

    bitstring += terminator;

    var i = 0;
    while (true) {
        var octet = bitstring.substring(i, i + 8);
        if (octet === '') {
            break;
        }
        codewords.push(octet);
        i += 8;
    }

    // Add More 0s to Make the Length a Multiple of 8
    while (codewords[codewords.length - 1].length < 8) {
        codewords[codewords.length - 1] += '0';
    }

    // Add Pad Bytes if the String is Still too Short
    var b = 0;
    while (codewords.length < numberOfDataCodewords) {
        codewords.push(padBytes[b++ % padBytes.length]);
    }

    data = codewords.map(function (e) {
        return parseInt(e, 2);
    });

    return data;
};
