<?php

namespace PrivStuff\Resource;

use \PrivStuff\Lib\Encryption;
use \Tonic\NotFoundException;

require_once('../lib/image/ImageFactory.php');

/**
 * The resource that represents the private note that user can create and retrieve
 *
 * User: ericlin
 * Date: 30/05/2014
 *
 * @uri /api/image
 * @uri /api/image/:id/:key
 * @uri /api/image/:id/:key/:width
 */
class Image extends Base
{
    /**
     * @param string $uniqId
     * @param string $key
     * @param int $width
     *
     * @method GET
     * @provides application/json
     *
     * @return string
     * @throws NotFoundException
     */
    public function get($uniqId, $key, $width=0)
    {
        if($width > 0) {
            $this->_getImage($uniqId, $key, $width);
            return '';
        }

        return $this->_getImageInfo($uniqId);
    }

    protected function _getImage($uniqId, $key, $width)
    {
        $db = $this->_getDB();
        $crypt = new Encryption($key);

        $stmt = $db->prepare("SELECT type, data FROM image WHERE uniq_id = :uniq_id");
        $stmt->execute(array(':uniq_id' => $uniqId));

        if ($stmt->rowCount() > 0) {
            $data = $stmt->fetch(\PDO::FETCH_ASSOC);
            $imgData = base64_decode($crypt->decrypt($data['data']));

            $image = \PrivStuff\Lib\Image\ImageFactory::getImageFromString($data['type'], $imgData);
            $image->render($width);

            // remove the note
            $stmt = $db->prepare(
                "UPDATE image SET data = '', notify_email = '', notify_reference = '', destroyed_at = NOW() WHERE uniq_id = :uniq_id"
            );
            $stmt->execute(array(':uniq_id' => $uniqId));
        }
    }

    protected function _getImageInfo($uniqId)
    {
        $db = $this->_getDB();
        $stmt = $db->prepare("SELECT width, height, destroyed_at FROM image WHERE uniq_id = :uniq_id");
        $stmt->execute(array(':uniq_id' => $uniqId));

        $width = 0;
        $height = 0;
        $destroyed = 0;

        if ($stmt->rowCount() > 0) {
            list($width, $height, $destroyed_at) = $stmt->fetch(\PDO::FETCH_NUM);
            $destroyed = !empty($destroyed_at);
        }

        return json_encode(array('width' => $width, 'height' => $height, 'destroyed' => $destroyed));
    }

    /**
     * @method POST
     * @provides application/json
     *
     * @throws \Tonic\Exception
     * @return string
     */
    public function create()
    {
        $key = Encryption::getRandomKey(13);

        $email      = isset($_REQUEST['email'])     ? $_REQUEST['email']        : '';
        $reference  = isset($_REQUEST['reference']) ? $_REQUEST['reference']    : '';

        $types = array(
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
        );

        if (!in_array($_FILES['file']['type'], array_keys($types))) {
            throw new \Tonic\Exception('Invalid file format.');
        }

        $crypt = new Encryption($key);
        $fp = fopen($_FILES['file']['tmp_name'], 'r');
        $encoded = $crypt->encrypt(base64_encode(fread($fp, filesize($_FILES['file']['tmp_name']))));

        list($width, $height) = getimagesize($_FILES['file']['tmp_name']);

        $uniqId = uniqid();

        $db = $this->_getDB();
        $stmt = $db->prepare(
            "INSERT INTO image (uniq_id, filename, type, data, width, height, notify_email, notify_reference, created_at)
             VALUES (:id, :filename, :type, :data, :width, :height, :email, :reference, NOW())"
        );
        $status = $stmt->execute(
            array(
                ':id'           => $uniqId,
                ':filename'     => $_FILES['file']['name'],
                ':type'         => $_FILES['file']['type'],
                ':data'         => $encoded,
                ':width'        => $width,
                ':height'       => $height,
                ':email'        => $email,
                ':reference'    => $reference
            )
        );

        if($status) {
            return json_encode(array('status' => 'success', 'key' => $key, 'uniq_id' => $uniqId));
        }

        return json_encode(array('status' => 'failed'));
    }
}
