/**
 * Geometry classes
 */

/**
 * Point
 */
var Point;

Point = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Circle
 */
var Circle;

/**
 * Constructor
 *
 * @param {Point} center circle center
 * @param {number} radius circle radius
 * @constructor
 */
Circle = function (center, radius) {
    this.center.x = center.x;
    this.center.y = center.y;
    this.setRadius(radius);
    this.c = new C(this.center.x, this.center.y);
};

Circle.prototype.center = new Point();
Circle.prototype.c = new C(0, 0);

Circle.prototype.setCurvature = function(curvature) {
    this.k = curvature;
    this.curvature = this.k;
    this.radius = 1 / this.k;
    this.r = this.radius;
};

Circle.prototype.setRadius = function(radius) {
    this.radius = radius;
    this.r = this.radius;
    this.k = 1 / this.r;
    this.curvature = this.k;
};
