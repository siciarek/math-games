/**
 * JavaScript implementation of John von Neuman’s Cellular Automaton
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var VonNeumanAutomaton = function (width, height, pattern) {

    this.name = 'John von Neuman’s Cellular Automaton';
    this.pattern = pattern
    this.generation = 0;
    this.r = 0;
    this.c = 0;
    this.dir = 180;
    this.cols = width;
    this.rows = height;

    this.transitions = {};
    this.grid = [];
    this.buffer = [];

    var states = [

//    a ground state U (48, 48, 48)

        0,

//    the transition or sensitised states (in 8 substates)

        1,  //    S (newly sensitised) (255, 0, 0)
        2,  //    S0 - (sensitised, having received no input for one cycle) (255, 125, 0)
        3,  //    S00 - (sensitised, having received no input for two cycles) (255, 175, 50)
        4,  //    S01 - (sensitised, having received no input for one cycle and then an input for one cycle) (255, 200, 75)
        5,  //    S000 - (sensitised, having received no input for three cycles) (251, 255, 0)
        6,  //    S1 - (sensitised, having received an input for one cycle) (255, 150, 25)
        7,  //    S10 - (sensitised, having received an input for one cycle and then no input for one cycle) (255, 255, 100)
        8,  //    S11 - (sensitised, having received input for two cycles) (255, 250, 125)

//    the confluent states (in 4 states of excitation)

        9,  //    C00 - quiescent (and will also be quiescent next cycle) (0, 255, 128)
        10, //    C10 - excited (but will be quiescent next cycle) (255, 255, 128)
        11, //    C01 - next-excited (now quiescent, but will be excited next cycle) (33, 215, 215)
        12, //    C11 - excited next-excited (currently excited and will be excited next cycle) (255, 128, 64)

//    the ordinary transmission states (in 4 directions, excited or quiescent, making 8 states)

        13, 14, //    North-directed (excited and quiescent) (36, 200, 36) (106, 106, 255)
        15, 16, //    South-directed (excited and quiescent) (106, 255, 106) (139, 139, 255)
        17, 18, //    West-directed (excited and quiescent) (73, 255, 73) (122, 122, 255)
        19, 20, //    East-directed (excited and quiescent) (27, 176, 27) (89, 89, 255)

//    the special transmission states (in 4 directions, excited or quiescent, making 8 states)

        21, 22, //    North-directed (excited and quiescent) (191, 73, 255) (255, 56, 56)
        23, 24, //    South-directed (excited and quiescent) (203, 106, 255) (255, 89, 89)
        25, 26, //    West-directed (excited and quiescent) (197, 89, 255) (255, 73, 73)
        27, 28 //    East-directed (excited and quiescent) (185, 56, 255) (235, 36, 36)
    ];

    this.patterns = [
        '201101001100101101001011001101001',
        '3012120201120201012201012120120201012201012120012120201201012120012120201120201012120201012201012120012120201201012120012120201120201012012120201120201012201012120201012120012120201120201012012120201120201012201012120120201012201012120012120201',
    ];

    // http://psoup.math.wisc.edu/mcell/rullex_nmbi.html
    // http://golly.cvs.sourceforge.net/viewvc/golly/golly/src/Rules/Langtons-Loops.table

    this.getInfo = function () {
        return 'gen. ' + this.generation;
    };

    this.trans = function (row, col) {
        var newstate = this.transitions[this.computeNeighbourhood(row, col)];
        return newstate;
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
                var v = this.trans(r, c);

                this.buffer[r][c] = v;
            }
        }
    };

    this.buffer2grid = function () {
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c] = this.buffer[r][c];
            }
        }
    };

    this.computeNeighbourhood = function (row, col) {
        var key = [];

        var neighbourhood = {
            'ME': [0, 0],
            'N': [-1, 0],
            'E': [0, 1],
            'S': [1, 0],
            'W': [0, -1]
        };

        for (var dir in neighbourhood) {
            if (neighbourhood.hasOwnProperty(dir)) {
                var n = neighbourhood[dir];
                var r = row + n.shift();
                var c = col + n.shift();

                var val = typeof this.grid[r] === 'undefined' || typeof this.grid[r][c] === 'undefined' ? 0 : this.grid[r][c];
                key.push(val);
            }
        }


        return key.join('');
    };

    this.init = function () {
        this.reset();

        this.r = Math.floor(this.rows / 2);
        this.c = Math.floor(this.cols / 2);

        if (pattern === 100) {

            this.transitions = {
                '00000': 0,
                '00001': 2,
                '00002': 0,
                '00003': 0,
                '00005': 0,
                '00006': 3,
                '00007': 1,
                '00011': 2,
                '00012': 2,
                '00013': 2,
                '00021': 2,
                '00022': 0,
                '00023': 0,
                '00026': 2,
                '00027': 2,
                '00032': 0,
                '00052': 5,
                '00062': 2,
                '00072': 2,
                '00102': 2,
                '00112': 0,
                '00202': 0,
                '00203': 0,
                '00205': 0,
                '00212': 5,
                '00222': 0,
                '00232': 2,
                '00522': 2,
                '01232': 1,
                '01242': 1,
                '01252': 5,
                '01262': 1,
                '01272': 1,
                '01275': 1,
                '01422': 1,
                '01432': 1,
                '01442': 1,
                '01472': 1,
                '01625': 1,
                '01722': 1,
                '01725': 5,
                '01752': 1,
                '01762': 1,
                '01772': 1,
                '02527': 1,
                '10001': 1,
                '10006': 1,
                '10007': 7,
                '10011': 1,
                '10012': 1,
                '10021': 1,
                '10024': 4,
                '10027': 7,
                '10051': 1,
                '10101': 1,
                '10111': 1,
                '10124': 4,
                '10127': 7,
                '10202': 6,
                '10212': 1,
                '10221': 1,
                '10224': 4,
                '10226': 3,
                '10227': 7,
                '10232': 7,
                '10242': 4,
                '10262': 6,
                '10264': 4,
                '10267': 7,
                '10271': 0,
                '10272': 7,
                '10542': 7,
                '11112': 1,
                '11122': 1,
                '11124': 4,
                '11125': 1,
                '11126': 1,
                '11127': 7,
                '11152': 2,
                '11212': 1,
                '11222': 1,
                '11224': 4,
                '11225': 1,
                '11227': 7,
                '11232': 1,
                '11242': 4,
                '11262': 1,
                '11272': 7,
                '11322': 1,
                '12224': 4,
                '12227': 7,
                '12243': 4,
                '12254': 7,
                '12324': 4,
                '12327': 7,
                '12425': 5,
                '12426': 7,
                '12527': 5,
                '20001': 2,
                '20002': 2,
                '20004': 2,
                '20007': 1,
                '20012': 2,
                '20015': 2,
                '20021': 2,
                '20022': 2,
                '20023': 2,
                '20024': 2,
                '20025': 0,
                '20026': 2,
                '20027': 2,
                '20032': 6,
                '20042': 3,
                '20051': 7,
                '20052': 2,
                '20057': 5,
                '20072': 2,
                '20102': 2,
                '20112': 2,
                '20122': 2,
                '20142': 2,
                '20172': 2,
                '20202': 2,
                '20203': 2,
                '20205': 2,
                '20207': 3,
                '20212': 2,
                '20215': 2,
                '20221': 2,
                '20222': 2,
                '20227': 2,
                '20232': 1,
                '20242': 2,
                '20245': 2,
                '20252': 0,
                '20255': 2,
                '20262': 2,
                '20272': 2,
                '20312': 2,
                '20321': 6,
                '20322': 6,
                '20342': 2,
                '20422': 2,
                '20512': 2,
                '20521': 2,
                '20522': 2,
                '20552': 1,
                '20572': 5,
                '20622': 2,
                '20672': 2,
                '20712': 2,
                '20722': 2,
                '20742': 2,
                '20772': 2,
                '21122': 2,
                '21126': 1,
                '21222': 2,
                '21224': 2,
                '21226': 2,
                '21227': 2,
                '21422': 2,
                '21522': 2,
                '21622': 2,
                '21722': 2,
                '22227': 2,
                '22244': 2,
                '22246': 2,
                '22276': 2,
                '22277': 2,
                '30001': 3,
                '30002': 2,
                '30004': 1,
                '30007': 6,
                '30012': 3,
                '30042': 1,
                '30062': 2,
                '30102': 1,
                '30122': 0,
                '30251': 1,
                '40112': 0,
                '40122': 0,
                '40125': 0,
                '40212': 0,
                '40222': 1,
                '40232': 6,
                '40252': 0,
                '40322': 1,
                '50002': 2,
                '50021': 5,
                '50022': 5,
                '50023': 2,
                '50027': 2,
                '50052': 0,
                '50202': 2,
                '50212': 2,
                '50215': 2,
                '50222': 0,
                '50224': 4,
                '50272': 2,
                '51212': 2,
                '51222': 0,
                '51242': 2,
                '51272': 2,
                '60001': 1,
                '60002': 1,
                '60212': 0,
                '61212': 5,
                '61213': 1,
                '61222': 5,
                '70007': 7,
                '70112': 0,
                '70122': 0,
                '70125': 0,
                '70212': 0,
                '70222': 1,
                '70225': 1,
                '70232': 1,
                '70252': 5,
                '70272': 0
            };

            var def = getDefinitions();

            var ro = Math.floor(def.height / 2);
            var co = Math.floor(def.width / 2);

            for(var d = 0; d < def.pattern.length; d++) {
                var point = def.pattern[d];
                var r = point[0];
                var c = point[1];
                var val = point[2];
                this.grid[(this.r - ro) + r][(this.c - co) + c] = val;
            }

            return;
        }

        var size = 2;

        for (r = this.r - size; r < this.r + size; r++) {
            for (var c = this.c - size; c < this.c + size; c++) {
                this.grid[r][c] = 1;
            }
        }

        size = 1;

        for (r = this.r - size; r < this.r + size; r++) {
            for (var c = this.c - size; c < this.c + size; c++) {
                this.grid[r][c] = 0;
            }
        }

        transitions = this.patterns[pattern].split('');
        this.states = transitions.shift();

        for (var me = 0; me < this.states; me++) {
            for (var n = 0; n < this.states; n++) {
                for (var e = 0; e < this.states; e++) {
                    for (var s = 0; s < this.states; s++) {
                        for (var w = 0; w < this.states; w++) {
                            var key = [me, n, e, s, w].join('');
                            this.transitions[key] = parseInt(transitions.shift());
                        }
                    }
                }
            }
        }

    };

    this.move = function () {

        this.computeBuffer();
        this.buffer2grid();

        this.generation++;

        return true;
    };

    this.init();
};


function getDefinitions() {

    var data = {
        width: 0,
        height: 0,
        rule: null,
        pattern: []
    };

    var states = {
        '.': 0,
        'A': 1,
        'B': 2,
        'C': 3,
        'D': 4,
        'E': 5,
        'F': 6,
        'G': 7
    };

    var pattern = '';

    $.ajax({
        url: 'data/Langtons-Loops.rle',
        async: false,
        success: function (response) {

            var lines = response.replace(/\r/g, '').split('\n');
            for (var l in lines) {
                if (lines.hasOwnProperty(l)) {
                    var line = lines[l].trim();
                    if (line.match(/^#/)) {
                        continue;
                    }

                    var match = line.match(/^x\s*=\s*(\d+),\s*y\s*=\s*(\d+),\s*rule\s*=\s*(.*)$/);

                    if(match !== null) {
                        data.width = parseInt(match[1]);
                        data.height = parseInt(match[2]);
                        data.rule = match[3];
                    }

                    if(line.match(/^[.A-G]/ig)) {
                        pattern += line;
                    }
                }

            }

            pattern = pattern.replace(/!$/, '');
            match = pattern.match(/(\d*[.A-G]|\$)/ig);
            var row = 0;
            var col = 0;

            for(var m = 0; m < match.length; m++) {
                var chunk = match[m];

                if(chunk === '$') {
                    row++;
                    col = 0;
                    continue;
                }

                var ch = chunk.match(/^(\d+)?([.A-G])$/);

                if(ch != null) {
                    count = typeof ch[1] === 'undefined' ? 1 : parseInt(ch[1]);

                    for(var v = 0; v < count; v++) {
                        col++;
                        data.pattern.push([row, col, states[ch[2]]]);
                    }
                }
            }
        }
    });

    return data;
}