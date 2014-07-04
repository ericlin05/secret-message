CREATE TABLE `note` (
  `id` int(10) NOT NULL auto_increment,
  `uniq_id` varchar(13) NOT NULL,
  `data` blob NOT NULL,
  `version` tinyint(1) unsigned NOT NULL default '1',
  `created_at` datetime NOT NULL,
  `destroyed_at` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uniq_id` (`uniq_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;