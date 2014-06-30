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
 * @uri /api/note
 * @uri /api/note/:id/:key
 */
class Note extends Base
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
            $stmt = $db->prepare("DELETE FROM note WHERE uniq_id = :uniq_id");
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

        $crypt = new Encryption($key);
        $encoded = $crypt->encrypt(trim($this->request->data));

        $uniqId = uniqid();

        $db = $this->_getDB();
        $stmt = $db->prepare("INSERT INTO note (uniq_id, data, created_at) VALUES (:id, :data, NOW())");
        $status = $stmt->execute(array(':id' => $uniqId, ':data' => $encoded));

        if($status) {
            return json_encode(array('status' => 'success', 'key' => $key, 'uniq_id' => $uniqId));
        }

        return json_encode(array('status' => 'failed'));
    }
}
