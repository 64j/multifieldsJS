<?php

class MfJsBack
{
    /**
     * @var null|MfJsBack
     */
    private static $instance = null;

    /**
     * @return static
     */
    public static function getInstance(): ?MfJsBack
    {
        if (is_null(self::$instance)) {
            self::$instance = new static();
        }

        return self::$instance;
    }

    /**
     * @return string
     */
    protected function getBasePath(): string
    {
        return dirname(__DIR__);
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
     * @return string
     */
    public function render(): string
    {
        $out = [];
        $elements = array_unique(array_merge([$this->getBasePath() . '/elements/mfjs'], glob($this->getBasePath() . '/elements/*', GLOB_ONLYDIR)));

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

        return implode("\n", $out);
    }

    /**
     * @param array $row
     * @return string
     */
    public function renderCustomTv(array $row): string
    {
        $id = $row['id'] ?? 0;
        $name = $row['name'] ?? $id;
        $value = $row['value'] ?? '';

        if (!$id) {
            return '';
        }

        if ($config = $this->getConfig($name)) {
            return '
                <div id="mfjs-' . $id . '" class="mfjs" data-mfjs="' . $id . '"></div>
                <textarea name="tv' . $id . '" rows="10" hidden>' . $value . '</textarea>
                <script>MfJs.initElement(\'mfjs-' . $id . '\', ' . $config . ');</script>';
        } else {
            return 'Config not found for tv: <strong>' . $name . '</strong>';
        }
    }

    /**
     * @param string $name
     * @return string|null
     */
    protected function getConfig(string $name): ?string
    {
        $configName = $this->getBasePath() . '/config/' . $name;

        if (is_file($file = $configName . '.php')) {
            $config = require $file;

            return json_encode($config, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
        } elseif (is_file($file = $configName . '.json')) {
            return file_get_contents($file);
        }

        return null;
    }
}
