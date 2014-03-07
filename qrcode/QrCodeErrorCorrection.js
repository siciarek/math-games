var QrCodeErrorCorrection = function () {
    this.config = new QrCodeConfig();
    this.gen = new GeneratorPolynominal();
};

QrCodeErrorCorrection.prototype.constructor = QrCodeErrorCorrection;

QrCodeErrorCorrection.prototype.getCode = function (data, numberOfEcCodewords) {

    var genpn = this.gen.polynominal(numberOfEcCodewords);
    var result = [];
    result = result.concat(data);

    for (var s = 0; s < data.length; s++) {
        var lterm = this.gen.int2exp(result[0]) % 255;

        for (var i = 0; i < genpn.length; i++) {
            var exp = (genpn[i] + lterm) % 255;
            exp = this.gen.exp2int(exp);
            result[i] = result[i] ^ exp;
        }

        result.shift();
    }

    return result;
};
