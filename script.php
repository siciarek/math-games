<?php
$db_host = 'ant';
$db_user = 'root';
$db_pass = 'a9a965421d0bac23f261b834ed5ddd6c';
$db_name = 'sescom_production';

$link = mysql_connect($db_host, $db_user, $db_pass);
$err = mysql_error();

if (!empty($err)) {
    throw new \Exception($err);
}

@mysql_select_db($db_name, $link);

$err = mysql_error($link);

if (!empty($err)) {
    throw new \Exception($err);
}

$query = 'SHOW TABLES';


function db_connect($db_host, $db_user, $db_pass, $db_name)
{
    $link = mysql_connect($db_host, $db_user, $db_pass);
    $err = mysql_error();

    if (!empty($err)) {
        throw new \Exception($err);
    }

    @mysql_select_db($db_name, $link);

    $err = mysql_error($link);

    if (!empty($err)) {
        throw new \Exception($err);
    }

    mysql_query("set names 'utf8'");
    mysql_query("SET CHARACTER_SET 'utf8_unicode_ci'");

    return $link;
}

