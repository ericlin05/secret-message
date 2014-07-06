<?php

namespace PrivStuff\Lib\Image;

require_once('ImageJPEG.php');
require_once('ImagePNG.php');
require_once('ImageGIF.php');

/**
 * User: ericlin
 * Date: 6/07/14
 * Time: 2:27 PM
 */
class ImageFactory
{
    public static function getImageFromString($mimeType, $string)
    {
        switch ($mimeType) {
            case "image/jpeg":
                return new ImageJPEG($string);
                break;

            case "image/png":
                return new ImagePNG($string);

                break;
            case "image/gif":
                return new ImageGIF($string);
                break;

            default:
                return new ImagePNG($string);
        }
    }
}
