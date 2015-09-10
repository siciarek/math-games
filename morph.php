<?php

/**
 * Documents:
 * http://www.cs.toronto.edu/~mangas/teaching/320/slides/CSC320T12.pdf
 * http://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/99/pub/www/notes/warp.pdf
 * http://graphics.cs.cmu.edu/courses/15-463/2011_fall/Lectures/morphing.pdf
 * 
 * http://matematyka.pisz.pl/forum/47244.html
 * http://www.matemaks.pl/rownanie-prostej-przechodzacej-przez-dwa-punkty.html
 */

$src = [
    [ 326, 116, 298, 47 ],
    [ 298, 47, 180, 43 ],
    [ 180, 43, 145, 106 ],
];

$trg = [
    [ 319, 151, 301, 88 ],
    [ 301, 88, 181, 86 ],
    [ 181, 86, 158, 149 ],
];

$srcImage = __DIR__ . '/images/morph/pic3.png';
$trgImage = __DIR__ . '/images/morph/pic2.png';

$morphDir = __DIR__ . '/morph/';

array_map('unlink', glob("$morphDir/*.png"));
sleep(3);

$t = 0.5;

$filename = $morphDir . '/src.01.png';
$im = imagecreatefrompng($srcImage);
$a = [];
foreach ($src as $P) {
    imageline($im, $P[0], $P[1], $P[2], $P[3], 0x0000FF);
    $a[] = [ $P[2], $P[3]];
}

foreach ($a as $p) {
    imagesetpixel($im, $p[0], $p[1], 0xFF0000);
}

imagepng($im, $filename);
imagedestroy($im);

$filename = $morphDir . '/trg.01.png';
$im = imagecreatefrompng($trgImage);

$a = [];

foreach ($trg as $P) {
    imageline($im, $P[0], $P[1], $P[2], $P[3], 0x0000FF);
    $a[] = [ $P[2], $P[3]];
}

foreach ($a as $p) {
    imagesetpixel($im, $p[0], $p[1], 0xFF0000);
}

imagepng($im, $filename);
imagedestroy($im);


$srcLines = [];
foreach ($src as $P) {
    $srcLines[] = new Line(new Point($P[0], $P[1]), new Point($P[2], $P[3]));
}

$trgLines = [];
foreach ($trg as $P) {
    $trgLines[] = new Line(new Point($P[0], $P[1]), new Point($P[2], $P[3]));
}

$dstLines = getDstLines($srcLines, $trgLines, $t);
$srcImgData = getImageData($srcImage);
$trgImgData = getImageData($trgImage);

class Point {

    public $x = 0;
    public $y = 0;

    public function __construct($x = 0, $y = 0) {
        $this->x = $x;
        $this->y = $y;
    }

}

class Line {

    public $p1;
    public $p2;

    public function __construct(Point $p1, Point $p2) {
        $this->p1 = $p1;
        $this->p2 = $p2;
    }

}

function getDstLines($srcLines, $trgLines, $t) {
    $dst = [];

    for ($i = 0; $i < count($srcLines); $i++) {

        $P = $srcLines[$i]->p1;
        $Q = $srcLines[$i]->p2;

        $P_ = $trgLines[$i]->p1;
        $Q_ = $trgLines[$i]->p2;

        $Pt = new Point((1 - $t) * $P->x + $t * $P_->x, (1 - $t) * $P->y + $t * $P_->y);
        $Qt = new Point((1 - $t) * $Q->x + $t * $Q_->x, (1 - $t) * $Q->y + $t * $Q_->y);

        $dst[] = new Line($Pt, $Qt);
    }

    return $dst;
}

function getU(Line $pq, Point $x) {
    return (($x->x - $pq->p1->x) * ($pq->p2->x - $pq->p1->x) + ($x->y - $pq->p1->y) * ($pq->p2->y - $pq->p1->y)) / squareLength($pq->p1, $pq->p2);
}

function getV(Line $pq, Point $x) {
    $perp = perpendicular($pq);

    return (($x->x - $pq->p1->x) * $perp->x + ($x->y - $pq->p1->y) * $perp->y) / lineLength($pq);
}

function getXp($u, $v, Line $pqp) {
    $xp = new Point();

    $len = lineLength($pqp);
    $perp = perpendicular($pqp);

    $xp->x = $pqp->p1->x + $u * ($pqp->p2->x - $pqp->p1->x) + ($v * ($perp->x)) / $len;
    $xp->y = $pqp->p1->y + $u * ($pqp->p2->y - $pqp->p1->y) + ($v * ($perp->y)) / $len;

    return $xp;
}

function pointLineDist(Point $x, Line $pq) {

    $c;
    $d;
    $e;

    $u = new Point();
    $v = new Point();
    $w = new Point();

    /* get the vector representation of the line */
    $v->x = $pq->p2->x - $pq->p1->x;
    $v->y = $pq->p2->y - $pq->p1->y;

    /* get the point in relation to the vector */
    $w->x = $x->x - $pq->p1->x;
    $w->y = $x->y - $pq->p1->y;

    $c = $w->x * $v->x + $w->y * $v->y;
    if ($c <= 0) {
        return sqrt(pow($x->x - $pq->p1->x, 2) + pow($x->y - $pq->p1->y, 2));
    }

    $d = pow($v->x, 2) + pow($v->y, 2);
    if ($d <= $c) {
        return sqrt(pow($x->x - $pq->p2->x, 2) + pow($x->y - $pq->p2->y, 2));
    }

    $e = $c / $d;
    $u->x = $pq->p1->x + $e * $v->x;
    $u->y = $pq->p1->y + $e * $v->y;

    return sqrt(pow($x->x - $u->x, 2) + pow($x->y - $u->y, 2));
}

function linelength(Line $line) {
    return length($line->p1, $line->p2);
}

function length(Point $p, Point $q) {
    return sqrt(squareLength($p, $q));
}

function squareLength(Point $p, Point $q) {
    return pow($q->x - $p->x, 2) + pow($q->y - $p->y, 2);
}

function perpendicular(Line $pq) {

    $m = - ($pq->p2->x - $pq->p1->x) / ($pq->p2->y - $pq->p1->y);
    $len = lineLength($pq);

    $perp = new Point();
    $perp->y = $m * $len / sqrt(1 + pow($m, 2));
    $perp->x = sqrt(pow($len, 2) - pow($perp->y, 2));

    return $perp;
}

function warpImage($srcLines, $dstLines, $srcImgData) {

    $width = count($srcImgData[0]);
    $height = count($srcImgData);

    /* warping parameters */
    
    $a = 1;
    $b = 1;
    $p = 0.5;

    $warped = [];
    $numlines = count($srcLines);
    $di = new Point();

    for ($r = 0; $r < $height; $r++) {
        for ($c = 0; $c < $width; $c++) {

            $DSUM = new Point();
            $weightsum = 0;
            $xi = new Point($c, $r);

            for ($i = 0; $i < $numlines; $i++) {

                /* calculate u,v based on Pi Qi */

                $u = getU($dstLines[$i], $xi);
                $v = getV($dstLines[$i], $xi);

                /* calculate X'i based on u,v and Pi'Qi' */

                $xp = getXp($u, $v, $srcLines[$i]);

                /* calculate displacement Di = Xi' - Xi for this line */

                $di->x = $xp->x - $xi->x;
                $di->y = $xp->y - $xi->y;

                /* dist = shortest distance from X to Pi Qi */
                $dist = pointLineDist($xi, $dstLines[$i]);
                $length = linelength($dstLines[$i]);

                /* weight = (length^p / (a + dist))^b */

                $weight = pow(pow($length, $p) / ($a + $dist), $b);

                /* DSUM += Di * weight */

                $DSUM->x += $di->x * $weight;
                $DSUM->y += $di->y * $weight;

                /* weightsum += weight */

                $weightsum += $weight;
            }

            /* X' = X + DSUM / weightsum */

            $xp->x = $xi->x + $DSUM->x / $weightsum;
            $xp->y = $xi->y + $DSUM->y / $weightsum;

            // Fill empty pixels:

            if ($xp->x < 0) {
                $xp->x = 0;
            }

            if ($xp->y < 0) {
                $xp->y = 0;
            }

            if ($xp->x > $width - 1) {
                $xp->x = $width - 1;
            }

            if ($xp->y > $height - 1) {
                $xp->y = $height - 1;
            }

            $warped[$xi->y][$xi->x] = $srcImgData[$xp->y][$xp->x];
        }
    }

    return $warped;
}

function saveImage($filename, $data) {

    $width = count($data[0]);
    $height = count($data);

    $im = @imagecreatetruecolor($width, $height);

    for ($r = 0; $r < $height; $r++) {
        for ($c = 0; $c < $width; $c++) {

            imagesetpixel($im, $c, $r, $data[$r][$c][0] << 16 | $data[$r][$c][1] << 8 | $data[$r][$c][2]);
        }
    }

    imagepng($im, $filename);
    imagedestroy($im);
}

function getImageData($imageFileName) {

    $info = getimagesize($imageFileName);
    $width = array_shift($info);
    $height = array_shift($info);

    $srcImgData = [];
    $im = imagecreatefrompng($imageFileName);
    for ($r = 0; $r < $height; $r++) {
        $srcImgData[$r] = [];
        for ($c = 0; $c < $width; $c++) {
            $rgb = imagecolorat($im, $c, $r);

            $srcImgData[$r][$c] = [
                ($rgb >> 16) & 0xFF,
                ($rgb >> 8) & 0xFF,
                $rgb & 0xFF,
            ];
        }
    }

    imagedestroy($im);

    return $srcImgData;
}

function getDestImgData($srcImgData, $trgImgData, $t) {

    $width = count($srcImgData[0]);
    $height = count($srcImgData);

    $dest = [];

    for ($r = 0; $r < $height; $r++) {
        $dest[$r] = [];
        for ($c = 0; $c < $width; $c++) {
            $dest[$r][$c] = [
                ($srcImgData[$r][$c][0] + $t * ($trgImgData[$r][$c][0] - $srcImgData[$r][$c][0])), // R
                ($srcImgData[$r][$c][1] + $t * ($trgImgData[$r][$c][1] - $srcImgData[$r][$c][1])), // G
                ($srcImgData[$r][$c][2] + $t * ($trgImgData[$r][$c][2] - $srcImgData[$r][$c][2]))  // B
            ];
        }
    }

    return $dest;
}

$warpedSrcImgData = warpImage($srcLines, $dstLines, $srcImgData);
$filename = $morphDir . '/warp.src.01.png';
saveImage($filename, $warpedSrcImgData);
var_dump('Warped source image');

$warpedTrgImgData = warpImage($trgLines, $dstLines, $trgImgData);
$filename = $morphDir . '/warp.trg.01.png';
saveImage($filename, $warpedTrgImgData);
var_dump('Warped target image');

$destWarpedImgData = getDestImgData($warpedSrcImgData, $warpedTrgImgData, $t);
$filename = $morphDir . '/dest.warped.01.png';
saveImage($filename, $destWarpedImgData);
var_dump('Destination image warped');

$destNotWarpedImgData = getDestImgData($srcImgData, $trgImgData, $t);
$filename = $morphDir . '/dest.notwarped.01.png';
saveImage($filename, $destNotWarpedImgData);
var_dump('Destination image not warped');
