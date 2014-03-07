var errorCorrectionDataProvider = [
    {
        input: {
            data: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17, 236, 17, 236],
            ecc: 7
        },
        expected: [209, 239, 196, 207, 78, 195, 109]
    },
    {
        input: {
            data: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17],
            ecc: 10
        },
        expected: [196, 35, 39, 119, 235, 215, 231, 226, 93, 23]
    },
    {
        input: {
            data: [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236],
            ecc: 13
        },
        expected: [168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16]
    }
];

test('Error Correction Test', function () {
    var ec = new QrCodeErrorCorrection();

    while (errorCorrectionDataProvider.length > 0) {
        var test = errorCorrectionDataProvider.shift();
        var actual = ec.getCode(test.input.data, test.input.ecc);
        deepEqual(actual, test.expected);
    }
});