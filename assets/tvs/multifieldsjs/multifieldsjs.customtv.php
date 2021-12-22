<?php
/**
 * custom tv multifieldsJS
 *
 * @author 64j
 */

if (!defined('MODX_BASE_PATH')) {
    die('HACK???');
}

echo MfJsBack::getInstance()->renderCustomTv($row ?? []);
