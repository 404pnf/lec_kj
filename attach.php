<?php
include_once 'config.php';
include_once 'include/attachment.inc';
	
header("Content-type: text/html; charset=ISO-8859-1");

$at = new Attachment();

$return_type = !empty($_REQUEST['return_type'])?$_REQUEST['return_type']:'json';
$func = $_REQUEST['f'];

$user_id = $_REQUEST["user_id"];
$page_id = $_REQUEST["page_id"];
$callback = $_REQUEST["callback"];

switch ($func){
	case "list":
		$arr = $at->list_uid_pid($user_id, $page_id);
		break;
	case "insert":
		$resource_link = $_REQUEST['resource_link'];
		$resource_tip = $_REQUEST['resource_tip'];
		$arr = $at->insert($user_id, $page_id, $resource_link, $resource_tip);
		break;
	case "update":
		$id = $_REQUEST['id'];
		$resource_link = $_REQUEST['resource_link'];
		$resource_tip = $_REQUEST['resource_tip'];
		$arr = $at->update($id, $user_id, $page_id, $resource_link, $resource_tip);
		break;
	case "delete":
		$id = $_REQUEST['id'];
		$arr = $at->delete($id, $user_id, $page_id);
		break;
}

if($return_type == 'php'){
	echo "<pre>";
	var_dump($arr);
	echo "</pre>";
}
else{
	
	$json = json_encode($arr);
	echo $callback."(".$json.")";
}
?>
