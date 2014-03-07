<?php

$url_fmt = 'http://www.thonky.com/qr-code-tutorial/generator-polynomial-tool/?degree=%d';

$output = array();

foreach(range(7, 100) as $degree) {
    $url = sprintf($url_fmt, $degree);
    $content = file_get_contents($url);
    $pn = preg_replace('|.*?(<em>.*?</em>).*|s', '$1', $content);
    $pn = strip_tags($pn);
    $pn = preg_replace('/\+\s*x/', '+ &alpha;0x', $pn);
    $pn = str_replace('&alpha;x', '&alpha;1x', $pn);
    $pn = str_replace('&alpha;', '', $pn);
    $pn = str_replace(' ', '', $pn);
    $pn = preg_replace('|x\d*|s', '', $pn);
    $pna = explode('+', $pn);
    $pna = array_map('intval', $pna);
    
    echo sprintf("    %d: %s,\n", $degree, json_encode($pna));
}




