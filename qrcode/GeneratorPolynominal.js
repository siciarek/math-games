var GeneratorPolynominal = function () {
    this.log = [];
    this.antilog = [];
    this.symbol = ',';

    this.createLogAndAntilog();
};

GeneratorPolynominal.prototype.constructor = GeneratorPolynominal;

GeneratorPolynominal.prototype.createLogAndAntilog = function (exp) {
    for (var i = 0; i < 256; i++) {
        var a = 1;
        var ix = i;

        while (ix-- > 0) {
            a <<= 1;
            a = a > 255 ? a ^ 285 : a;
        }

        this.log[i] = a;
        this.antilog[a] = i;
    }
};

GeneratorPolynominal.prototype.exp2int = function (exp) {
    return this.log[exp];
};

GeneratorPolynominal.prototype.int2exp = function (exp) {
    return this.antilog[exp];
};

GeneratorPolynominal.prototype.multiply = function (fst, sec) {
    var temp = {};
    var res = [];

    for (var s = 0; s < sec.length; s++) {
        for (var f = 0; f < fst.length; f++) {
            var fs = fst[f];
            var sc = sec[s];
            var fsa = fs.split(this.symbol).map(function (e) {
                return parseInt(e);
            });
            var sca = sc.split(this.symbol).map(function (e) {
                return parseInt(e);
            });

            fs = fsa[0] + sca[0];
            sc = fsa[1] + sca[1];

            fs %= 255;
            sc %= 255;

            sc = this.symbol + sc;

            if (typeof temp[sc] === 'undefined') {
                temp[sc] = [];
            }

            temp[sc].push(fs);
        }
    }

    for (var k in temp) {
        if (temp.hasOwnProperty(k)) {

            aexp = 0;
            xexp = parseInt(k.toString().replace(/\D/, ''));

            fs = parseInt(temp[k][0]);

            if (temp[k].length > 1) {
                sc = parseInt(temp[k][1]);

                fs = this.exp2int(fs);
                sc = this.exp2int(sc);

                var intg = fs ^ sc;
				aexp = this.int2exp(intg);
            }
            else {
                aexp = fs;
            }

			aexp %= 255;
            res.push(aexp + this.symbol + xexp);
        }
    }

    return res;
};

GeneratorPolynominal.prototype.polynominal = function (degree) {
    var pn = [];

    var exp = 1;
    var result = ['0' + this.symbol + '1', '0' + this.symbol + '0'];

    do {
        var second = ['0' + this.symbol + '1', exp + this.symbol + '0'];
        result = this.multiply(result, second);
    } while (++exp < degree);

    while (result.length > 0) {
        var chunk = result.shift().split(this.symbol).shift();
        pn.push(parseInt(chunk));
    }

    return pn;
};

