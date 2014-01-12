/**
 * Display
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Display = function (app, reset, renderTo) {

    /**
     * App to run
     * @type {object}
     */
    this.app = app;
    this.reset = typeof reset === 'undefined' ? true : reset;

    /**
     * Main display selector
     * @type {*|jQuery|HTMLElement}
     */
    this.selector = typeof renderTo === 'undefined' ? $('#display') : $(renderTo);
    this.rowSelector = 'div';
    this.cellSelector = 'span';

    this.buffer = {};
    this.interval = null;
    this.colors = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'x'
    ];

    this.setName = function (name) {
        var html = '<i class="icon-cog icon-large"></i> ' + name;
        $('head title').text(name);
        $('ul.navbar-right li.title a').html(html).attr('title', name);
    };

    this.setInfo = function () {
        this.selector.next().html(this.app.getInfo());
    };

    this.clear = function () {
        if (this.reset === true) {
            for (var c = 0; c < this.colors.length; c++) {
                var cls = this.colors[c];
                this.selector.find(this.cellSelector + '.' + cls).removeClass(cls);
            }
        }
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

    this.setPixel = function (row, col, value) {
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

    this.init = function () {
        var row = [
            '<' + this.rowSelector + '>',
            '</' + this.rowSelector + '>'
        ];
        var cell = '<' + this.cellSelector + '></' + this.cellSelector + '>';
        var display = '';

        for (var r = 0; r < this.app.rows; r++) {
            display += row[0];
            for (var c = 0; c < this.app.cols; c++) {
                display += cell;
            }
            display += row[1];
        }

        this.selector.append(display);
        this.setName(this.app.name);
    };

    this.move = function () {

        if (typeof this.app.beforeMove === 'function') {
            this.app.beforeMove();
        }

        var result = this.app.move();

        if (typeof this.app.afterMove === 'function') {
            this.app.afterMove();
        }

        this.clear();

        var startrow = this.reset ? 0 : this.app.r - 1;
        var endrow = this.reset ? this.app.rows : this.app.r;

        for (var r = startrow; r < endrow; r++) {
            for (var c = 0; c < this.app.cols; c++) {
                if (typeof this.app.cursor === 'object' && this.app.cursor.r === r && this.app.cursor.c === c) {
                    this.setPixel(r, c, 6);
                }
                else {
                    if (this.app.grid[r][c] !== 0) {
                        this.setPixel(r, c, this.app.grid[r][c]);
                    }
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
