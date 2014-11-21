var circles = [];

function drawCircleX(c) {

    var cx = c[0].r;
    var cy = c[0].i;
    var r = Math.abs(1 / c[1]);

    cx = cx * (size + size) + size /2;
    cy = cy * (size + size) + size /2;
    r *= 2 * size;

    circle(cx, cy, r);
}


function main(n, mode) {

    var r_0out = 1;

    n = n || 4;
    mode = mode || 'three';

    var loc = location.href.split('?');

    if (loc.length > 1) {
        var settings = loc.pop().split('=');
        n = parseInt(settings.pop());
        mode = settings.pop();
    }

    var circ = null;
    var stage = null;

    clear();

    switch (mode) {

        case 'test':

            var k_1 = 28;
            var k_2 = 25;
            var k_3 = 25;

            var d = (1 / k_1 + 1 / k_2);

            var cx_1 = 0;
            var cy_1 = 0;
            var R = 1 / k_1;

            var cx_2 = cx_1 + d;
            var cy_2 = cy_1;
            var r = 1 / k_2;

            var c1 = {
                x: cx_1,
                y: cy_1,
                r: R + 1 / k_3
            };

            var c2 = {
                x: cx_2,
                y: cy_2,
                r: r + 1 / k_3
            };

            var c3 = circle_circle_intersection(c1, c2).shift();

            var cx_3 = c3.x;
            var cy_3 = c3.y;

            var ck_i1 = [new C(cx_1, cy_1), k_1];
            var ck_i2 = [new C(cx_2, cy_2), k_2];
            var ck_i3 = [new C(cx_3, cy_3), k_3];

            var ck_0out = f_mm(ck_i1, ck_i2, ck_i3);

            appendCircle(ck_i1);
            appendCircle(ck_i2);
            appendCircle(ck_i3);
            appendCircle(ck_0out);

            fill_easy(ck_0out, ck_i2, ck_i3, n);
            fill_easy(ck_i1, ck_i2, ck_i3, n);
            fill_easy(ck_i1, ck_i2, ck_0out, n);

            break;

        case 'two':

            var k_0out = -1 / r_0out;
            var k_i1 = 1 / (r_0out / 2);
            var k_i2 = 1 / (r_0out / 2);

            var ck_0out = [new C(0, 0), k_0out];
            var ck_i1 = [new C(0, r_0out / 2), k_i1];
            var ck_i2 = [new C(0, -r_0out / 2), k_i2];

            clear();

            // n = -1, initial stage : 3 mutually tangent circles

            appendCircle(ck_0out, -1);
            appendCircle(ck_i1, -1);
            appendCircle(ck_i2, -1);

            // 0 to n stages recursivelly processed with outer circle

            fill_easy(ck_i1, ck_i2, ck_0out, n);
            fill_hard(ck_i1, ck_i2, ck_0out, n);

            break;

        case 'three':

            var a = 1 + 2 / Math.sqrt(3);
            var r_i = r_0out / a;
            var height = r_i * Math.sqrt(3);

            var c_ia = new C(r_0out, (2 * r_0out - r_i));
            var c_ib = new C((r_0out + r_i), (2 * r_0out - r_i - height));
            var c_ic = new C((r_0out - r_i), (2 * r_0out - r_i - height));

            var ck_ia = [c_ia, 1 / r_i];
            var ck_ib = [c_ib, 1 / r_i];
            var ck_ic = [c_ic, 1 / r_i];

            clear();

            // n = -1, initial stage : 3 mutually tangent circles

            appendCircle(ck_ia, -1);
            appendCircle(ck_ib, -1);
            appendCircle(ck_ic, -1);

            if (n == -1) {
                return;
            }

            // n = 0, zero stage : 2 circles tangent to previous : outer circle ck_0out and inner circle ck_0in

            var ck_0out = f_mm(ck_ia, ck_ib, ck_ic);
            var ck_0in = f_pp(ck_ia, ck_ib, ck_ic);

            appendCircle(ck_0in, 0);
            appendCircle(ck_0out, 0);

            // 1 to n stages recursivelly processed with outer circle

            fill_easy(ck_ia, ck_ib, ck_0out, n);
            fill_easy(ck_ib, ck_ic, ck_0out, n);
            fill_hard_easy(ck_ic, ck_ia, ck_0out, n);

            // And inner circle ck_0in
            fill_easy(ck_ia, ck_ib, ck_0in, n);
            fill_easy(ck_ib, ck_ic, ck_0in, n);
            fill_easy(ck_ic, ck_ia, ck_0in, n);

            break;
    }

    console.log([mode, n, circles.length]);

    while (circles.length > 0) {
        var temp = circles.shift();
        circ = temp.shift();
        stage = temp.shift();
        if (mode === 'two') {
            circ[0].r += r_0out;
            circ[0].i += r_0out;
        }
        drawCircle(circ, stage);
    }
}

function appendCircle(circle, stage) {
    circles.push([circle, stage]);
}


function drawCircle(c) {

    var cx = c[0].r;
    var cy = c[0].i;
    var r = Math.abs(1 / c[1]);

    cx *= size / 4 + size / 4;
    cy *= size / 4 + size / 4;
    r *= size / 2;

    var cls = 'circle';

    var element = doc.createElementNS(ns, 'circle');
    element.setAttribute('cx', cx);
    element.setAttribute('cy', cy);
    element.setAttribute('r', r);
    element.setAttribute('class', cls);

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(element);
}

function fill_easy(ckla, cklb, cklc, stage) {
    if (stage > 0) {
        var ckm = f_pp(ckla, cklb, cklc);
        appendCircle(ckm, stage);

        fill_easy(ckla, cklb, ckm, stage - 1);
        fill_easy(cklb, cklc, ckm, stage - 1);
        fill_easy(ckla, cklc, ckm, stage - 1);
    }
}

function fill_hard_easy(ck_ic, ck_ia, ck_0out, stage) {
    if (stage > 0) {
        /* step 1 = circle in the middle */
        var ck_1c = f_pm(ck_ia, ck_ic, ck_0out);
        appendCircle(ck_1c, stage);
        /* 1c */
        /* step 2 = 3 circles around */
        fill_easy(ck_ia, ck_0out, ck_1c, stage - 1);
        /* 2ca */
        fill_easy(ck_ia, ck_ic, ck_1c, stage - 1);
        /* 2cb */
        /* hard subgap 2cc */
        if (stage > 1) {
            var ck_2cc = f_pm(ck_ic, ck_1c, ck_0out);
            appendCircle(ck_2cc, stage);
            /* 2cc */
            /* step 3 for subgap 2cc */
            fill_easy(ck_0out, ck_1c, ck_2cc, stage - 2);
            /* 3cca */
            fill_easy(ck_ic, ck_1c, ck_2cc, stage - 2);
            /* 3ccb */
            if (stage > 2) {
                var ck_3ccc = f_pm(ck_ic, ck_0out, ck_2cc);
                appendCircle(ck_3ccc, stage);
                /* 3ccc */
                /* step 4 for subgap 3ccc */
                if (stage > 3) {
                    var ck_4ccca = f_pm(ck_0out, ck_2cc, ck_3ccc);
                    appendCircle(ck_4ccca, stage);

                    fill_easy(ck_ic, ck_2cc, ck_3ccc, stage - 3);
                    /* 4cccb */
                    fill_easy(ck_ic, ck_0out, ck_3ccc, stage - 3);
                    /* 4cccc */
                    /* step 5 for subgap 4ccca */
                    fill_easy(ck_0out, ck_2cc, ck_4ccca, stage - 4);
                    /*  5cccaa */
                    fill_easy(ck_2cc, ck_3ccc, ck_4ccca, stage - 4);
                    /* 5cccab */
                    if (stage > 4) {
                        var ck_5cccac = f_pm(ck_0out, ck_3ccc, ck_4ccca);
                        appendCircle(ck_5cccac, stage);
                    }
                }
            }
        }
    }
}

function fill_hard(ck_ic, ck_ia, ck_0out, stage) {
    if (stage > 0) {
        /* step 1 = circle in the middle */
        var ck_1c = f_pm(ck_ia, ck_ic, ck_0out);
        appendCircle(ck_1c, stage);
        /* 1c */
        /* step 2 = 3 circles around */
        fill_hard(ck_ia, ck_0out, ck_1c, stage - 1);
        /* 2ca */
        fill_hard(ck_ia, ck_ic, ck_1c, stage - 1);
        /* 2cb */
        /* hard subgap 2cc */
        if (stage > 1) {
            var ck_2cc = f_pm(ck_ic, ck_1c, ck_0out);
            appendCircle(ck_2cc, stage);
            /* 2cc */
            /* step 3 for subgap 2cc */
            fill_hard(ck_0out, ck_1c, ck_2cc, stage - 2);
            /* 3cca */
            fill_hard(ck_ic, ck_1c, ck_2cc, stage - 2);
            /* 3ccb */
            if (stage > 2) {
                var ck_3ccc = f_pm(ck_ic, ck_0out, ck_2cc);
                appendCircle(ck_3ccc, stage);
                /* 3ccc */
                /* step 4 for subgap 3ccc */
                if (stage > 3) {
                    var ck_4ccca = f_pm(ck_0out, ck_2cc, ck_3ccc);
                    appendCircle(ck_4ccca, stage);

                    fill_hard(ck_ic, ck_2cc, ck_3ccc, stage - 3);
                    /* 4cccb */
                    fill_hard(ck_ic, ck_0out, ck_3ccc, stage - 3);
                    /* 4cccc */
                    /* step 5 for subgap 4ccca */
                    fill_hard(ck_0out, ck_2cc, ck_4ccca, stage - 4);
                    /*  5cccaa */
                    fill_hard(ck_2cc, ck_3ccc, ck_4ccca, stage - 4);
                    /* 5cccab */
                    if (stage > 4) {
                        var ck_5cccac = f_pm(ck_0out, ck_3ccc, ck_4ccca);
                        appendCircle(ck_5cccac, stage);
                    }
                }
            }
        }
    }
}
