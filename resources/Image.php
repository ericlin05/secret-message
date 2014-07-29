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
 */
class Image extends Base
{
    /**
     * @param string $uniqId
     * @param string $key
     *
     * @method GET
     * @provides application/json
     *
     * @return string
     * @throws NotFoundException
     */
    public function get($uniqId, $key)
    {
        $db = $this->_getDB();
        $crypt = new Encryption($key);

        $stmt = $db->prepare("SELECT type, data FROM image WHERE uniq_id = :uniq_id");
        $stmt->execute(array(':uniq_id' => $uniqId));

        if ($stmt->rowCount() > 0) {
            $data = $stmt->fetch(\PDO::FETCH_ASSOC);
            $imgData = base64_decode($crypt->decrypt($data['data']));

            $image = \PrivStuff\Lib\Image\ImageFactory::getImageFromString($data['type'], $imgData);
            $image->render();

            // remove the note
            $stmt = $db->prepare(
                "UPDATE image SET data = '', notify_email = '', notify_reference = '', destroyed_at = NOW() WHERE uniq_id = :uniq_id"
            );
            $stmt->execute(array(':uniq_id' => $uniqId));
        }
    }

    /**
     * @method POST
     * @provides application/json
     *
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

        $uniqId = uniqid();

        $db = $this->_getDB();
        $stmt = $db->prepare(
            "INSERT INTO image (uniq_id, filename, type, data, notify_email, notify_reference, created_at)
             VALUES (:id, :filename, :type, :data, :email, :reference, NOW())"
        );
        $status = $stmt->execute(
            array(
                ':id' => $uniqId,
                ':filename' => $_FILES['file']['name'],
                ':type' => $_FILES['file']['type'],
                ':data' => $encoded,
                ':email' => $email,
                ':reference' => $reference
            )
        );

        if($status) {
            return json_encode(array('status' => 'success', 'key' => $key, 'uniq_id' => $uniqId));
        }

        return json_encode(array('status' => 'failed'));
    }
}
