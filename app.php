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

if(empty($page)) {
    $page = 'default/index';
}
elseif(in_array($page, array('index', 'references'))) {
    $page = 'default/' . $page;
}
else {
    $page = 'application/' . $page;
}

echo $twig->render($page . '.html.twig');

?>