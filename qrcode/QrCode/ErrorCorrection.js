var ErrorCorrection = function () {
    this.config = new Config();
    this.gen = new GeneratorPolynominal();
};

ErrorCorrection.prototype.constructor = ErrorCorrection;

ErrorCorrection.prototype.getCode = function (data, version, eclevel) {

    var numberOfEcCodewords = parseInt(this.config.dataSizeInfo['' + version + '-' + eclevel][1]);

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
