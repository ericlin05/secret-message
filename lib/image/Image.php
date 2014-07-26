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
    protected $_resizeResource = null;

    public function __construct($string)
    {
        $this->_imageResource = imagecreatefromstring($string);
    }

    abstract public function render($width = 600);

    protected function _resize($width = 600)
    {
        list($oWidth, $oHeight) = array(imagesx($this->_imageResource), imagesy($this->_imageResource));
        $height = ($oHeight / $oWidth) * $width;

        $this->_resizeResource = imagecreatetruecolor($width, $height);
        imagecopyresampled($this->_resizeResource, $this->_imageResource, 0, 0, 0, 0, $width, $height, $oWidth, $oHeight);
    }
}
