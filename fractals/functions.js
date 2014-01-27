
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
