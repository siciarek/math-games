var dataAnalyzerDataProvider = [
    {
        message: 'HELLO WORLD',
        expected: { mode: 'alphanumeric' }
    },
    {
        message: '1234567890',
        expected: { mode: 'numeric' }
    }
];

test('Data Analyzer Test', function () {
    var da = new QrCodeDataAnalyzer();

    while (dataAnalyzerDataProvider.length > 0) {
        var test = dataAnalyzerDataProvider.shift();
        var actual = da.analyze(test.message);
        deepEqual(actual, test.expected, [test.message].toString());
    }
});