<?php

$file = 'http://www.thonky.com/qr-code-tutorial/character-capacities';
$file = 'table.php.htm';
$file = 'Error Correction Code Words and Block Information - QR Code Tutorial.htm';

$content = file_get_contents($file);

$html = preg_replace('|^.*?(<table[^>]*?>(.*?)</table>).*?$|s', '$1', $content);

/**
 * @var DOMDocument $doc
 * @var DOMElement $row
 * @var DOMElement $cell
 */
$doc = new DOMDocument();
$doc->loadXML($html);

$data = array();

foreach ($doc->getElementsByTagName('tr') as $row) {
    $key = null;
    foreach ($row->childNodes as $cell) {

        if ($cell->localName !== 'td' || empty($cell->textContent)) {
            continue;
        }

        if ($key === null) {
            $key = trim($cell->textContent);
            $data[$key] = array();
            continue;
        }

        $data[$key][] = trim($cell->textContent);
    }
}

echo json_encode($data);

exit;

$version = null;
$ecLevel = null;

$data = array();

$keys = array(
    'numeric', 'alphanumeric', 'byte', 'kanji'
);

foreach ($doc->getElementsByTagName('tr') as $row) {

    $i = 0;

    foreach ($row->childNodes as $cell) {

        if ($cell->hasAttribute('rowspan')) {
            $version = trim($cell->nodeValue);
            $data[$version] = array();
            continue;
        }

        if ($version === null) {
            continue;
        }

        $value = trim($cell->nodeValue);

        if (in_array($value, array('L', 'M', 'H', 'Q',))) {
            $ecLevel = trim($cell->nodeValue);
            $data[$version][$ecLevel] = array();
            continue;
        }

        $data[$version][$ecLevel][$keys[$i++]] = intval($value);
    }
}

echo json_encode($data);