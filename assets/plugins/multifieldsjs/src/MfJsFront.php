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
     * @param array $params
     * @return string
     */
    public function render(array $params): string
    {
        $tv = evolutionCMS()->documentObject[$params['tvName'] ?? null] ?? null;
        $api = $params['api'] ?? null;

        if (is_null($tv)) {
            return '';
        }

        switch ($api) {
            case '1':
            case 'json':
                return $tv[1];

            default:
                return $this->renderData(json_decode($tv[1] ?: '{}'));
        }
    }

    /**
     * @param array $data
     * @return string
     */
    protected function renderData(array $data): string
    {
        dd($data);
    }
}
