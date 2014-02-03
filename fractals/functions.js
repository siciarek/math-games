
function circle_circle_intersection(c1, c2) {

    var solutions = [];

    var r0 = c1.r;
    var r1 = c2.r;

    var x0 = c1.x;
    var y0 = c1.y;

    var x1 = c2.x;
    var y1 = c2.y;

    /**
     * dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    var dx = x1 - x0;
    var dy = y1 - y0;
    var d = Math.sqrt(dx * dx + dy * dy);

    if (d === 0 && c1.r == c2.r) {
        throw 'Circles are coincident and there are an infinite number of solutions.';
    }
    else if (d > (r0 + r1)) {
        throw 'No solution. The circles are separate.';
    }
    else if (d > Math.abs(r0 + r1)) {
        throw 'No solution. One circle is contained in the other.';
    }
    else {

        /**
         * Determine the distance from point 0 to point 2.
         */
        var a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

        /**
         * Determine the coordinates of point 2.
         */
        var x2 = x0 + (dx * a / d);
        var y2 = y0 + (dy * a / d);

        /**
         * Determine the distance from point 2 to either of the
         * intersection points.
         */
        var h = Math.sqrt((r0 * r0) - (a * a));

        /**
         * There are two intersection points
         */
        solutions.push(
            {
                x: x2 - dy * (h / d),
                y: y2 + dx * (h / d)
            }
        );

        solutions.push(
            {
                x: x2 + dy * (h / d),
                y: y2 - dx * (h / d)
            }
        );
    }

    return solutions;
}

function f_p(a1, a2, a3) {

    // Real numbers:
    if (typeof a1 === 'number' && typeof a2 === 'number' && typeof a3 === 'number') {
        return  a1 + a2 + a3 + 2 * Math.sqrt(a1 * a2 + a2 * a3 + a3 * a1);
    }

    // Complex numbers:
    return (a1) .add (a2) .add (a3) .add(new C(2).mul(a1.mul(a2).add(a2.mul(a3)).add(a3.mul(a1)).sqrt()));
}

function f_m(a1, a2, a3) {

    // Real numbers:
    if (typeof a1 === 'number' && typeof a2 === 'number' && typeof a3 === 'number') {
        return  a1 + a2 + a3 - 2 * Math.sqrt(a1 * a2 + a2 * a3 + a3 * a1);
    }

    // Complex numbers:
    return a1.add(a2).add(a3).sub(new C(2).mul(a1.mul(a2).add(a2.mul(a3)).add(a3.mul(a1)).sqrt()));
}

function f_pp(ck1, ck2, ck3) {

    var k4 = f_p(ck1[1], ck2[1], ck3[1]);
    var c4 = f_p(
        ck1[0].mul(ck1[1]),
        ck2[0].mul(ck2[1]),
        ck3[0].mul(ck3[1])
    ).div(k4);

    var ck4 = [c4, k4];
    return [c4, k4, ck4];
}

function f_pm(ck1, ck2, ck3) {

    var k4 = f_p(ck1[1], ck2[1], ck3[1]);
    var c4 = f_m(
        ck1[0].mul(ck1[1]),
        ck2[0].mul(ck2[1]),
        ck3[0].mul(ck3[1])
    ).div(k4);

    var ck4 = [c4, k4];
    return [c4, k4, ck4];
}

function f_mp(ck1, ck2, ck3) {

    var k4 = f_m(ck1[1], ck2[1], ck3[1]);
    var c4 = f_p(
        ck1[0].mul(ck1[1]),
        ck2[0].mul(ck2[1]),
        ck3[0].mul(ck3[1])
    ).div(k4);

    var ck4 = [c4, k4];
    return [c4, k4, ck4];
}

function f_mm(ck1, ck2, ck3) {

    var k4 = f_m(ck1[1], ck2[1], ck3[1]);
    var c4 = f_m(
        ck1[0].mul(ck1[1]),
        ck2[0].mul(ck2[1]),
        ck3[0].mul(ck3[1])
    ).div(k4);

    var ck4 = [c4, k4];
    return [c4, k4, ck4];
}
