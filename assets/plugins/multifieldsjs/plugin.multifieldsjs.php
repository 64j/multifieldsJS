<?php
/**
 * Plugin multifieldsjs
 *
 * @author 64j
 */

$evo = evolutionCMS();

if ($evo->event->name == 'OnManagerMainFrameHeaderHTMLBlock') {
    if (in_array($evo->getManagerApi()->action, [3, 4, 17, 27, 72])) {
        $out = [];

        $elements = array_unique(array_merge([__DIR__ . '/elements/mfjs'], glob(__DIR__ . '/elements/*', GLOB_ONLYDIR)));

        foreach ($elements as $path) {
            if ($elements_elements = glob($path . '/*.css')) {
                foreach ($elements_elements as $element) {
                    preg_match('/@version\s+(.*?)[\n\r]/is', file_get_contents($element, false, null, 0, 100), $matches);
                    $version = $matches[1] ?? filemtime($element);
                    $element = str_replace([DIRECTORY_SEPARATOR, MODX_BASE_PATH], '/', $element);
                    $out[] = '<link rel="stylesheet" type="text/css" href="..' . $element . '?v=' . $version . '"/>';
                }
            }

            if ($elements_elements = glob($path . '/*.js')) {
                foreach ($elements_elements as $element) {
                    preg_match('/@version\s+(.*?)[\n\r]/is', file_get_contents($element, false, null, 0, 100), $matches);
                    $version = $matches[1] ?? filemtime($element);
                    $element = str_replace([DIRECTORY_SEPARATOR, MODX_BASE_PATH], '/', $element);
                    $out[] = '<script src="..' . $element . '?v=' . $version . '"></script>';
                }
            }
        }

        echo implode("\n", $out);
    }
}
