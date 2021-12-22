<?php
/**
 * Plugin multifieldsjs
 *
 * @author 64j
 */

spl_autoload_register(function ($class) {
    if (file_exists($file = __DIR__ . '/src/' . $class . '.php')) {
        require_once $file;
    }
});

$evo = evolutionCMS();

switch ($evo->event->name) {
    case 'OnManagerMainFrameHeaderHTMLBlock':
        if (in_array($evo->getManagerApi()->action, [3, 4, 17, 27, 72])) {
            $evo->event->addOutput(MfJsBack::getInstance()
                ->render());
        }
        break;

    case 'OnWebPageInit':
        MfJsFront::getInstance();
        break;
}
