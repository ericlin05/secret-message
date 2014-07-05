<?php

namespace PrivStuff\Resource;

use \PrivStuff\Lib\Encryption;
use \Tonic\NotFoundException;

/**
 * The resource that represents the private note that user can create and retrieve
 *
 * User: ericlin
 * Date: 30/05/2014
 *
 * @uri /api/image
 * @uridsf /api/image/:id/:key
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

        $stmt = $db->prepare("SELECT data FROM note WHERE uniq_id = :uniq_id");
        $stmt->execute(array(':uniq_id' => $uniqId));

        $ret = array('status' => 'failed', 'data' => null);

        if ($stmt->rowCount() > 0) {
            $data = trim($crypt->decrypt($stmt->fetchColumn()));
            if($data) {
                $ret['status'] = 'success';
                $ret['data'] = $data;
            }

            // remove the note
            $stmt = $db->prepare("UPDATE note SET data = '', destroyed_at = NOW() WHERE uniq_id = :uniq_id");
            $stmt->execute(array(':uniq_id' => $uniqId));
        }

        return json_encode($ret);
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

        $types = array(
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
        );

        if (!in_array(
            $_FILES['file']['type'],
            array_keys($types)

        )) {
            throw new \Tonic\Exception('Invalid file format.');
        }

        // You should name it uniquely.
        // DO NOT USE $_FILES['upfile']['name'] WITHOUT ANY VALIDATION !!
        // On this example, obtain safe unique name from its binary data.
        if (!move_uploaded_file(
            $_FILES['file']['tmp_name'],
            sprintf(__DIR__.'/../public/uploads/%s.%s',
                sha1_file($_FILES['file']['tmp_name']),
                isset($types[$_FILES['file']['tmp_name']]) ? $types[$_FILES['file']['tmp_name']] : 'png'
            )
        )) {
            throw new \Tonic\Exception('Failed to move uploaded file.');
        }

        echo 'File is uploaded successfully.';

        $crypt = new Encryption($key);
        $encoded = $crypt->encrypt(trim('tset'));

        $uniqId = uniqid();

        $db = $this->_getDB();
        $stmt = $db->prepare("INSERT INTO image (uniq_id, data, created_at) VALUES (:id, :data, NOW())");
        $status = $stmt->execute(array(':id' => $uniqId, ':data' => $encoded));

        if($status) {
            return json_encode(array('status' => 'success', 'key' => $key, 'uniq_id' => $uniqId));
        }

        return json_encode(array('status' => 'failed'));
    }
}
