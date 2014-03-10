var dataAnalyzerDataProvider = [
    // Numeric:
    {
        message: '1234567890', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },
    {
        message: '11111111112222222222333333333344444444449', expected: { mode: 'numeric', eclevel: 'L', version: 1 }
    },
    {
        message: '00000000000000000000000000000000000000000', expected: { mode: 'numeric', eclevel: 'L', version: 1 }
    },
    {
        message: '000000000000000000000000000000000000000000', expected: { mode: 'numeric', eclevel: 'Q', version: 2 }
    },
    {
        message: '48603173114', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },

    // Alphanumeric
    {
        message: 'HELLO WORLD', expected: { mode: 'alphanumeric', eclevel: 'Q', version: 1 }
    },

    // Binary:
    {
        message: 'Hello, World!', expected: { mode: 'binary', eclevel: 'M', version: 1 }
    }
];

test('Data Analyzer Test', function () {
    var analyzer = new DataAnalyzer();

    while (dataAnalyzerDataProvider.length > 0) {
        var test = dataAnalyzerDataProvider.shift();
        var actual = analyzer.analyze(test.message);
        deepEqual(actual, test.expected, [test.message].toString());
    }
});