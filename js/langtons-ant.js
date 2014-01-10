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
    this.dir = 270;
    this.grid = [];
    this.cols = width;
    this.rows = height;

    this.getInfo = function () {
        return 'step ' + this.step;
    };

    this.init = function () {
        this.r = Math.floor(this.rows / 2);
        this.c = Math.floor(this.cols / 2);

        for (var r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = 0;
            }
        }

        if (this.pattern === 1) {
            for (var r = 0; r < this.rows; r++) {
                for (var c = 0; c < this.cols; c++) {
                    if (c > parseInt(this.cols / 4) && c < parseInt(this.cols - (this.cols / 4))
                        && r > parseInt(this.rows / 2.5) && r < parseInt(this.rows - (this.rows / 2.5))
                        ) {
                        this.grid[r][c] = 1;
                    }
                }
            }
        }
    };

    this.move = function () {

        this.grid[this.r][this.c] = this.grid[this.r][this.c] === 0 ? 1 : 0;

        var offsets = {
            0: [ 1, 0],
            90: [0, -1],
            180: [-1, 0],
            270: [0, 1]
        };

        var o = offsets[this.dir];
        this.r += o.shift();
        this.c += o.shift();

        this.dir += this.grid[this.r][this.c] === 1 ? -90 : 90;
        this.dir += 360;
        this.dir %= 360;

        if (this.r < this.rows && this.r > 0 && this.c < this.cols && this.c > 0) {
            this.step++;
            return true;
        }

        return false;
    };

    this.init();
};
