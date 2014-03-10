<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>QRCode Model 2</title>
</head>

<body>
<?php
    $params['blocksize'] = 6;

    $params['message'] = 'http://pl.m.wikipedia.org';
//    $params['message'] = '603173114';

    $params = array_merge($params, $_GET);
    $size = $params['blocksize'] * ((2 - 1) * 4 + 21 + (2 * 4));
?>

<h1><?php echo $params['message'] ?></h1>

<?php foreach(array('L', 'M') as $ecl):?>
<h3><?php echo $ecl ?></h3>

<?php
$params['mask'] = -1;
$params['ecclevel'] = $ecl;
$pstring = http_build_query($params);
?>
<iframe frameborder="0" width="<?php echo $size ?>" height="<?php echo $size ?>" src="qrcode.svg?<?php echo $pstring; ?>"></iframe>

<?php foreach([0, 1, 2, 3, 4, 5, 6, 7, 'X'] as $mask):
    $params['mask'] = $mask;
    $pstring = http_build_query($params);
?>
     <iframe frameborder="0" width="<?php echo $size ?>" height="<?php echo $size ?>" src="qrcode.svg?<?php echo $pstring; ?>"></iframe>
<?php endforeach;?>

<?php endforeach;?>

</body>
</html>