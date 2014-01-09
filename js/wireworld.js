function createClock(pat, size, start, obj) {
    r = start[0];
    c = start[1];
    l = size.v;
    while (l--) {
        pat[r++ + '-' + c ] = 3;
    }
    c++;
    l = size.h;
    while (l--) {
        pat[r + '-' + c++ ] = 3;
    }
    r--;
    l = size.v;
    while (l--) {
        pat[r-- + '-' + c ] = 3;
    }
    c--;
    l = size.h;
    while (l--) {
        pat[r + '-' + c-- ] = 3;
    }

    r = start[0];
    c = start[1] + size.h + 1;
    l = obj.board.cols - c;
    while (l--) {
        pat[r + '-' + c++ ] = 3;
    }

    pat[(start[0] - 1) + '-' + (start[1] + size.h)] = 2;
    pat[(start[0]) + '-' + (start[1] + size.h + 1)] = 1;
}

/**
 * JavaScript implementation of  Brian Silverman’s Wireworld
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Wireworld = function (board, pattern) {

    pattern = pattern || 0;

    this.name = 'Brian Silverman’s Wireworld';
    this.pattern = pattern;
    this.step = 0;
    this.grid = [];
    this.buffer = [];
    this.board = board;
    this.colors = [
        'empty',
        'electron-head',
        'electron-tail',
        'conductor'
    ];

    this.getInfo = function () {
        return 'step ' + this.step;
    };

    this.getPattern = function (pattern) {

        var patterns = [];
        var pat = null;
        var c = 0;
        var r = 0;
        var key = null;
        var l = 0;

        // simple horizontal conductor

        pat = {};
        for (c = 0; c < this.board.cols; c++) {
            r = Math.floor(this.board.rows / 2);
            key = r + '-' + c;
            pat[key] = c === 0 ? 1 : 3;
        }
        patterns.push(pat);

        // conductor

        pat = {};

        r = 16;
        c = 0;
        pat[r + '-' + c] = 1; // electron head
        c++;

        l = 10;
        while (l--) {
            pat[r + '-' + c++] = 3;
        }
        r++;

        l = 10;
        while (l--) {
            pat[r++ + '-' + c ] = 3;
        }
        c++;

        l = 10;
        while (l--) {
            pat[r + '-' + c++] = 3;
        }
        r--;

        l = 10;
        while (l--) {
            pat[r-- + '-' + c ] = 3;
        }
        c++;

        l = 10;
        while (l--) {
            pat[r + '-' + c++] = 3;
        }
        r++;

        l = 10;
        while (l--) {
            pat[r++ + '-' + c++ ] = 3;
        }

        l = 10;
        while (l--) {
            pat[r + '-' + c++] = 3;
        }

        l = 11;
        while (l--) {
            pat[r-- + '-' + c++ ] = 3;
        }

        l = 32;
        while (l--) {
            pat[r + '-' + c++ ] = 3;
        }

        for (; c < this.board.cols;) {
            pat[r++ + '-' + c++] = 3;
        }

        patterns.push(pat);

        // clock

        pat = {};
        var maxtime = 16;

        for (var t = 0; t < maxtime; t++) {
            var top = 3 + 4 * t;
            var horiz = t;
            var left = maxtime - t;
            createClock(pat, { h: horiz, v: 1 }, [top, left], this);
        }

        patterns.push(pat);

        pattern %= patterns.length;

        return patterns[pattern];
    };

    this.reset = function () {

        if(this.pattern === 0) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = wwpatterns[this.pattern][r][c];
                }
            }

            return;
        }

        if(this.pattern === 7) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = gates[r][c];
                }
            }

            return;
        }

        if(this.pattern === 7) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = gates[r][c];
                }
            }

            return;
        }

        if(this.pattern === 2) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = clocks[r][c];
                }
            }

            return;
        }

        if(this.pattern === 6) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = gateAndNotAndNot[r][c];
                }
            }

            return;
        }

        if(this.pattern === 5) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = gateAndNotOr[r][c];
                }
            }

            return;
        }

        if(this.pattern === 3) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = wireworldDigitBoard[r][c];
                }
            }

            return;
        }

        if(this.pattern === 4) {
            for (var r = 0; r < this.board.rows; r++) {
                this.grid[r] = [];
                this.buffer[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.grid[r][c] = wireworldDigitAltBoard[r][c];
                }
            }

            return;
        }

        var p = this.getPattern(this.pattern);

        for (var r = 0; r < this.board.rows; r++) {
            this.grid[r] = [];
            this.buffer[r] = [];
            for (var c = 0; c < this.board.cols; c++) {
                this.grid[r][c] = this.buffer[r][c] = 0;

                if (typeof p[r + '-' + c] !== 'undefined') {
                    this.grid[r][c] = p[r + '-' + c];
                }
            }
        }
    };

    this.getState = function (row, col) {
        var val = this.grid[row][col];
        return this.transitions[val](row, col, this);
    };

    this.computeBuffer = function () {
        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
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

        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                this.grid[r][c] = this.buffer[r][c];
            }
        }
    };

    this.init = function () {
        this.step = 0;

        if (typeof this.board.rows !== 'undefined' && this.board.cols !== 'undefined') {
            this.reset();
            this.board.setColors(this.colors);
            this.board.setName(this.name);
            this.board.setInfo(this.getInfo());
        }
    };

    this.move = function () {

        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                this.board.setCellColor(r, c, this.grid[r][c]);
            }
        }

        this.board.setInfo(this.getInfo());

        this.computeBuffer();
        this.buffer2grid();

        return this.step++ < 400;
    };

    this.init();
};
