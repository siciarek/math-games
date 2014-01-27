var ns = 'http://www.w3.org/2000/svg';
var svg = document.getElementsByTagNameNS(ns, 'svg')[0];
var doc = svg.ownerDocument;
var size = parseInt(svg.getAttribute('viewBox').split(' ').pop());

function clear() {
    circles = [];

    if(svg.getElementById('canvas')) {
        svg.removeChild(svg.getElementById('canvas'));
    }

    g = doc.createElementNS(ns, 'g');
    g.setAttribute('id', 'canvas');
    g.setAttribute('fill', 'none');
    g.setAttribute('stroke', 'black');

    svg.appendChild(g);
}

function drawCircle(circle) {

    var cx = circle[0].r;
    var cy = circle[0].i;
    var r = Math.abs(1 / circle[1]);

    cx *= size / 4 + size / 4;
    cy *= size / 4 + size / 4;
    r *= size / 2;

    var c = doc.createElementNS(ns, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);

    svg.getElementById('canvas').appendChild(c);
}
