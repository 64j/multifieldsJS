<?php

class MfJsFront
{
    /**
     * @var null|MfJsFront
     */
    private static $instance = null;

    /**
     * @return static
     */
    public static function getInstance(): ?MfJsFront
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
     * @param array $params
     * @return string
     */
    public function render(array $params): string
    {
        $tvName = $params['tvName'] ?? null;
        $tv = evolutionCMS()->documentObject[$tvName] ?? null;
        $api = $params['api'] ?? null;

        if (is_null($tv)) {
            return '';
        }

        switch ($api) {
            case '1':
            case 'json':
                return $tv[1];

            default:
                return $this->renderData(json_decode($tv[1] ?: '{}', true), $this->getConfig($tvName));
        }
    }

    /**
     * @param array $data
     * @param array $config
     * @return string
     */
    protected function renderData(array $data, array $config): string
    {
        print_r($data);
        print_r($config);
        exit;
    }

    /**
     * @param string $name
     * @return array|null
     */
    protected function getConfig(string $name): array
    {
        $configName = $this->getBasePath() . '/config/' . $name;

        if (is_file($file = $configName . '.php')) {
            $config = require $file;
        } elseif (is_file($file = $configName . '.json')) {
            $config = json_decode(file_get_contents($file), true);
        }

        return $config ?? [];
    }
}
