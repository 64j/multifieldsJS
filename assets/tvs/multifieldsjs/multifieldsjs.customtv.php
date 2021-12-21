<?php
/**
 * custom tv multifieldsJS
 * @author 64j
 */

if (!defined('MODX_BASE_PATH')) {
    die('HACK???');
}

$name = $row['name'] ?? ($row['id'] ?? 0);
$value = $row['value'] ?? '';
$config = MODX_BASE_PATH . 'assets/plugins/multifieldsjs/config/' . $name;

if (is_file($config . '.php')) {
    $config = require $config . '.php';
    $config = json_encode($config, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
} elseif (is_file($config . '.json')) {
    $config = file_get_contents($config . '.json');
} else {
    $config = '{}';
}

echo '
<div id="mfjs-' . $name . '" class="mfjs" data-mfjs="' . $name . '"></div>
<textarea name="tv' . $name . '" rows="10" hidden>' . $value . '</textarea>
<script>MfJs.initElement(\'mfjs-' . $name . '\', ' . $config . ');</script>';
