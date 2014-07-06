<?php

namespace PrivStuff\Lib\Image;

require_once('Image.php');

/**
 * Created by JetBrains PhpStorm.
 * User: ericlin
 * Date: 6/07/14
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */
class ImageGIF extends Image
{
    public function render()
    {
        // Set the content type header - in this case image/gif
        header('Content-Type: image/gif');

        // integer representation of the color black (rgb: 0,0,0)
        $background = imagecolorallocate($this->_imageResource, 0, 0, 0);
        // removing the black from the placeholder
        imagecolortransparent($this->_imageResource, $background);
        // Output the image
        imagegif($this->_imageResource);
        imagedestroy($this->_imageResource);
    }
}
