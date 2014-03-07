var QrCodeDataEncoder = function () {
    this.config = new QrCodeConfig();
    this.ec = new QrCodeErrorCorrection();
};

QrCodeDataEncoder.prototype.constructor = QrCodeDataEncoder;

QrCodeDataEncoder.prototype.encodeNumeric = function(message) {
	var data = [];
    var characters = message.split('');

	return data;
};

QrCodeDataEncoder.prototype.encodeAlphanumeric = function(message) {
	var data = [];
    var characters = message.split('');
    
	var valuesTable = {
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
	
	var numbers = characters.map(function(e) { return valuesTable[e]; });
    
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
        
		data.push(bin);
    }

	return data;
};

QrCodeDataEncoder.prototype.encodeByte = function(message) {
	var data = [];
    var characters = message.split('');

	data = characters.map(function(e) {
        var _bytenum = e.charCodeAt(0);
        var _byte = _bytenum.toString(2);

		while(_byte.length < 8) {
            _byte = '0' + _byte;
		}
        console.log([e, _bytenum, _byte]);
        return _byte;
    });

console.log(data);
    
	return data;
};

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

    if (this.mode === 'numeric') {		
		bitdata = bitdata.concat(this.encodeNumeric(message));
	}
    if (this.mode === 'alphanumeric') {		
		bitdata = bitdata.concat(this.encodeAlphanumeric(message));
	}
    else if (this.mode === 'byte') {		
		bitdata = bitdata.concat(this.encodeByte(message));
	}
	else {
	
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
	
    return data;
};
