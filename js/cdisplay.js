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

        this.data = new Uint8ClampedArray(this.app.cols * this.app.rows * 4 * this.pxsize * this.pxsize);
        this.imgData = this.cx.createImageData(this.app.cols * this.pxsize, this.app.rows * this.pxsize);
    };

    this.setPixel = function (x, y, color) {


    };

    this.move = function () {

        for (var row = 0; row < this.app.rows; row++) {
            for (var col = 0; col < this.app.cols; col++) {
                var color = this.colmap[this.app.grid[row][col]];
                for (var y = 0; y < this.pxsize; y++) {
                    var dy = row * this.pxsize + y;
                    for (var x = 0; x < this.pxsize; x++) {
                        var dx = col * this.pxsize + x;

                        var i = (dy * this.app.cols * this.pxsize + dx) << 2;

                        this.data[i + 0] = color[0];
                        this.data[i + 1] = color[1];
                        this.data[i + 2] = color[2];
                        this.data[i + 3] = color[3];
                    }
                }
            }
        }

        this.imgData.data.set(this.data);
        this.cx.putImageData(this.imgData, 0, 0);

        if (typeof this.app.beforeMove === 'function') {
            this.app.beforeMove();
        }

        var result = this.app.move();

        if (typeof this.app.afterMove === 'function') {
            this.app.afterMove();
        }

        this.setInfo();

        return result;
    };

    /**
     * http://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas
     *
     * @param {ImageData} imageData
     * @param {number} scale
     * @returns {ImageData}
     */
    this.scaleImageData = function (imageData, scale) {

        var scaled = this.cx.createImageData(imageData.width * scale, imageData.height * scale);

        for (var row = 0; row < imageData.height; row++) {
            for (var col = 0; col < imageData.width; col++) {
                var sourcePixel = [
                    imageData.data[(row * imageData.width + col) * 4 + 0],
                    imageData.data[(row * imageData.width + col) * 4 + 1],
                    imageData.data[(row * imageData.width + col) * 4 + 2],
                    imageData.data[(row * imageData.width + col) * 4 + 3]
                ];
                for (var y = 0; y < scale; y++) {
                    var destRow = row * scale + y;
                    for (var x = 0; x < scale; x++) {
                        var destCol = col * scale + x;
                        for (var i = 0; i < 4; i++) {
                            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
                                sourcePixel[i];
                        }
                    }
                }
            }
        }

        return scaled;
    };

    this.run = function (speed) {
        var self = this;

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
