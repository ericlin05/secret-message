-- Create syntax for TABLE 'image'
CREATE TABLE `image` (
  `id` int(10) NOT NULL auto_increment,
  `uniq_id` varchar(13) NOT NULL,
  `filename` varchar(255) default NULL,
  `type` varchar(255) default NULL,
  `data` longblob NOT NULL,
  `version` tinyint(1) unsigned NOT NULL default '1',
  `notify_email` varchar(255) default NULL,
  `notify_reference` text,
  `created_at` datetime NOT NULL,
  `destroyed_at` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uniq_id` (`uniq_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'note'
CREATE TABLE `note` (
  `id` int(10) NOT NULL auto_increment,
  `uniq_id` varchar(13) NOT NULL,
  `data` blob NOT NULL,
  `version` tinyint(1) unsigned NOT NULL default '1',
  `notify_email` varchar(255) default NULL,
  `notify_reference` text,
  `created_at` datetime NOT NULL,
  `destroyed_at` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uniq_id` (`uniq_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;