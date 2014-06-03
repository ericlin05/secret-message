<?php

namespace PrivStuff\Lib;

/**
* Class to provide 2 way encryption of data
*
* @author    Kevin Waterson
* @copyright    2009    PHPRO.ORG
*
*/
class Encryption
{
    protected $key;

    public function __construct($key)
    {
        $this->key = $key;
    }
    /**
     *
     * This is called when we wish to set a variable
     *
     * @access    public
     * @param    string    $name
     * @param    string    $value
     * @throws \Exception
     *
     */
    public function __set( $name, $value )
    {
        switch( $name)
        {
            case 'ivs':
            case 'iv':
                $this->$name = $value;
                break;

            default:
                throw new \Exception( "$name cannot be set" );
        }
    }

    /**
     *
     * Gettor - This is called when an non existant variable is called
     *
     * @access    public
     * @param    string    $name
     * @return mixed
     * @throws \Exception
     *
     */
    public function __get( $name )
    {
        switch( $name )
        {
            case 'ivs':
                return mcrypt_get_iv_size( MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB );

            case 'iv':
                return mcrypt_create_iv( $this->ivs );

            default:
                throw new \Exception( "$name cannot be called" );
        }
    }

    /**
    *
    * Encrypt a string
    *
    * @access    public
    * @param    string    $text
    * @return    string    The encrypted string
    *
    */
    public function encrypt( $text )
    {
        // add end of text delimiter
        $data = mcrypt_encrypt( MCRYPT_RIJNDAEL_128, $this->key, $text, MCRYPT_MODE_ECB, $this->iv );
        return base64_encode( $data );
    }
 
    /**
    *
    * Decrypt a string
    *
    * @access    public
    * @param    string    $text
    * @return    string    The decrypted string
    *
    */
    public function decrypt( $text )
    {
        $text = base64_decode( $text );
        return mcrypt_decrypt( MCRYPT_RIJNDAEL_128, $this->key, $text, MCRYPT_MODE_ECB, $this->iv );
    }

    /**
     * Generate a random key to be used for encrypt and decrypt strings
     *
     * @param int $length
     * @return string
     */
    public static function getRandomKey($length=5)
    {
        return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
    }
} // end of class
