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
        $this->params = array_merge([
            'api' => '',
            'name' => ''
        ], $params);

        $value = evolutionCMS()->documentObject[$this->params['name']][1] ?? null;

        if (empty($value)) {
            return '';
        }

        switch ($this->params['api']) {
            case '1':
            case 'json':
                return $value;

            default:
                return $this->tpl(
                    '@CODE:[+mf.items+]',
                    $this->renderData(
                        json_decode($value, true),
                        $this->getConfig($this->params['name'])
                    )
                );
        }
    }

    /**
     * @param array $data
     * @param array $config
     * @param string $tplKey
     * @return array
     */
    protected function renderData(array $data, array $config, string $tplKey = ''): array
    {
        $out = [];

        foreach ($data as $key => $item) {
//            if ($item['type'] == 'row') {
//                $classes = [];
//                foreach ($item as $k => $v) {
//                    if (substr($k, 0, 5) == 'mfjs.') {
//                        if ($v) {
//                            $classes[] = substr($k, 5) . '-' . $v;
//                        }
//                    }
//                }
//
//                if (!empty($classes)) {
//                    $item['class'] = implode(' ', $classes);
//                }
//            }

            $item = array_combine(array_map(function ($name) {
                return substr($name, 0, 5) == 'mfjs.' ? 'mf.' . substr($name, 5) : 'mf.' . $name;
            }, array_keys($item)), $item);

            $item['mf.name'] = $item['mf.name'] ?? (string) $key;

            $this->prepare(
                $config[$item['mf.name']]['prepare'] ?? (
                    $this->params['prepare_' . $tplKey . $item['mf.name']] ?? (
                        $this->params['prepare_' . $tplKey . '*'] ?? (
                            $this->params['prepare_' . $item['mf.name']] ?? null
                        )
                    )
                ),
                $item
            );

            $item['mf.tpl'] = $config[$item['mf.name']]['tpl'] ?? (
                    $this->params['tpl_' . $tplKey . $item['mf.name']] ?? (
                        $this->params['tpl_' . $tplKey . '*'] ?? (
                            $this->params['tpl_' . $item['mf.name']] ?? '@CODE:[+mf.value+]'
                        )
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
                $item = array_merge($item, $this->renderData(
                    $item['mf.items'],
                    $config[$item['mf.name']]['items'] ?? [], $tplKey . $item['mf.name'] . '.'
                ));
            }

            $key = $item['mf.name'];

            if (!isset($out[$key])) {
                $out[$key] = '';
            }

            $out[$key] .= $this->tpl(
                $item['mf.tpl'],
                $item
            );
        }

        if (!empty($out)) {
            $out['mf.items'] = is_array($out) ? implode($out) : $out;
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
