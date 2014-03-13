/**
 * Quick Response Model 2 Code generator
 *
 * @param data raw data, default 'QRCODE'
 * @param ecstrategy error correction strategy, default ['M']
 * @constructor
 */
var QrCode = function (data, ecstrategy) {

    data = data || 'QRCODE';
    ecstrategy = ecstrategy || ['M'];

    var analyzer = new DataAnalyzer();
    var encoder = new DataEncoder();
    var errcorrection = new ErrorCorrection();

    var info = analyzer.analyze(data, ecstrategy);
    var encdata = encoder.encode(info.data, info.version, info.mode, info.eclevel);
    var ecc = errcorrection.getCode(encdata, info.version, info.eclevel);

    this.matrix = new Matrix(info.version);
    this.matrix.setStaticAreas();
    this.matrix.setReservedAreas();

    var tiler = new Tiler(this.matrix);
    tiler.setArea(encdata, ecc);

    console.log(info);
    console.log(encdata);
    console.log(ecc);
};

QrCode.prototype.getData = function() {
    return this.matrix.getData();
};

QrCode.prototype.getSize = function() {
    return this.matrix.getSize();
};
