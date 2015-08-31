/**
 * JavaScript implementation of Stephen Wolfram’s Elementary Cellular Automaton
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var CellularAutomaton = function (width, height, rule, density) {

    density = density || 0;

    this.name = 'Elementary CA';
    this.rows = height;
    this.cols = width;
    this.density = density;
    this.r = 0;
    this.c = 0;

    this.grid = [];
    this.sequence = [];
    this.rules = {};

    rule = typeof rule === 'undefined' ? 30 : rule;
    this.slideshow = true;
    this.rule = rule;

    this.getInfo = function () {
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
        this.grid = [];
        this.sequence = [];

        this.setRules();

        this.c = Math.floor(this.cols / 2);

        for (var r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (var c = 0; c < this.cols; c++) {
                this.grid[r].push(0);
            }
        }

        if (this.density > 0) {
            var sum = 0;
            for (var i = 0; i < this.cols; i++) {
                if (Math.random() < this.density) {
                    var value = 1;
                    this.grid[this.r][i] = value;

                    sum += value;
                }
            }
            this.sequence.push(sum);
        }
        else {
            this.grid[this.r][this.c] = 1;
            this.sequence.push(1);
        }
    };

    this.move = function () {

        var _continue = true;

        if (!(this.r < this.rows - 1)) {

            console.log(this.sequence);

            if (this.slideshow === true) {
                this.rule++;
                this.rule %= 256;
                this.init();
                _continue = true;
            }
            else {
                _continue = false;
            }
        }

        if (_continue === true) {
            var sum = 0;

            for (var c = 0; c < this.cols; c++) {

                var key = 0, k = 0;

                do {
                    key |= this.grid[this.r][(this.cols + c - k + 1 ) % this.cols] << k++;
                } while (k < 3);

                var value = this.rules[key];

                this.grid[this.r + 1][c] = value;
                sum += value;
            }

            this.sequence.push(sum);
            this.r++;
        }

        return _continue;
    };

    this.init();
};
