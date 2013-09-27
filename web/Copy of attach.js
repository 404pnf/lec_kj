//阅读器
var  n = reader || {};

//设备
reader.device = (function(window){
	var deviceWidth = $(window).width();
	var deviceHeight = $(window).height();
	return {
		width:deviceWidth,
		height:deviceHeight
	}
})(window);

reader.info = {
    fontSize:14,                     //字体
    bookId:11,                       //图书id
    userId:0,                        //用户是否登录   
    has_sc:0,                        //用户是否已经收藏本书，未0，1收藏但未提示，2提示过
    chapterId:172,                   //当前章节
    language:1,                      //阅读语种
    start:0,                         //阅读进度段落
    type:1,                          //图书是1，公开课2
    catalog:"",                      //公开课共有章节
    mode:'0',                        //公开课共有章节
    showstatus:{"zh":1,"en":1,"zh_en":1},
    loginurl:'/smarty/view/login.php?destination=/book/reading/11',
    pageLength:0,                    //该章节的长度PX
}

//阅读器的初始化
reader.init = function(){
	
	//下载页面之后隐藏工具条
	$( "#reader_headerBar" ).fixedtoolbar("hide");
	$( "#reader_footBar" ).fixedtoolbar("hide");
	
    //设置阅读器的容器
    reader.set.pageContainer(); 
    //下载页面
    var url = "/book/content/chapter/"+reader.info.type+"/"+reader.info.language+"/"+reader.info.bookId+"/"+reader.info.chapterId+"/100000";
    reader.until.loadPageByChapter(url);
    //绑定翻页功能
    reader.controller.nextPage();
    reader.controller.prePage();
    //绑定返回页面的功能
    reader.controller.backHome();

};
//获取元素的方法
reader.method = {
    getReaderWidth:function(){
        return (reader.device.width - 20);
    },
    getReaderHeight:function(){
        return (reader.device.height);
    },
    pageContainer:function(){
        return $("#pageContainer");
    },
    page:function(){
        return $("#page");
    },
    loadImg:function(){
        return $("#loadimg");
    },
    flagPosition:function(){
        return $("#flag").offset();
    },
    getCurrentPos:function(){
        return parseInt(this.page().offset().left,10);
    },
    backHomeBtn:function(){
        return $("#backHome");
    }

}
//设置阅读器的方法
reader.set = {
    //设置容器的大小
    pageContainer:function(){
        //设置阅读器的大小
        var pageContainer = reader.method.pageContainer();
        pageContainer.css({
            "width":reader.device.width,
            "height":reader.device.height
        });
        //设置document的宽度
        $(document).width(reader.device.width);
    },
    //设置分页
    pageSub:function(){
        var page = reader.method.page();
        //分页       
        page.css({
            "height":"100%",
            "column-width":reader.method.getReaderWidth(),
            "-moz-column-width":reader.method.getReaderWidth(),
            "-webkit-column-width":reader.method.getReaderWidth()
        });
        //计算页数，设定宽度，解决浏览器滑动抖动的问题,
        reader.info.pageLength = Math.abs(reader.method.flagPosition().left)+reader.method.getReaderWidth()+10;
        page.css("width",reader.info.pageLength-20);
    },
    //reset重置阅读器
    pageReset:function(){
        //分页之前要处理一些信息，将样式返回
        var page = reader.method.page();
        page.css({"left":0,"width":'',"height":'', "column-width":'',"-webkit-column-width":''});
        page.html("");
    }
}


reader.controller = {   
    //isAnimate标记是否在动画中
    isAnimate:true,
    //后翻页
    nextPage:function(){
        var pageContainer = reader.method.pageContainer();
        var page = reader.method.page();
        pageContainer.swipeleft(function(evt){
            //如果正在加载中，则直接返回
            if(reader.method.loadImg().css("display")==="block"){return false;}
            if(reader.controller.isAnimate){
                reader.controller.isAnimate = false;
                var currentPos = reader.method.getCurrentPos();
                if(Math.abs(currentPos)+reader.device.width>=reader.info.pageLength){
                    var url = "/book/content/chapter/"+reader.info.type+"/"+reader.info.language+"/"+reader.info.bookId+"/"+(reader.info.chapterId+1)+"/10000000";
                    reader.until.loadPageByChapter(url,"nextPage");
                    reader.controller.isAnimate = true;
                    return false;
                }
                page.animate({"left":currentPos-reader.device.width},function(){
                    reader.controller.isAnimate = true;
                });
            }else{
                return false;
            }       
        });
    },
    //前翻页
    prePage:function(){
        var pageContainer = reader.method.pageContainer();
        var page = reader.method.page();
        pageContainer.swiperight(function(evt){
            //如果正在加载中，则直接返回
            if(reader.method.loadImg().css("display")==="block"){return false;}
            if(reader.controller.isAnimate){
                reader.controller.isAnimate = false;
                var currentPos = reader.method.getCurrentPos();
                if(Math.abs(currentPos)<=0){
                    var url = "/book/content/chapter/"+reader.info.type+"/"+reader.info.language+"/"+reader.info.bookId+"/"+(reader.info.chapterId-1)+"/10000000";
                    reader.until.loadPageByChapter(url,"prePage");
                    reader.controller.isAnimate = true;
                    return false;
                }
                page.animate({"left":currentPos+reader.device.width},function(){
                    reader.controller.isAnimate = true;
                });
            }else{
                return false;
            }       
        });
    },
    //返回
    backHome:function(){
        reader.method.backHomeBtn().click(function(){
            var a = reader.until.getCurPageFirstElement();
            //console.log(a);
        });
    }


}

reader.until = {
    //通过chapter获取文章内容
    loadPageByChapter:function(url,direction,fn){
        reader.method.loadImg().css("display","block");
        //初始化阅读器
        reader.set.pageReset();
        $.get(url, function(data){
            var page = reader.method.page();
            var data = $.parseJSON(data);
            var flag = "<div id='flag'>---本章完</div>";
            page.html(data.content+flag);
            reader.method.loadImg().css("display","none");
            reader.set.pageSub();
            if(direction==="nextPage"){
                reader.info.chapterId = reader.info.chapterId + 1;                
            }else if(direction==="prePage"){
                page.css("left",-reader.method.flagPosition().left+10);
                reader.info.chapterId = reader.info.chapterId - 1;
            }else{
                reader.info.chapterId = reader.info.chapterId;
            }
        });
    },
    // 获取当前页面的第一个段落
    getCurPageFirstElement:function(){
        var page = reader.method.page();
        var currentPos = reader.method.getCurrentPos();
        $.each(page.find(".segment"),function(i,val){
            // reader.info.pInfo["s"+ $(val).attr("segmentid")] = $(val).offset();
            //console.log(Math.abs($(val).offset().left)-10);
            //console.log(Math.abs(currentPos));
            console.log($(val).offset());
            console.log(Math.abs(currentPos));
            if(Math.abs($(val).offset().left)-10===Math.abs(currentPos)){
                console.log($(val).html()) ;
                return false;
            }
        });
    }
}

