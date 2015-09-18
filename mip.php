<?php

/**
 * Morphological Image Processing
 * 
 * https://www.cs.auckland.ac.nz/courses/compsci773s1c/lectures/ImageProcessing-html/topic4.htm
 * http://aragorn.pb.bialystok.pl/~boldak/DIP/CPO-W05-v01-50pr.pdf
 * http://ee.lamar.edu/gleb/dip/10-2%20-%20Morphological%20Image%20Processing.pdf
 * http://www.mathworks.com/help/images/ref/strel.html
 * https://en.wikipedia.org/wiki/Mathematical_morphology
 */

require_once __DIR__ . '/mip/miplib.php';

StructuringElelement::$image =<<<IMG
0 1 0
1 2 1
0 1 0
IMG;

$se = new StructuringElelement();

Image::$image =<<<IMG
0 0 0 0 0 0 0
0 0 1 1 0 0 0
0 1 0 0 1 0 0
0 1 0 0 1 0 0
0 0 1 0 1 0 0
0 0 1 0 1 0 0
0 1 0 0 0 1 0
0 1 0 0 0 1 0
0 1 1 1 1 0 0
0 0 0 0 0 0 0
IMG;

$img = new Image();

echo Image::display($img->getData(), 'hole');

echo PHP_EOL;

$cpl = Mip::complement($img);

echo Image::display($img->getComplement()->getData(), 'hole.complement');

echo PHP_EOL;

echo Image::display($se->getData(), 'se');

echo PHP_EOL;

// Hole filling

exit;

$di = Mip::dilation($img, $se);

$diimg = new Image();
$diimg->setData($di);

$results = [
    'support' => Mip::support($img)->getData(),
    'complement' => Mip::complement($img)->getData(),
    'erosion' => Mip::erosion($img, $se),
    'dilation' => Mip::dilation($img, $se),
    'boundary' => Mip::boundary($diimg, $se),
];

foreach ($results as $name => $data) {
    echo Image::display($data, $name);
    echo PHP_EOL;
    echo PHP_EOL;
}

exit;

foreach(range(2, 240) as $radius) {
    $data = drawCircle($radius);
    Image::display($data, sprintf('circle.%03d', $radius));
}

exit;

$starimg = new Image();

$starImage = __DIR__ . '/images/star.png';
$dat = getImageData($starImage);
$starimg->setData($dat);

$b = Mip::boundary($starimg, $se);
Image::display($starimg->getData(), 'star');
Image::display($b, 'star.boundries');

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

            $col = $rgb === 0 ? Image::BACKGROUND : Image::FOREGROUND;
            $srcImgData[$r][$c] = $col;
        }
    }

    imagedestroy($im);

    return $srcImgData;
}

function drawCircle($radius) {
    
    $size = 490; // $radius * 2 - 1;
    $data = [];

    $centerX = intval($size / 2);
    $centerY = intval($size / 2);

    for ($r = 0; $r < $size; $r++) {
        $data[$r] = [];
        for ($c = 0; $c < $size; $c++) {
            $data[$r][$c] = Image::BACKGROUND;
        }
    }
    
    return Image::drawCircle($data, $centerX, $centerY, $radius);
}
