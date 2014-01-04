<?php
$debug = file_exists(__DIR__ . '/DEBUG');

require_once __DIR__ . '/vendor/autoload.php';

$loader = new Twig_Loader_Filesystem(__DIR__ . '/app/Resources/views');
$twig = new Twig_Environment($loader, array(
    'cache' => $debug ? null : __DIR__ . '/app/cache/prod/twig',
));

$page = '';

if (array_key_exists('REDIRECT_URL', $_SERVER)) {
    $page = $_SERVER['REDIRECT_URL'];
    $page = preg_replace('|math\-games|', '', $page);
    $page = preg_replace('/^\W+/', '', $page);
    $page = preg_replace('|\.html$|', '', $page);
}

$page = empty($page) ? 'index' : $page;

echo $twig->render('default/' . $page . '.html.twig');

?>