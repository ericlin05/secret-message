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

        $stmt = $db->prepare("SELECT data, destroyed_at FROM note WHERE uniq_id = :uniq_id");
        $stmt->execute(array(':uniq_id' => $uniqId));

        $ret = array('status' => 'failed', 'data' => null);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);

            if(!empty($row['destroyed_at'])) {
                $ret['status'] = 'destroyed';
            } else {
                $data = trim($crypt->decrypt($row['data']));
                if($data) {
                    $ret['status'] = 'success';
                    $ret['data'] = $data;
                }

                // remove the note
                $stmt = $db->prepare(
                    "UPDATE note SET data = '', notify_email = '', notify_reference = '', destroyed_at = NOW() WHERE uniq_id = :uniq_id"
                );
                $stmt->execute(array(':uniq_id' => $uniqId));
            }
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

        $data = json_decode($this->request->data, true);

        $crypt      = new Encryption($key);
        $message    = $crypt->encrypt(trim($data['message']));
        $email      = $data['email'];
        $reference  = $data['reference'];

        $uniqId = uniqid();

        $db = $this->_getDB();
        $stmt = $db->prepare(
            "INSERT INTO note (uniq_id, data, notify_email, notify_reference, created_at) VALUES (:id, :data, :email, :reference, NOW())"
        );
        $status = $stmt->execute(
            array(
                ':id' => $uniqId, ':data' => $message,
                ':email' => $email, ':reference' => $reference
            )
        );

        if($status) {
            return json_encode(
                array(
                    'status' => 'success', 'key' => $key, 'uniq_id' => $uniqId
                )
            );
        }

        return json_encode(array('status' => 'failed'));
    }
}
