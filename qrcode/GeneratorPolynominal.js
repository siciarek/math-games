var GeneratorPolynominal = function () {
    this.log = [];
    this.antilog = [];
	this.symbol = 'x';

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

    this.testpns = {
            2: [0, 25, 1],
                3: [0, 198, 199, 3],
        7: [0, 87, 229, 146, 149, 238, 102, 21],
                8: [0, 175, 238, 208, 249, 215, 252, 196, 28],
                9: [0, 95, 246, 137, 231, 235, 149, 11, 123, 36],
        10: [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45],
        13: [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78],
        15: [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105],
        17: [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136],
        22: [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231]
    };
};

GeneratorPolynominal.prototype.constructor = GeneratorPolynominal;

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
			var fsa = fs.split(this.symbol).map(function(e){return parseInt(e);});
			var sca = sc.split(this.symbol).map(function(e){return parseInt(e);});
			
			fs = fsa[0] + sca[0];
			sc = this.symbol + (fsa[1] + sca[1]);

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

            fs = parseInt(temp[k][0]) % 255;

            if (temp[k].length > 1) {
                sc = parseInt(temp[k][1]) % 255;

                                fs = this.exp2int(fs);
                                sc = this.exp2int(sc);

                var intg = fs ^ sc;
                aexp = intg > 0 ? this.int2exp(intg) : 0;
            }
            else {
                aexp = fs;
            }

            res.push(aexp + this.symbol + xexp);
        }
    }

    return res;
};

GeneratorPolynominal.prototype.polynominal = function(degree) {
        var pn = [];

        var result = ['0' + this.symbol + '1', '0' + this.symbol + '0'];
        var exp = 1;

        do {
            var second = ['0' + this.symbol + '1', exp + this.symbol + '0'];
        result = this.multiply(result, second);
        } while(++exp < degree);

        while(result.length > 0) {
                var chunk = result.shift().split(this.symbol).shift();
                pn.push(parseInt(chunk));
        }

        return pn;
};

