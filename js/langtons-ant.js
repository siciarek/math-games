/**
 * JavaScript implementation of Chris Langton’s Ant
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var LangtonsAnt = function (width, height, pattern) {

    this.name = 'Chris Langton’s Ant';
    this.pattern = pattern
    this.step = 0;
    this.r = 0;
    this.c = 0;
    this.dir = 180;
    this.grid = [];
    this.cols = width;
    this.rows = height;

    // L (90° left), R (90° right), N (no turn) and U (180° U-turn)

    this.L = 90;
    this.R = -90;
    this.N = 0;
    this.U = 180;

    this.getInfo = function () {
        return 'step ' + this.step;
    };

    this.init = function () {
        this.r = Math.floor(this.rows / 2);
        this.c = Math.floor(this.cols / 2);

        var p = [
            1, 0, 0.5
        ];

        for (var r = 0; r < this.rows; r++) {
            this.grid.push([]);
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = 0;
                if (c > parseInt(this.cols / 4) && c < parseInt(this.cols - (this.cols / 4))
                    && r > parseInt(this.rows / 2.5) && r < parseInt(this.rows - (this.rows / 2.5))
                    ) {
                    this.grid[r][c] = Math.random() < p[this.pattern] ? 0 : 3;
                }
            }
        }
    };

    this.computeDirection = function() {
        this.dir += this.grid[this.r][this.c] !== 0 ? this.L : this.R;
        this.dir += 360;
        this.dir %= 360;
    };

    this.move = function () {

        if(typeof this.grid[this.r] === 'undefined' || typeof this.grid[this.r][this.c] === 'undefined') {
            return false;
        }

        this.grid[this.r][this.c] = this.grid[this.r][this.c] !== 0 ? 0 : 1;

        var offsets = {
            0: [ 1, 0],
            90: [0, -1],
            180: [-1, 0],
            270: [0, 1]
        };

        var o = offsets[this.dir];
        this.r += o.shift();
        this.c += o.shift();

        if(typeof this.grid[this.r] === 'undefined' || typeof this.grid[this.r][this.c] === 'undefined') {
            return false;
        }

        this.computeDirection();

        this.step++;

        return true;
    };

    this.init();
};
