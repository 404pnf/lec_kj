<?php
/**
 * @author wanghaixia
 *
 */
class Attachment{


	/**
	 * 查询用户某个页面的资源列表
	 * @param $user_id 用户id
	 * @param $page_id 页面的唯一标识id，字符串类型
	 * @param $num 需要显示的资源数，默认显示全部
	 * @return 试卷信息数组
	 */
	public function  list_uid_pid($user_id, $page_id, $num){
		$status = "0";
		$message = "失败";
		$res = array();
		if(!empty($user_id) && !empty($page_id)){
			$conn = DB_CONNECT::db_conn();
			
			if(!empty($num)){
				$limitCondition = " LIMIT $num ";
			}
		    $sql = "SELECT id, user_id, page_id, resource_tip, resource_link, link_type, create_time 
		    	FROM user_resource 
				WHERE user_id = ? AND page_id = ? 
				$limitCondition";
	
		     $res = $conn->getAll($sql,array($user_id, $page_id));
		     if(!DB::isError($res)){
		     	$status = "1";
		     	$message = "成功";
		     }
		     else{
		     	$message = "数据库操作错误";
		     }
		}
		else{
			$message = "信息不完整";
		}
		
		$arr = array('status'=>$status,
				'message'=>$message,
				'info'=>$res
		);
	     return  $arr;
	}
	
	
	/**
	 * 插入用户资源
	 * @param $user_id 用户id
	 * @param $page_id 页面的唯一标识id，字符串类型
	 * @param $resource_link 资源连接
	 * @param $resource_tip 资源说明或备注，可选
	 * @param $link_type 资源类型，可选
	 * @return Ambigous <multitype:string , multitype:string multitype:unknown number  >
	 */
	public function insert($user_id, $page_id, $resource_link, $resource_tip, $link_type = 1){
		$status = "0";
		$message = "失败";
		
		if(!empty($user_id) && !empty($page_id) && !empty($resource_link)){
	
			if(empty($resource_tip))	$resource_tip = $resource_link;
			if(strpos($resource_link, ":") == false){
				$resource_link ="http://".$resource_link;
			}
			//TODO 检测连接的类型，如果可以的话
			
			$conn = DB_CONNECT::db_conn();
			$sql = "INSERT INTO `user_resource`
				(user_id, page_id, resource_tip, resource_link, link_type, create_time)
				VALUES(?,?,?,?,?,now())";
			$res = $conn->query($sql,array($user_id, $page_id, $resource_tip, $resource_link, $link_type));
	
			if(!DB::isError($res)){
				$status = "1";
				$message = "成功";
				$id = mysql_insert_id();
			}
			else{
				$message = "数据库操作错误";
			}
		}
		else{
			$message = "信息不完整";
		}
		
		if($status == "1")
			$arr = array('status'=>$status,
						'message'=>$message,
					'info'=>array(
						'id'=>$id,
						"user_id" => $user_id,
						"page_id" => $page_id,
						'resource_tip'=>$resource_tip,
						"resource_link" => $resource_link,
						"link_type" => $link_type,
					)
			);
		else 
			$arr = array('status'=>$status,
						'message'=>$message);
		
		return $arr;
	}

	
	public function update($id, $user_id, $page_id, $resource_link, $resource_tip, $link_type = 1){
		$status = "0";
		$message = "失败";
		
		if(!empty($id) && !empty($user_id) && !empty($page_id) && !empty($resource_link)){
	
			if(empty($resource_tip))	$resource_tip = $resource_link;
			if(strpos($resource_link, ":") == false){
				$resource_link ="http://".$resource_link;
			}
			//TODO 检测连接的类型，如果可以的话
			
			$conn = DB_CONNECT::db_conn();
			$sql = "UPDATE `user_resource` SET
						 resource_tip = ?, resource_link=?, link_type=?, update_time= now()
					WHERE id = ? AND user_id = ? AND page_id = ?";
			$res = $conn->query($sql,array($resource_tip, $resource_link, $link_type, $id, $user_id, $page_id));
			
			if(!DB::isError($res)){
				if($conn->affectedRows() == 1){
					$status = "1"; 
					$message = "成功";
				}
				else{
					$check_sql = "SELECT `user_id`, page_id FROM `user_resource` WHERE `id` = ? ";
					$info = $conn->getRow($check_sql,array($id));
					if(!DB::isError($info)){
						if(count($info) == 0){
							$status = "2"; 
							$message = "id 错误";
						}
						else{
							if($info['user_id'] !== $user_id){
								$status = "3"; 
								$message = "不是本用户的资源，无权修改";
							}
							elseif($info['page_id'] !== $page_id){
								$status = "4"; 
								$message = "不能修改非本页的内容";
							}
						}
					}
					else{
						$message = "数据库操作错误";
					}
				}
			}
			else{
				$message = "数据库操作错误";
			}
		}
		else{
			$message = "信息不完整";
		}
		
		if($status == "1")
			$arr = array('status'=>$status,
						'message'=>$message,
					'info'=>array(
						'id'=>$id,
						"user_id" => $user_id,
						"page_id" => $page_id,
						'resource_tip'=>$resource_tip,
						"resource_link" => $resource_link,
						"link_type" => $link_type,
					)
			);
		else 
			$arr = array('status'=>$status,
						'message'=>$message);
		return $arr;
	
	}

	public function delete($id, $user_id, $page_id){
		$status = "0";
		$message = "失败";
	
		if(!empty($id) && !empty($user_id) && !empty($page_id)){
	
				
			$conn = DB_CONNECT::db_conn();
			$sql = "DELETE FROM `user_resource`
					WHERE id = ? AND user_id = ? AND page_id = ?";
			$res = $conn->query($sql,array($id, $user_id, $page_id));
				
			if(!DB::isError($res)){
				if($conn->affectedRows() == 1){
					$status = "1";
					$message = "成功";
				}
				else{
					$check_sql = "SELECT `user_id`, page_id FROM `user_resource` WHERE `id` = ? ";
					$info = $conn->getRow($check_sql,array($id));
					if(!DB::isError($info)){
						if(count($info) == 0){
							$status = "2";
							$message = "id 错误";
						}
						else{
							if($info['user_id'] !== $user_id){
								$status = "3";
								$message = "不是本用户的资源，无权删除";
							}
							elseif($info['page_id'] !== $page_id){
								$status = "4";
								$message = "不能删除非本页的内容";
							}
						}
					}
					else{
						$message = "数据库操作错误";
					}
				}
			}
			else{
				$message = "数据库操作错误";
			}
		}
		else{
			$message = "信息不完整";
		}
	
		$arr = array('status'=>$status,
				'message'=>$message);
		return $arr;
	
	}

}





