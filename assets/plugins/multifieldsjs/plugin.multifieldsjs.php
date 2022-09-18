<?php
/**
 * Plugin multifieldsjs
 *
 * @author 64j
 */

if (!defined('MODX_BASE_PATH')) {
    die('HACK???');
}

spl_autoload_register(function ($class) {
    if (file_exists($file = __DIR__ . '/src/' . $class . '.php')) {
        require_once $file;
    }
});

$evo = evolutionCMS();

if ($evo->event->name == 'OnManagerMainFrameHeaderHTMLBlock') {
    if (in_array($evo->getManagerApi()->action, [3, 4, 17, 27, 72])) {
        $evo->event->addOutput(MfJsBack::getInstance()->render());
    }
}
