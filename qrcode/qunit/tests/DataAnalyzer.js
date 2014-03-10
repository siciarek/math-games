var dataAnalyzerDataProvider = [
    // Numeric:
    {
        message: '0123456789', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },

    {
        message: '0', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },
    {
        message: '00000000000000000000000000000000000000000', expected: { mode: 'numeric', eclevel: 'L', version: 1 }
    },
    {
        message: '000000000000000000000000000000000000000000', expected: { mode: 'numeric', eclevel: 'Q', version: 2 }
    },

    {
        message: '1', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },
    {
        message: '11111111111111111111111111111111111111111', expected: { mode: 'numeric', eclevel: 'L', version: 1 }
    },
    {
        message: '111111111111111111111111111111111111111111', expected: { mode: 'numeric', eclevel: 'Q', version: 2 }
    },

    {
        message: '2', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },
    {
        message: '22222222222222222222222222222222222222222', expected: { mode: 'numeric', eclevel: 'L', version: 1 }
    },
    {
        message: '222222222222222222222222222222222222222222', expected: { mode: 'numeric', eclevel: 'Q', version: 2 }
    },

    {
        message: '48603173114', expected: { mode: 'numeric', eclevel: 'H', version: 1 }
    },

    // Alphanumeric
    {
        message: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:', expected: { mode: 'alphanumeric', eclevel: 'L', version: 2 }
    },
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
        deepEqual(actual, test.expected, [test.expected.mode, test.message].toString());
    }
});