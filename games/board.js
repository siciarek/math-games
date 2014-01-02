/**
 * Board
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Board = function (rows, cols, renderTo) {

    rows = rows || 120;
    cols = cols || 161;
    renderTo = renderTo || 'board';

    this.rows = rows;
    this.cols = cols;
    this.selector = $('#' + renderTo);

    this.setName = function (name) {
        $('head title').text(name);
        $('h1').html(name);
    };

    this.setInfo = function (info) {
        this.selector.next().html(info);
    };

    this.clear = function () {
        this.selector.find('span').removeClass('b');
    };

    this.getCell = function (row, col) {
        var row = this.selector
            .find('div:nth-child(' + (row + 1) + ')');

        return row
            .find('span:nth-child(' + (col + 1) + ')');
    };

    this.toggleCell = function (row, col) {
        this.getCell(row, col).toggleClass('b');
    };

    this.setCell = function (row, col, value) {

        if(typeof value === 'undefined') {
            value = true;
        }

        var cell = this.getCell(row, col);

        if (value === true) {
            cell.addClass('b');
        }
        else {
            cell.removeClass('b');
        }
    };

    this.unsetCell = function (row, col) {
        this.setCell(row, col, false);
    };

    this.getCellColor = function (row, col) {
        return this.getCell(row, col).hasClass('b') ? 'black' : 'white';
    };

    this.init = function () {
        for (var r = 0; r < this.rows; r++) {
            var row = $('<div></div>');
            for (var c = 0; c < this.cols; c++) {
                row.append('<span></span>');
            }
            this.selector.prepend(row);
        }
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