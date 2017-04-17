
$(document).ready(function(){
	// navBar.initNavBar();
	//初始化导航
	loginBar.initNavBar();
	loginOutBar.initNavBar();
	expBar.initNavBar();
});

/**
 * @param liClass
 * @param subNavClass
 * @param minlength 单列最小长度
 * @param subWidth 菜单宽度
 * @param subHeight 菜单高度
 * @param animation 是否执行动画
 * @param subLiClass
*/
var navBar = function(liClass,subNavClass,minlength,subWidth,subHeight,animation,subLiClass) {
	this.top = "nav";
	this.dropdown = ".dropdown"
	this.liClass = "." + liClass;
	this.subNavClass = "." + subNavClass;
	this.minListLength = minlength;
	this.subHeight = subHeight;
	this.subWidth = subWidth;
	this.subLiClass = "." + subLiClass;
	this.display = 0;
	this.mobileMenu = 0;
	this.animation = animation;
	this.winWidth = $(window).width();
	////设置导航栏拐点
	this.navColls = 928;
};

navBar.prototype.initNavBar = function () {
	console.log("initNavBar ---------",this.liClass,this.dropdown);
	this.winWidth = $(window).width();
	var self = this;
	//隐藏菜单
	$(this.top).find(self.liClass).find(this.subNavClass).hide();
	if( self.winWidth < self.navColls ) {
		$(this.liClass + this.dropdown + ">a").on("click",function(e){
			self.onCLick(e,this,self);
		});
	} else {
		$(this.liClass + this.dropdown).mouseenter(function (e) {
			self.onMouseEnter(e,this,self);
		});
		$(this.liClass + this.dropdown).mouseover(function(e){
			self.onMouseEnter(e,this,self);
		});
		$(this.liClass + this.dropdown).mouseleave(function(e){
			self.onMouseLeave(e,this,self);
		});
	}
};
///折叠状态下使用监听click事件
navBar.prototype.onCLick = function (e,item) {

	var self = this;
	var target = e.currentTarget;
	// console.log("on click",$(self.top),$(self.top).find(self.liClass),$(self.top).find(self.liClass).find(self.subNavClass));
	$(self.top).find(self.liClass).find(self.subNavClass).toggle();
	var subWidth = self.subWidth;
	var itemLeft = 18;
	$(self.top).find(self.liClass).find(self.subNavClass).each(function(index) {
		var item = this;
		var listnumber = $(item).find(self.subLiClass).length;
		//宽度，折叠下宽度固定
		var listWidth = subWidth;
		// console.log("--------------",listnumber,listWidth,item,$(item).find(self.subLiClass),itemLeft);
		$(item).css({
			"width": listWidth,
			"left": itemLeft
		});
	});
	e.stopPropagation();
	e.preventDefault();
}


navBar.prototype.onMouseLeave = function (e,item) {
	var self = this;
	//判断是否在主菜单上离开
	// return false;

	if( item !== e.target) {
		//隐藏菜单
		if(self.animation) {
			$(item).find(self.subNavClass).css({
				height : 0,
				"border-top-width": 0
			});
		} else {
			$(item).find(self.subNavClass).hide();
		}
		console.log(item,e.target,e.currentTarget);
	}
	this.display = 0;
}

navBar.prototype.onMouseEnter = function (e,item) {
	var self = this;
	if(self.animation) {
		$(self.top).find(self.liClass).find(self.subNavClass).css({
			height:(self.minListLength + 1) * self.subHeight,
			"border-top-width": "1px"
		});
	}

	//显示菜单
	$(self.top).find(self.liClass).find(self.subNavClass).show();
	var subWidth = self.subWidth;
	var itemLeft = 0;
	$(self.top).find(self.liClass).find(self.subNavClass).each(function(index) {
		var item = this;
		var listnumber = $(item).find(self.subLiClass).length;
		//宽度，折叠下宽度固定
		var listWidth = self.winWidth < self.navColls ?  subWidth : Math.ceil(listnumber / self.minListLength) * subWidth;
		console.log("--------------",listnumber,listWidth,item,$(item).find(self.subLiClass),itemLeft);

		$(item).css({
			"width": listWidth,
			"left": itemLeft
		});
		//左侧偏移,折叠下不偏移
		if( self.winWidth < self.navColls ) {
			itemLeft = 0;
		} else {
			itemLeft += listWidth;
		}

	});
	this.display = 1;
}
/**
 * @param setup setup.text setup.link setup.listIcon
 */
navBar.prototype.getList = function (setup) {
    setup = setup || {};
	var listLi = document.createElement("li");
	if(setup.liClass){
		$(listLi).addClass(setup.liClass);
	} else {
		$(listLi).addClass(this.liClass.slice(1));
	}

	var listLiA = document.createElement("a");
	var listIcon = document.createElement("span");
	$(listLiA).addClass("subMenuLink");
	if(setup.text)
		$(listLiA).text(setup.text);
	if(setup.link)
		$(listLiA).attr("href",setup.link);
	if(setup.listIcon) {
		$(listIcon).addClass(setup.listIcon);
		$(listLiA).append(listIcon);
	}
	$(listLi).append(listLiA);
	return listLi;
}
//示例导航栏下拉菜单
var expBar = new navBar("expBox","subnav-products",4,100,50,false,"productBox");

//产品导航栏下拉菜单,导航栏拐点 928px
if($(window).width() < 928) {
	var docbarSubWidth = 200;
} else {
	var docbarSubWidth = 200;
}
var bar = new navBar("productBox","subnav-products",4,docbarSubWidth,50,false,"productBox");
//登陆注册下拉菜单
var loginBar = new navBar("logintBox","subnav-login",4,100,50,false,"logintBox");
//登陆之后下拉菜单
var loginOutBar = new navBar("logintOutBox","subnav-login-out",4,150,50,false,"logintOutBox");

(function() {
	///获取并解析文档分类导航
    $(".productBox>a").each(function (index) {
        var doc = "/cn/github/egret-docs/config/index.json";
        console.log(window.location.host + doc);
        if($(this).text() == "文档") {
            var item = this;

            // console.log("文档");
            $.ajax({
                type: 'GET',
                url: "http://" + window.location.host + doc,
                data: "",
                success: function(data) {
                    // console.log(data);
                    var docHos = "/cn/github/egret-docs/";
                    var docHos1 = "/cn/github/api/";
                    var newDocHos = "/cn/doc/index/";
					for(var j = 0; j < data.length; j ++) {
						if( data[j].children ) {
							console.log(data[j].text);
							var titlelList = bar.getList({
								text:data[j].text,
								link:"",
								liClass:"titleBox"
							});
							console.log(titlelList);

							var listData = data[j].children;
							$(item).parent().addClass("dropdown");
							var listParent = $(item).parent();
							var listUl = document.createElement("ul");
							$(listUl).addClass("subnav subnav-products flex");
							$(listParent).append(listUl);
							var showList = 0;

							$(listUl).append(titlelList);

							for(var i in listData) {
								console.log(listData[i]);
								if(listData[i].in_use == "true"){
									var t = listData[i].filename.split(".");
									var list2 = bar.getList({
										text: listData[i].text,
										link: "http://" + window.location.host + docHos + t[0] + "/index.html?home=1",
										//link: "http://" + window.location.host + docHos1 + t[0] + "/index.html?home=1",
										//link: "http://" + window.location.host + newDocHos + t[0] + "/index.html",
										listIcon: t[0]
									});
									$(listUl).append(list2);
									showList++;
								}
							}
							var blankLenght = (bar.minListLength - showList % bar.minListLength) % bar.minListLength;
							for( var i = 0; i < blankLenght; i ++ ) {
								var list = bar.getList();
								$(listUl).append(list);
							}
							console.log($(listUl).width());
							$(titlelList).css({
								width: Math.ceil(listData.length / bar.minListLength) * bar.subWidth
							})
						}
						showList = 0;
					}
					console.log("------------------add initnavbar");
					bar.initNavBar();
                },
                dataType: "json"
            });
        }
    });
	///折叠状态下清除特定浮动样式
	console.log($(".media-clear-pull"),$(window).width(),bar.winWidth);
	if(bar.winWidth < bar.navColls) {
		console.log($(".media-clear-pull"));
		$(".media-clear-pull").removeClass("pull-right");
		$(".media-clear-pull").removeClass("pull-left");
	}
})();