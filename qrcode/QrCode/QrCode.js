/**
 * Quick Response Model 2 Code generator
 *
 * @param data raw data, default 'QRCODE'
 * @param ecstrategy error correction strategy, default ['M']
 * @param pattern mask pattern, default from evaluator
 * @constructor
 */
var QrCode = function (data, ecstrategy) {

    data = data || 'QRCODE';
    ecstrategy = ecstrategy || ['M'];

    var analyzer = new DataAnalyzer();
    var encoder = new DataEncoder();
    var errcorrection = new ErrorCorrection();
    var tiler, evaluator, mask;
    var formatString, versionInformationString;

    var info = analyzer.analyze(data, ecstrategy);
    var encdata = encoder.encode(info.data, info.version, info.mode, info.eclevel);
    var ecc = errcorrection.getCode(encdata, info.version, info.eclevel);

    this.matrix = new Matrix(info.version, info.eclevel);
    this.matrix.setStaticAreas();
    this.matrix.setReservedAreas();

    tiler = new Tiler(this.matrix);
    tiler.setArea(encdata, ecc);

    mask = new Mask(this.matrix);
    var results = [];
    var evaluations = {};
    var temp = [];
    var pattern = 0;

    for(pattern = 0; pattern < 8; pattern++) {
        var maskinfo = mask.apply(pattern);
        results.push(maskinfo.evaluation.total);
        evaluations[results[pattern]] = pattern;
    }

    results = results.sort();
    pattern = evaluations[results[0]];

    maskinfo = mask.apply(pattern);
    this.matrix.data = maskinfo.data;

    info['pattern'] = pattern;

    console.log(info);
};

QrCode.prototype.getData = function () {
    return this.matrix.getData();
};

QrCode.prototype.getSize = function () {
    return this.matrix.getSize();
};
