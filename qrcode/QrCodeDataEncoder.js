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

    console.log([bitstring.length, diff]);
    console.log(bitdata);
    console.log(bitstring);


    if(diff > 4) {
        bitstring += terminator;
    }
    else {
        while(diff > 0) {
            bitstring += '0';
            diff--;
        }
    }

    console.log(bitstring);

    // Add More 0s to Make the Length a Multiple of 8
    while(bitstring.length % 8 > 0) {
        bitstring += '0';
    }

    console.log(bitstring);

    // Add Pad Bytes if the String is Still too Short
    var b = 0;
    while(bitstring.length / 8 < numberOfDataCodewords) {
        bitstring += padBytes[b++ % padBytes.length];
    }

    console.log([bitstring.length, bitstring]);

    var start = 0;
    var octet = null;

    while(codewords.length < numberOfDataCodewords) {
        octet = bitstring.substring(start, start + 8);
        start += 8;
        codewords.push(octet);
    }

    console.log(codewords);
    console.log(codewords.length);

    while(codewords.length) {
        octet = codewords.shift();
        data.push(parseInt(octet, 2));
    }

    var ecc = this.ec.getCode(data, numberOfDataCodewords, numberOfEcCodewords);
    data = data.concat(ecc);

    return data;

    var datastra = [];

    switch (this.mode) {
        case 'byte':

            for (var range in temp) {
                if (temp.hasOwnProperty(range)) {
                    var ran = range.split('-');
                    if (version >= parseInt(ran[0]) && version <= parseInt(ran[1])) {
                        wordSize = temp[range];
                        break;
                    }
                }
            }

            var msglen = message.length.toString(2);

            while (msglen.length < wordSize) {
                msglen = '0' + msglen;
            }

            datastra = [mode, msglen];

            temp = message.split('');

            while (temp.length > 0) {
                var _byte = temp.shift();
                var _bytechc = _byte.charCodeAt(0);
                var _bits = _bytechc.toString(2);

                while (_bits.length < 8) {
                    _bits = '0' + _bits;
                }

                datastra.push(_bits);
            }

//                terminator = '0000';
//                datastra.push(terminator);

            break;

        case 'numeric':
            temp = message.split('');
            var xtemp = [];
            var x = 0, y = 0;
            while (temp.length) {

                if (typeof xtemp[y] === 'undefined') {
                    xtemp[y] = [];
                }

                xtemp[y] += temp.shift();
                x++;
                if (x % 3 === 0) {
                    y++;
                }
            }
            temp = [];
            while (xtemp.length > 0) {
                var v = xtemp.shift();
                temp.push(parseInt(v).toString(2));
            }

            console.log(xtemp);
            break;

        case 'alphanumeric':

            for (range in temp) {
                if (temp.hasOwnProperty(range)) {
                    var ran = range.split('-');
                    if (version >= parseInt(ran[0]) && version <= parseInt(ran[1])) {
                        wordSize = temp[range];
                        break;
                    }
                }
            }

            msglen = message.length.toString(2);

            while (msglen.length < wordSize) {
                msglen = '0' + msglen;
            }

            datastra = [mode, msglen];

            temp = message.split('');

            for (var c = 0; c < temp.length; c += 2) {
                var first = typeof temp[c] !== 'undefined' ? this.config.valuesTable[this.mode][temp[c]] : 0;
                var second = typeof temp[c + 1] !== 'undefined' ? this.config.valuesTable[this.mode][temp[c + 1]] : 0;
                var word = second === 0 ? first : (45 * first + second);
                var wordstr = word.toString(2);
                var wlen = second === 0 ? 6 : 11;

                while (wordstr.length < wlen) {
                    wordstr = '0' + wordstr;
                }

                datastra.push(wordstr);
            }

            datastra.push(terminator);

            break;
        default:
            break;
    }

    var dataWordsCount = parseInt(this.config.dataSizeInfo[version + '-' + this.eccLevel][0])
    var eccWordsCount = parseInt(this.config.dataSizeInfo[version + '-' + this.eccLevel][1]);

    var dataBitsCount = dataWordsCount * 8;

    var datastr = datastra.join('');

    datastr += '000000000000000000000000';

    if (dataBitsCount < datastr.length) {
        datastr = datastr.substring(0, dataBitsCount);
    }

    console.log([dataBitsCount, datastr.length, '*']);

    var bitwords = [];

    while (datastr.length > 0) {
        var chunk = datastr.substring(0, 8);
        var rx = new RegExp('^' + chunk);
        datastr = datastr.replace(rx, '');
        bitwords.push(chunk);
    }

    var last = bitwords.pop();

    while (last.length < 8) {
        last += '0';
    }

    bitwords.push(last);

    var fillers = ['11101100', '00010001'];

    var x = 0;

    while (bitwords.length <= dataWordsCount) {
        bitwords.push(fillers[x++ % 2]);
    }

    while (bitwords.length > 0) {
        data.push(parseInt(bitwords.shift(), 2));
    }

    console.log({dwc: dataWordsCount, ecc: eccWordsCount});

    var ecc = this.ec.getCode(data, dataWordsCount, eccWordsCount);

    while (ecc.length > 0) {
        data.push(ecc.shift());
    }

    return data;
};
