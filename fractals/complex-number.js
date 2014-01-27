/**
 * Complex number
 */

/**
 * Constructor
 *
 * @param r
 * @param i
 * @constructor
 */
var C = function(r, i) {
    i = typeof i === 'undefined' ? 0 : i;
    this.r = r;
    this.i = i;
};

/**
 * Unary operators
 *
 * @returns {C}
 */
C.prototype.conj = function() {
    return new C(this.r, -1 * this.i);
};

C.prototype.sqrt = function() {
    return new C(
        Math.sqrt(Math.sqrt(Math.pow(this.r, 2) + Math.pow(this.i, 2))) * Math.cos(Math.atan2(this.i, this.r) / 2),
        Math.sqrt(Math.sqrt(Math.pow(this.r, 2) + Math.pow(this.i, 2))) * Math.sin(Math.atan2(this.i, this.r) / 2)
    );
};

/**
 * Binary operator (+)
 *
 * @param {C|number} c
 * @returns {C}
 */
C.prototype.add = function(c) {
    if(typeof c === 'number') {
        c = new C(c);
    }

    return new C(this.r + c.r, this.i + c.i);
};

/**
 * Binary operator (-)
 *
 * @param {C|number} c
 * @returns {C}
 */
C.prototype.sub = function(c) {
    if(typeof c === 'number') {
        c = new C(c);
    }

    return new C(this.r - c.r, this.i - c.i);
};

/**
 * Binary operator (*)
 *
 * @param {C|number} c
 * @returns {C}
 */
C.prototype.mul = function(c) {
    if(typeof c === 'number') {
        c = new C(c);
    }

    return new C(
        this.r * c.r - this.i * c.i,
        this.r * c.i + this.i * c.r
     );
};

/**
 * Binary operator (/)
 *
 * @param {C|number} c
 * @returns {C}
 */
C.prototype.div = function(c) {

    if(typeof c === 'number') {
        c = new C(c);
    }

    var numerator = this.mul(c.conj());
    var denominator = c.mul(c.conj());

    return new C(numerator.r / denominator.r, numerator.i / denominator.r);
};
