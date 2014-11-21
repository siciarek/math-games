var d = '';

function main() {

    var n = 0;

    if (location.href.match(/n=\d+$/)) {
        n = parseInt(location.href.replace(/.+?n=(\d+)$/, '$1'));
    }

    var sizes = { 0: 2, 1: 8, 2: 26, 3: 64 };

    var size = 512 / sizes[n];

    var x0 = 0;
    var y0 = 512;

    clear();

    n = n > 1 ? Math.pow(2, n) : n;

    d = 'M' + x0 + ',' + y0 + 'L';
    curve(x0, y0, size, n);
    path(d);
}

function dline(p1, p2) {
    d += ' ' + p1.x + ',' + p1.y;
    d += ' ' + p2.x + ',' + p2.y;
}

function curve(x0, y0, size, n, type) {

    if (n === 0) {

        var full = size * 2;
        var half = size;

        var x = x0;
        var y = y0;

        var path = [
            [
                { x: x, y: y },
                { x: x + full, y: y }
            ],
            [
                { x: x + full, y: y },
                { x: x + full, y: y - half }
            ],
            [
                { x: x + full, y: y - half },
                { x: x, y: y - half }
            ],
            [
                { x: x, y: y - half },
                { x: x, y: y - full }
            ],
            [
                { x: x, y: y - full },
                { x: x + full, y: y - full }
            ]
        ];

        if (type === 1) {
            x = x0 + full;
            y = y0;

            path = [
                [
                    { x: x, y: y },
                    { x: x, y: y - full }
                ],
                [
                    { x: x, y: y - full },
                    { x: x - half, y: y - full }
                ],
                [
                    { x: x - half, y: y - full},
                    { x: x - half, y: y }
                ],
                [
                    { x: x - half, y: y },
                    { x: x - full, y: y }
                ],
                [
                    { x: x - full, y: y },
                    { x: x - full, y: y - full }
                ]
            ];
        }

        if (type === 2) {
            x = x0;
            y = y0 - full;

            path = [
                [
                    { x: x, y: y },
                    { x: x, y: y + full }
                ],
                [
                    { x: x, y: y + full },
                    { x: x + half, y: y + full }
                ],
                [
                    { x: x + half, y: y + full },
                    { x: x + half, y: y }
                ],
                [
                    { x: x + half, y: y },
                    { x: x + full, y: y }
                ],
                [
                    { x: x + full, y: y },
                    { x: x + full, y: y + full }
                ]
            ];
        }

        if (type === 3) {
            x = x0 + full;
            y = y0 - full;

            path = [
                [
                    { x: x, y: y },
                    { x: x - full, y: y }
                ],
                [
                    { x: x - full, y: y },
                    { x: x - full, y: y + half }
                ],
                [
                    { x: x - full, y: y + half },
                    { x: x, y: y + half }
                ],
                [
                    { x: x, y: y + half },
                    { x: x, y: y + full }
                ],
                [
                    { x: x, y: y + full },
                    { x: x - full, y: y + full }
                ]
            ];
        }

        path.forEach(function (point) {
            if (point.length === 2) {
                dline(point[0], point[1]);
            }
        });
    } else {
        curve(x0, y0, size, n - 1, 0);
        curve(x0, y0 - 3 * size, size, n - 1, 1);
        curve(x0, y0 - 6 * size, size, n - 1, 0);

        curve(x0 + 3 * size, y0 - 6 * size, size, n - 1, 2);
        curve(x0 + 3 * size, y0 - 3 * size, size, n - 1, 3);
        curve(x0 + 3 * size, y0, size, n - 1, 2);


        curve(x0 + 6 * size, y0, size, n - 1, 0);

        curve(x0 + 6 * size, y0 - 3 * size, size, n - 1, 1);



        curve(x0 + 6 * size, y0 - 6 * size, size, n - 1, 0);
    }
}
