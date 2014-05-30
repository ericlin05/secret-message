<?php

namespace PrivStuff\Resource;

use Tonic\Resource,
    \Tonic\NotFoundException;

/**
 * Add description here
 *
 * User: ericlin
 * Date: 30/05/2014
 * Time: 4:34 PM
 */ 
class Base extends Resource
{
    /**
     * @return \PDO
     * @throws \Tonic\NotFoundException
     */
    protected function _getDB()
    {
        try {
            return new \PDO(
                $this->container['db_config']['dsn'],
                $this->container['db_config']['username'],
                $this->container['db_config']['password']
            );
        } catch (\Exception $e) {
            throw new NotFoundException;
        }
    }
}
