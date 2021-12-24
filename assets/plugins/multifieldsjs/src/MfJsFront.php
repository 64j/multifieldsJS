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

        foreach ($data as $key => $item) {
            $item['name'] = $item['name'] ?? (string) $key;

            $this->prepare($config[$item['name']]['prepare'] ?? ($this->params['prepare_' . $tplKey . $item['name']] ?? ($this->params['prepare_' . $tplKey . '*'] ?? null)), $item);
            $item['tpl'] = $config[$item['name']]['tpl'] ?? ($this->params['tpl_' . $tplKey . $item['name']] ?? ($this->params['tpl_' . $tplKey . '*'] ?? '@CODE:[+value+]'));

            if (isset($item['columns']) ?? is_array($item['columns'])) {
                $tpl = $config[$item['name']]['tpl.columns'] ?? ($this->params['tpl_' . $tplKey . $item['name'] . '.columns'] ?? '@CODE:[+items+]');
                $item['columns'] = $this->tpl($tpl, [
                    'items' => $this->renderData($item['columns'], $config[$item['name']]['columns'] ?? [], $tplKey . $item['name'] . '.columns.')
                ]);
            }

            if (isset($item['items']) ?? is_array($item['items'])) {
                $item['items'] = $this->renderData($item['items'], $config[$item['name']]['items'] ?? [], $tplKey . $item['name'] . '.');
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
     * @param $name
     * @param array $data
     * @return void
     */
    protected function prepare($name = null, array &$data = [])
    {
        if (!empty($name)) {
            $evo = evolutionCMS();

            $args = [
                'data' => $data,
                'modx' => $evo,
                '_MFJS' => $this
            ];

            if ((is_object($name)) || is_callable($name)) {
                $data = call_user_func_array($name, $args);
            } else {
                $data = $evo->runSnippet($name, $args) ?: $data;
            }
        }
    }
}
