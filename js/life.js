/**
 * JavaScript implementation of John Conway’s Game of Life
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Life = function (board) {

    this.name = 'John Conway’s Game of Life';
    this.current = [];
    this.buffer = [];
    this.generations = 100;
    this.generation = 0;

    this.structure = 0;
    this.structures = [];
    this.definitions = null;

    this.board = board;

    this.setStructure = function () {

        var r = Math.ceil(this.board.rows / 2);
        var c = Math.ceil(this.board.cols / 2);
        var offsets = [];

        var def = this.definitions[this.structures[this.structure]].definition;

        for (var row = 0; row < def.length; row++) {
            for (var col = 0; col < def[0].length; col++) {
                if (def[row][col] === 1) {
                    offsets.push([row, col]);
                }
            }
        }

        r -= Math.ceil(def.length / 2);
        c -= Math.ceil(def[0].length / 2);

        for (i = 0; i < offsets.length; i++) {
            var o = offsets[i];
            this.current[r + o[0]][c + o[1]] = 1;
        }
    };

    this.getInfo = function () {
        var description = this.definitions[this.structures[this.structure]].description;
        return '' + (this.structure + 1) + '/' + this.structures.length + ''
            + '<span style="color:black;display:inline-block;margin-left:16px;margin-right:16px">' + this.structures[this.structure] + '</span>'
            + '(gen. ' + this.generation + ')'
            + '<br/><pre style="font-family: sans-serif;font-style: italic">' + description.trim() + '</pre>'
            ;
    };

    this.reset = function () {
        for (var r = 0; r < this.board.rows; r++) {
            this.buffer[r] = [];
            this.current[r] = [];
            for (var c = 0; c < this.board.cols; c++) {
                this.buffer[r][c] = 0;
                this.current[r][c] = 0;
            }
        }
    };

    this.computeBuff = function () {
        for (var r = 0; r < this.board.rows; r++) {
            for (var c = 0; c < this.board.cols; c++) {
                var n = this.countNeighbours(r, c);
                this.buffer[r][c] = n === 3 || n === 2 && this.current[r][c] === 1 ? 1 : 0;
            }
        }
    };

    this.countNeighbours = function (row, col) {
        var count = 0;

        var n = [];
        n.push([row - 1, col - 1]);
        n.push([row - 1, col    ]);
        n.push([row - 1, col + 1]);
        n.push([row    , col - 1]);
        n.push([row    , col + 1]);
        n.push([row + 1, col - 1]);
        n.push([row + 1, col    ]);
        n.push([row + 1, col + 1]);

        for (var i = 0; i < n.length; i++) {
            var e = n[i];
            var r = e[0];
            var c = e[1];
            if (typeof this.current[r] !== 'undefined' && typeof this.current[r][c] !== 'undefined' && this.current[r][c] === 1) {
                count++;
            }
        }

        return count;
    };

    this.buff2curr = function () {
        for (var r = 0; r < this.board.rows; r++) {
            this.current[r] = [];
            for (var c = 0; c < this.board.cols; c++) {
                this.current[r][c] = this.buffer[r][c];
            }
        }
    };

    this.init = function () {
        if (typeof this.board.rows !== 'undefined' && this.board.cols !== 'undefined') {
            this.reset();

            if (this.definitions === null) {
                this.definitions = getDefinitions();

                for (var name in this.definitions) {
                    if (this.definitions.hasOwnProperty(name)) {
                        this.structures.push(name);
                    }
                }
            }

            this.setStructure();

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
                if (this.current[r][c] === 1) {
                    this.board.setCell(r, c);
                }
            }
        }

        this.board.setInfo(this.getInfo());
        this.generation++;

        if (this.generation > this.generations) {
            this.reset();
            this.generation = 0;
            this.structure++;
            this.structure %= this.structures.length;
            this.setStructure();
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

//                if(name !== 'ring of fire') continue;

                data[name] = {
                    definition: parseDefinition(e.definition),
                    description: e.description
                };
            }
        }
    }

    return data;
}

