/**
 * JavaScript implementation of Chris Langton’s Ant
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var LangtonsAnt = function (board) {

    this.name = 'Chris Langton’s Ant';
    this.step = 0;
    this.r = 0;
    this.c = 0;
    this.dir = 270;
    this.board = board;

    this.getInfo = function () {
        return 'step ' + this.step;
    };

    this.init = function () {

        if (typeof this.board.rows !== 'undefined' && this.board.cols !== 'undefined') {
            this.r = Math.floor(this.board.rows / 2);
            this.c = Math.floor(this.board.cols / 2);

            this.board.setName(this.name);
            this.board.setInfo(this.getInfo());
        }
    };

    this.move = function () {

        this.board.toggleCell(this.r, this.c);

        var offsets = {
            0: [ 1, 0],
            90: [0, -1],
            180: [-1, 0],
            270: [0, 1]
        };

        var o = offsets[this.dir];
        this.r += o.shift();
        this.c += o.shift();

        this.dir += this.board.isCellFilled(this.r, this.c) ? -90 : 90;
        this.dir += 360;
        this.dir %= 360;

        if (this.r < this.board.rows && this.c < this.board.cols && this.r >= 0 && this.c >= 0) {
            this.step++;
            this.board.setInfo(this.getInfo());
            return true;
        }

        return false;
    };

    this.init();
};
