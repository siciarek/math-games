/**
 * JavaScript implementation of John Conway’s Game of Life
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Life = function (board) {

    this.name = 'John Conway’s Game of Life';
    this.current = [];
    this.buffer = [];
    this.iterations = 0;
    this.iteration = 0;

    this.structure = 0;
    this.structures = [
        'Pulsar',
        'R-pentomino',
        'Gosper’s glider gun',
        'Diehard',
        'Glider',
        'LWSS Dakota'
    ];

    this.board = board;

    this.setStructure = function () {

        var r = 0;
        var c = 0;
        var iterations = 0;
        var offsets = [];

        switch (this.structures[this.structure]) {
            case 'Pulsar':
                iterations = 50;
                r = 60 - 10;
                c = 80 - 6;
                offsets = [

                    [0, 2],
                    [0, 3],
                    [0, 4],

                    [2, 0],
                    [3, 0],
                    [4, 0],

                    [5, 2],
                    [5, 3],
                    [5, 4],

                    [2, 5],
                    [3, 5],
                    [4, 5],

                    ///////////////////

                    [0, 8],
                    [0, 9],
                    [0, 10],

                    [2, 7],
                    [3, 7],
                    [4, 7],

                    [5, 8],
                    [5, 9],
                    [5, 10],

                    [2, 12],
                    [3, 12],
                    [4, 12],

                    //////////////////////

                    [7, 8],
                    [7, 9],
                    [7, 10],

                    [8, 7],
                    [9, 7],
                    [10, 7],

                    [12, 8],
                    [12, 9],
                    [12, 10],

                    [8, 12],
                    [9, 12],
                    [10, 12],

                    /////////////////////

                    [8, 0],
                    [9, 0],
                    [10, 0],

                    [8, 5],
                    [9, 5],
                    [10, 5],

                    [7, 2],
                    [7, 3],
                    [7, 4],

                    [12, 2],
                    [12, 3],
                    [12, 4]

                    /////////////////////

                ];
                break;

            case 'R-pentomino':
                iterations = 70;
                r = 50;
                c = 80;
                offsets = [
                    [0, 1],
                    [0, 2],

                    [1, 0],
                    [1, 1],

                    [2, 1]
                ];
                break;

            case 'Gosper’s glider gun':
                iterations = 200;
                r = 40;
                c = 60;
                offsets = [
                    [0, 24],

                    [1, 22],
                    [1, 24],

                    [2, 12],
                    [2, 13],
                    [2, 20],
                    [2, 21],
                    [2, 34],
                    [2, 35],

                    [3, 11],
                    [3, 15],
                    [3, 20],
                    [3, 21],
                    [3, 34],
                    [3, 35],

                    [4, 0],
                    [4, 1],
                    [4, 10],
                    [4, 16],
                    [4, 20],
                    [4, 21],

                    [5, 0],
                    [5, 1],
                    [5, 10],
                    [5, 14],
                    [5, 16],
                    [5, 17],
                    [5, 22],
                    [5, 24],

                    [6, 10],
                    [6, 16],
                    [6, 24],

                    [7, 11],
                    [7, 15],

                    [8, 12],
                    [8, 13]
                ];
                break;

            case 'Diehard':
                iterations = 130;
                r = 60;
                c = 80;
                offsets = [
                    [0, 6],
                    [1, 0],
                    [1, 1],
                    [2, 1],
                    [2, 5],
                    [2, 6],
                    [2, 7]
                ];
                break;

            case 'Glider':
                iterations = 200;
                r = 10;
                c = 10;
                offsets = [
                    [0, 1],
                    [1, 2],
                    [2, 0],
                    [2, 1],
                    [2, 2]
                ];
                break;

            case 'LWSS Dakota':
                iterations = 100;
                r = 60;
                c = 110;
                offsets = [
                    [0, 1],
                    [0, 4],
                    [1, 0],
                    [2, 0],
                    [2, 4],
                    [3, 0],
                    [3, 1],
                    [3, 2],
                    [3, 3]
                ];
                break;
        }

        for (i = 0; i < offsets.length; i++) {
            var o = offsets[i];
            this.current[r + o[0]][c + o[1]] = 1;
        }

        this.iterations = iterations;
    };

    this.getInfo = function () {
        return this.structures[this.structure] + ' iteration ' + this.iteration;
    };

    this.reset = function () {
        for (var r = 0; r < this.board.rows; r++) {
            this.buffer[r] = [];
            this.current[r] = [];
            for (var c = 0; c < this.board.cols; c++) {
                this.buffer[r][c] = 0;
                this.current[r][c] = 0;
            }
        }
    };

    this.computeBuff = function () {
        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                var val = this.current[r][c];
                var n = this.countNeighbours(r, c);

                if (val === 0 && n === 3) {
                    this.buffer[r][c] = 1;
                }
                else if (val === 1 && (n === 2 || n === 3)) {
                    this.buffer[r][c] = 1;
                }
                else {
                    this.buffer[r][c] = 0;
                }
            }
        }
    };

    this.countNeighbours = function (row, col) {
        var count = 0;

        var n = [];
        n.push([row - 1, col - 1]);
        n.push([row - 1, col    ]);
        n.push([row - 1, col + 1]);
        n.push([row    , col - 1]);
        n.push([row    , col + 1]);
        n.push([row + 1, col - 1]);
        n.push([row + 1, col    ]);
        n.push([row + 1, col + 1]);

        for (var i = 0; i < n.length; i++) {
            var e = n[i];
            var r = e[0];
            var c = e[1];
            if (typeof this.current[r] !== 'undefined' && typeof this.current[r][c] !== 'undefined' && this.current[r][c] === 1) {
                count++;
            }
        }

        return count;
    };

    this.buff2curr = function () {
        for (var r = 0; r < this.board.rows; r++) {
            this.current[r] = [];
            for (var c = 0; c < this.board.cols; c++) {
                this.current[r][c] = this.buffer[r][c];
            }
        }
    };

    this.init = function () {
        if (typeof this.board.rows !== 'undefined' && this.board.cols !== 'undefined') {
            this.reset();

            this.setStructure();

            this.board.setName(this.name);
            this.board.setInfo(this.getInfo());
        }
    };

    this.move = function () {
        this.board.clear();

        this.computeBuff();
        this.buff2curr();

        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                if (this.current[r][c] === 1) {
                    this.board.setCell(r, c);
                }
            }
        }

        this.board.setInfo(this.getInfo());
        this.iteration++;

        if (this.iteration > this.iterations) {
            this.reset();
            this.iteration = 0;
            this.structure++;
            this.structure %= this.structures.length;
            this.setStructure();
        }

        return true;
    };

    this.init();
};

