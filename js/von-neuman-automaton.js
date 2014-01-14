/**
 * JavaScript implementation of John von Neuman’s Cellular Automaton
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var VonNeumanAutomaton = function (width, height, pattern) {
    this.pattern = pattern
    this.cols = width;
    this.rows = height;

    this.name = 'John von Neuman’s Cellular Automaton';
    this.generations = 1000;
    this.generation = 0;
    this.r = 0;
    this.c = 0;
    this.dir = 180;

    this.transitions = {};
    this.grid = [];
    this.buffer = [];

    this.pat = [];

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
        '3012120201120201012201012120120201012201012120012120201201012120012120201120201012120201012201012120012120201201012120012120201120201012012120201120201012201012120201012120012120201120201012012120201120201012201012120120201012201012120012120201'
    ];

    // http://psoup.math.wisc.edu/mcell/rullex_nmbi.html

    this.getInfo = function () {
        return 'gen. ' + this.generation;
    };

    this.trans = function (row, col) {
        var n = this.neumanNeighbourhood(row, col);
        return this.transitions[n];
    };

    this.reset = function () {

        this.generation = 0;

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
                v = this.trans(r, c);
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

    this.neumanNeighbourhood = function (row, col) {

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

        var def = getPattern(pattern);

        if (def != null) {

            var ro = Math.floor(def.height / 2);
            var co = Math.floor(def.width / 2);

            this.transitions = def.rules;

            for (var d = 0; d < def.pattern.length; d++) {
                var point = def.pattern[d];
                var r = point[0];
                var c = point[1];

                r += (this.r - ro);
                c += (this.c - co);

                this.grid[r][c] = point[2];
            }
        }
        else {

            var size = 2;

            for (r = this.r - size; r < this.r + size; r++) {
                for (c = this.c - size; c < this.c + size; c++) {
                    this.grid[r][c] = 1;
                }
            }

            size = 1;

            for (r = this.r - size; r < this.r + size; r++) {
                for (c = this.c - size; c < this.c + size; c++) {
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
        }

    };

    this.move = function () {

        this.computeBuffer();
        this.buffer2grid();
        return this.generation++ < this.generations;
    };

    this.init();
};


function getPattern(pattern) {

    var patterns = [
        'Langtons-Loops',
        'Byl-Loop',
        'Chou-Reggia-1',
        'Chou-Reggia-2',
        'Evoloop'
    ];

    pattern -= 100;

    if (typeof patterns[pattern] === 'undefined') {
        return null;
    }

    var rootdir = '/data';

    // Golly
    var patternurl = rootdir + '/Patterns/' + patterns[pattern] + '.rle';

    // http://code.google.com/p/ruletablerepository/wiki/TheRules#Self-replicating_loops
    var ruleurl = rootdir + '/Rules/' + patterns[pattern] + '.table';

    var data = {
        width: 0,
        height: 0,
        states: 2,
        rule: null,
        rules: {},
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
        'G': 7,
        'H': 8
    };

    var pattern = '';


    $.ajax({
        url: patternurl,
        async: false,
        success: function (response) {

            var lines = response.replace(/\r/g, '\n').split('\n');

            for (var l in lines) {
                if (lines.hasOwnProperty(l)) {
                    var line = lines[l].trim();
                    if (line.length === 0 || line.match(/^#/)) {
                        continue;
                    }

                    var match = line.match(/^x\s*=\s*(\d+),\s*y\s*=\s*(\d+),\s*rule\s*=\s*(.*)$/);

                    if (match !== null) {
                        data.width = parseInt(match[1]);
                        data.height = parseInt(match[2]);
                        data.rule = match[3];
                        continue;
                    }

                    if (line.match(/^\d*[.A-Z$]/ig)) {
                        pattern += line;
                    }
                }
            }

            pattern = pattern.replace(/!$/, '');
            match = pattern.match(/(\d*[.A-Z\$]|\$)/ig);
            var row = 0;
            var col = 0;

            for (var m = 0; m < match.length; m++) {
                var chunk = match[m];

                if (chunk === '$') {
                    row++;
                    col = 0;
                    continue;
                }

                var ch = chunk.match(/^(\d+)?([.A-Z])$/);

                if (ch != null) {
                    count = typeof ch[1] === 'undefined' ? 1 : parseInt(ch[1]);

                    for (var v = 0; v < count; v++) {
                        col++;
                        data.pattern.push([row, col, states[ch[2]]]);
                    }
                }
            }
        }
    });

    $.ajax({
        url: ruleurl,
        async: false,
        success: function (response) {
            var lines = response.replace(/\r/g, '').split('\n');
            var line = null;
            var empty = true;

            var vars = {};
            var transitions = [];

            while (lines.length > 0) {

                line = lines.shift().trim();
                if (!(line.length > 0 && !line.match(/^[#@]/))) {
                    continue;
                }

                if (line.match(/^n_states:\s*(\d)\s*$/)) {
                    data.states = parseInt(line.match(/^n_states:\s*(\d)\s*$/).pop());
                    continue;
                }

                var match = line.match(/^(\d{6})$/g);

                if (match === null) {
                    continue;
                }

                transitions.push(line);
            }

            if (transitions.length === 0) {

                lines = response.replace(/\r/g, '').split('\n');

                while (lines.length > 0) {

                    line = lines.shift();
                    line = line.trim();

                    if (line.length === 0 || line.match(/^#/)) {
                        continue;
                    }

                    match = line.match(/^var\s*(\w+)\s*=\s*\{(.*)\}$/);

                    if (match !== null) {
                        var tmp = match[2].split(',');
                        vars[match[1]] = [];
                        for (var x = 0; x < tmp.length; x++) {
                            vars[match[1]].push(tmp[x].trim());
                        }
                        continue;
                    }

                    line = line.replace(/\s/g, '').trim();

                    match = line.match(/^((?:\w+,){5}(?:\d+))$/g);

                    if(match === null) {
                        continue;
                    }

                    if (match !== null) {
                        transitions.push(line);
                    }
                }

                var stackl = [];
                var stackr = [];

                for (var y = 0; y < transitions.length; y++) {

                    var rule = transitions[y];
                    match = rule.match(/([^\d,]+)/g);

                    if (match === null) {
                        continue;
                    }

                    stackl = [rule];
                    stackr = [];

                    while(match.length > 0) {
                        var symbol = match.shift();

                        while (stackl.length > 0) {
                            var xrule = stackl.pop();

                            for (var v = 0; v < vars[symbol].length; v++) {
                                var state = vars[symbol][v];
                                stackr.push(xrule.replace(symbol, state));
                            }
                        }

                        while(stackr.length > 0) {
                            stackl.push(stackr.pop());
                        }
                    }

                    while (stackl.length > 0) {
                        var elem = stackl.pop().replace(/\D/g, '');
                        transitions.push(elem);
                    }
                }
            }

            while (transitions.length) {
                line = transitions.pop();
                line = line.replace(/,/g, '');

                var el = line.split('');
                c = el[0];
                t = el[1];
                r = el[2];
                b = el[3];
                l = el[4];
                i = el[5];

                i = parseInt(i);

                // All neighbourhood rotations lead to the same new state:
                data.rules[[c, t, r, b, l].join('')] = i; //   0
                data.rules[[c, l, t, r, b].join('')] = i; //  90 CW
                data.rules[[c, b, l, t, r].join('')] = i; // 180 CW
                data.rules[[c, r, b, l, t].join('')] = i; // 250 CW
            }

            // Clear undefined rules:
            for (a = 0; a < data.states; a++)
                for (b = 0; b < data.states; b++)
                    for (c = 0; c < data.states; c++)
                        for (d = 0; d < data.states; d++)
                            for (e = 0; e < data.states; e++)
                                if (typeof data.rules[[a, b, c, d, e].join('')] === 'undefined') {
                                    data.rules[[a, b, c, d, e].join('')] = a;
                                }
        }
    });

    return data;
}