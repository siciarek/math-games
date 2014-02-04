var image = images[index];
var pxsize = isNaN(parseInt(image.pxsize)) === false && parseInt(image.pxsize) > 1 ? image.pxsize : 1;

var c = null;

var N;
var grid = [];
var buffer = [];
var original = [];

var imageData = null;
var data = null;

var iteration = 0;
var interval = null;

function init() {
    var img = new Image();

    img.src = image.src;

    img.onload = function () {

        N = Math.min(this.width, this.height) + 1;

        var display = document.getElementById('display');
        display.setAttribute('width', N);
        display.setAttribute('height', N);

        c = display.getContext('2d');
        c.drawImage(this, 0, 0, N, N);

        imageData = c.getImageData(0, 0, N, N);

        data = new Uint8ClampedArray(N * pxsize * N * pxsize * 4);

        for (var y = 0; y < N; y++) {

            grid[y] = [];
            buffer[y] = [];
            original[y] = [];

            for (var x = 0; x < N; x++) {
                var i = (y * N + x) << 2;

                var pix = [];
                pix[0] = imageData.data[i + 0];
                pix[1] = imageData.data[i + 1];
                pix[2] = imageData.data[i + 2];
                pix[3] = imageData.data[i + 3];

                grid[y].push(pix);
                original[y].push(pix);
            }
        }

        imageData = c.createImageData(N * pxsize, N * pxsize);
        display.setAttribute('width', N * pxsize);
        display.setAttribute('height', N * pxsize);

        redraw();

    };
}

function redraw() {

    for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {

            for (var py = 0; py < pxsize; py++) {
                var dpy = y * pxsize + py;

                for (var px = 0; px < pxsize; px++) {
                    var dpx = x * pxsize + px;

                    var i = (dpy * N * pxsize + dpx) << 2;

                    for (var p = 0; p < grid[y][x].length; p++) {
                        data[i + p] = grid[y][x][p];
                    }
                }
            }
        }
    }

    imageData.data.set(data);
    c.putImageData(imageData, 0, 0);

    setInfo();
}

function setInfo() {
    $('.info').html('iter. ' + iteration);
}

function step() {
    move();
}

function run() {
    interval = setInterval(function () {
        if (move() === false) {
            clearInterval(interval);
            iteration = 0;
            return;
        }
    }, speed);
}

function restored() {
    for (var j = 0; j < 20; j++) {

        if (JSON.stringify(grid[j]) !== JSON.stringify(original[j])) {
            break;
        }

        if (j === 19) {
            return false;
        }
    }

    return true;
}

function move() {
    iterate();
    redraw();
    return restored();
}

function iterate() {

    for (y = 0; y < N; y++) {
        for (x = 0; x < N; x++) {
            buffer[y][x] = T(mod(2 * y + x, N), mod(x + y, N));
        }
    }

    updateGrid();
    iteration++;
}

function updateGrid() {
    for (y = 0; y < N; y++) {
        for (x = 0; x < N; x++) {
            grid[y][x] = buffer[y][x];
        }
    }
}

function mod(value, N) {
    return value % N;
}

function T(x, y) {
    return grid[y][x];
}

$(document).ready(function () {
    $('#display').click(function () {
        step();
    });

    $('#display').dblclick(function () {
        run();
    });

    init();
});
