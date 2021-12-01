<?php
/**
 * Plugin multifieldsjs
 * @author 64j
 */

/** @var DocumentParser $modx */
$e = &$modx->event;

switch ($e->name) {
    case 'OnManagerMainFrameHeaderHTMLBlock':
        if (in_array($modx->manager->action, [3, 4, 17, 27, 72])) {
            $out = [
                '<link rel="stylesheet" type="text/css" href="/assets/plugins/multifieldsjs/elements/mfjs/mfjs.css"/>',
                '<script>!window.Sortable && document.write(decodeURIComponent(\'' . rawurlencode('<script src="/assets/plugins/multifieldsjs/elements/mfjs/Sortable.min.js"></script>') . '\'));</script>',
                '<script src="/assets/plugins/multifieldsjs/elements/mfjs/mfjs.js"></script>',
                '<script>MfJs.options = {dir: \'/assets/plugins/multifieldsjs\'};</script>'
            ];

            if ($elements = glob(__DIR__ . '/elements/*', GLOB_ONLYDIR)) {
                foreach ($elements as $path) {
                    if (basename($path) == 'mfjs') {
                        continue;
                    }

                    if ($elements_elements = glob($path . '/*.css')) {
                        foreach ($elements_elements as $element) {
                            $filemtime = filemtime($element);
                            $filemtime = 1;
                            $element = str_replace([DIRECTORY_SEPARATOR, MODX_BASE_PATH], '/', $element);
                            $out[] = '<link rel="stylesheet" type="text/css" href="' . $element . '?v=' . $filemtime . '"/>';
                        }
                    }

                    if ($elements_elements = glob($path . '/*.js')) {
                        foreach ($elements_elements as $element) {
                            $filemtime = filemtime($element);
                            $filemtime = 1;
                            $element = str_replace([DIRECTORY_SEPARATOR, MODX_BASE_PATH], '/', $element);
                            $out[] = '<script src="' . $element . '?v=' . $filemtime . '"></script>';
                        }
                    }
                }
            }

            echo implode("\n", $out);
        }
        break;
}
