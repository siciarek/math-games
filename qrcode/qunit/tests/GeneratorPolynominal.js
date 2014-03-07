var generatorPolynominalDataProvider = {
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

test('Generator Polynominal Test', function() {
    var genpn = new GeneratorPolynominal();

    for(var degree in generatorPolynominalDataProvider) {
        if(generatorPolynominalDataProvider.hasOwnProperty(degree)) {
            var actual = genpn.polynominal(degree);
            var expected = generatorPolynominalDataProvider[degree];
            deepEqual(actual, expected, 'Degree ' + degree + ' do not passed.');
        }
    }
});