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
    if (in_array($evo->getManagerApi()->action, [2, 3, 4, 17, 27, 72])) {
        $data = MfJsBack::getInstance()
            ->render();

        if (isset($_REQUEST['mfjs-action'])) {
            echo $data . '</head><body></body></html>';
            exit;
        } else {
            $evo->event->addOutput($data);
        }
    }
}

if ($evo->event->name = 'OnManagerFrameLoader') {
    //MfJsBack::getInstance()->managerPageInit();
}
