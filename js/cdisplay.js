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
        [255, 255, 255],
        [0, 0, 0],
        [144, 144, 144]
    ];

    this.init = function () {
        this.setName(this.app.name);

        this.disp = document.getElementById('disp');
        this.disp.setAttribute('width', this.app.cols * this.pxsize);
        this.disp.setAttribute('height', this.app.rows * this.pxsize);
        this.disp.setAttribute('style', 'border: 1px solid black');

        this.cx = this.disp.getContext('2d');
    };

    this.setPixel = function (x, y, colindex) {
        var color = this.colmap[colindex];

        var i = (y * this.app.cols + x) << 2;
        this.data[i + 0] = color[0];
        this.data[i + 1] = color[1];
        this.data[i + 2] = color[2];
        this.data[i + 3] = 255;
    };

    this.move = function () {

        this.clear();

        var startrow = 0;
        var endrow = 0;

        this.data = [];

        this.imgData = this.cx.createImageData(this.app.cols, this.app.rows);

        for (var y = 0; y < this.app.rows; y++) {
            for (var x = 0; x < this.app.cols; x++) {
                this.setPixel(x, y, this.app.grid[y][x]);
            }
        }

        this.imgData.data.set(this.data);

        if(this.pxsize > 1) {
            this.imgData = this.scaleImageData(this.imgData, this.pxsize);
        }

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
