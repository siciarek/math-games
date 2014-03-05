var message = 'HELLO WORLD';
var ecclevel = 'L';
var version = 2;
var mode = 'alphanumeric';

// http://mathgames.dev/qrcode/qrcode.svg?message=HELLO%20WORLD&mode=alphanumeric&ecclevel=L&version=1
// http://mathgames.dev/qrcode/qrcode.svg?message=http://siciarek.pl&mode=byte&ecclevel=L&version=1
// http://mathgames.dev/qrcode/qrcode.svg?message=1234567890&mode=numeric&ecclevel=L&version=1
// http://mathgames.dev/qrcode/qrcode.svg?message=HELLO%20WORLD&mode=alphanumeric&ecclevel=L&version=2
// message=ABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCDE

var getParams = function () {
    var params = {};
    if (location.search) {
        var parts = location.search.slice(1).split('&');

        parts.forEach(function (part) {
            var pair = part.split('=');
            pair[0] = decodeURIComponent(pair[0]);
            pair[1] = decodeURIComponent(pair[1]);
            params[pair[0]] = (pair[1] !== 'undefined') ?
                              pair[1] : true;
        });
    }
    return params;
};

var params = getParams();

if(params.hasOwnProperty('message')) {
    message = params['message'];
}

if(params.hasOwnProperty('version')) {
    version = parseInt(params['version']);
}

if(params.hasOwnProperty('ecclevel')) {
    ecclevel = params['ecclevel'];
}

if(params.hasOwnProperty('mode')) {
    mode = params['mode'];
}

var coder = new QrCode(message, ecclevel, version, mode);

var info = {
    message: coder.message,
    messagelen: coder.message.length,
    capacity: coder.capacity,
    mode: coder.mode,
    version: coder.V,
    ecclevel: coder.eccLevel,
    penalty: coder.penalty
};

console.log(info);

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
                quietZone + left * blocksize,
                blocksize, 
				colors[grid[top][left]]
                // coder.mask[top][left] === coder.ALIGNMENT ? colors[301] : colors[grid[top][left]]
            );
        }
    }
}

init();
drawQrCode(coder);

