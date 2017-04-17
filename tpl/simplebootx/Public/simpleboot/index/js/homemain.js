/***
 * 首页滚动效果，传入参数 id bg 。tittle message 为打字效果参数，srcbase为图片跟目录
 */

var scrollBanner = (function () {

	var scrollBanner = function (id,bg,title,message,srcbase,src) {
		this.id = id;
		this.bg = bg;
		this.title = title;
		this.stageW = $(window).width();
		this.stageH = $(window).height();
		this.offsetTop = 50;
		// this.src = "img/dist/banner.jpg";
		this.srcbase = srcbase;
		this.src = src ? src : "";
		this.titleTextMessage = [];
		console.log("-----------message",message);
		for(var i in message) {
			this.titleTextMessage.push(message[i].split(""));
		}
		this.titleTypeingIndex = 0;
		this.titleText = $(this.title).find(".title-sub").text();
		this.typeingSpeed = 120;
		this.typeingSleep = 5000;
		this.typeingItem = 0;
		this.stopTypeing = false;
		this.onMouseOver = false;
//		window.addEventListener("resize",this.onResize.bind(this));
		$(window).on("resize",this.onResize.bind(this))
		$(window).on("scroll",this.onScroll.bind(this));
		//初始化效果
		this.init();
	}
		
	scrollBanner.prototype.init = function () {
		console.log(this.id,this.stageH,this.stageW);
		var self = this;
		$(this.id).css(
			{
				"width":this.stageW,
				"height":this.stageH,
				"opacity":1
			}
		);
		$(this.id).find(this.bg).css({
	    	"background-image":"url(" + this.src + ")",
	    	"height": this.stageH
	    });
	    $(this.id).find(this.title).css({
	    	"margin-top":-$(this.id).find(this.title).height(),
	    	"opacity":1
	    });
		$(document.body).css(
			{
				"padding-top":this.stageH
			}
		);
		var title = $(this.id).find(this.title)[0];
		this.textTop = this.getElementTop(title);	
		// this.typeing(0,this.titleText,this.typeingItem,1);
		//导航条折叠样式
		if(this.stageW < 976) {
			$("nav.navbar").css(
				{
					height:"auto"
				}
			)
		}
		console.log("video,**********",$("#bgvid"),"::::::::",this.stageW);
		if(this.stageW < 600){
			console.log("video,**********",$("#bgvid"));
			$("#bgvid").remove();
		}
		 //添加导航条鼠标事件
		 $("nav").mouseenter(function(e){
			 //console.log("on navbar mouseenter");
			 self.onMouseOver = true;
			 if(!self.navblack)
			 	$("nav").addClass("navber-black");
		 });
		 $("nav").mouseleave(function(e){
			 //console.log("on navber mouse leave",this.navblack,!this.navblack);
			 self.onMouseOver = false;
			 if($(e.target).hasClass("subMenuLink")){
				 console.log(e.target,this,e.currentTarget);
				 window.setTimeout(function(){
					if(!self.navblack)
						$("nav").removeClass("navber-black");
					bar.onMouseLeave(e,$(".productBox.dropdown"));
				 },700);
			 } else {
				if(!self.navblack)
					$("nav").removeClass("navber-black");
					bar.onMouseLeave(e,$(".productBox.dropdown"));
			 }
		 });
	}

	scrollBanner.prototype.onResize = function (e) {
		console.log("on resize start",e);
		this.stageW = $(window).width();
		this.stageH = $(window).height();
		this.init();		
	}
	scrollBanner.prototype.onScroll = function (e) {
//		console.log(e);
		var scale1 = 0.142875,
			scale2 = 0.333333;
		var title = $(this.id).find(this.title)[0];
	
		var top = -$(window).scrollTop();
		var fade = (this.getElementTop(title) + top) / this.textTop;

		//navbar高度

		var navbarHeight = $("nav").height();

		$(this.id).find(this.bg).css(
			{
				"transform" : "matrix(1, 0, 0, 1, 0, " + top * scale1 + ")",
				"height": this.stageH
			}
		);
		$(this.id).find(this.title).css(
			{
				"transform" : "matrix(1, 0, 0, 1, 0, " + top * scale2 + ")",
				"opacity": fade
			}
		)
		if( $(window).scrollTop() >= this.stageH - navbarHeight - this.offsetTop && !this.navblack){
			console.log("change color");
			if( !this.onMouseOver )
				$("nav").addClass("navber-black");
			// $(".navbar-brand").find("img").attr("src",this.srcbase + "logo-dark.png");
			// $(".navbar-login").find("img").attr("src",this.srcbase + "login-dark.png");
			this.navblack = true;
		} else if ( $(window).scrollTop() < this.stageH - navbarHeight - this.offsetTop ) {
			if( !this.onMouseOver )
				$("nav").removeClass("navber-black");
			// $(".navbar-brand").find("img").attr("src",this.srcbase + "logo.png");
			// $(".navbar-login").find("img").attr("src",this.srcbase + "login.png");
			this.navblack = false;
		}
	};
	//打字动画
	scrollBanner.prototype.typeing = function (index,text,item,diraction) {
		var self = this;
		// console.log(item,this.titleTextMessage);
		if( this.stopTypeing ) {
			return false;
		}
		if( index <= this.titleTextMessage[item].length * 2 + 1) {
			if( index === this.titleTextMessage[item].length + 1 ) {
				diraction = 0;
				index++;
				$(this.title).find(".title-sub").addClass("animated-typeing");
				window.setTimeout(function(){
					self.typeing(index,self.titleText,self.typeingItem,diraction);
				},this.typeingSleep);
				return 1;
			} else if (index > this.titleTextMessage[item].length + 1) {
				diraction = 0;
			}
			else {
				diraction = 1;
			}
			if( diraction ){
				text += this.titleTextMessage[item].slice(index-1,index++);
				$(this.title).find(".title-sub").text(text);
				$(this.title).find(".title-sub").removeClass("animated-typeing");
				window.setTimeout(function () {
					self.typeing(index,text,self.typeingItem,diraction);
				},this.typeingSpeed);
				return 1;
			} else {
				text = $(this.title).find(".title-sub").text().slice(0,-1);
				$(this.title).find(".title-sub").text(text);
				index++;
				window.setTimeout(function () {
					self.typeing(index,text,self.typeingItem,diraction);
				},this.typeingSpeed / 2);
				return 1;
			}
		} 
		// console.log(item,this.titleTextMessage[item]);
		if(self.typeingItem < this.titleTextMessage.length - 1){
			self.typeingItem ++;
		} else {
			self.typeingItem = 0;
		}
		$(this.title).find(".title-sub").addClass("animated-typeing");
		window.setTimeout(function(){
			self.typeing(0,self.titleText,self.typeingItem,diraction);
		},this.typeingSleep / 3);
	}
	
	
	//以下函数获得画布相对页面距离
	scrollBanner.prototype.getElementLeft = function (element) {　
	    var actualLeft = element.offsetLeft;　　　　
	    var current = element.offsetParent;　　　　
	    while (current !== null) {　　　　　　
	        actualLeft += current.offsetLeft;　　　　　　
	        current = current.offsetParent;　　　　
	    }　　　　
	    return actualLeft;　　
	}　　
	scrollBanner.prototype.getElementTop = function (element) {　　　　
	        var actualTop = element.offsetTop;　　　　
	        var current = element.offsetParent;　　　　
	        while (current !== null) {　　　　　　
	            actualTop += current.offsetTop;　　　　　　
	            current = current.offsetParent;　　　　
	        }　　　　
	        return actualTop;　　
	    }
	return scrollBanner;
})();
/***
 * 首页解析bbs内容
 */
(function () {

	var getUcenterUId = function ( url ) {
		if(url) {
			console.log(url.match(/uid=.*/g)[0]);
			var match = url.match(/uid=.*/g)[0];
			return match.split("=");
		} else {
			return false;
		}
	}
	var createEle = function ( className, ele, text ) {
		var elename = ele ? ele : "div";
		var t = text ? text : "";
		var div = document.createElement(elename);
		$(div).text(t);
		if( className ) {
			$(div).addClass(className);
			return div;
		} else {
			return div;
		}
	} 

	var container = $("#bbs-container");
	$("#bbslist .xld .cl").each(function(item){
		var self = this;
		var uid = getUcenterUId($(self).find("dt .y a").attr("href"))[1];
		var shortDes = $(self).find("dd").text(),
			author = $(self).find("dt .y a").text(),
			ava = "http://bbs.egret.com/uc_server/avatar.php?uid=" + uid,
			title = $(self).find("dt>a").text();
		var cell = createEle("cell");
		$(cell).addClass("row");
		$(container).append(cell);
		var cellGroup = createEle("cell-group-justified"); 
		$(cell).append(cellGroup);
		var cellGroupAva = createEle("cell-group-avatar");
		$(cellGroupAva).addClass("cell-group");
		// $(cellGroupAva).addClass("hidden-xs");
		$(cellGroup).append(cellGroupAva);
		var imgAva = createEle("avatar","img");
		$(imgAva).addClass("img-circle");
		imgAva.src = ava;
		$(cellGroupAva).append(imgAva);
		var cellTitle = createEle("cell-group");
		var cellTitleLink = createEle("xst","a");
		$(cellTitleLink).attr("href",$(self).find("dt>a").attr("href"));
		$(cellTitleLink).text(title);
		$(cellTitleLink).attr("target","_blank");
		$(cellTitle).addClass("cell-group-middle");
		$(cellGroup).append(cellTitle);
		$(cellTitle).append(cellTitleLink);
		var title2 = createEle("title2");
		var authorSpan = createEle("" , "span","发布者");
		$(cellTitle).append(title2);
		// $(title2).append(authorSpan);
		var authorLink = createEle("" , "a",author);
		// $(title2).append(authorLink);
		// console.log("------uid",ava);
		// console.log(self,$(self).find("dd").text(),$(self).find("dt .y a").text(),$(self).find("dt>a").text());
	});
	var bannercontainer = $("#bbs-slideshow-container");
	console.log("-----------",bannercontainer,$('#bbsbanner'));
	$('#bbsbanner .q_topltslide').each(function(item) {
		var self = this;
		console.log("-----------",self);
		$(".rpic li>a").each(function( item ){
			var imgLink = this;
			$(imgLink).addClass("slide");
			console.log("----------",imgLink);
			console.log($($(".rtxt li>a")[item]).text());
			var bbsTitle = createEle("bbs-slide-title","span",$($(".rtxt li>a")[item]).text());
			$(imgLink).append(bbsTitle);
			$(bannercontainer).append(imgLink);
		});
	});

})();