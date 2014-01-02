/**
 * JavaScript implementation of Stephen Wolfram’s Elementary Cellular Automaton
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var CellularAutomaton = function (board, rule) {

    this.name = 'Stephen Wolfram’s Elementary Cellular Automaton';

    rule = typeof rule === 'undefined' ? null : rule;

    this.board = board;
    this.steps = 15;
    this.r = 0;
    this.c = 0;
    this.matrix = [];
    this.slideshow = rule === null;

    this.rule = this.slideshow ? 30 : rule;
    this.rules = {};

    this.getInfo = function() {
        return '<span style="color:black">rule ' + this.rule + '</span> (gen. ' + this.r + ')';
    };

    this.setRules = function () {
        for (var i = 0; i < 8; i++) {
            this.rules[i] = (this.rule >> i) % 2;
        }
    };

    this.init = function () {
        this.c = 0;
        this.r = 0;
        this.matrix = [];

        this.setRules();

        if (typeof this.board.rows !== 'undefined' && this.board.cols !== 'undefined') {
            this.board.clear();
            this.c = Math.floor(this.board.cols / 2);

            for (var r = 0; r < this.board.rows; r++) {
                this.matrix[r] = [];
                for (var c = 0; c < this.board.cols; c++) {
                    this.matrix[r].push(0);
                }
            }

            this.matrix[this.r][this.c] = 1;

            this.board.setCell(this.r, this.c);
            this.board.setName(this.name);
            this.board.setInfo(this.getInfo());
        }
    };


    this.move = function () {

        if (this.r >= this.steps) {
            if (this.slideshow === true) {
                this.rule++;
                this.rule %= 256;
                this.init();
                return true;
            }
            return false;
        }

        for (var c = 0; c < this.board.cols; c++) {

            var key = 0;

            // left edge cell - no left neighbour:
            if (c == 0) {
                key |= this.matrix[this.r][this.board.cols - 1] << 2;
                key |= this.matrix[this.r][c] << 1;
                key |= this.matrix[this.r][c + 1];
            }
            // right edge cell - no right heghbour:
            else if (c == this.board.cols - 1) {
                key |= this.matrix[this.r][c - 1] << 2;
                key |= this.matrix[this.r][c] << 1;
                key |= this.matrix[this.r][0];
            }
            // cells with both neighbours:
            else {
                key |= this.matrix[this.r][c - 1] << 2;
                key |= this.matrix[this.r][c] << 1;
                key |= this.matrix[this.r][c + 1];
            }

            this.matrix[this.r + 1][c] = this.rules[key];

            this.board.setCell(this.r + 1, c, this.rules[key] === 1);
        }

        this.r++;

        this.board.setInfo(this.getInfo());

        return true;
    };

    this.init();
};
