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
     * @var array
     */
    protected $config = [];

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
        $evo = evolutionCMS();

        $this->params = array_merge([
            'api' => null,
            'tvName' => null,
            'docid' => $evo->documentIdentifier
        ], $params);

        $value = $evo->documentObject[$this->params['tvName']][1] ?? null;

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
                        $this->getConfig($this->params['tvName'])
                    )
                );
        }
    }

    /**
     * @param array $data
     * @param array $config
     * @param string $parentName
     * @return array
     */
    protected function renderData(array $data, array $config, string $parentName = ''): array
    {
        $out = [];

        foreach ($data as $key => $item) {
            $item = array_combine(array_map(function ($name) {
                return substr($name, 0, 3) == 'mf.' ? $name : 'mf.' . $name;
            }, array_keys($item)), $item);

            $item['mf.name'] = $item['mf.name'] ?? (string) $key;

            $item = $this->setPrepare($item, $item['mf.name'], $parentName, $config);

            if (isset($item['mf.columns']) && is_array($item['mf.columns'])) {
                $tpl = $config[$item['mf.name']]['tpl.columns'] ?? (
                        $this->params['tpl_' . $parentName . $item['mf.name'] . '.columns'] ?? '@CODE:[+mf.items+]'
                    );

                $item['mf.columns'] = $this->tpl($tpl, [
                    'mf.items' => $this->renderData(
                        $item['mf.columns'],
                        $config[$item['mf.name']]['columns'] ?? [], $parentName . $item['mf.name'] . '.columns.'
                    )
                ]);
            }

            if (isset($item['mf.items']) && is_array($item['mf.items'])) {
                $item = array_merge($item, $this->renderData(
                    $item['mf.items'],
                    $config[$item['mf.name']]['items'] ?? [], $parentName . $item['mf.name'] . '.'
                ));
            }

            $item = $this->setPrepareWrap($item, $item['mf.name'], $parentName, $config);

            $key = $item['mf.name'];

            if (!isset($out[$key])) {
                $out[$key] = '';
            }

            $out[$key] .= $this->tpl(
                $this->setTpl($item['mf.name'], $parentName, $config),
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

        $this->config = $config['templates'] ?? [];

        return $this->config;
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
     * @param string $name
     * @param string $parentName
     * @param array $config
     * @return string
     */
    protected function setTpl(string $name, string $parentName, array $config): string
    {
        return $config[$name]['tpl'] ?? (
                $this->config[$name]['tpl'] ?? (
                    $this->params['tpl_' . $parentName . $name] ?? (
                        $this->params['tpl_' . $parentName . '*'] ?? (
                            $this->params['tpl_' . $name] ?? '@CODE:[+mf.value+]'
                        )
                    )
                )
            );
    }

    /**
     * @param array $item
     * @param string $name
     * @param string $parentName
     * @param array $config
     * @return array
     */
    protected function setPrepare(array $item, string $name, string $parentName, array $config): array
    {
        return $this->prepare(
            $config[$name]['prepare'] ?? (
                $this->config[$name]['prepare'] ?? (
                    $this->params['prepare_' . $parentName . $name] ?? (
                        $this->params['prepare_' . $parentName . '*'] ?? (
                            $this->params['prepare_' . $name] ?? null
                        )
                    )
                )
            ),
            $item
        );
    }

    /**
     * @param array $item
     * @param string $name
     * @param string $parentName
     * @param array $config
     * @return array
     */
    protected function setPrepareWrap(array $item, string $name, string $parentName, array $config): array
    {
        return $this->prepare(
            $config[$name]['prepareWrap'] ?? (
                $this->config[$name]['prepareWrap'] ?? (
                    $this->params['prepareWrap_' . $parentName . $name] ?? (
                        $this->params['prepareWrap_' . $parentName . '*'] ?? (
                            $this->params['prepareWrap_' . $name] ?? null
                        )
                    )
                )
            ),
            $item
        );
    }

    /**
     * @param $name
     * @param array $data
     * @return array
     */
    protected function prepare($name = null, array $data = []): array
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

        return $data;
    }

    /**
     * @param string $name
     * @param $default
     * @return mixed|string
     */
    public function param(string $name, $default = null)
    {
        return $this->params[$name] ?? ($default ?? '');
    }
}
