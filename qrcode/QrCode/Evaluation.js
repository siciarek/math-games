var QrCodeEvaluation = function () {

};

QrCodeEvaluation.prototype.constructor = QrCodeEvaluation;

QrCodeEvaluation.prototype.evaluate = function (data) {
    var result = [];
    var total = 0;

    result[0] = this.rules[1](data);
    result[1] = this.rules[2](data);
    result[2] = this.rules[3](data);
    result[3] = this.rules[4](data);

    total = result[0] + result[1] + result[2] + result[3];

    return total;
};

QrCodeEvaluation.prototype.rules = {

    1: function (data) {
        /**
         * The first rule gives the QR code a penalty
         * for each group of five or more same-colored modules in a row (or column).
         */
        var result = 0;

        var horizontal = 0;
        var vertical = 0;

        var r, c;

        // rows:

        for (r = 0; r < data.length; r++) {
            sum = 0;
            sameColored = 0;
            color = -1;
            for (c = 0; c < data[0].length; c++) {

                if (data[r][c] !== color) {
                    sameColored++;
                    if (sameColored >= 5) {
                        sum += 3 + (sameColored - 5);
                    }
                    sameColored = 0;
                }
                else {
                    sameColored++;
                }
                color = data[r][c];
            }
            horizontal += sum;
        }

        // columns:

        for (c = 0; c < data.length; c++) {
            sum = 0;
            sameColored = 0;
            color = -1;
            for (r = 0; r < data[0].length; r++) {
                if (data[r][c] !== color) {
                    sameColored++;
                    if (sameColored >= 5) {
                        sum += 3 + (sameColored - 5);
                    }
                    sameColored = 0;
                }
                else {
                    sameColored++;
                }
                color = data[r][c];
            }
            vertical += sum;
        }

        result = horizontal + vertical;

        return result;
    },

    2: function (data) {
        /**
         * The second rule gives the QR code a penalty
         * for each 2x2 area of same-colored modules in the matrix.
         */
        var result = 0;

        var r, c;

        for (r = 0; r < data.length - 2; r++) {
            for (c = 0; c < data[0].length - 2; c++) {
                if(data[r][c] === data[r][c + 1]
                && data[r][c] === data[r + 1][c]
                && data[r][c] === data[r + 1][c + 1]) {
                    result += 3;
                }
            }
        }

        return result;
    },

    3: function (data) {
        /**
         * The third rule gives the QR code a large penalty
         * if there are patterns that look similar to the finder patterns.
         *
         * (1 x dark: 1 x bright: 3 x dark: 1 x bright: 1 x dark) pattern (and reversed) in a line or a column
         * [ 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0 ]
         * [ 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1 ]
         */
        var result = 0;

        var patterns = [
            [ 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1 ]
        ];

        var match = true;
        var r, c;

        // Rows:
        for (r = 0; r <  data.length; r++) {
            for (c = 0; c <  data[0].length - patterns[0].length; c++) {
                match = [true, true];

                for (var p = 0; p < patterns[0].length; p++) {
                    if (data[r][c + p] !== patterns[0][p]) {
                        match[0] = false;
                    }
                    if (data[r][c + p] !== patterns[1][p]) {
                        match[1] = false;
                    }
                }

                if (match[0] === true) {
                    result += 40;
                }

                if (match[1] === true) {
                    result += 40;
                }
            }
        }

        // Cols:
        for (c = 0; c < data[0].length; c++) {
            for (r = 0; r < data.length - patterns[0].length; r++) {
                match = [true, true];

                for (p = 0; p < patterns[0].length; p++) {
                    if (data[r + p][c] !== patterns[0][p]) {
                        match[0] = false;
                    }
                    if (data[r + p][c] !== patterns[1][p]) {
                        match[1] = false;
                    }
                }

                if (match[0] === true) {
                    result += 40;
                }

                if (match[1] === true) {
                    result += 40;
                }
            }
        }

        return result;
    },

    4: function (data) {
        /**
         * The fourth rule gives the QR code a penalty
         * if more than half of the modules are dark or light, with a larger penalty for a larger difference.
         */
        var result = 0;
        var dark = 0;
        var light = 0;
        var total = 0;
        var r, c;

        for (r = 0; r < data.length; r++) {
            for (c = 0; c < data[0].length; c++) {
                dark += data[r][c] === 1 ? 1 : 0;
                light += data[r][c] === 0 ? 1 : 0;
                total++;
            }
        }

        var perc = (dark / total) * 100;

        var fivemul = {
            upper: 0,
            lower: 0
        };

        while (fivemul.upper < perc) {
            fivemul.upper += 5;
        }

        fivemul.lower = fivemul.upper - 5;

        var a = Math.abs(fivemul.lower - 50);
        var b = Math.abs(fivemul.upper - 50);

        result = Math.min(a, b);
        result *= 10;

        return result;
    }
};

