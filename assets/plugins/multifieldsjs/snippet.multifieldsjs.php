<?php
/**
 * Snippet multifieldsjs
 *
 * @author 64j
 */

if (!defined('MODX_BASE_PATH')) {
    die('HACK???');
}

echo MfJsFront::getInstance()
    ->render($params ?? []);
