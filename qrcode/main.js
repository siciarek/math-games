

var messages = [
    ['HELLO WORLD', 'M'],
    ['LOREM IPSUM DOLOR', 'M'],
    ['TOMASZ MROWIEC', 'M'],
    ['JACEK SICIAREK', 'M'],
    ['FIKANDO MIKANDO', 'M'],
    ['GRANDE FINALE', 'M'],
    ['ABCDE123', 'H']
];

var m = 0;

var message = messages[m][0];

message = location.href;
var params = message.split('?');
message = params.length < 2 ? 'HELLO WORLD' : decodeURIComponent(params.pop());
var ecc = 'M';

console.log([message]);

var coder = new QrCode(message, ecc);

console.log(coder.capacity);

function drawQrCode(coder) {

    var grid = coder.matrix;
//    grid = coder.mask;

    var quietZoneSize = 4;

    var imgsize = 512;
    var blocksize = imgsize / (coder.size + 2 * quietZoneSize);

    var quietZone = quietZoneSize * blocksize;

    var colors = {
    // QR Code colors:
        1: '#000000',
        0: '#FFFFFF',
        9: '#CCCCCC',

    // Test colors:
        101: 'red',
        100: 'yellow',

    // Mask colors:
        200: 'blue',
        201: 'black',
        300: 'green',
        301: 'pink',
        400: 'magenta',
        500: 'yellow',
        600: 'brown',
        700: 'orange',
        1000: 'cyan'
    };

    svg.setAttribute('viewBox', [0, 0, imgsize, imgsize].join(' '));

    square(
        0,
        0,
        coder.size * blocksize + 2 * quietZone,
        colors[0]
    );


    for (var top = 0; top < grid.length; top++) {
        for (var left = 0; left < grid[0].length; left++) {
            square(
                quietZone + top * blocksize,
                quietZone + left * blocksize, blocksize,
                colors[grid[top][left]]
            );
        }
    }
}

init();
drawQrCode(coder);
