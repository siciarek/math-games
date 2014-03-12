var matrixDataProvider = [

];

test('Matrix Test', function () {
    var matrix, expected, actual, message, data, mask, r, c;

    for(var v = 1; v <= 40; v++) {
        // Check Matrix size:
        matrix = new Matrix(v);
        actual = matrix.getSize();
        expected = (((v - 1) * 4) + 21);
        message = 'Size ' + v;
        deepEqual(actual, expected, message);

        // Check Matrix data size:
        data = matrix.getData();
        actual = 0;
        for(r = 0; r < data.length; r++) {
            for(c = 0; c < data[r].length; c++) {
                actual++;
            }
        }
        expected *= expected;
        message = 'Data Size ' + v;
        deepEqual(actual, expected, message);

        // Check Matrix mask size:
        mask = matrix.getMask();
        actual = 0;
        for(r = 0; r < mask.length; r++) {
            for(c = 0; c < mask[r].length; c++) {
                actual++;
            }
        }
        message = 'Mask Size ' + v;
        deepEqual(actual, expected, message);
    }
});