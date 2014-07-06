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
class ImageJPEG extends Image
{
    public function render()
    {
        // Set the content type header - in this case image/jpg
        header('Content-Type: image/jpeg');
        // Output the image
        imagejpeg($this->_imageResource);
        imagedestroy($this->_imageResource);
    }
}
