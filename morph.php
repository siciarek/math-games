<?php

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

/**
 * Documents:
 * http://www.cs.toronto.edu/~mangas/teaching/320/slides/CSC320T12.pdf
 * http://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/99/pub/www/notes/warp.pdf
 * http://graphics.cs.cmu.edu/courses/15-463/2011_fall/Lectures/morphing.pdf
 * 
 * http://matematyka.pisz.pl/forum/47244.html
 * http://www.matemaks.pl/rownanie-prostej-przechodzacej-przez-dwa-punkty.html
 */
$srcImage = __DIR__ . '/images/morph/pic3.png';
$trgImage = __DIR__ . '/images/morph/pic2.png';

$morphDir = __DIR__ . '/morph/';

array_map('unlink', glob("$morphDir/*"));
sleep(3);

$P = [180, 40];
$Q = [140, 110];

$P_ = [195, 67];
$Q_ = [145, 145];

$X = [40, 100];
$X_ = [300, 150];

$t = 0.5;

// Pt to odcinek między granicami PQ i P_Q_
$Pt = [(1 - $t) * $P[0] + $t * $P_[0], (1 - $t) * $P[1] + $t * $P_[1]];
$Qt = [(1 - $t) * $Q[0] + $t * $Q_[0], (1 - $t) * $Q[1] + $t * $Q_[1]];


$filename = $morphDir . '/src.01.png';
$im = imagecreatefrompng($srcImage);
$color = 0x0000FF;
imageline($im, $P[0], $P[1], $Q[0], $Q[1], $color);
imagepng($im, $filename);
imagedestroy($im);

$filename = $morphDir . '/trg.01.png';
$im = imagecreatefrompng($trgImage);
$color = 0x0000FF;
imageline($im, $P_[0], $P_[1], $Q_[0], $Q_[1], $color);
imagepng($im, $filename);
imagedestroy($im);


$srcLines = [
    new Line(new Point($P[0], $P[1]), new Point($Q[0], $Q[1])),
];

$trgLines = [
    new Line(new Point($P_[0], $P_[1]), new Point($Q_[0], $Q_[1])),
];

$dstLines = [
    new Line(new Point($Pt[0], $Pt[1]), new Point($Qt[0], $Qt[1])),
];

$srcImgData = getImageData($srcImage);
$trgImgData = getImageData($trgImage);

function getU(Line $pq, Point $x) {
    return (($x->x - $pq->p1->x) * ($pq->p2->x - $pq->p1->x) +
            ($x->y - $pq->p1->y) * ($pq->p2->y - $pq->p1->y)) / squareLength($pq->p1, $pq->p2);
}

function getV(Line $pq, Point $x) {
    $perp = perpendicular($pq);

    return (($x->x - $pq->p1->x) * $perp->x + ($x->y - $pq->p1->y) * $perp->y) / lineLength($pq);
}

function getXp($u, $v, Line $pqp, Point $x) {
    $xp = new Point();

    $len = lineLength($pqp);
    $perp = perpendicular($pqp);

    $xp->x = $pqp->p1->x + $u * ($pqp->p2->x - $pqp->p1->x) + ($v * ($perp->x)) / $len;
    $xp->y = $pqp->p1->y + $u * ($pqp->p2->y - $pqp->p1->y) + ($v * ($perp->y)) / $len;

    return $xp;
}

function point2LineD(Point $x, Line $pq) {

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

            $dsum = new Point();
            $weightsum = 0;
            $xi = new Point($c, $r);

            for ($i = 0; $i < $numlines; $i++) {

                /* calculate u,v based on Pi Qi */

                $u = getU($dstLines[$i], $xi);
                $v = getV($dstLines[$i], $xi);

                /* calculate X'i based on u,v and Pi'Qi' */

                $xp = getXp($u, $v, $srcLines[$i], $xi);

                /* calculate displacement Di = Xi' - Xi for this line */

                $di->x = $xp->x - $xi->x;
                $di->y = $xp->y - $xi->y;

                /* dist = shortest distance from X to Pi Qi */
                $dist = point2LineD($xi, $dstLines[$i]);
                $lengthp = linelength($dstLines[$i]);

                /* weight = (lengthp / (a + dist))b */

                $weight = pow(pow($lengthp, $p) / ($a + $dist), $b);

                /* DSUM += Di * weight */

                $dsum->x += $di->x * $weight;
                $dsum->y += $di->y * $weight;

                /* weightsum += weight */

                $weightsum += $weight;
            }

            /* X' = X + DSUM / weightsum */

            $xp->x = intval($xi->x + $dsum->x / $weightsum);
            $xp->y = intval($xi->y + $dsum->y / $weightsum);

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
$warpedTrgImgData = warpImage($trgLines, $dstLines, $trgImgData);
$destWarpedImgData = getDestImgData($warpedSrcImgData, $warpedTrgImgData, $t);
$destNowarpedImgData = getDestImgData($srcImgData, $trgImgData, $t);

// Create warped images:

$filename = $morphDir . '/warp.src.01.png';
saveImage($filename, $warpedSrcImgData);

$filename = $morphDir . '/warp.trg.01.png';
saveImage($filename, $warpedTrgImgData);

$filename = $morphDir . '/dest.warped.01.png';
saveImage($filename, $destWarpedImgData);

$filename = $morphDir . '/dest.nowarped.01.png';
saveImage($filename, $destNowarpedImgData);
