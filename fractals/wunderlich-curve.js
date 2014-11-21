function main(n, size) {

    n = n || 1;
    size = size || 256;
    
    var x0 = 0;
    var y0 = 512;
    ssize = 512 / 8;
    
    clear();
    
    drawSymbol(x0, y0, ssize, n);
    drawSymbol(x0 + 3 * ssize, y0, ssize);
    drawSymbol(x0 + 6 * ssize, y0, ssize);

    drawSymbol(x0,             y0 - 3 * ssize, ssize);
    drawSymbol(x0 + 3 * ssize, y0 - 3 * ssize, ssize);
    drawSymbol(x0 + 6 * ssize, y0 - 3 * ssize, ssize);

    drawSymbol(x0,             y0 - 6 * ssize, ssize);
    drawSymbol(x0 + 3 * ssize, y0 - 6 * ssize, ssize);
    drawSymbol(x0 + 6 * ssize, y0 - 6 * ssize, ssize);
}

function drawSymbol(x0, y0, size, n) {
 
    if(n === 0) {
 
    var points = [
        [{ x: x0, y: y0 },                   { x: x0 + size * 2, y: y0 }],
        [{ x: x0 + size * 2, y: y0 },        { x: x0 + size * 2, y: y0 - size }],
        [{ x: x0 + size * 2, y: y0 - size }, { x: x0, y: y0 - size }],
        [{ x: x0, y: y0 - size },            { x: x0, y: y0 - size * 2 }],
        [{ x: x0, y: y0 - size * 2 },        { x: x0 + size * 2, y: y0 - size * 2 }]
    ];

    points.forEach(function(point) {
        if(point.length === 2) {
            line(point[0], point[1]);
        }
    });
    } else {
        drawSymbol(x0, y0, ssize, n - 1);
        drawSymbol(x0 + 3 * ssize, y0, ssize, n - 1);
        drawSymbol(x0 + 6 * ssize, y0, ssize);

        drawSymbol(x0,             y0 - 3 * ssize, ssize);
        drawSymbol(x0 + 3 * ssize, y0 - 3 * ssize, ssize);
        drawSymbol(x0 + 6 * ssize, y0 - 3 * ssize, ssize);

        drawSymbol(x0,             y0 - 6 * ssize, ssize);
        drawSymbol(x0 + 3 * ssize, y0 - 6 * ssize, ssize);
        drawSymbol(x0 + 6 * ssize, y0 - 6 * ssize, ssize);
    }
}
