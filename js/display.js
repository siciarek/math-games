/**
 * Display
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Display = function (app, renderTo) {

    /**
     * App to run
     * @type {object}
     */
    this.app = app;

    /**
     * Main display selector
     * @type {*|jQuery|HTMLElement}
     */
    this.selector = typeof renderTo === 'undefined' ? $('#board') : $(renderTo);
    this.rowSelector = 'div';
    this.cellSelector = 'span';

    this.buffer = {};
    this.interval = null;
    this.colors = [];

    this.setColors = function (colors) {
        this.colors = colors;
    };

    this.setName = function (name) {
        var html = '<i class="icon-cog icon-large"></i> ' + this.app.name;
        $('head title').text(name);
        $('li.title a').html(html).attr('title', this.app.name);
    };

    this.setInfo = function () {
        this.selector.next().html(this.app.getInfo());
    };

    this.clear = function () {
        this.selector.find(this.cellSelector + '.b').removeClass('b');
    };

    this.getCell = function (r, c) {
        var key = r + '-' + c;

        if (typeof this.buffer[key] === 'undefined') {
            this.buffer[key] = $($(this.selector.find(this.rowSelector).get(r)).find(this.cellSelector).get(c));
        }

        return this.buffer[key];
    };

    this.toggleCell = function (row, col) {
        this.getCell(row, col).toggleClass('b');
    };

    this.setCellColor = function (row, col, value) {
        if (value > 0) {
            this.getCell(row, col).removeAttr('class');
            this.getCell(row, col).addClass(this.colors[value]);
        }
    };

    this.setCell = function (row, col, value) {

        if (typeof value === 'undefined') {
            value = true;
        }

        if (value === true) {
            this.getCell(row, col).addClass('b');
        }
        else {
            this.getCell(row, col).removeClass('b');
        }
    };

    this.isCellFilled = function (row, col) {
        return this.getCell(row, col).hasClass('b');
    };

    this.init = function () {
        var row = [
            '<' + this.rowSelector + '>',
            '</' + this.rowSelector + '>'
        ];
        var cell = '<' + this.cellSelector + '></' + this.cellSelector + '>';
        var board = '';

        for (var r = 0; r < this.app.rows; r++) {
            board += row[0];
            for (var c = 0; c < this.app.cols; c++) {
                board += cell;
            }
            board += row[1];
        }

        this.selector.append(board);
    };

    this.move = function () {

        var result = app.move();

        this.clear();

        for (var r = 0; r < this.app.rows; r++) {
            for (var c = 0; c < this.app.cols; c++) {
                if (this.app.grid[r][c]) {
                    this.setCell(r, c);
                }
            }
        }

        this.setInfo();

        return result;
    };

    this.run = function (speed) {
        var self = this;
        self.interval = setInterval(function () {
            if (self.move() === false) {
                clearInterval(self.interval);
            }
        }, speed);

        return true;
    };

    this.init();
};
