/**
 * Board
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Board = function (rows, cols, renderTo) {

    rows = rows || 120;
    cols = cols || 161;
    renderTo = renderTo || 'board';

    this.buffer = {};
    this.rows = rows;
    this.cols = cols;

    this.rowSelector = 'div';
    this.cellSelector = 'span';
    this.boardSelector = $('#' + renderTo);

    this.setName = function (name) {
        $('head title').text(name);
        $('h1').html(name);
    };

    this.setInfo = function (info) {
        this.boardSelector.next().html(info);
    };

    this.clear = function () {
        this.boardSelector.find(this.cellSelector + '.b').removeClass('b');
    };

    this.getCell = function (r, c) {
        var key = r + '-' + c;

        if (typeof this.buffer[key] === 'undefined') {
            this.buffer[key] = $($(this.boardSelector.find(this.rowSelector).get(r)).find(this.cellSelector).get(c));
        }

        return this.buffer[key];
    };

    this.toggleCell = function (row, col) {
        this.getCell(row, col).toggleClass('b');
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

        for (var r = 0; r < this.rows; r++) {
            board += row[0];
            for (var c = 0; c < this.cols; c++) {
                board += cell;
            }
            board += row[1];
        }

        this.boardSelector.append(board);
    };

    this.init();
};

var interval = null;

function run(app, speed) {
    interval = setInterval(function () {
        if (app.move() === false) {
            clearInterval(interval);
        }
    }, speed);

    return true;
}