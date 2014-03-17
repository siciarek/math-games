var data = 'HELLO WORLD';
var ecstrategy = ['Q'];
var maskPattern = null;
var version = null;
var qrcode = null;

var request = new Request();

if (request.params.hasOwnProperty('mask')) {
    maskPattern = request.params['mask'];
}

if (request.params.hasOwnProperty('data')) {
    data = request.params['data'];
}

if (request.params.hasOwnProperty('ec')) {
    ecstrategy = [request.params['ec']];
}

if (request.params.hasOwnProperty('v')) {
    version =  request.params['v'];
}

// v: 7
// data = "It is a long established fact that a reader will be distracted by the readable content of a page when looking.";


if(Object.keys(request.params).length) {
    qrcode = new QrCode(data, ecstrategy, maskPattern, version);
}
else {
    qrcode = new QrCode(data);
}

console.log(['INFO', qrcode.getInfo()]);

function drawQrCode(code, blocksize, quietZoneSize) {

    blocksize = blocksize || 4;
    quietZoneSize = quietZoneSize || 4;

    var colors = {};
    colors[code.matrix.DATA_DARK_MODULE] = '#000000';
    colors[code.matrix.DATA_LIGHT_MODULE] = '#FFFFFF';
    colors[code.matrix.DATA_UNDEFINED_MODULE] = '#CCCCCC';

    var quietZone = quietZoneSize * blocksize;
    var size = code.getSize() * blocksize + 2 * quietZone;
    var grid = code.getData();

    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size)

    square(0, 0, size, colors[code.matrix.DATA_LIGHT_MODULE]);

    for (var top = 0; top < grid.length; top++) {
        for (var left = 0; left < grid[0].length; left++) {
            square(
                quietZone + top * blocksize,
                quietZone + left * blocksize,
                blocksize,
                colors[grid[top][left]]
            );
        }
    }
}

init();
drawQrCode(qrcode);