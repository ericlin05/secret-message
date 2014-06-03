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
 * @uri /note
 * @uri /note/:id/:key
 */
class Note extends Base
{
    /**
     * @param string $id
     * @param string $key
     *
     * @method GET
     * @provides application/json
     *
     * @return string
     * @throws NotFoundException
     */
    public function get($id, $key)
    {
        $db = $this->_getDB();
        $crypt = new Encryption($key);

        $stmt = $db->prepare("SELECT data FROM note WHERE id = :id");
        $stmt->execute(array(':id' => $id));

        $ret = array('status' => 'failed', 'data' => null);

        if ($stmt->rowCount() > 0) {
            $data = trim($crypt->decrypt($stmt->fetchColumn()));
            if($data) {
                $ret['status'] = 'success';
                $ret['data'] = $data;
            }

            // remove the note
            $stmt = $db->prepare("DELETE FROM note WHERE id = :id");
            $stmt->execute(array(':id' => $id));
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

        $id = uniqid();

        $db = $this->_getDB();
        $stmt = $db->prepare("INSERT INTO note (id, data, created_at) VALUES (:id, :data, NOW())");
        $status = $stmt->execute(array(':id' => $id, ':data' => $encoded));

        if($status) {
            return json_encode(array('status' => 'success', 'key' => $key, 'id' => $id));
        }

        return json_encode(array('status' => 'failed'));
    }
}
