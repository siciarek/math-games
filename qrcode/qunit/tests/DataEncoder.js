var dataEncoderDataProvider = [
    // http://www.thonky.com/qr-code-tutorial/data-encoding/
    {
        input: {
            message: 'HELLO WORLD',
			version: 1,
			mode: 'alphanumeric',
			ecLevel: 'M'
        },
        expected: [ 32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17 ]
    },
    {
        input: {
            message: 'HELLO WORLD',
			version: 1,
			mode: 'alphanumeric',
			ecLevel: 'Q'
        },
        expected: [ 32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236 ]
    },
	// http://www.swetake.com/qrcode/qr2_en.html
    {
        input: {
            message: 'ABCDE123',
			version: 1,
			mode: 'alphanumeric',
			ecLevel: 'H'
        },
        expected: [ 32, 65, 205, 69, 41, 220, 46, 128, 236 ]
    }
];

test('Data Encoder Test', function () {
    var de = new DataEncoder();

    while (dataEncoderDataProvider.length > 0) {
        var test = dataEncoderDataProvider.shift();
        var actual = de.encode(test.input.message, test.input.version, test.input.mode, test.input.ecLevel);
        deepEqual(actual, test.expected, [test.input.message, test.input.version, test.input.mode, test.input.ecLevel].toString());
    }
});