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

    protected function getAssetsPath(): string
    {
        return $this->getBasePath() . '/assets';
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
                $value = trim($value);
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
        $items = array_merge(
            array_unique(array_merge([$this->getAssetsPath() . '/components/MfJs.js'], glob($this->getAssetsPath() . '/components/*.{css,js}', GLOB_BRACE))),
            glob($this->getAssetsPath() . '/elements/*/*.{css,js}', GLOB_BRACE)
        );

        foreach ($items as $item) {
            $docBlock = $this->mfJsParseDocBlock($item);
            if (!empty($docBlock['disabled'])) {
                continue;
            }
            $version = $docBlock['version'] ?? filemtime($item);
            $ext = pathinfo($item, PATHINFO_EXTENSION);
            $item = str_replace([DIRECTORY_SEPARATOR, MODX_BASE_PATH], '/', $item);
            if ($ext == 'css') {
                $out[] = '<link rel="stylesheet" type="text/css" href="..' . $item . '?v=' . $version . '"/>';
            } elseif ($ext == 'js') {
                $out[] = '<script src="..' . $item . '?v=' . $version . '"></script>';
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
                <div id="' . $name . '" class="mfjs"></div>
                <textarea name="tv' . $id . '" rows="10" hidden>' . $value . '</textarea>
                <script>MfJs.render(\'' . $name . '\', ' . $config . ');</script>';
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
