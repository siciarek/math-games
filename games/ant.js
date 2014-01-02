/**
 * JavaScript implementation of Chris Langton’s Ant
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Ant = function (board) {

    this.name = 'Langton’s Ant';
    this.steps = 0;
    this.r = 0;
    this.c = 0;
    this.dir = 270;
    this.board = board;

    this.getInfo = function() {
        return 'step ' + this.steps;
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

        switch (this.dir) {
            case 0:
                this.r++;
                break;
            case 90:
                this.c--;
                break;
            case 180:
                this.r--;
                break;
            case 270:
                this.c++;
                break;
        }

        this.dir += this.board.getCellColor(this.r, this.c) === 'black' ? -90 : 90;
        this.dir += 360;
        this.dir %= 360;

        if((this.r < this.board.rows && this.c < this.board.cols && this.r >= 0 && this.c >= 0) === false) {
            return false;
        }

        this.steps++;
        this.board.setInfo(this.getInfo());

        return true;
    };

    this.init();
};
