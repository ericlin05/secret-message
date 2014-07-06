<?php

namespace PrivStuff\Lib\Image;

/**
 * User: ericlin
 * Date: 6/07/14
 * Time: 2:22 PM
 */
abstract class Image
{
    protected $_imageResource = null;

    public function __construct($string)
    {
        $this->_imageResource = imagecreatefromstring($string);
    }

    abstract public function render();
}
