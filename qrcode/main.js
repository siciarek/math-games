var request = new Request();

var dataOnly = false;
var blocksize = 4;

var message = null;

message = 'HELLO WORLD'; // http://www.thonky.com/qr-code-tutorial/hello-world-final.png
message = '48603173114';
message = '00000000000000000000000000000000000000000';
//message = '11111111111111111111111111111111111111111';
//message = '11111111';

if(request.params.hasOwnProperty('message')) {
    message = request.params['message'];
}

var analyzer = new DataAnalyzer();
var a = analyzer.analyze(message);

ecclevel = a.eclevel;
mode = a.mode;
version = a.version;
mask = -1;

if(request.params.hasOwnProperty('version')) {
    version = parseInt(request.params['version']);
}

if(request.params.hasOwnProperty('ecclevel')) {
    ecclevel = request.params['ecclevel'];
}

if(request.params.hasOwnProperty('mode')) {
    mode = request.params['mode'];
}

if(request.params.hasOwnProperty('mask')) {
    mask = request.params['mask'];
}

if(request.params.hasOwnProperty('do')) {
    dataOnly = request.params['do'];
}

if(request.params.hasOwnProperty('blocksize')) {
    blocksize = request.params['blocksize'];
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
				dataOnly && coder.mask[top][left] !== coder.DATA ? colors[9] : colors[grid[top][left]]
            );
        }
    }

    console.log({'DATA MODULES COUNT': dc});
}

init();
drawQrCode(coder);

