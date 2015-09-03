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
$srcImage = __DIR__ . '/images/morph/pic3.png';
$trgImage = __DIR__ . '/images/morph/pic2.png';

$morphDir = __DIR__ . '/morph/';

array_map('unlink', glob("$morphDir/*"));
sleep(3);

$info = getimagesize($srcImage);
$width = array_shift($info);
$height = array_shift($info);

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

function getLine($xA, $yA, $xB, $yB) {
    $a = ($yA - $yB) / ($xA - $xB);
    $b = $yA - $a * $xA;

    return [$a, $b];
}

function getPerpen($P, $Q, $X) {

    list($a, $b) = getLine($P[0], $P[1], $Q[0], $Q[1]);

    $pa = - (1 / $a);
    $pb = - ($X[0] * $pa - $X[1]);

    $x = ($pb - $b) / ($a - $pa);
    $y = $a * $T[0] + $b;

    return [$x, $y];
}

$T = getPerpen($P, $Q, $X);
$R = getPerpen($P_, $Q_, $X_);


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


$srcImgData = [];
$im = imagecreatefrompng($srcImage);
for ($r = 0; $r < $height; $r++) {
    $srcImgData[$r] = [];
    for ($c = 0; $c < $width; $c++) {
        $rgb = imagecolorat($im, $c, $r);
        $color = [
            ($rgb >> 16) & 0xFF,
            ($rgb >> 8) & 0xFF,
            $rgb & 0xFF,
        ];
        $srcImgData[$r][$c] = $color;
    }
}
imagedestroy($im);

$trgImgData = [];
$im = imagecreatefrompng($trgImage);
for ($r = 0; $r < $height; $r++) {
    $trgImgData[$r] = [];
    for ($c = 0; $c < $width; $c++) {
        $rgb = imagecolorat($im, $c, $r);
        $color = [
            ($rgb >> 16) & 0xFF,
            ($rgb >> 8) & 0xFF,
            $rgb & 0xFF,
        ];
        $trgImgData[$r][$c] = $color;
    }
}
imagedestroy($im);

function U($r, $c) {
    global $Pt, $Qt;
    $X = [$r, $c];
    $u = $r;

    /*
      ($X - $Pt)($Qt - $Pt)
      $u = ---------------------
      || $Qt - $Pt ||^2
     */

    return $u;
}

function V($r, $c) {
    global $Pt, $Qt;
    $X = [$r, $c];

    $v = $c;
    /*
      ($X - $Pt)Perp($Qt - $Pt)
      $v = ---------------------
      || $Qt - $Pt ||
     */
    return $v;
}

for ($r = 0; $r < $height; $r++) {
    for ($c = 0; $c < $width; $c++) {

        $u = U($r, $c);
        $v = V($r, $c);

        $resultImgData[$r][$c] = $srcImgData[$u][$v][0] << 16 | $srcImgData[$u][$v][1] << 8 | $srcImgData[$u][$v][2];

//              ($srcImgData[$r][$c][0] + $t * ($trgImgData[$r][$c][0] - $srcImgData[$r][$c][0])) << 16  // R
//            | ($srcImgData[$r][$c][1] + $t * ($trgImgData[$r][$c][1] - $srcImgData[$r][$c][1])) << 8   // G
//            | ($srcImgData[$r][$c][2] + $t * ($trgImgData[$r][$c][2] - $srcImgData[$r][$c][2]));       // B
    }
}

// Create image:
$i = 1;
$im = @imagecreatetruecolor($width, $height);

$filename = $morphDir . sprintf('%02d', $i++) . '.png';

for ($r = 0; $r < $height; $r++) {
    for ($c = 0; $c < $width; $c++) {
        imagesetpixel($im, $c, $r, $resultImgData[$r][$c]);
    }
}

imagepng($im, $filename);
imagedestroy($im);




$resfname = $morphDir . '/res.01.png';
$im = imagecreatefrompng($srcImage);
$color = 0x0000FF;

imageline($im, $P[0], $P[1], $Q[0], $Q[1], 0x00FF00);
// imageline($im, $Pt[0], $Pt[1], $Qt[0], $Qt[1], $color);
imageline($im, $P_[0], $P_[1], $Q_[0], $Q_[1], 0x00FF00);

imagesetpixel($im, $X[0], $X[1], 0x00FF00);

imageline($im, $X[0], $X[1], $T[0], $T[1], 0x00FF00);
imageline($im, $X_[0], $X_[1], $R[0], $R[1], $color);

imagepng($im, $resfname);
imagedestroy($im);
