<?php
/**
 * Documents:
 * http://www.cs.toronto.edu/~mangas/teaching/320/slides/CSC320T12.pdf
 * http://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/99/pub/www/notes/warp.pdf
 * http://graphics.cs.cmu.edu/courses/15-463/2011_fall/Lectures/morphing.pdf
 */

$srcImage = __DIR__ . '/images/morph/pic3.png';
$trgImage = __DIR__ . '/images/morph/pic2.png';

$morphDir = __DIR__ . '/morph/';

array_map('unlink', glob("$morphDir/*"));

$info = getimagesize($srcImage);
$width = array_shift($info);
$height = array_shift($info);

$P = [180, 40];
$Q = [140, 110];

$filename = $morphDir . '/src.01.png';
$im = imagecreatefrompng($srcImage);
$color = 0x0000FF;
imageline($im, $P[0], $P[1], $Q[0], $Q[1], $color);
imagepng($im, $filename);
imagedestroy($im);

$P_ = [195, 67];
$Q_ = [145, 145];

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

$parts = 11;

$step = 1 / $parts;

$i = 1;

$dfrac = 0.5;
$t = $dfrac;

$P = [100, 100];
$Q = [100, 200];

$P_ = [200, 100];
$Q_ = [200, 200];

$Pt = [(1 - $t) * $P[0] + $t * $P_[0], (1 - $t) * $P[1] + $t * $P_[1]];
$Qt = [(1 - $t) * $Q[0] + $t * $Q_[0], (1 - $t) * $Q[1] + $t * $Q_[1]];

$p00 = $P;
$p10 = $P_;
$p01 = $Q;
$p11 = $Q_;

//print_r([$p00, $p01, $p01, $p11]);exit;

for ($r = 0; $r < $height; $r++) {
    for ($c = 0; $c < $width; $c++) {
        $x = $c;
        $y = $r;
         
// px0 = p00 + x*(p10-p00)
   $px0 = [$p00[0] + $x * ($p10[0] - $p00[0]), $p00[1] + $x * ($p10[1] - $p00[1])];
// px1 = p01 + x*(p11-p01)
   $px1 = [$p01[0] + $x * ($p11[0] - $p01[0]), $p01[1] + $x * ($p11[1] - $p01[1])];
// pxy = px0 + y*(px1-px0)                
   $pxy = [$px0[0] + $y * ($px1[0] - $px0[0]), $px0[1] + $y * ($px1[1] - $px0[1])];
      
        
        $nr = $r;
        $nc = $c;
        
        if($x > 100 and $x < 200 and $y > 100 and $y < 200) {
            $nr = $pxy[1];
            $nc = $pxy[0];
            
            print_r([$nc, $nr]);
        }

        $resultImgData[$r][$c] = $srcImgData[$nr][$nc][0] << 16 | $srcImgData[$nr][$nc][1] << 8 | $srcImgData[$nr][$nc][2];
                
//              ($srcImgData[$r][$c][0] + $dfrac * ($trgImgData[$r][$c][0] - $srcImgData[$r][$c][0])) << 16  // R
//            | ($srcImgData[$r][$c][1] + $dfrac * ($trgImgData[$r][$c][1] - $srcImgData[$r][$c][1])) << 8   // G
//            | ($srcImgData[$r][$c][2] + $dfrac * ($trgImgData[$r][$c][2] - $srcImgData[$r][$c][2]));       // B
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

exit;


$resfname = $morphDir . '/res.01.png';
$im = imagecreatefrompng($srcImage);
$color = 0x0000FF;

imageline($im, $P[0], $P[1], $Q[0], $Q[1], 0x00FF00);
imageline($im, $P_[0], $P_[1], $Q_[0], $Q_[1], 0x00FF00);

imageline($im, $Pt[0], $Pt[1], $Qt[0], $Qt[1], $color);
imagepng($im, $resfname);
imagedestroy($im);
