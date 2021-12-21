<?php

class MfJsBack
{
    /**
     * @var string
     */
    protected $basePath;

    /**
     * @param string $basePath
     */
    public function __construct(string $basePath)
    {
        $this->basePath = $basePath;
    }

    /**
     * @param string $filename
     * @return array
     */
    protected function mfJsParseDocBlock(string $filename): array
    {
        if (
            is_file($filename)
            && preg_match_all(
                '/@(\w+)\s+(.*)\r?\n/m',
                file_get_contents($filename, false, null, 0, 200),
                $matches
            )
        ) {
            return array_map(function ($value) {
                switch (true) {
                    case is_numeric($value):
                        return is_float($value + 0) ? (float) $value : (int) $value;
                    case $value === 'true':
                        return true;
                    case $value === 'false':
                        return false;
                    default:
                        return (string) $value;
                }
            }, array_combine($matches[1], $matches[2]));
        }

        return [];
    }

    /**
     *
     */
    public function render()
    {
        $out = [];
        $elements = array_unique(array_merge([$this->basePath . '/elements/mfjs'], glob($this->basePath . '/elements/*', GLOB_ONLYDIR)));

        foreach ($elements as $path) {
            if ($elements_elements = glob($path . '/*.{css,js}', GLOB_BRACE)) {
                foreach ($elements_elements as $element) {
                    $docBlock = $this->mfJsParseDocBlock($element);
                    if (!empty($docBlock['disabled'])) {
                        continue;
                    }
                    $version = $docBlock['version'] ?? filemtime($element);
                    $ext = pathinfo($element, PATHINFO_EXTENSION);
                    $element = str_replace([DIRECTORY_SEPARATOR, MODX_BASE_PATH], '/', $element);
                    if ($ext == 'css') {
                        $out[] = '<link rel="stylesheet" type="text/css" href="..' . $element . '?v=' . $version . '"/>';
                    } elseif ($ext == 'js') {
                        $out[] = '<script src="..' . $element . '?v=' . $version . '"></script>';
                    }
                }
            }
        }

        echo implode("\n", $out);
    }
}