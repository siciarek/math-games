var ns = 'http://www.w3.org/2000/svg';
var svg = document.getElementsByTagNameNS(ns, 'svg')[0];
var doc = svg.ownerDocument;
var size = parseInt(svg.getAttribute('viewBox').split(' ').pop());


function init() {
    clear();
}

function clear() {
    circles = [];

    if(svg.getElementById('canvas')) {
        svg.removeChild(svg.getElementById('canvas'));
    }

    g = doc.createElementNS(ns, 'g');
    g.setAttribute('id', 'canvas');

    svg.appendChild(g);
}

function text(string, x, y) {
    var element = doc.createElementNS(ns, 'text');
    element.setAttribute('x', x);
    element.setAttribute('y', y);
    element.text(string);

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(element);
}

function rectangle(top, left, width, height, cls) {

    cls = cls || 'rectangle';

    var element = doc.createElementNS(ns, 'rect');
    element.setAttribute('x', top);
    element.setAttribute('y', left);
    element.setAttribute('width', width);
    element.setAttribute('height', height);
    element.setAttribute('class', cls);

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(element);
}

function square(top, left, size, cls) {
    cls = cls || 'square';

    rectangle(top, left, size, size, cls);
}

function circle(cx, cy, r, cls) {

    if(typeof cx === 'function' && typeof cx.constructor === 'function') {
        var temp
    }

    cls = cls || 'circle';

    var c = doc.createElementNS(ns, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('class', cls);

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(c);
}

function point(point) {
    circle(point.x, point.y, 2, 'point');
}

function segment(from, to) {
    line(from, to, 'segment');
    point(from);
    point(to);
}

function line(from, to, cls) {
    cls = cls || null;

    var d = '';

    d += 'M' + from.x + ' ' + from.y;
    d += 'L' + to.x + ' ' + to.y;

    var c = doc.createElementNS(ns, 'path');
    c.setAttribute('d', d);

    if(cls !== null) {
        c.setAttribute('class', cls);
    }

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(c);
}


function path(d, cls) {
    cls = cls || null;

    var c = doc.createElementNS(ns, 'path');
    c.setAttribute('d', d);

    if(cls !== null) {
        c.setAttribute('class', cls);
    }

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(c);
}