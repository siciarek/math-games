var inter = null;
var aftertouch = false;
var isrunning = false;

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
var display = null;

function init() {
    var img = new Image();

    img.src = image.src;

    img.onload = function () {

        N = Math.min(this.width, this.height);

        display = document.getElementById('display');
        display.setAttribute('height', N);
        display.setAttribute('width', N);

        c = display.getContext('2d');
        c.drawImage(this, 0, 0, N, N);

        imageData = c.getImageData(0, 0, N, N);
        data = new Uint8ClampedArray(N * pxsize * N * pxsize * 4);

        for (var y = 0; y < N; y++) {

            grid[y] = [];
            original[y] = [];
            buffer[y] = [];

            for (var x = 0; x < N; x++) {
                var i = (y * N + x) << 2;

                grid[y][x] = [
                    imageData.data[i + 0],
                    imageData.data[i + 1],
                    imageData.data[i + 2],
                    imageData.data[i + 3]
                ];

                original[y][x] = [
                    imageData.data[i + 0],
                    imageData.data[i + 1],
                    imageData.data[i + 2],
                    imageData.data[i + 3]
                ];

                buffer[y][x] = null;
            }
        }

        display.setAttribute('height', N * pxsize);
        display.setAttribute('width', N * pxsize);
        imageData = c.createImageData(N * pxsize, N * pxsize);

        redraw();
    };
}

function redraw() {

    for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {

            for (py = 0; py < pxsize; py++) {
                dpy = y * pxsize + py;

                for (px = 0; px < pxsize; px++) {
                    dpx = x * pxsize + px;

                    i = (dpy * N * pxsize + dpx) << 2;

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
            isrunning = false;
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

function T(x, y) {
    return grid[y][x];
}

function mod(value, N) {
    return (value) % N;
}

function iterate() {

    for (x = 0; x < N; x++) {
        for (y = 0; y < N; y++) {
            buffer[y][x] = T(mod(2 * x + y, N), mod(x + y, N));
        }
    }

    for (x = 0; x < N; x++) {
        for (y = 0; y < N; y++) {
            grid[N - 1 - y][x] = buffer[y][x];
        }
    }

    iteration++;
}

$(document).ready(function () {

    $('#display').on('mousedown', function () {
        aftertouch = true;
        inter = setInterval(function(){
            clearInterval(inter);

            if(aftertouch === true) {
                aftertouch = false;
                isruning = true;
                run();
            }
        }, 1000);
    });

    $('#display').on('mouseup', function () {
        aftertouch = false;
        clearInterval(inter);
    });

    $('#display').on('click', function () {
        if(isrunning === false) {
            step();
        }
    });

    init();
});
