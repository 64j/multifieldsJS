<?php

class MfJsFront
{
    /**
     * @var null|MfJsFront
     */
    private static $instance = null;

    /**
     * @var array
     */
    protected $params = [];

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
        $this->params = $params;
        $tvName = $this->params['tvName'] ?? null;
        $tv = evolutionCMS()->documentObject[$tvName] ?? null;
        $api = $this->params['api'] ?? null;

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
     * @param string $tplKey
     * @return string
     */
    protected function renderData(array $data, array $config, string $tplKey = ''): string
    {
        $out = '';
        foreach ($data as $item) {
            $item['tpl'] = $config[$item['name']]['tpl'] ?? ($this->params['tpl_' . $tplKey . $item['name']] ?? '@CODE:[+value+]');

            if (isset($item['items'])) {
                $item['items'] = $this->renderData($item['items'], $config[$item['name']]['items'] ?? [], $tplKey . $item['name'] . '_');
            }

            $out .= $this->tpl($item['tpl'], $item);
        }

        return $out;
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

        return $config['templates'] ?? [];
    }

    /**
     * @param null $tpl
     * @param array $plh
     * @return string
     */
    protected function tpl($tpl = null, array $plh = []): string
    {
        $evo = evolutionCMS();

        if (empty($tpl)) {
            if (isset($plh['mf.items'])) {
                $tpl = '@CODE:[+mf.items+]';
            } else {
                $tpl = '@CODE:[+value+]';
            }
        }

        return class_exists('DLTemplate') ? DLTemplate::getInstance($evo)
            ->parseChunk($tpl, $plh, false, true) : $evo->parseText($evo->getTpl($tpl), $plh);
    }

    /**
     * @param string $name
     * @param array $data
     * @return void
     */
    protected function prepare(string $name = 'prepare', array &$data = [])
    {
        if (!empty($name)) {
            $evo = evolutionCMS();

            $args = [
                'name' => $name,
                'params' => [
                    'data' => $data,
                    'modx' => $evo,
                    '_MFJS' => $this
                ]
            ];

            if ((is_object($name)) || is_callable($name)) {
                $data = call_user_func_array(...$args);
            } else {
                $data = $evo->runSnippet(...$args);
            }
        }
    }
}
