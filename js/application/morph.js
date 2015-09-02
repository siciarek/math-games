
function readImage(img) {
    display = document.getElementById('display');
    display.setAttribute('height', img.height);
    display.setAttribute('width', img.width);
    c = display.getContext('2d');
    c.drawImage(img, 0, 0, img.width, img.height);

    var imgData = c.getImageData(0, 0, img.width, img.height);

    var data = new Uint8ClampedArray(img.width * img.height);
    var emptyImageData = c.createImageData(img.width, img.height);
    emptyImageData.data.set(data);
    c.putImageData(emptyImageData, 0, 0);

    return imgData.data;
}

var interval = null;

var sourceData = [];
var targetData = [];
var imgSource = new Image();
var sourceLoaded = false;
var targetLoaded = false;

imgSource.onload = function () {
    sourceData = readImage(this);
    sourceLoaded = true;
};

var imgTarget = new Image();
imgTarget.onload = function () {
    var temp = readImage(this);
    var ti = 0;

    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {

        }
    }
    targetLoaded = true;
};



$(window).load(function () {
    imgSource.src = 'images/morph/pic1.png';
    imgTarget.src = 'images/morph/pic2.png';

    interval = setInterval(function () {
        if (sourceLoaded === true && targetLoaded === true) {
            clearInterval(interval);
            console.log(sourceData.length);
            console.log(targetData[0]);
        }
    }, 100);
});
 