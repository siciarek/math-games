<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>QRCode Model 2</title>
</head>

<body>
<?php
    $params['blocksize'] = 4;
    $params['version'] = 1;
    $params = array_merge($params, $_GET);
    $size = $params['blocksize'] * (($params['version'] - 1) * 4 + 21 + (2 * 4));
?>
<?php
$params['mask'] = -1;
$pstring = http_build_query($params);
?>
<iframe frameborder="0" width="<?php echo $size ?>" height="<?php echo $size ?>" src="qrcode.svg?<?php echo $pstring; ?>"></iframe>

<br/>

<?php foreach(range(0, 7) as $mask):
    $params['mask'] = $mask;
    $pstring = http_build_query($params);
?>
    <?php echo ($mask > 0 and $mask % 4 === 0) ? '<br/>' : '' ?>
    <iframe frameborder="0" width="<?php echo $size ?>" height="<?php echo $size ?>" src="qrcode.svg?<?php echo $pstring; ?>"></iframe>
<?php endforeach;?>

</body>
</html>