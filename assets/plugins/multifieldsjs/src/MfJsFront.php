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
            $item = array_combine(array_map(function ($name) {
                return 'mf.' . $name;
            }, array_keys($item)), $item);

            $item['mf.name'] = $item['mf.name'] ?? (string) $key;

            $this->prepare(
                $config[$item['mf.name']]['prepare'] ?? (
                    $this->params['prepare_' . $tplKey . $item['mf.name']] ?? (
                        $this->params['prepare_' . $tplKey . '*'] ?? null
                    )
                ),
                $item
            );

            $item['mf.tpl'] = $config[$item['mf.name']]['tpl'] ?? (
                    $this->params['tpl_' . $tplKey . $item['mf.name']] ?? (
                        $this->params['tpl_' . $tplKey . '*'] ?? '@CODE:[+mf.value+]'
                    )
                );

            if (isset($item['mf.columns']) ?? is_array($item['mf.columns'])) {
                $tpl = $config[$item['mf.name']]['tpl.columns'] ?? (
                        $this->params['tpl_' . $tplKey . $item['mf.name'] . '.columns'] ?? '@CODE:[+mf.items+]'
                    );

                $item['mf.columns'] = $this->tpl($tpl, [
                    'mf.items' => $this->renderData(
                        $item['mf.columns'],
                        $config[$item['mf.name']]['columns'] ?? [], $tplKey . $item['mf.name'] . '.columns.'
                    )
                ]);
            }

            if (isset($item['mf.items']) ?? is_array($item['mf.items'])) {
                $item['mf.items'] = $this->renderData(
                    $item['mf.items'],
                    $config[$item['mf.name']]['items'] ?? [], $tplKey . $item['mf.name'] . '.'
                );
            }

            $out .= $this->tpl(
                $item['mf.tpl'],
                $item
            );
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
