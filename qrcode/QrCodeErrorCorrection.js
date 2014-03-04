var QrCodeErrorCorrection = function () {
    this.config = new QrCodeConfig();
    this.log = [];
    this.antilog = [];

    for (var i = 0; i < 256; i++) {

        var a = 1;
        var ix = i;

        while (ix-- > 0) {
            a <<= 1;
            a = a > 255 ? a ^ 285 : a;
        }

        this.log.push([i, a]);
        this.antilog.push([a, i]);
    }
};

QrCodeErrorCorrection.prototype.constructor = QrCodeErrorCorrection;

QrCodeErrorCorrection.prototype.exp2int = function (exp) {
    for (var i = 0; i < this.log.length; i++) {
        if (exp === this.log[i][0]) {
            return this.log[i][1];
        }
    }
};

QrCodeErrorCorrection.prototype.int2exp = function (int) {
    for (var i = 0; i < this.antilog.length; i++) {
        if (int === this.antilog[i][0]) {
            return this.antilog[i][1];
        }
    }
};

/**
 * http://www.thonky.com/qr-code-tutorial/error-correction-coding/#generator-polynomial-for-2-error-correction-codewords
 *
 * @param degree
 * @returns {Array}
 */
QrCodeErrorCorrection.prototype.getGeneratorPn = function (degree) {

    var pns = {
       10: 'α0x10 + α251x9 + α67x8 + α46x7 + α61x6 + α118x5 + α70x4 + α64x3 + α94x2 + α32x + α45',
       13: 'α0x13 + α74x12 + α152x11 + α176x10 + α100x9 + α86x8 + α100x7 + α106x6 + α104x5 + α130x4 + α218x3 + α206x2 + α140x + α78' 
    };

    var xgenpn = pns[degree];

    xgenpn = xgenpn.replace(/x\d*/g, '');
    xgenpn = xgenpn.replace(/α/g, '');
    xgenpn = xgenpn.replace(/\s*/g, '');
    var tmp = xgenpn.split('+');
    var genpn = [];

    while (tmp.length > 0) {
        var v = parseInt(tmp.shift());
        genpn.push(v);
    }

    // console.log(genpn);

    return genpn;
};

QrCodeErrorCorrection.prototype.getCode = function (data, dataWordsCount, eccWordsCount) {

    // console.log([dataWordsCount, eccWordsCount]);

    var i;
    var result = [];

    var genpn = this.getGeneratorPn(eccWordsCount);

    for (i = 0; i < data.length; i++) {
        result.push(data[i]);
    }

    for (var s = 0; s < dataWordsCount; s++) {
        var lterm = this.int2exp(result[0]);

        for (i = 0; i < genpn.length; i++) {
            var exp = (genpn[i] + lterm) % 255;
            exp = this.exp2int(exp);
            result[i] = result[i] ^ exp;
        }

        result.shift();
    }

    return result;
};

QrCodeErrorCorrection.prototype.mulPn = function (fst, sec) {
    var temp = {};
    var res = [];
    var res2 = [];
    var res3 = [];

    for (var s = 0; s < sec.length; s++) {
        for (var f = 0; f < fst.length; f++) {
            res.push([fst[f], sec[s]]);
        }
    }

    for (var r = 0; r < res.length; r++) {
        var fs = res[r][0];
        var sc = res[r][1];
        var fsa = fs.match(/[ax]\d+/g);
        var sca = sc.match(/[ax]\d+/g);

        var aexp = (parseInt(fsa[0].replace(/\D/, '')) +
            parseInt(sca[0].replace(/\D/, '')));
        var xexp = (parseInt(fsa[1].replace(/\D/, '')) +
            parseInt(sca[1].replace(/\D/, '')));

        res2.push([
            'a' + aexp,
            'x' + xexp
        ]);
    }

    temp = {};

    for (r = 0; r < res2.length; r++) {
        fs = res2[r][0];
        sc = res2[r][1];
        if (typeof temp[sc] === 'undefined') {
            temp[sc] = [];
        }
        temp[sc].push(fs);
    }

    for (var k in temp) {
        if (temp.hasOwnProperty(k)) {

            aexp = 0;
            xexp = parseInt(k.replace(/\D/, ''));

            if (temp[k].length > 1) {

                fs = parseInt(temp[k][0].replace(/\D/, ''));
                sc = parseInt(temp[k][1].replace(/\D/, ''));

                var int = this.exp2int(fs) ^ this.exp2int(sc);
                aexp = int > 0 ? this.int2exp(int) : 0;
            }
            else {
                aexp = parseInt(temp[k][0].replace(/\D/, ''));

                if (aexp == 216) {
                    // console.log([temp[k], int, exp]);
                }
            }

            res3.push('a' + aexp + 'x' + xexp);
        }
    }

    return res3;
};


