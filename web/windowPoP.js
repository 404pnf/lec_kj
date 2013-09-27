//定义一个弹出窗口
(function () {
    //弹窗函数
    function WindowPop(Vargs){
        this.width = Vargs.width;
        this.height = Vargs.height;
        this.isMask = Vargs.isMask;
        this.fn = Vargs.fn;
        var _this = this;

        //创建窗口
        this.oNewBox = this.createHtml();

        //创建遮罩
        if(this.isMask){
            this.oMask = $("<div id='masker'></div>");
            this.oMask.height($(window).height());
            this.oMask.css("top",$(window).scrollTop());
            $("body").append(this.oMask);
        }
		
		//拖拽滚动条
		var olfFun = window.onscroll;
		if(typeof window.onscroll!="function"){
			window.onscroll= function(){
				_this.resetScroll();
			}
		}else{
			window.onscroll = function(){
				olfFun();
				_this.resetScroll();
			}
		}
		
		
        //点击关闭
        this.oNewBox.oCloseBTn.click(function(){
            _this.closedBox();
			$("body").css("overflow","auto");
        })
        //重置浏览器事件
        $(window).resize(function () {
            var nWindowWidth = $(window).width();
            var nWindowHeight = $(window).height();
            _this.oNewBox.oPopBox.animate({
                "left":nWindowWidth / 2,
                "margin-left":-(_this.oNewBox.oPopBox).width() / 2,
                "top":nWindowHeight / 2+$(window).scrollTop(),
                "margin-top":-(_this.oNewBox.oPopBox).height() / 2
            }, 300);
            _this.oMask.css({
                "width":nWindowWidth,
                "height":nWindowHeight,
                "overflow":"hidden"
            });
        })
    }
    WindowPop.prototype={
        createHtml:function(){
            var oPopBox = $("<div id='oPopBox' class='zz_book_Onepl' style='background:#fff'></div>");
            var oBoxContent = $("<div id='oboxcon'></div>");
            var oCloseBTn = $("<div class='tanchu_close'><img src='/web/images/tanchu_close.png'></div>");
            oPopBox.append(oCloseBTn);
            oPopBox.append(oBoxContent);
            oPopBox.width(this.width);
            oPopBox.height(this.height);
            oPopBox.css("margin-top",-oPopBox.height()/2);
            return {
                oPopBox:oPopBox,
                oBoxContent:oBoxContent,
                oCloseBTn:oCloseBTn
            };
        },
		resetScroll:function(){
			var boxtotop = $(window).height()/2 + $(window).scrollTop();
			var masktotop = $(window).scrollTop();
			this.oNewBox.oPopBox.css("top",boxtotop);
			this.oMask.css("top",masktotop);
		},
        openBox:function() {
            $("body").append(this.oNewBox.oPopBox);
            this.moveTocenter(this.oNewBox.oPopBox);
			$("body").css("overflow","hidden");
            if(this.fn){
                this.fn(this.oNewBox.oBoxContent);
            }
        },
        closedBox:function () {
            this.oNewBox.oPopBox.remove();
            $("#masker").remove();
        },
        moveTocenter:function (oBox) {
            var nWindowWidth = $(window).width();
            var nWindowHeight = $(window).height();
            oBox.css({
                "position":"absolute",
                "left":nWindowWidth/2,
                "margin-left":-oBox.width()/2,
                "top":nWindowHeight/2+$(window).scrollTop(),
                "margin-top":-oBox.height()/2
            });
        }
    }
    window.WindowPop = WindowPop;
})();
