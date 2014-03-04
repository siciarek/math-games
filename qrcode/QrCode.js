var QrCode = function (message, eccLevel, mode) {

    this.UP = -1;
    this.DOWN = 1;

    this.LEFT = -1;
    this.RIGHT = -1;

    this.UNDEFINDED = 9;
    this.FINDER = 200;
    this.DARK_MODULE = 201;
    this.TOP_TIMER = 300;
    this.LEFT_TIMER = 301;
    this.FORMAT = 400;
    this.VERSION = 500;
    this.ALIGNMENT = 600;
    this.SEPARATOR = 700;
    this.DATA = 1000;

    this.datadirx = this.LEFT;
    this.datadiry = this.UP;

    this.ending = false;

    this.maskPattern = 0;

    this.setDataModule = function (value, index) {

        var x = this.datax;
        var y = this.datay;

        if (index > 0) {
            x += index % 2 === 0 ? 0 : this.datadirx;
            y += index % 2 === 0 ? this.datadiry : 0;
        }

        if (typeof this.mask[y] === 'undefined') {
            if (this.datax === 10) {
                this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
                this.datax -= 2;
                this.datay -= 8;

                x = this.datax;
                y = this.datay;

                this.ending = true;
            }
            else {
                this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
                this.datax -= 2;
                x = this.datax;
                y = this.datay;
            }
        }
        else {
            var mval = this.mask[y][x];

            if (mval !== this.UNDEFINDED) {
                switch (mval) {
                    case this.SEPARATOR:
                        this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
                        this.datax -= 2;
                        x = this.datax;
                        y = this.datay;
                        break;
                    case this.FORMAT:
                        this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;

                        if (this.ending === true) {
                            this.datay = 9;
                            this.datax -= 3;
                            x = this.datax;
                            y = this.datay;
                            this.ending = false;
                        }
                        else {
                            this.datax -= 2;
                            x = this.datax;
                            y = this.datay;
                        }
                        break;
                    case this.TOP_TIMER:
                        x = this.datax;
                        y = this.datay + (this.datadiry === this.UP ? -2 : 2);
                        break;
                    default:
                        return;
                }
            }
        }

        if (parseInt(value) === 1) {
            this.setFullModule(x, y, 'data');
        }
        else {
            this.setEmptyModule(x, y, 'data');
        }

        this.datay = y;
    };

    this.setDataArea = function () {


        var datastr = '';

        for (var i = 0; i < this.data.length; i++) {
            var val = this.data[i].toString(2);

            while (val.length < 8) {
                val = '0' + val;
            }

            datastr += val;
        }

        var data = datastr.split('');


        for (i = 0; i < data.length; i++) {
            this.setDataModule(data[i], i);
        }
    };

    eccLevel = eccLevel || 'Q';
    mode = mode || 'alphanumeric';

    this.message = message;
    this.eccLevel = eccLevel;
    this.mode = mode;

    this.config = new QrCodeConfig();
    this.eval = new QrCodeEvaluation();
    this.ecc = new QrCodeErrorCorrection();

    this.V = 0;
    this.size = 0;

    this.datay = 0;
    this.datax = 0;

    this.data = [];
    this.matrix = [];
    this.mask = [];

    this.values = {
        undefined: this.UNDEFINDED,
        full: 1,
        empty: 0,
        test_full: 101,
        test_empty: 100
    };

    this.maskValues = {
        undefined: this.UNDEFINDED,
        finder: this.FINDER,
        dark_module: this.DARK_MODULE,
        top_timer: this.TOP_TIMER,
        left_timer: this.LEFT_TIMER,
        format: this.FORMAT,
        version: this.VERSION,
        alignment: this.ALIGNMENT,
        separator: this.SEPARATOR,
        data: this.DATA
    };

    this.encode = function () {
        this.setUpProperVersion();

        this.setFinderPatterns();
        this.setSeparators();
        this.setTimingPatterns();
        this.setDarkModule();
        this.setAlignmentPatterns();

        this.setFormatInformationArea(true);
        this.setVersionInformationArea(true);

        this.encodeData();
        this.setDataArea();

        var tempres = [];

        for (var p = 0; p < 8; p++) {
            var result = this.applyMask(p);
            tempres.push(result);
            this.evaluation[result] = p;
        }

        this.penalty = this.evaluation[tempres.sort().shift()];
        this.applyMask(this.penalty, true);

        this.setFormatInformationArea();
        this.setVersionInformationArea();
    };

    this.penalty = 10000;

    this.evaluation = {};

    this.applyMask = function (number, final) {

        final = final || false;

        var data = [];

        this.maskPattern = number;

        var binnum = number.toString(2);

        while (binnum.length < 3) {
            binnum = '0' + binnum;
        }

        var funct = this.config.maskPatterns[binnum];

        for (var r = 0; r < this.size; r++) {
            data[r] = [];
            for (var c = 0; c < this.size; c++) {
                data[r][c] = this.matrix[r][c];
                if (this.mask[r][c] === this.DATA) {
                    var val = data[r][c];
                    data[r][c] = funct(r, c) ? val ^ 1 : val;
                }
            }
        }

        if (final === true) {
            this.matrix = data;
        }

        return this.eval.evaluate(data);
    };

    this.encodeData = function () {

        switch (this.mode) {
            case 'numeric':

                break;

            case 'alphanumeric':
                var mode = this.config.dataModeBitStrings[this.mode];
                var temp = this.config.wordSizes[this.mode];
                var wordSize = 0;

                for (var range in temp) {
                    if (temp.hasOwnProperty(range)) {
                        var ran = range.split('-');
                        if (this.V >= parseInt(ran[0]) && this.V <= parseInt(ran[1])) {
                            wordSize = temp[range];
                            break;
                        }
                    }
                }

                var msglen = this.message.length.toString(2);

                while (msglen.length < wordSize) {
                    msglen = '0' + msglen;
                }

                var datastra = [mode, msglen];

                temp = this.message.split('');

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

                break;
            default:
                break;
        }

        var terminator = '0000';
        datastra.push(terminator);

        var dataWordsCount = parseInt(this.config.dataSizeInfo[this.V + '-' + this.eccLevel][0]);
        var eccWordsCount = parseInt(this.config.dataSizeInfo[this.V + '-' + this.eccLevel][1]);
        var dataBitsCount = dataWordsCount * 8;

        var datastr = datastra.join('');

        datastr = datastr.substring(0, dataBitsCount);

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

        while (bitwords.length < dataWordsCount) {
            bitwords.push(fillers[x++ % fillers.length]);
        }


        var bitwordsnumbers = [];

        for (var b = 0; b < bitwords.length; b++) {
            bitwordsnumbers.push(parseInt(bitwords[b], 2));
        }

        for (var b = 0; b < bitwordsnumbers.length; b++) {
            this.data.push(bitwordsnumbers[b]);
        }


        var ecc = this.ecc.getCode(bitwordsnumbers, dataWordsCount, eccWordsCount);

        while (ecc.length > 0) {
            this.data.push(ecc.shift());
        }
    };

    this.setUpProperVersion = function () {
        for (var ver in this.config.characterCapacities) {
            if (this.config.characterCapacities.hasOwnProperty(ver)) {
                var list = this.config.characterCapacities[ver][this.eccLevel];
                if (this.message.length <= list[this.mode]) {
                    this.V = ver;
                    this.capacity = list[this.mode];
                    this.size = (((this.V - 1) * 4) + 21);
                    this.datay = this.size - 1;
                    this.datax = this.size - 1;
                    return;
                }
            }
        }
    };

    this.getMode = function () {
        return this.mode;
    };

    this.getEccLevel = function () {
        return this.eccLevel;
    };

    this.getMaskPattern = function () {
        return this.maskPattern;
    };

    this.getVersionInformationString = function () {
        return this.config.versionInformationStrings[this.V];
    };

    this.getTypeInformationBits = function (eccLevel, maskPattern) {
        return this.config.typeInformationBits[eccLevel][maskPattern];
    };

    this.setFormatInformationArea = function (reserve) {

        if (typeof reserve === 'undefined') {
            reserve = false;
        }

        var eccLevel = this.getEccLevel();
        var maskPattern = this.getMaskPattern();

        var temp = this.getTypeInformationBits(eccLevel, maskPattern).split('');
        var bits = [
            [],
            []
        ];

        var val = 0;
        var x = 0;
        var y = 0;

        while (temp.length > 0) {
            val = parseInt(temp.shift());
            val = reserve === false ? val : 0;
            bits[0].push(val);
            bits[1].push(val);
        }

        x = 8;
        y = 0;
        for (; y < 8; y++) {
            if (y !== 6) {
                val = bits[0].pop();
                val === 1 ? this.setFullModule(x, y, 'format') : this.setEmptyModule(x, y, 'format');
            }
        }

        x = 8;
        y = 8;
        for (; x >= 0; x--) {
            if (x !== 6) {
                val = bits[0].pop();
                val === 1 ? this.setFullModule(x, y, 'format') : this.setEmptyModule(x, y, 'format');
            }
        }

        x = this.size - 1;
        y = 8;
        for (; x >= this.size - 8; x--) {
            val = bits[1].pop();
            val === 1 ? this.setFullModule(x, y, 'format') : this.setEmptyModule(x, y, 'format');
        }

        x = 8;
        y = (4 * this.V) + 9 + 1;
        for (; y < this.size; y++) {
            val = bits[1].pop();
            val === 1 ? this.setFullModule(x, y, 'format') : this.setEmptyModule(x, y, 'format');
        }
    };

    this.setVersionInformationArea = function (reserve) {
        if (this.V < 7) {
            return false;
        }

        if (typeof reserve === 'undefined') {
            reserve = false;
        }

        var temp = this.getVersionInformationString().split('');
        var bits = [
            [],
            []
        ];
        var val = 0;
        var x = 0;
        var y = 0;
        var i = 0;

        while (temp.length > 0) {
            val = parseInt(temp.shift());
            val = reserve === false ? val : 0;
            bits[0].push(val);
            bits[1].push(val);
        }

        y = 0;
        x = this.size - 11;

        for (; y < 6; y++) {
            for (i = 0; i < 3; i++) {
                bits[0].pop() == 1 ? this.setFullModule(x + i, y, 'version') : this.setEmptyModule(x + i, y, 'version');
            }
        }

        y = this.size - 11;
        x = 0;

        for (; x < 6; x++) {
            for (i = 0; i < 3; i++) {
                bits[1].pop() == 1 ? this.setFullModule(x, y + i, 'version') : this.setEmptyModule(x, y + i, 'version');
            }
        }

        return true;
    };

    this.setFinderPattern = function (top, left) {

        var x = 0;
        var y = 0;

        // TOP/BOTTOM:
        for (x = 0; x < 7; x++) {
            y = 0;
            this.setFullModule((left + x), (top + y), 'finder');
            y = 6;
            this.setFullModule((left + x), (top + y), 'finder');
        }

        // INNER SEPARATOR TOP/BOTTOM:
        for (x = 1; x < 6; x++) {
            y = 1;
            this.setEmptyModule((left + x), (top + y), 'finder');
            y = 5;
            this.setEmptyModule((left + x), (top + y), 'finder');
        }

        // RIGHT/LEFT:
        for (y = 1; y < 6; y++) {
            x = 0;
            this.setFullModule((left + x), (top + y), 'finder');
            x = 6;
            this.setFullModule((left + x), (top + y), 'finder');
        }

        // INNER SEPARATOR RIGHT/LEFT:
        for (y = 1; y < 6; y++) {
            x = 1;
            this.setEmptyModule((left + x), (top + y), 'finder');
            x = 5;
            this.setEmptyModule((left + x), (top + y), 'finder');
        }

        // CENTER:
        for (x = 2; x < 5; x++) {
            for (y = 2; y < 5; y++) {
                this.setFullModule((left + x), (top + y), 'finder');
            }
        }
    };

    this.setFinderPatterns = function () {
        this.setFinderPattern(0, 0);
        this.setFinderPattern(this.size - 7, 0);
        this.setFinderPattern(0, this.size - 7);
    };

    this.setSeparators = function () {
        var i = 0;
        var x = 0, y = 0;
        var offset = this.size - 7;
        var aoffset = 0;
        var boffset = 7;

        // LEFT-TOP:
        i = 7;
        while (i > 0) {
            i--;
            this.setEmptyModule(x + boffset, y + aoffset + i, 'separator');
            this.setEmptyModule(x + aoffset + i, y + boffset, 'separator');
        }

        aoffset = boffset;
        boffset = aoffset;
        this.setEmptyModule(x + aoffset, y + boffset, 'separator');

        // RIGHT-TOP:
        i = 7;
        while (i > 0) {
            i--;
            aoffset = offset;
            boffset = 7;
            this.setEmptyModule(x + aoffset + i, y + boffset, 'separator');
            aoffset = offset - 1;
            boffset = 0;
            this.setEmptyModule(x + aoffset, y + boffset + i, 'separator');
        }

        aoffset = offset - 1;
        boffset = 7;

        this.setEmptyModule(x + aoffset, y + boffset, 'separator');

        // LEFT BOTTOM:
        i = 7;
        while (i > 0) {
            i--;
            aoffset = 7;
            boffset = offset;
            this.setEmptyModule(x + aoffset, y + boffset + i, 'separator');
            aoffset = 0;
            boffset = offset - 1;
            this.setEmptyModule(x + aoffset + i, y + boffset, 'separator');
        }

        aoffset = offset - 1;
        boffset = 7;
        this.setEmptyModule(x + boffset, y + aoffset, 'separator');
    };

    this.setTimingPatterns = function () {
        var limit = this.size - 7;

        for (var c = 8; c < limit - 1; c++) {
            if (c % 2 === 0) {
                this.setFullModule(c, 6, 'top_timer');
                this.setFullModule(6, c, 'left_timer');
            } else {
                this.setEmptyModule(c, 6, 'top_timer');
                this.setEmptyModule(6, c, 'left_timer');
            }
        }
    };

    this.setAlignmentPattern = function (cx, cy) {

        // CENTER:
        this.setFullModule(cx, cy, 'alignment');

        offset = 1;

        for (x = cx - offset; x <= cx + offset; x++) {
            y = cy - offset;
            this.setEmptyModule(x, y, 'alignment');
            y = cy + offset;
            this.setEmptyModule(x, y, 'alignment');
        }

        for (i = cy - offset; i <= cy + offset; i++) {
            y = i;
            x = cx - offset;
            this.setEmptyModule(x, y, 'alignment');
            x = cx + offset;
            this.setEmptyModule(x, y, 'alignment');
        }

        offset = 2;

        for (i = cx - offset; i <= cx + offset; i++) {
            x = i;
            y = cy - offset;
            this.setFullModule(x, y, 'alignment');
            y = cy + offset;
            this.setFullModule(x, y, 'alignment');
        }

        for (i = cy - offset; i <= cy + offset; i++) {
            y = i;
            x = cx - offset;
            this.setFullModule(x, y, 'alignment');
            x = cx + offset;
            this.setFullModule(x, y, 'alignment');
        }
    };

    this.setAlignmentPatterns = function () {
        var table = this.config.alignmentPatternLocations[this.V];

        for (var x = 0; x < table.length; x++) {
            for (var y = 0; y < table.length; y++) {

                if (
                    x === 0 && y === 0
                        || x === 0 && y === table.length - 1
                        || x === table.length - 1 && y === 0
                    ) {
                    continue;
                }

                this.setAlignmentPattern(table[x], table[y]);
            }
        }
    };

    this.setDarkModule = function (color) {
        var x = 8;
        var y = (4 * this.V) + 9;

        this.setFullModule(x, y, 'dark_module');
    };

    this.setModule = function (x, y, value, maskValue) {
        value = value || 'undefined';
        maskValue = maskValue || 'undefined';

        if (typeof this.matrix[y] === 'undefined') {
            var row = [];

            for (var c = 0; c < this.size; c++) {
                row[c] = this.values['undefined'];
            }
            this.matrix[y] = row;
        }

        if (typeof this.mask[y] === 'undefined') {
            var mrow = [];

            for (var mc = 0; mc < this.size; mc++) {
                mrow[mc] = this.maskValues['undefined'];
            }
            this.mask[y] = mrow;
        }

        this.matrix[y][x] = this.values[value];
        this.mask[y][x] = this.maskValues[maskValue];
    };

    this.setFullModule = function (x, y, maskValue) {
        maskValue = maskValue || 'undefined';
        this.setModule(x, y, 'full', maskValue);
    };

    this.setEmptyModule = function (x, y, maskValue) {
        maskValue = maskValue || 'undefined';
        this.setModule(x, y, 'empty', maskValue);
    };

    this.encode();
};