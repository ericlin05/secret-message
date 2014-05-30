<?php

namespace PrivStuff\Resource;

use \PrivStuff\Resource\Base,
    \Tonic\NotFoundException;

/**
 * Add description here
 *
 * User: ericlin
 * Date: 30/05/2014
 *
 * @uri /note
 */
class Note extends Base
{
    /**
     *
     * @method GET
     * @provides application/json
     *
     * @return string
     * @throws NotFoundException
     */
    public function getNote()
    {
        $db = $this->_getDB();

        $stmt = $db->query("SELECT data FROM note WHERE id = 1");
        if (!$stmt) {
            throw new NotFoundException;
        }

        return json_encode(array($stmt->fetchColumn()));
    }
}
