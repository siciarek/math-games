var QrCodeErrorCorrection = function () {
    this.config = new QrCodeConfig();
    this.gen = new GeneratorPolynominal();
};

QrCodeErrorCorrection.prototype.constructor = QrCodeErrorCorrection;

QrCodeErrorCorrection.prototype.getCode = function (data, dataWordsCount, eccWordsCount) {

    var i;
    var result = [];

    var genpn = this.gen.polynominal(eccWordsCount);

    for (i = 0; i < data.length; i++) {
        result.push(data[i]);
    }

    for (var s = 0; s < dataWordsCount; s++) {
        var lterm = this.gen.int2exp(result[0]);

        for (i = 0; i < genpn.length; i++) {
            var exp = (genpn[i] + lterm) % 255;
            exp = this.gen.exp2int(exp);
            result[i] = result[i] ^ exp;
        }

        result.shift();
    }

    return result;
};
