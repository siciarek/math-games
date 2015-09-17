<?php

/**
 * Morphological Image Processing
 * 
 * https://www.cs.auckland.ac.nz/courses/compsci773s1c/lectures/ImageProcessing-html/topic4.htm
 */
$se = new StructuringElelement();
$img = new Image();

$base = $img->getData();
$complement = $img->getComplement()->getData();
$erosion = $se->erosion($img);
$dilation = $se->dilation($img);

echo $img::display($base, 'base') . PHP_EOL;
echo PHP_EOL;
echo $img::display($complement, 'complement') . PHP_EOL;
echo PHP_EOL;
echo $img::display($erosion, 'erosion') . PHP_EOL;
echo PHP_EOL;
echo $img::display($dilation, 'dilation') . PHP_EOL;

class Image {

    public static $image = <<<IMG
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 1 1 1 0 0 0 0 0 0 0 0 0 0
0 0 1 1 1 1 1 0 0 0 0 0 0 0 0 0
0 0 1 1 1 1 1 0 0 0 0 1 1 1 0 0
0 0 1 1 1 1 0 0 0 0 1 1 1 1 0 0
0 0 0 1 1 0 0 0 0 1 1 1 1 1 0 0
0 0 0 0 0 0 0 0 1 1 1 1 1 0 0 0
0 0 0 0 0 0 0 1 1 1 1 1 0 0 0 0
0 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0
0 0 0 0 0 1 1 1 1 1 0 0 0 0 0 0
0 0 0 0 1 1 1 1 1 0 0 0 0 0 0 0
0 0 0 0 1 1 1 1 1 1 1 1 0 0 0 0
0 0 0 0 1 1 1 1 1 1 1 1 0 0 0 0
0 0 0 0 0 1 1 1 1 1 1 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
IMG;

    const FOREGROUND = 1;
    const BACKGROUND = 0;

    protected $data = [];

    public function __construct($image = null) {
        $data = [];

        $temp = explode("\n", $image === null ? self::$image : $image);

        foreach ($temp as $row) {
            $row = trim($row);
            $line = explode(' ', $row);
            $line = array_map('trim', $line);

            $this->data[] = $line;
        }
    }

    public static function display($data, $name = null, $save = true) {
        $temp = [];

        $height = count($data);
        $width = count($data[0]);

        foreach ($data as $row) {
            $temp[] = implode(' ', $row);
        }

        if ($name !== null and $save === true) {

            $filename = $name . '.png';
            $im = @imagecreatetruecolor($width, $height);

            for ($r = 0; $r < $height; $r++) {
                for ($c = 0; $c < $width; $c++) {
                    imagesetpixel($im, $c, $r, $data[$r][$c] ? 0xFFFFFF : 0x000000);
                }
            }

            imagepng($im, $filename);
            imagedestroy($im);

            array_unshift($temp, sprintf("%s:", $name));
        }

        return implode("\n", $temp);
    }

    public function getComplement() {
        $cimage = self::$image;
        $cimage = preg_replace('/0/', 'X', $cimage);
        $cimage = preg_replace('/1/', '0', $cimage);
        $cimage = preg_replace('/X/', '1', $cimage);
        
        return new Image($cimage);
    }
    
    public function getData() {
        return $this->data;
    }

    public function getWidth() {
        return count($this->data[0]);
    }

    public function getHeight() {
        return count($this->data);
    }

    public function getValueAt($x, $y) {

        // Out of image boundries:
        if (!($y > 0 AND $x > 0 AND $x < $this->getWidth() - 1 AND $y < $this->getHeight() - 1)) {
            return self::BACKGROUND;
        }

        return $this->data[$y][$x];
    }

}

class StructuringElelement {

    public static $structuringElement = <<<SE
1 1 1
1 2 1
1 1 1 
SE;
    protected $offsets = [];
    protected $origin = [ 'x' => null, 'y' => null];

    public function erosion(Image $image) {
        $result = $image->getData();

        for ($y = 0; $y < $image->getHeight(); $y++) {
            for ($x = 0; $x < $image->getWidth(); $x++) {
                $result[$y][$x] = $this->fit($x, $y, $image) ? Image::FOREGROUND : Image::BACKGROUND;
            }
        }

        return $result;
    }

    public function dilation(Image $image) {

        $result = $image->getData();

        for ($y = 0; $y < $image->getHeight(); $y++) {
            for ($x = 0; $x < $image->getWidth(); $x++) {
                $result[$y][$x] = $this->hit($x, $y, $image) ? Image::FOREGROUND : Image::BACKGROUND;
            }
        }

        return $result;
    }

    public function __construct() {

        $se = [];

        $temp = explode("\n", self::$structuringElement);

        foreach ($temp as $row) {
            $row = trim($row);
            $line = explode(' ', $row);
            $line = array_map('trim', $line);

            $se[] = $line;
        }

        for ($y = 0; $y < count($se); $y++) {
            for ($x = 0; $x < count($se[0]); $x++) {
                if ($se[$y][$x] > 1) {
                    $this->origin['x'] = $x;
                    $this->origin['y'] = $y;
                    break;
                }
            }

            if ($this->origin['x'] !== null) {
                break;
            }
        }

        for ($y = 0; $y < count($se); $y++) {
            for ($x = 0; $x < count($se[0]); $x++) {
                if ($se[$y][$x] > 0) {
                    $this->offsets[] = [
                        $this->origin['x'] - $x,
                        $this->origin['y'] - $y,
                    ];
                }
            }
        }
    }

    public function fit($x, $y, Image $image) {
        $result = true;

        foreach ($this->offsets as $o) {
            $nx = $x + $o[0];
            $ny = $y + $o[1];

            if ($image->getValueAt($nx, $ny) == 0) {
                $result = false;
                break;
            }
        }

        return $result;
    }

    public function hit($x, $y, Image $image) {
        $result = false;

        foreach ($this->offsets as $o) {
            $nx = $x + $o[0];
            $ny = $y + $o[1];

            if ($image->getValueAt($nx, $ny) == 1) {
                $result = true;
                break;
            }
        }

        return $result;
    }

    public function getOffsets() {
        return $this->offsets;
    }

    public function getOrigin() {
        return $this->origin;
    }

}
