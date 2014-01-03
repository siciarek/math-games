/**
 * JavaScript implementation of John Conway’s Game of Life
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var GameOfLife = function (board) {

    this.name = 'John Conway’s Game of Life';
    this.current = [];
    this.buffer = [];
    this.generations = 0;
    this.generation = 0;
    this.definitions = null;
    this.pattern = 0;
    this.patterns = [];

    this.board = board;

    this.setPattern = function () {

        var pattern = this.definitions[this.patterns[this.pattern]];
        var def = pattern.definition;
        var offsets = [];

        if (pattern.type !== null && pattern.type.match(/p\d+/) !== null) {

            var period = parseInt(pattern.type.replace(/^.*?p(\d+).*?/, '$1'));

            if (period === 1 || period <= 20) {
                this.generations = 20;
            }
            else if (period <= 50) {
                this.generations = 50;
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

        var top = Math.ceil((this.board.rows - def.length) / 2);
        var left = Math.ceil((this.board.cols - def[0].length) / 2);

        while (offsets.length > 0) {
            var o = offsets.shift();
            this.current[top + o.shift()][left + o.shift()] = true;
        }
    };

    this.getInfo = function () {
        var description = this.definitions[this.patterns[this.pattern]].description;
        return '' + (this.pattern + 1) + '/' + this.patterns.length + ''
            + '<span style="color:black;display:inline-block;margin-left:16px;margin-right:16px">' + this.patterns[this.pattern] + '</span>'
            + '(gen. ' + this.generation + '/' + this.generations + ')'
            + '<br/><pre style="font-family: sans-serif;font-style: italic">' + description.trim() + '</pre>'
            ;
    };

    this.reset = function () {
        for (var r = 0; r < this.board.rows; r++) {
            this.current[r] = [];
            this.buffer[r] = [];
            for (var c = 0; c < this.board.cols; c++) {
                this.current[r][c] = this.buffer[r][c] = false;
            }
        }
    };

    this.computeBuff = function () {
        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                var n = this.countNeighbours(r, c);
                this.buffer[r][c] = n === 3 || n === 2 && this.current[r][c];
            }
        }
    };

    this.countNeighbours = function (row, col) {
        var count = 0;
        var neighbours = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        while(neighbours.length > 0) {
            var n = neighbours.shift();
            var r = row + n.shift();
            var c = col + n.shift();
            if (typeof this.current[r] !== 'undefined' && typeof this.current[r][c] !== 'undefined' && this.current[r][c]) {
                if (count++ > 3) {
                    return count;
                }
            }
        }

        return count;
    };

    this.buff2curr = function () {
        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                this.current[r][c] = this.buffer[r][c];
            }
        }
    };

    this.init = function () {
        if (typeof this.board.rows !== 'undefined' && this.board.cols !== 'undefined') {

            if (this.definitions === null) {
                this.definitions = getDefinitions();

                for (var name in this.definitions) {
                    if (this.definitions.hasOwnProperty(name)) {
                        this.patterns.push(name);
                    }
                }
            }

            this.reset();
            this.setPattern();

            this.board.setName(this.name);
            this.board.setInfo(this.getInfo());
        }
    };

    this.move = function () {
        this.board.clear();

        this.computeBuff();
        this.buff2curr();

        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                if (this.current[r][c]) {
                    this.board.setCell(r, c);
                }
            }
        }

        this.board.setInfo(this.getInfo());
        this.generation++;

        if (this.generation > this.generations) {
            this.generation = 0;
            this.pattern++;
            this.pattern %= this.patterns.length;
            this.reset();
            this.setPattern();
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

