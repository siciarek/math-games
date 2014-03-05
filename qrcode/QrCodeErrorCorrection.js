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

    this.pns = {
        7: [0, 87, 229, 146, 149, 238, 102, 21],
        10: [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45],
        13: [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78],
        17: [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136],
        22: [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231]
    };
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

//    console.log({ degree: degree });
//
//    var pnstemp = {
//        7: 'α0x7 + α87x6 + α229x5 + α146x4 + α149x3 + α238x2 + α102x + α21',
//        10: 'α0x10 + α251x9 + α67x8 + α46x7 + α61x6 + α118x5 + α70x4 + α64x3 + α94x2 + α32x + α45',
//        13: 'α0x13 + α74x12 + α152x11 + α176x10 + α100x9 + α86x8 + α100x7 + α106x6 + α104x5 + α130x4 + α218x3 + α206x2 + α140x + α78',
//        17: 'α0x17 + α43x16 + α139x15 + α206x14 + α78x13 + α43x12 + α239x11 + α123x10 + α206x9 + α214x8 + α147x7 + α24x6 + α99x5 + α150x4 + α39x3 + α243x2 + α163x + α136',
//        22: 'α0x22 + α210x21 + α171x20 + α247x19 + α242x18 + α93x17 + α230x16 + α14x15 + α109x14 + α221x13 + α53x12 + α200x11 + α74x10 + α8x9 + α172x8 + α98x7 + α80x6 + α219x5 + α134x4 + α160x3 + α105x2 + α165x + α231'
//    };
//
//    var pns = {};
//
//    for (var key in pnstemp) {
//        var xgenpn = pnstemp[key];
//        xgenpn = xgenpn.replace(/x\d*/g, '');
//        xgenpn = xgenpn.replace(/α/g, '');
//        xgenpn = xgenpn.replace(/\s*/g, '');
//        var tmp = xgenpn.split('+');
//
//        pns[key] = [];
//
//        while (tmp.length > 0) {
//            var v = parseInt(tmp.shift());
//            pns[key].push(v);
//        }
//    }

    return this.pns[degree];
};

QrCodeErrorCorrection.prototype.getCode = function (data, dataWordsCount, eccWordsCount) {

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

    console.log({dwc: dataWordsCount, ecc: eccWordsCount});
    console.log(data);
    console.log(result);

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

        var aexp = parseInt(fsa[0].replace(/\D/, '')) + parseInt(sca[0].replace(/\D/, ''));
        var xexp = parseInt(fsa[1].replace(/\D/, '')) + parseInt(sca[1].replace(/\D/, ''));

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


