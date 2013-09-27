/*
Navicat MySQL Data Transfer

Source Server         : 123
Source Server Version : 50166
Source Host           : 192.168.54.123:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50166
File Encoding         : 65001

Date: 2013-09-27 11:24:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `user_resource`
-- ----------------------------
DROP TABLE IF EXISTS `user_resource`;
CREATE TABLE `user_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `page_id` varchar(145) NOT NULL,
  `resource_tip` varchar(250) DEFAULT NULL,
  `resource_link` varchar(512) NOT NULL,
  `link_type` varchar(45) DEFAULT '1' COMMENT '0. 其他\n1. htm / html / htmls / jsp / asp / php  / 无扩展名\n2. doc / docx  \n3. xls / xlsx  \n4. ppt / pptx  \n5. pdf\n6. txt\n7. zip / rar / 7z / iso / tar / gz / jar  \n8. jpg / png / gif / jpge / bmp / raw / tiff / tif\n9. mp3 / wav / mod / ra / ram / cmf / cda / m',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index1` (`user_id`,`page_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_resource
-- ----------------------------
INSERT INTO `user_resource` VALUES ('3', '1', 'abc_lesson_1_page_1', 'bai', 'http://baidu.com', '1', '2013-09-26 16:50:39', null);
INSERT INTO `user_resource` VALUES ('5', '1', 'abc_lesson_1_page_1', 'aa', 'http://baidu.com', '1', '2013-09-26 17:00:48', null);
