//点击附件按钮，启动弹层
$(function(){
	$(".pop_btn").click(function(){
		if(!$(this).hasClass("clicked")){
			$(this).addClass("clicked");
			attach.init($(this).parent(".attach_pop"));
		}
	});
}); 
 
//附件弹层
var  pop = pop || {};//如果已经加载过pop，则直接赋值对象，否则创建一个新对象。
pop.setting = {
		width: 200,	//弹框的宽
		max_height: 250,	//弹框的高
		button_position: "LM",	//附件按钮所在的位置信息，LT 左上，LB 左下，RT 右上，RB 右下，LM 左中，RM 右中，TM 上中，BM 下中，按钮的位置决定弹层的位置，但不会修改按钮本身的位置
		pop_x: 10,	//弹框距离按钮的x值。按钮在 LT、LB、LM ，则x代表距按钮右侧的距离；按钮RT、RB、RM、TM、BM，则是距按钮左侧的距离；
		pop_y: 20,	//弹框距离按钮的x值。按钮在 LT、RT、TM ，则y代表距按钮之下的距离；按钮LB、RB、BM、LM、RM，则是距按钮上侧的距离
		pop_center: false, //弹层是否居中，如果值为true，则pop_x,pop_y将不起作用，弹层上下左右居中显示
		fn: "",
};

pop.base={
		pop_obj : {}, //弹层对象
		pop_property_obj: {}, //获取属性的对象
};

//弹窗的初始化
pop.init = function(pop_property_obj){
	pop.base.pop_property_obj = $(pop_property_obj);	//设置全局的获取属性div对象，必须
	pop.base.pop_obj = pop.until.creat_pop();	//生成全局的弹窗对象，必须
	pop.get.pop_btn_obj().addClass("clicked");
	
	//根据设置，控制弹窗的显示
	if(pop.setting.pop_center){
		pop.until.pop_position_center();
	}
	else{
		pop.until.pop_position_set();
	}
	pop.until.close_btn();//给关闭按钮绑定事件，并且控制是否显示
	
	if(pop.setting.fn){
		pop.setting.fn(pop.get.container());
    }

};

//获取元素的方法
pop.get = {
	pop_btn_obj: function(){
		return pop.base.pop_property_obj.find("img.pop_btn");
	},
    title_container:function(){
        return pop.base.pop_obj.find(".title_value");
    },
    container:function(){
        return pop.base.pop_obj.find(".content_container");
    },
	close_button_obj:function(){
        return pop.base.pop_obj.find(".close_button");
    },
    load_image:function(){
        return pop.base.pop_obj.find(".loadimg");
    },
	content:function(){
		
	},
};

pop.until = {
	creat_pop:function(){
		var	$pop_obj = 
			$('<div id="" class="pop_window">'+
				'<div class="left_line"></div>'+
				'<div class="right_line"></div>'+
				'<div class="title_bar">'+
					'<div class="close_button" title="关闭">×</div>'+
					'<div class="title_value">附加资源</div>'+
				'</div>'+
				'<div class="content_container">'+
				'</div>'+
				'<div class="bottom_line">'+
					'<div class="leftcorner"></div>'+
					'<div class="line"></div>'+
					'<div class="rightcorner"></div>'+
				'</div>'+
			'</div>');
		$pop_obj.css({
			"width":pop.setting.width,
			"max-height":pop.setting.max_height
		});
		
		return $pop_obj;
	},
	pop_position_center:function(){
		//弹窗居中
		var $container_obj = $("body");
		var $pop_mask = $('<div id="pop_mask"></div>');
		$container_obj.append($pop_mask);

		s_top=document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop; 
		w_height = document.documentElement.clientHeight;
	 	var pop_top = s_top+(w_height-pop.setting.height)/2;
	 	
		w_width = document.documentElement.clientWidth;
	 	var pop_left = (w_width-pop.setting.width)/2;
	 	
	 	pop.base.pop_obj.css({
			"top": pop_top,
			"left": pop_left,
			});
	 	pop.base.pop_obj.appendTo($container_obj).fadeIn();
	},
	pop_position_set:function(){
		//根据设置定义弹窗位置
		var $container_obj = pop.base.pop_property_obj;
		$container_obj.css({"position":"relative"});
		
		var btn_pos = pop.setting.button_position;
		var btn_width = pop.get.pop_btn_obj().width();
		var btn_height = pop.get.pop_btn_obj().height();
		var pop_x = pop.setting.pop_x;
		var pop_y = pop.setting.pop_y;
		
		if(btn_pos == "LT"){
			pop.base.pop_obj.css({
				"left": btn_width + pop_x,
				"top": btn_height + pop_y,
			});
		}
		else if(btn_pos == "RT"){
			pop.base.pop_obj.css({
				"right": btn_width + pop_x,
				"top": btn_height + pop_y,
			});
		}
		else if(btn_pos == "LB"){
			pop.base.pop_obj.css({
				"left": btn_width + pop_x,
				"bottom": btn_height + pop_y,
			});
		}
		else if(btn_pos == "RB"){
			pop.base.pop_obj.css({
				"right": btn_width + pop_x,
				"bottom": btn_height + pop_y,
			});
		}
		else if(btn_pos == "LM"){
			pop.base.pop_obj.css({
				"left": btn_width + pop_x,
				"top": -pop_y,
			});
		}
		else if(btn_pos == "RM"){
			pop.base.pop_obj.css({
				"right": btn_width + pop_x,
				"top": -pop_y,
			});
		}
		else if(btn_pos == "TM"){
			pop.base.pop_obj.css({
				"left": -pop_x,
				"top": btn_height + pop_y,
			});
		}
		else if(btn_pos == "BM"){
			pop.base.pop_obj.css({
				"left": -pop_x,
				"bottom": btn_height + pop_y,
			});
		}
		pop.base.pop_obj.appendTo($container_obj).fadeIn();
	},
	close_pop:function(){
		if(pop.base.pop_obj){
			pop.get.pop_btn_obj().removeClass("clicked");
			
			pop.base.pop_obj.remove();
			$("#pop_mask").remove();
		}
	},
	close_btn:function(){
		var $close_btn_obj = pop.get.close_button_obj();
		
		$close_btn_obj.click(function(event){
			pop.until.close_pop();
		});
	},
    
};


var attach = attach || {};
attach.setting = {
		server: "localhost", //服务器地址
		user_id: 2,	//用户id
		page_uniq_id: "test", //页面唯一标识，有课件名、课号、页号等组成，确保唯一性
		width: 200,	//弹框的宽
		max_height: 250,	//弹框的高
		button_position: "LM",	//附件按钮所在的位置信息，LT 左上，LB 左下，RT 右上，RB 右下，LM 左中，RM 右中，TM 上中，BM 下中，按钮的位置决定弹层的位置，但不会修改按钮本身的位置
		pop_x: 10,	//弹框距离按钮的x值。按钮在 LT、LB、LM ，则x代表距按钮右侧的距离；按钮RT、RB、RM、TM、BM，则是距按钮左侧的距离；
		pop_y: 20,	//弹框距离按钮的x值。按钮在 LT、RT、TM ，则y代表距按钮之下的距离；按钮LB、RB、BM、LM、RM，则是距按钮上侧的距离
		pop_center: false, //弹层是否居中，如果值为true，则pop_x,pop_y将不起作用，弹层上下左右居中显示
};

attach.property_obj = {};


//附件初始化
attach.init = function(attach_property_obj){
	attach.property_obj = $(attach_property_obj);	//设置全局的获取属性div对象，必须
	
	attach.until.pop(attach.until.list_pop, attach.until.edit_pop);
 
  //下载页面
  //var url = "/book/content/chapter/"+attach.setting.type+"/"+attach.setting.language+"/"+attach.setting.bookId+"/"+attach.setting.chapterId+"/100000";
  //attach.until.loadPageByChapter(url);
  //绑定翻页功能

};

//获取元素的方法
attach.get = {
	server:function(){
		var server = setting.server;
		return (server == "" || server == undefined) ? attach.setting.server : server;
	},
	user_id:function(){
		var user_id = +setting.user_id;
		return (user_id == "" || user_id == undefined) ? attach.setting.user_id : user_id;
	},
	page_uniq_id:function(){
		var lessonid = setting.lesson_id;
		var pageid = setting.page_id;
		if(lessonid == "" || lessonid == undefined || pageid == "" || pageid == undefined ){
			alert("加载附件出错");
			return attach.setting.page_uniq_id;
		}
		else{
			var id =  "abc_lesson_"+lessonid+"_page_"+pageid;
			return id;
		}	
	},
	width:function(obj){
		var width = +obj.width;
		return (width == "" || width == undefined) ? attach.setting.width : width;
	},
	max_height:function(obj){
		var max_height = +obj.max_height;
		return (max_height == "" || max_height == undefined) ? attach.setting.max_height : max_height;
	},
	button_position:function(obj){
		var button_position = obj.button_position;
		return (button_position == "" || button_position == undefined) ? attach.setting.button_position : button_position;
	},
	pop_x:function(obj){
		var pop_x = +obj.pop_x;
		return (pop_x == "" || pop_x == undefined) ? attach.setting.pop_x : pop_x;
	},
	pop_y:function(obj){
		var pop_y = +obj.pop_y;
		return (pop_y == "" || pop_y == undefined) ? attach.setting.pop_y : pop_y;
	},
	pop_center:function(obj){
		var pop_center = obj.pop_center;
		return (pop_center === "" || pop_center === undefined) ? attach.setting.pop_center : pop_center;
	},
};

attach.until = {
	pop: function(list_pop, edit_pop){
			var url = "http://"+attach.get.server()+"/attach.php?callback=?";
			var postdata = {"f":"list",
					"user_id":attach.get.user_id(),
					"page_id":attach.get.page_uniq_id()};
			$.getJSON(url, postdata, function(data){
				var status = data.status;
				var info = data.info;
				
				if(status!=1){
					alert(data.message);
				}
				else{
					if(info == undefined || info.length==0){
						edit_pop();//没有资源列表，显示添加内容窗口
					}
					else{
						list_pop(info);//显示资源列表
					}
				}
			});
	},
	list_pop: function(list_info){
		//设置弹层的属性，并且初始化
		var list_setting = setting.list_pop;
		pop.setting.width = attach.get.width(list_setting);
		pop.setting.max_height = attach.get.max_height(list_setting);
		pop.setting.button_position = attach.get.button_position(list_setting);
		pop.setting.pop_x = attach.get.pop_x(list_setting);
		pop.setting.pop_y = attach.get.pop_y(list_setting);
		pop.setting.pop_center = attach.get.pop_center(list_setting);
		pop.setting.fn = function(content_con){
			attach.until.list(content_con, list_info);
		};
		pop.init(attach.property_obj);
	
	},
	list: function(content_con, list_info){
		if(list_info !== undefined && list_info.length>0){
			var html = '<div class="space_line line_top"></div><ul class="simple_list">';
			
			$.each(list_info,function(index, data){
				//"id":"2","user_id":"1","page_id":"abc_page_1","resource_tip":"aaa.com","resource_link":"aaa.com","link_type":"1","create_time":"2013-09-11 19:09:21"
				var resource_link = data.resource_link;
				if(resource_link.search(/\:/)==-1)
					resource_link = "http://"+resource_link;
				var last_class = "";
				if(index == (list_info.length-1)){
					last_class = "last";
				}
				html += '<li class="'+last_class+'"><a href="'+resource_link+'" target="_blank">'+data.resource_tip+'</a></li>';
			
			});
				html +='</ul>';
				html +='<div class="space_line line_bottom"></div><a class="simple_edit_btn" href="javascript:void(0)"></a>';
			content_con.html(html);
		
			$(".simple_edit_btn").click(function(){//点编辑按钮，出大弹层
				pop.until.close_pop();
				attach.until.edit_pop(list_info);
			});
			content_con.find(".simple_list").css({
				"max-height":pop.setting.max_height-150,
			});
			content_con.find(".space_line").css({
				"width":pop.setting.width-28,
			});
		}
		
		
	},
	edit_pop: function(list_info){
		//设置弹层的属性，并且初始化
		var edit_setting = setting.edit_pop;
		pop.setting.width = attach.get.width(edit_setting);
		pop.setting.max_height = attach.get.max_height(edit_setting);
		pop.setting.button_position = attach.get.button_position(edit_setting);
		pop.setting.pop_x = attach.get.pop_x(edit_setting);
		pop.setting.pop_y = attach.get.pop_y(edit_setting);
		pop.setting.pop_center = attach.get.pop_center(edit_setting);
		pop.setting.fn = function(content_con){
			attach.until.edit_list(content_con, list_info);
		};
		pop.init(attach.property_obj);
	
	},
	edit_list: function(content_con, list_info){
		var	$edit_obj = 
			$('<div class="add_btn_cont">'+
				'<div class="add_btn add_web"></div>'+
			'</div>');
		var $list_container = $('<div class="list_container"></div>');
		content_con.append($edit_obj,$list_container);
		$list_container.css({
			"max-height":pop.setting.max_height-120,
		});
		
		attach.until.display_list($list_container, list_info);
		attach.until.add_web($edit_obj,$list_container);
		
	},
	display_list:function($list_container, list_info){
		//显示已有内容
		if(list_info !== undefined && list_info.length>0){
			var $edit_list_obj = $('<ul class="edit_list"></ul>');
			$list_container.append($edit_list_obj);
			
			$.each(list_info,function(index, data){
				attach.until.add_list($list_container, data);
			});
			$list_container.find("li .dis_resource_link").css({
				"width":$list_container.find("li").width()-125,
			});
		}
	},
	add_web:function($edit_obj,$list_container){
		//添加本地文件
		var $add_web_obj = 
			$('<div class="add_web_input">'+
					'<div class="space_line"></div>'+
					'<div class="add_web_form" >'+
						'<div class="fclear input_t">'+
							'<div class="tip_c"><input class="resource_tip" type="text" placeholder="资源" value=""><span class="tip">*</span></div>'+
							'<div class="done_btn">完成</div>'+
							'<div class="cancel_btn">取消</div>'+
						'</div>'+
						'<input class="resource_link" type="text" placeholder="请输入本地文件地址" value=""/>'+
					'</div>'+
			'</div>');
		
		$edit_obj.find(".add_web").click(function(){
			var $add_web_btn = $(this);
			
			if($add_web_btn.hasClass("active")) return false;
			$add_web_btn.addClass("active");
			
			$add_web_obj.appendTo($list_container);
			$list_container.scrollTop($list_container.find("ul").height()+111);
			
			$(".add_web_input .cancel_btn").click(function(){
				$(this).parents(".add_web_input").remove();
				$add_web_btn.removeClass("active");
			});
			
			$(".add_web_input .done_btn").click(function(){
				var $input_container = $(this).parents(".add_web_input");
				var $resource_tip = $input_container.find(".resource_tip");
				var $resource_link = $input_container.find(".resource_link");
				var resource_tip_val = $resource_tip.val(), resource_link_val = $resource_link.val();
				
				if(resource_tip_val.length == 0){
					$resource_tip.next(".tip").html("*").show();
				}
				else if(resource_tip_val.length > 7){
					$resource_tip.next(".tip").html("字数少于7个").show();
				}
				else{
					$resource_tip.next(".tip").html("");
					
					attach.until.insert(resource_tip_val, resource_link_val, function(data){
						$input_container.remove();
						$add_web_btn.removeClass("active");
						//成功后直接加一行显示
						attach.until.add_list($list_container, data);
					});
					
				}
			});
			
		});
	},
	insert:function(resource_tip_val, resource_link_val, fn){
		var url = "http://"+attach.get.server()+"/attach.php?callback=?";
		var postdata = {"f":"insert",
				"user_id":attach.get.user_id(),
				"page_id":attach.get.page_uniq_id(),
				"resource_tip":resource_tip_val,
				"resource_link":resource_link_val
				};
		$.getJSON(url, postdata, function(data){
			var status = data.status;
			
			if(status!=1){
				alert(data.message);
			}
			else{
				if(fn) fn(data.info);
			}
		});
	},
	add_list:function($list_container, list_info){
		//原有连接
		if(list_info !== undefined){
			//"id":"2","user_id":"1","page_id":"abc_page_1","resource_tip":"aaa.com","resource_link":"aaa.com","link_type":"1","create_time":"2013-09-11 19:09:21"
			var resource_link = list_info.resource_link;
			if(resource_link.search(/\:/)==-1)
				resource_link = "http://"+resource_link;
			var $edit_list_obj = $('<li class="fclear" data-id="'+list_info.id+'">'+
						'<div class="li_left"><a class="dis_resource_tip" href="'+resource_link+'" target="_blank">'+list_info.resource_tip+'</a>'+
							'<a class="dis_resource_link" href="'+resource_link+'" target="_blank">'+resource_link+'</a></div>'+
						'<div class="li_right"><div class="delete_btn">删除</div><div class="edit_btn">编辑</div></div>'+
					'</li>');
				
			$list_container.find(".edit_list").append($edit_list_obj);
			
			$edit_list_obj.find(".edit_btn").click(function(){
				attach.until.do_edit($(this));
			});
			
			$edit_list_obj.find(".delete_btn").click(function(){
				attach.until.do_delete($(this));
			});
			
			
		}
	},
	do_edit:function($edit_btn){
		var $parent_li =  $edit_btn.parents("li");
		var $resource_tip = $parent_li.find(".dis_resource_tip");
		var $resource_link = $parent_li.find(".dis_resource_link");
		
		var id = $parent_li.attr("data-id");
		var resource_tip_val = $resource_tip.text();
		var resource_link_val = $resource_link.text();
		
		var $_obj = 
			$('<div class="add_web_input">'+
					'<div class="space_line"></div>'+
					'<div class="add_web_form" >'+
						'<div class="fclear input_t">'+
							'<div class="tip_c"><input class="resource_tip" type="text" placeholder="资源" value="'+resource_tip_val+'"><span class="tip">*</span></div>'+
							'<div class="done_btn">完成</div>'+
							'<div class="cancel_btn">取消</div>'+
						'</div>'+
						'<input class="resource_link" type="text" placeholder="请输入本地文件地址" value="'+resource_link_val+'"/>'+
					'</div>'+
			'</div>');
		$parent_li.css("display","none");
		$parent_li.after($_obj);
		
		$_obj.find(".done_btn").click(function(){
			resource_tip_val = $_obj.find(".resource_tip").val();
			resource_link_val = $_obj.find(".resource_link").val();
			
			attach.until.update(id, resource_tip_val, resource_link_val, function(data){
				$_obj.remove();
				$resource_tip.html(data.resource_tip);
				$resource_link.html(data.resource_link);
				$parent_li.css("display","block");
			});
		});
		
		$_obj.find(".cancel_btn").click(function(){
			$_obj.remove();
			$parent_li.css("display","block");
		});
		
	},
	update:function(id, resource_tip_val, resource_link_val, fn){
		var url = "http://"+attach.get.server()+"/attach.php?callback=?";
		var postdata = {"f":"update",
				"user_id":attach.get.user_id(),
				"page_id":attach.get.page_uniq_id(),
				"id":id,
				"resource_tip":resource_tip_val,
				"resource_link":resource_link_val
				};
		$.getJSON(url, postdata, function(data){
			var status = data.status;
			
			if(status!=1){
				alert(data.message);
			}
			else{
				if(fn) fn(data.info);
			}
		});
	},
	do_delete:function($delete_btn){
		var $parent_li =  $delete_btn.parents("li");
		var id = $parent_li.attr("data-id");
		attach.until.del_confirm(pop.base.pop_obj,function(){
			attach.until.del(id,function(){
				$parent_li.slideUp("slow",function(){$(this).remove();});
			});
		});
	},
	del:function(id, fn){
		var url = "http://"+attach.get.server()+"/attach.php?callback=?";
		var postdata = {"f":"delete",
				"user_id":attach.get.user_id(),
				"page_id":attach.get.page_uniq_id(),
				"id":id
				};
		$.getJSON(url, postdata, function(data){
			var status = data.status;
			
			if(status!=1){
				alert(data.message);
			}
			else{
				if(fn) fn();
			}
		});
	},
	del_confirm:function(containerO, yescallback, nocallback){
		$("#confirmPop").remove();
		var _div = $('<div id="confirmPop">'+
						'<p >是否要删除文件？</p>' +
						'<div class="fclear">' +
							'<div class="TC_delate_btn no_btn"></div>' +
							'<div class="TC_delate_btn yes_btn"></div>' +
						'</div>'+
					'</div>');

		var $pop_mask = $('<div id="delete_pop_mask"></div>');
		$pop_mask.appendTo(containerO);
		$(_div).appendTo(containerO).fadeIn();
		
		//弹窗居中
	 	var pop_top = (pop.base.pop_obj.height()-189)/2;
	 	var pop_left = (pop.base.pop_obj.width()-327)/2;
	 	$(_div).css({
			"top": pop_top,
			"left": pop_left,
		});
	 	
		$(_div).find(".yes_btn").click(function(){
			$(_div).fadeOut('fast');
			$pop_mask.fadeOut('fast');
			if(yescallback) yescallback();
			return true;
		});
		$(_div).find(".no_btn").click(function(){
			$(_div).fadeOut('fast');
			$pop_mask.fadeOut('fast');
			if(nocallback) nocallback();
			return false;
		});
	}
};
