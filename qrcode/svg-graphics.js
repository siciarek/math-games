var ns = 'http://www.w3.org/2000/svg';
var svg = document.getElementsByTagNameNS(ns, 'svg')[0];
var doc = svg.ownerDocument;
var mode = 'crispEdges';

function init(_mode) {
    _mode = _mode || mode;
    mode = _mode;
    clear();
}

function clear() {
    circles = [];

    if (svg.getElementById('canvas')) {
        svg.removeChild(svg.getElementById('canvas'));
    }

    g = doc.createElementNS(ns, 'g');
    g.setAttribute('id', 'canvas');
    g.setAttribute('shape-rendering', mode);

    svg.appendChild(g);
}

function text(string, x, y, color) {
    color = color || '#000000';
    var element = doc.createElementNS(ns, 'text');
    element.setAttribute('x', x);
    element.setAttribute('y', y);
    element.setAttribute('style', 'font-size:7px;text-anchor:middle;font-family:sans-serif;fill:' + color);
    element.appendChild(doc.createTextNode(string));

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(element);
}

function rectangle(top, left, width, height, color) {

    var element = doc.createElementNS(ns, 'rect');
    element.setAttribute('x', left);
    element.setAttribute('y', top);
    element.setAttribute('width', width);
    element.setAttribute('height', height);
    element.setAttribute('fill', color);
//    element.setAttribute('stroke', 'gray');
//    element.setAttribute('stroke-width', 1);

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(element);
}

function square(top, left, size, cls) {
    cls = cls || 'square';

    rectangle(top, left, size, size, cls);
}

function circle(cx, cy, r, cls) {

    if (typeof cx === 'function' && typeof cx.constructor === 'function') {
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

    if (cls !== null) {
        c.setAttribute('class', cls);
    }

    var canvas = svg.getElementById('canvas');
    canvas.appendChild(c);
}

init();