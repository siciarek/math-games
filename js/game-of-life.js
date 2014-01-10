/**
 * JavaScript implementation of John Conway’s Game of Life
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var GameOfLife = function (width, height, rulestring) {

    this.name = 'John Conway’s Game of Life';
    rulestring = rulestring || 'B3/S23';
    this.rulestring = rulestring;

    this.grid = [];
    this.buffer = [];
    this.generations = 0;
    this.generation = 0;
    this.definitions = null;
    this.pattern = 0;
    this.patterns = [];

    this.pause = false;
    this.rows = height;
    this.cols = width;

    this.born = function (n) {
        var r = this.rulestring.split('/').shift();
        return r.replace(n, '') !== r ? 1 : 0;
    };

    this.survive = function (n) {
        var r = this.rulestring.split('/').pop();
        return r.replace(n, '') !== r ? 1 : 0;
    };

    this.fetchPattern = function () {
        return this.definitions[this.patterns[this.pattern]];
    };

    this.setUpPattern = function () {

        var pattern = this.fetchPattern();
        var def = pattern.definition;
        var offsets = [];

        if (pattern.type !== null && pattern.type.match(/p\d+/) !== null) {

            var period = parseInt(pattern.type.replace(/^.*?p(\d+).*?/, '$1'));

            if (period === 1) {
                this.generations = 20;
            }
            else if (period <= 20) {
                this.generations = 35;
            }
            else if (period <= 50) {
                this.generations = 60;
            }
            else {
                this.generations = period + 20;
            }
        }
        else {
            this.generations = 120;
        }

        for (var row = 0; row < def.length; row++) {
            for (var col = 0; col < def[0].length; col++) {
                if (def[row][col] === 1) {
                    offsets.push([row, col]);
                }
            }
        }

        var top = Math.ceil((this.rows - def.length) / 2);
        var left = Math.ceil((this.cols - def[0].length) / 2);

        while (offsets.length > 0) {
            var o = offsets.shift();
            this.grid[top + o.shift()][left + o.shift()] = 1;
        }
    };

    this.getInfo = function () {
        var description = this.definitions[this.patterns[this.pattern]].description;
        var name = this.definitions[this.patterns[this.pattern]].name;
        return '' + (this.pattern + 1) + '/' + this.patterns.length + ''
            + '<span style="color:black;display:inline-block;margin-left:16px;margin-right:16px">' + name + '</span>'
            + '(gen. ' + this.generation + '/' + this.generations + ')'
            + '<br/><div style="white-space:pre;font-family: sans-serif;font-style: italic">' + description.trim() + '</div>'
            ;
    };

    this.reset = function () {
        for (var r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            this.buffer[r] = [];
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = 0;
                this.buffer[r][c] = 0;
            }
        }
    };

    this.computeBuffer = function () {
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                var n = this.countNeighbours(r, c);
                var v = this.grid[r][c];
                this.buffer[r][c] = (v === 0 && this.born(n) || v === 1 && this.survive(n)) ? 1 : 0;
            }
        }
    };

    this.countNeighbours = function (row, col) {
        var count = 0;
        var neighbours = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [ 0, -1],
            [ 0, 1],
            [ 1, -1],
            [ 1, 0],
            [ 1, 1]
        ];

        while (neighbours.length > 0) {
            var n = neighbours.shift();
            var r = row + n.shift();
            var c = col + n.shift();
            if (typeof this.grid[r] !== 'undefined' && typeof this.grid[r][c] !== 'undefined' && this.grid[r][c] === 1) {
                count++;
            }
        }

        return count;
    };

    this.buffer2grid = function () {
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = this.buffer[r][c];
            }
        }
    };

    this.init = function () {

        if (this.definitions === null) {
            this.definitions = getDefinitions();

            for (var name in this.definitions) {
                if (this.definitions.hasOwnProperty(name)) {
                    this.patterns.push(name);
                }
            }
        }

        this.reset();
        this.setUpPattern();
    };

    this.nextPattern = function() {
        this.pattern++;
        this.pattern %= this.patterns.length;
    };

    this.move = function () {

        this.computeBuffer();
        this.buffer2grid();

        if (this.generation++ > this.generations) {
            this.generation = 0;
            this.nextPattern();
            this.reset();
            this.setUpPattern();
        }

        return true;
    };

    this.init();
};

function parseDefinition(definition) {
    var temp = definition.replace(/[ \t\r]*/g, '').split('');
    var data = [];
    data.push([]);
    var filled = '*';
    var newrow = "\n";
    var row = 0;
    var col = 0;

    for (i = 0; i < temp.length; i++) {
        var e = temp[i];

        if (e === newrow) {
            data.push([]);
            row++;
            col = 0;
            continue;
        }

        data[row].push(e === filled ? 1 : 0);
    }
    return data;
}

function getDefinitions() {
    var data = {};

    for (var name in gameOfLifePatterns) {
        if (gameOfLifePatterns.hasOwnProperty(name)) {
            var e = gameOfLifePatterns[name];
            if (e.definition !== null) {

                if (e.definition.match(/\w/)) {
                    continue;
                }

                e.definition = parseDefinition(e.definition);
                data[name] = e;
            }
        }
    }

    return data;
}

