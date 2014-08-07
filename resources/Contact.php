<?php

namespace PrivStuff\Resource;

use \Tonic\Response;

/**
 * The resource that represents the private note that user can create and retrieve
 *
 * User: ericlin
 * Date: 30/05/2014
 *
 * @uri /api/contact
 */
class Contact extends Base
{
    /**
     * @method POST
     * @provides application/json
     *
     * @return string
     */
    public function create()
    {
        $data = json_decode($this->request->data, true);

        $email      = $data['email'];
        $firstName  = $data['first_name'];
        $lastName   = $data['last_name'];
        $message    = $data['message'];

        $errorMessage = "We are unable to process your request at this time, please try again later!";

        $db = $this->_getDB();
        $stmt = $db->prepare(
            "INSERT INTO contact (first_name, last_name, email, message, created_at) VALUES (:first_name, :last_name, :email, :message, NOW())"
        );
        $status = $stmt->execute(
            array(
                ':first_name' => $firstName,
                ':last_name' => $lastName,
                ':email' => $email,
                ':message' => $message
            )
        );

        if($status) {
            return new Response(Response::CREATED);
        }

        return new Response(Response::INTERNALSERVERERROR, json_encode(array('message' => $errorMessage)));
    }
}
