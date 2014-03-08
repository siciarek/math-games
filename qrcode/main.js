var message = 'HELLO WORLD';
var ecclevel = 'M';
var version = 2;
var mode = 'alphanumeric';
var mask = null;

if(0) {
// http://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Wikipedia_mobile_en.svg/296px-Wikipedia_mobile_en.svg.png
    message = 'http://en.m.wikipedia.org';

    message = 'Hello, World!';
    mode = 'byte';
    version = 2;
    ecclevel = 'Q';
    mask = -1;
}

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
            params[pair[0]] = (pair[1] !== 'undefined') ? pair[1] : true;
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

if(params.hasOwnProperty('mask')) {
    mask = params['mask'];
}

var blocksize = 4;

if(params.hasOwnProperty('blocksize')) {
    blocksize = params['blocksize'];
}

var coder = new QrCode(message, ecclevel, version, mode, mask);

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

    var quietZoneSize = 4;
    var quietZone = quietZoneSize * blocksize;
    var size = coder.size * blocksize + 2 * quietZone;

    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size)

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

    square(
        0,
        0,
        size,
        colors[0]
    );

    var dc = 0;
    var grid = coder.matrix;
//    grid = coder.mask;

    for (var top = 0; top < grid.length; top++) {
        for (var left = 0; left < grid[0].length; left++) {
            if(coder.mask[top][left] === coder.DATA) {
                ++dc;
            }
            square(
                quietZone + top * blocksize,
                quietZone + left * blocksize,
                blocksize,
                colors[grid[top][left]]
//				coder.mask[top][left] !== coder.DATA ? colors[9] : colors[grid[top][left]]
            );
        }
    }

    console.log({'DATA MODULES COUNT': dc});
}

init();
drawQrCode(coder);

