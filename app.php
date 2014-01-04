<?php
$debug = file_exists(__DIR__ . '/DEBUG');

require_once __DIR__ . '/vendor/autoload.php';

$loader = new Twig_Loader_Filesystem(__DIR__ . '/app/Resources/views');
$twig = new Twig_Environment($loader, array(
    'cache' => $debug ? null : __DIR__ . '/app/cache/prod/twig',
));

$page = 'index';

if (array_key_exists('REDIRECT_URL', $_SERVER)) {
    $page = preg_replace('/^\W/', '', $_SERVER['REDIRECT_URL']);
    $page = preg_replace('|\.html$|', '', $page);
}

echo $twig->render('default/' . $page . '.html.twig');

?>