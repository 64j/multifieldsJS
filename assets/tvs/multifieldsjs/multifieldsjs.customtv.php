<?php
/**
 * custom tv multifieldsJS
 * @author 64j
 */

if (!defined('MODX_BASE_PATH')) {
    die('HACK???');
}

$id = $row['id'] ?? 0;
$name = $row['name'] ?? $id;
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
<div id="mfjs-' . $id . '" class="mfjs" data-mfjs="' . $id . '"></div>
<textarea name="tv' . $id . '" rows="10" hidden>' . $value . '</textarea>
<script>MfJs.initElement(\'mfjs-' . $id . '\', ' . $config . ');</script>';
