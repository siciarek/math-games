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

    $params['message'] = 'HELLO WORLD';

    $params = array_merge($params, $_GET);
    $size = $params['blocksize'] * ((2 - 1) * 4 + 21 + (2 * 4));
?>

<h1><?php echo $params['message'] ?></h1>

<?php foreach(array('Q') as $ecl):?>
<h3><?php echo $ecl ?></h3>

<?php
$params['mask'] = 'X';
$params['eclevel'] = $ecl;
$pstring = http_build_query($params, null, '&', PHP_QUERY_RFC3986);
?>

<iframe frameborder="0" width="<?php echo $size ?>" height="<?php echo $size ?>" src="qrcode.svg?<?php echo $pstring; ?>"></iframe>

<?php foreach([0, 1, 2, 3, 4, 5, 6, 7] as $mask):
    $params['mask'] = $mask;
    $pstring = http_build_query($params, null, '&', PHP_QUERY_RFC3986);
?>
     <iframe frameborder="0" width="<?php echo $size ?>" height="<?php echo $size ?>" src="qrcode.svg?<?php echo $pstring; ?>"></iframe>
<?php endforeach;?>

<?php endforeach;?>

</body>
</html>