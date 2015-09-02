<?php
/**
 * Documents:
 * http://www.cs.toronto.edu/~mangas/teaching/320/slides/CSC320T12.pdf
 * http://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/99/pub/www/notes/warp.pdf
 */

$srcImage = __DIR__ . '/images/morph/pic2.png';
$trgImage = __DIR__ . '/images/morph/pic3.png';

$info = getimagesize($srcImage);
$width = array_shift($info);
$height = array_shift($info);

//$P = [240, 160];
//$Q = [243, 224];
//
//$im = imagecreatefrompng($srcImage);
//header('Content-Type: image/png');
//$color = 0x0000FF;
//imageline($im, $P[0], $P[1], $Q[0], $Q[1], $color);
//imagepng($im);
//imagedestroy($im);
//
//exit;


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

$parts = 11;

$step = 1 / $parts;

$i = 1;

$morphDir = __DIR__ . '/morph/';

array_map('unlink', glob("$morphDir/*"));

for ($dfrac = 0; $dfrac < 2; $dfrac += $step) {

    if($dfrac > 1) {
        $dfrac = 1;
    }

// Method: cross-dissolve 

// http://www.cs.toronto.edu/~mangas/teaching/320/slides/CSC320T12.pdf
// http://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/99/pub/www/notes/warp.pdf

//for y = ymin to ymax
//for x = xmin to xmax
//temp[x,y].r = picA[x,y].r + dfrac*(picB[x,y].r-picA[x,y].r)
//temp[x,y].g = picA[x,y].g + dfrac*(picB[x,y].g-picA[x,y].g)
//temp[x,y].b = picA[x,y].b + dfrac*(picB[x,y].b-picA[x,y].b)

    for ($r = 0; $r < $height; $r++) {
        for ($c = 0; $c < $width; $c++) {
            $resultImgData[$r][$c] =
                  ($srcImgData[$r][$c][0] + $dfrac * ($trgImgData[$r][$c][0] - $srcImgData[$r][$c][0])) << 16  // R
                | ($srcImgData[$r][$c][1] + $dfrac * ($trgImgData[$r][$c][1] - $srcImgData[$r][$c][1])) << 8   // G
                | ($srcImgData[$r][$c][2] + $dfrac * ($trgImgData[$r][$c][2] - $srcImgData[$r][$c][2]));       // B
        }
    }

// Create image:

    $im = @imagecreatetruecolor($width, $height);

    $filename = $morphDir . sprintf('%02d', $i++) . '.png';

    for ($r = 0; $r < $height; $r++) {
        for ($c = 0; $c < $width; $c++) {
            imagesetpixel($im, $c, $r, $resultImgData[$r][$c]);
        }
    }

    imagepng($im, $filename);
    imagedestroy($im);
    var_dump($filename, $dfrac);
    
    if($dfrac === 1) {
        break;
    }
}
