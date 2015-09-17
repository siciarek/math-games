<?php

/**
 * Morphological Image Processing
 * 
 * https://www.cs.auckland.ac.nz/courses/compsci773s1c/lectures/ImageProcessing-html/topic4.htm
 * http://aragorn.pb.bialystok.pl/~boldak/DIP/CPO-W05-v01-50pr.pdf
 * http://ee.lamar.edu/gleb/dip/10-2%20-%20Morphological%20Image%20Processing.pdf
 */
//StructuringElelement::$image = <<<SE
//0 1 0
//1 2 1
//0 1 0 
//SE;

$se = new StructuringElelement();
$img = new Image();

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
    echo $img::display($data, $name);
    echo PHP_EOL;
    echo PHP_EOL;
}

class Mip {

    public static function boundary(Image $image, StructuringElelement $se) {

        $base = $image->getData();
        $erosion = self::erosion($image, $se);
        $result = self::diff($base, $erosion);

        return $result;
    }
    
    public static function diff($first, $second) {
        $result = [];
        
        for ($y = 0; $y < count($first); $y++) {
            $result[$y] = [];
            for ($x = 0; $x < count($first[0]); $x++) {
                $result[$y][$x] = $first[$y][$x] != $second[$y][$x] ? Image::FOREGROUND : Image::BACKGROUND;
            }
        }        
        
        return $result;
    }

    public static function mul($first, $second) {
        $result = [];
        
        for ($y = 0; $y < count($first); $y++) {
            $result[$y] = [];
            for ($x = 0; $x < count($first[0]); $x++) {
                $result[$y][$x] = ($first[$y][$x] === Image::FOREGROUND AND $second[$y][$x] === Image::FOREGROUND) ? Image::FOREGROUND : Image::BACKGROUND;
            }
        }        
        
        return $result;
    }
    
    public static function add($first, $second) {
        $result = [];
        
        for ($y = 0; $y < count($first); $y++) {
            $result[$y] = [];
            for ($x = 0; $x < count($first[0]); $x++) {
                $result[$y][$x] = ($first[$y][$x] === Image::FOREGROUND OR $second[$y][$x] === Image::FOREGROUND) ? Image::FOREGROUND : Image::BACKGROUND;
            }
        }        
        
        return $result;
    }

    public static function support(Image $image) {
        return $image->getSupport();
    }

    public static function complement(Image $image) {
        return $image->getComplement();
    }

    public static function erosion(Image $image, StructuringElelement $se) {
        return $se->erosion($image);
    }

    public static function dilation(Image $image, StructuringElelement $se) {
        return $se->dilation($image);
    }
}

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

    public function setData(array $data) {
        $this->data = $data;
    }
    
    public static function display($data, $name = null, $save = true) {
        $temp = [];

        $height = count($data);
        $width = count($data[0]);

        foreach ($data as $row) {
            $temp[] = implode(' ', $row);
        }

        if ($name !== null and $save === true) {

            $filename = __DIR__ . '/mip/' . $name . '.png';
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

    public function getSupport() {
        return new Image(self::$image);
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

    public static $image = <<<SE
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

    public function __construct($image = null) {

        $se = [];

        $temp = explode("\n", $image === null ? self::$image : $image);

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
