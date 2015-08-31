/**
 * Display
 *
 * @author Jacek Siciarek <siciarek@gmail.com>
 */
var Display = function (app, pxsize) {

    /**
     * App to run
     * @type {object}
     */
    this.app = app;

    this.disp = null;
    this.cx = null;
    this.imgData = null;
    this.data = [];
    this.interval = null;

    this.pxsize = pxsize || 1;

    this.buf = null;
    this.buf8 = null;

    this.colmap = [
        [250, 250, 250, 255],
        [0, 0, 0, 255],
        [144, 144, 144, 255]
    ];

    this.init = function () {
        this.setName(this.app.name);

        this.disp = document.getElementById('display');
        this.disp.setAttribute('width', this.app.cols * this.pxsize);
        this.disp.setAttribute('height', this.app.rows * this.pxsize);

        this.cx = this.disp.getContext('2d');

        this.imgData = this.cx.createImageData(this.app.cols * this.pxsize, this.app.rows * this.pxsize);

        this.buf = new ArrayBuffer(this.imgData.data.length);
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.data = new Uint32Array(this.buf);
    };

    this.setPixel = function (x, y, color) {

        var width = this.app.cols * this.pxsize;
        
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];

        for (var xo = 0; xo < this.pxsize; xo++) {
            for (var yo = 0; yo < this.pxsize; yo++) {
                this.data[(y + yo) * width + (x + xo)] =
                        (a << 24) | // alpha
                        (b << 16) | // blue
                        (g << 8)  | // green
                        r;          // red
            }
        }
    }
    ;

    this.move = function () {
        var ri = -1;
        var ci = -1;
        
        this.data = new Uint32Array(this.buf);
        
        for (var y = 0; y < this.app.rows * this.pxsize; y += this.pxsize) {
            ri++;
            ci = -1;
            for (var x = 0; x < this.app.cols * this.pxsize; x += this.pxsize) {
                ci++;
                var color = this.colmap[this.app.grid[ri][ci]];
                this.setPixel(x, y, color);
            }
        }

        this.imgData.data.set(this.buf8);
        this.cx.putImageData(this.imgData, 0, 0);

        if (typeof this.app.beforeMove === 'function') {
            this.app.beforeMove();
        }

        var result = this.app.move();

        if (typeof this.app.afterMove === 'function') {
            this.app.afterMove();
        }

        this.setInfo();

        console.log('.');
        
        return result;
    };

    this.run = function (speed) {
        var self = this;

console.log([speed]);

        self.interval = setInterval(function () {
            if (self.move() === false) {
                clearInterval(self.interval);
            }
        }, speed);

        return true;
    };

    this.setName = function (name) {
        var html = '<i class="icon-cog icon-large"></i> ' + name;
        $('head title').text(name);
        $('ul.navbar-right li.title a').html(html).attr('title', name);
    };

    this.setInfo = function () {
        $('.info').html(this.app.getInfo());
    };

    this.clear = function () {

    };

    this.init();
};
