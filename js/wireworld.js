/**
 * JavaScript implementation of  Brian Silverman’s Wireworld
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Wireworld = function (width, height, pattern) {

    pattern = pattern || 0;

    this.name = 'Wireworld';
    this.pattern = pattern;
    this.step = 0;
    this.grid = [];
    this.buffer = [];
    this.cols = width;
    this.rows = height;

    this.getInfo = function () {
        return 'step ' + this.step;
    };

    this.reset = function () {

        if(this.pattern <= 1) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = wwpatterns[this.pattern][r][c];
                }
            }

            return;
        }

        if(this.pattern === 7) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = gates[r][c];
                }
            }

            return;
        }

        if(this.pattern === 7) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = gates[r][c];
                }
            }

            return;
        }

        if(this.pattern === 2) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = clocks[r][c];
                }
            }

            return;
        }

        if(this.pattern === 6) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = gateAndNotAndNot[r][c];
                }
            }

            return;
        }

        if(this.pattern === 5) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = gateAndNotOr[r][c];
                }
            }

            return;
        }

        if(this.pattern === 3) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = wireworldDigitBoard[r][c];
                }
            }

            return;
        }

        if(this.pattern === 4) {
            for (var r = 0; r < this.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.cols; c++) {
                    this.grid[r][c] = wireworldDigitAltBoard[r][c];
                }
            }

            return;
        }
    };

    this.getState = function (row, col) {
        var val = this.grid[row][col];
        return this.transitions[val](row, col, this);
    };

    this.computeBuffer = function () {
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                this.buffer[r][c] = this.getState(r, c);
            }
        }
    };

    this.countNeighbours = function (row, col) {
        var count = 0;
        var neighbours = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [ 0, -1],
            [ 0, 1],
            [ 1, -1],
            [ 1, 0],
            [ 1, 1]
        ];

        while (neighbours.length > 0) {
            var n = neighbours.shift();
            var r = row + n.shift();
            var c = col + n.shift();
            if (typeof this.grid[r] !== 'undefined' && typeof this.grid[r][c] !== 'undefined' && this.grid[r][c] === 1) {
                count++;
            }
        }

        return count;
    };

    this.transitions = [
        function (row, col, obj) {
            return 0;
        },
        function (row, col, obj) {
            return 2;
        },
        function (row, col, obj) {
            return 3;
        },
        function (row, col, obj) {
            var n = obj.countNeighbours(row, col);
            return n === 1 || n === 2 ? 1 : 3;
        }
    ];

    this.buffer2grid = function () {

        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = this.buffer[r][c];
            }
        }
    };

    this.init = function () {
        this.step = 0;
        this.reset();
    };

    this.move = function () {

        this.computeBuffer();
        this.buffer2grid();

        this.step++;

        return true;
    };

    this.init();
};
