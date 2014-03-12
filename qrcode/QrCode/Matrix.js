var Matrix = function (version) {

    if (typeof version === 'undefined' || isNaN(parseInt(version))) {
        throw 'Invalid version number.';
    }

    this.DATA_UNDEFINED_MODULE = 7;
    this.DATA_LIGHT_MODULE = 0;
    this.DATA_DARK_MODULE = 1;

    this.MASK_POSITION_DETECTION_PATTERN = 101;
    this.MASK_SEPARATOR = 102;
    this.MASK_TOP_TIMER = 103;
    this.MASK_LEFT_TIMER = 104;
    this.MASK_ALIGNMENT = 105;
    this.MASK_FIXED_DARK_MODULE = 106;

    this.MASK_FORMAT_INFORMATION = 201;
    this.MASK_VERSION_INFORMATION = 202;
    this.MASK_DATA = 255;

    this.version = version;
    this.size = (((this.version - 1) * 4) + 21);
    this.data = [];
    this.mask = [];

    this.allocate(this.data, this.size);
    this.allocate(this.mask, this.size);

    this.setPositionDetectionPatterns(this.data, this.version);
};

Matrix.prototype.constructor = Matrix;

Matrix.prototype.setPositionDetectionPatterns = function(data, version) {

};

Matrix.prototype.allocate = function (data, size) {
    var r, c;

    for (r = 0; r < size; r++) {
        var row = [];
        for (c = 0; c < size; c++) {
            row[c] = this.UNDEFINED_MODULE;
        }
        data.push(row);
    }
};

Matrix.prototype.getSize = function () {
    return this.size;
};

Matrix.prototype.getData = function () {
    return this.data;
};

Matrix.prototype.getMask = function () {
    return this.mask;
};
