var Tiler = function(coder) {
    this.coder = coder;

    this.datay = this.coder.size - 1;
    this.datax = this.coder.size - 1;
    this.mask = this.coder.mask;

    this.UP = -1;
    this.DOWN = 1;

    this.LEFT = -1;
    this.RIGHT = -1;

    this.datadirx = this.LEFT;
    this.datadiry = this.UP;

    this.ending = false;

    this.al = false;
    this.check = [];
};

Tiler.prototype.constructor = Tiler;

Tiler.prototype.coder = {};


Tiler.prototype.remainder = function() {
    var rb = this.coder.config.remainderBits[this.coder.V];
    var remainder = '';
    while(rb-- > 0) {
        remainder += '0';
    }

    return remainder;
};

Tiler.prototype.setArea = function () {

    var bytes = this.coder.data.map(function (e) {
        var val = e.toString(2);

        while (val.length < 8) {
            val = '0' + val;
        }

        return val;
    });

    var datastr = bytes.join('');

    datastr += this.remainder();

    var data = datastr.split('').map(function(e){return parseInt(e);});

//    console.log({ BEFORE: data.length });

    var limit = 122000;
    var checkstr = '';
    var d = 0;

    while (data.length > 0) {
        var el = data.shift();
        if(typeof el === 'undefined') break;
        if(d >= limit)break;
        checkstr += el;

        var ret = this.setModule(el, d);

        if(ret === 100) {
            el = data.shift();
            this.setModule(el, d);
        }

        d++;
    }

//    console.log({ AFTER: this.check.length, STR: checkstr });
};

Tiler.prototype.setModule = function (value, index) {

    var x = this.datax;
    var y = this.datay;

    if (index > 0 && this.al === false) {
        x += index % 2 === 0 ? 0 : this.datadirx;
        y += index % 2 === 0 ? this.datadiry : 0;
    }

    if (typeof this.coder.mask[y] === 'undefined') {
        if (this.datax === 10) {
            this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
            this.datax -= 2;
            this.datay -= 8;

            x = this.datax;
            y = this.datay;

            this.ending = true;
        }
        else {
            this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
            this.datax -= 2;
            x = this.datax;
            y = this.datay;
        }
    }
    else {
        var mval = this.al === true ? this.coder.ALIGNMENT : this.mask[y][x];

        if (mval !== this.coder.UNDEFINDED) {
            switch (mval) {
                case this.coder.SEPARATOR:
                    this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;
                    this.datax -= 2;
                    x = this.datax;
                    y = this.datay;
                    break;
                case this.coder.FORMAT:
                    this.datadiry = this.datadiry === this.UP ? this.DOWN : this.UP;

                    if (this.ending === true) {
                        this.datay = 9;
                        this.datax -= 3;
                        x = this.datax;
                        y = this.datay;
                        this.ending = false;
                    }
                    else {
                        this.datax -= 2;
                        x = this.datax;
                        y = this.datay;
                    }
                    break;

                case this.coder.TOP_TIMER:
                    x = this.datax;
                    y = this.datay + (this.datadiry === this.UP ? -2 : 2);
                    break;

                case this.coder.ALIGNMENT:
                    if (this.datadiry === this.UP && this.coder.matrix[y][x - 1] === this.coder.UNDEFINDED) {
                        this.datay -= (index % 2 === 0 ? 1 : 1);
                        this.datax -= (this.al == false && index % 2 === 0 ? 1 : 0);
                        this.al = true;

                        y = this.datay;
                        x = this.datax;

                        break;
                    }

                    x = this.datax;
                    y = this.datay + (this.datadiry === this.UP ? -6 : 6);

                    break;
                default:
                    return 1;
            }
        }
    }

    if (value === 1) {
        this.coder.setFullModule(x, y, 'data');
    }
    else if(value === 0) {
        this.coder.setEmptyModule(x, y, 'data');
    }
    else {
        throw 'Invalid value: ' + value;
    }

    this.check.push([x, y]);

    if (this.al === true && this.coder.matrix[y - 1][x + 1] === this.coder.UNDEFINDED) {
        this.al = false;
        this.datax += 1;
        return 100;
    }

    this.datay = y;
    return 1;
};
