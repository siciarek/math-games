var Mask = function (matrix) {
    this.matrix = matrix;
    this.config = new Config();
};

Mask.prototype.constructor = Mask;

/**
 * Applies mask
 *
 * @param patternNumber
 * @returns {*}
 */
Mask.prototype.apply = function(patternNumber) {

    var data = [];
    var maskinfo = {
        evaluator: {},
        data: []
    };

    var binnum = parseInt(patternNumber).toString(2);

    while (binnum.length < 3) {
        binnum = '0' + binnum;
    }

    var funct = this.config.maskPatterns[binnum];

    for (var r = 0; r < this.matrix.getSize(); r++) {
        maskinfo.data[r] = [];
        for (var c = 0; c < this.matrix.getSize(); c++) {
            maskinfo.data[r][c] = this.matrix.data[r][c];
            if (this.matrix.mask[r][c] === this.matrix.MASK_DATA) {
                var val = maskinfo.data[r][c];
                maskinfo.data[r][c] = funct(r, c) ? val ^ 1 : val;
            }
        }
    }

    formatString = this.config.getFormatString(this.matrix.eclevel, patternNumber);
    versionInformationString = this.config.getVersionInformationString(this.matrix.version);

    this.matrix.setFormatInformationArea(formatString, maskinfo.data);
    this.matrix.setVersionInformationArea(versionInformationString, maskinfo.data);

    var evaluation = new Evaluation(this.matrix);

    maskinfo.evaluation = evaluation.evaluatePattern(maskinfo.data);

    return maskinfo;
};