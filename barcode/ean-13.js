var separator = {
    border: [1, 0, 1],
    mid: [0, 1, 0, 1, 0]
};

var codes = {
    "0": { "L": [0, 0, 0, 1, 1, 0, 1], "G": [0, 1, 0, 0, 1, 1, 1], "R": [1, 1, 1, 0, 0, 1, 0] },
    "1": { "L": [0, 0, 1, 1, 0, 0, 1], "G": [0, 1, 1, 0, 0, 1, 1], "R": [1, 1, 0, 0, 1, 1, 0] },
    "2": { "L": [0, 0, 1, 0, 0, 1, 1], "G": [0, 0, 1, 1, 0, 1, 1], "R": [1, 1, 0, 1, 1, 0, 0] },
    "3": { "L": [0, 1, 1, 1, 1, 0, 1], "G": [0, 1, 0, 0, 0, 0, 1], "R": [1, 0, 0, 0, 0, 1, 0] },
    "4": { "L": [0, 1, 0, 0, 0, 1, 1], "G": [0, 0, 1, 1, 1, 0, 1], "R": [1, 0, 1, 1, 1, 0, 0] },
    "5": { "L": [0, 1, 1, 0, 0, 0, 1], "G": [0, 1, 1, 1, 0, 0, 1], "R": [1, 0, 0, 1, 1, 1, 0] },
    "6": { "L": [0, 1, 0, 1, 1, 1, 1], "G": [0, 0, 0, 0, 1, 0, 1], "R": [1, 0, 1, 0, 0, 0, 0] },
    "7": { "L": [0, 1, 1, 1, 0, 1, 1], "G": [0, 0, 1, 0, 0, 0, 1], "R": [1, 0, 0, 0, 1, 0, 0] },
    "8": { "L": [0, 1, 1, 0, 1, 1, 1], "G": [0, 0, 0, 1, 0, 0, 1], "R": [1, 0, 0, 1, 0, 0, 0] },
    "9": { "L": [0, 0, 0, 1, 0, 1, 1], "G": [0, 0, 1, 0, 1, 1, 1], "R": [1, 1, 1, 0, 1, 0, 0] }
};

var groups = {
    "0": ["L", "L", "L", "L", "L", "L", "R", "R", "R", "R", "R", "R" ],
    "1": ["L", "L", "G", "L", "G", "G", "R", "R", "R", "R", "R", "R" ],
    "2": ["L", "L", "G", "G", "L", "G", "R", "R", "R", "R", "R", "R" ],
    "3": ["L", "L", "G", "G", "G", "L", "R", "R", "R", "R", "R", "R" ],
    "4": ["L", "G", "L", "L", "G", "G", "R", "R", "R", "R", "R", "R" ],
    "5": ["L", "G", "G", "L", "L", "G", "R", "R", "R", "R", "R", "R" ],
    "6": ["L", "G", "G", "G", "L", "L", "R", "R", "R", "R", "R", "R" ],
    "7": ["L", "G", "L", "G", "L", "G", "R", "R", "R", "R", "R", "R" ],
    "8": ["L", "G", "L", "G", "G", "L", "R", "R", "R", "R", "R", "R" ],
    "9": ["L", "G", "G", "L", "G", "L", "R", "R", "R", "R", "R", "R" ]
};

function drawLines(data, sep, digit) {

    sep = sep || false;
    digit = typeof digit === 'undefined' ? -1 : digit;

    var len = length + (sep ? 4 : 0);

    for (var i = 0; i < data.length; i++) {
        cc++;

        if(data[i] === 0) {
            continue;
        }

        var x = startx + (cc * width);
        rectangle(x, starty, width, len, color);
    }

    if(digit != -1) {
        text(digit,  startx + ((cc - 3) * width), starty + len + 6, color);
    }
}

function drawBarcode(code) {

    init();

    rectangle(0, 0, 120, 75, background);

    drawLines(separator.border, true);

    var first = code.shift();

    text(first,  startx - (width + 3), starty + length + 6, color);

    group = groups[first];

    for (var q = 0; q < code.length; q++) {
        var digit = code[q];
        var data = codes[digit][group[q]];

        drawLines(data, 0, digit);

        if (q === code.length / 2 - 1) {
            drawLines(separator.mid, true);
        }
    }

    drawLines(separator.border, true);
}

var startx = 11;
var starty = 10;
var length = 50;
var width = 1;
var color = '#000000';
var background = '#FFFFFF';

var cc = 0;

code = [
    [
        9,
        7, 8, 8, 3, 7, 2,
        7, 8, 1, 8, 4, 0
    ],
    [
        8,
        7, 1, 1, 2, 5, 3,
        0, 0, 1, 2, 0, 2
    ],
    [
        4,
        0, 0, 2, 4, 5, 0,
        1, 1, 8, 9, 7, 3
    ]
];

drawBarcode(code[0]);
