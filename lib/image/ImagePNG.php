<?php

namespace PrivStuff\Lib\Image;

require_once('Image.php');

/**
 * User: ericlin
 * Date: 6/07/14
 * Time: 2:24 PM
 */
class ImagePNG extends Image
{
    public function render()
    {
        // Set the content type header - in this case image/png
        header('Content-Type: image/png');
        // integer representation of the color black (rgb: 0,0,0)
        $background = imagecolorallocate($this->_imageResource, 0, 0, 0);
        // removing the black from the placeholder
        imagecolortransparent($this->_imageResource, $background);
        // turning off alpha blending (to ensure alpha channel information
        // is preserved, rather than removed (blending with the rest of the
        // image in the form of black))
        imagealphablending($this->_imageResource, false);
        // turning on alpha channel information saving (to ensure the full range
        // of transparency is preserved)
        imagesavealpha($this->_imageResource, true);
        // Output the image
        imagepng($this->_imageResource);
        imagedestroy($this->_imageResource);
    }
}
