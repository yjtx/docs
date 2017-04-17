/*
* @Author: Administrator
* @Date:   2017-04-10 15:56:42
* @Last Modified by:   Administrator
* @Last Modified time: 2017-04-17 11:43:49
*/

(function () {

	var category_name,rest_param,source_root,file_root,json_root,current_node,first_node,md_path,right_article_title,json_parse,before_node,str='';//定义变量

	zhunbei();

function zhunbei() {
		var file_param = document.location.href.split('#');

		var ooo_potion = file_param[0].indexOf('index.html');
		source_root = file_param[0].substring(0,ooo_potion);//源文件地址
		file_root = source_root +'github/egret-docs';//github地址

		if(file_param[1]) {
		 	rest_param = file_param[1].split('____');
		 	category_name = rest_param[0];
		} else {
			category_name = 'Engine2D';
		}

	     //设置select选中
         $("#product option").each(function (){
            var srcValue2 = $(this).attr('src');
            var txt2 = $(this).text();
            if(srcValue2 == category_name ){
            	 $("#product").val(txt2);
            }
         });

	    json_root = source_root +'github/egret-docs/config/'+ category_name + '.json';//主分类json文件

	     $.ajax({
	         type: "GET",
	         url: json_root,
	         dataType: "text",
	         async: false,
	         success: function(data){
	                    var c = JSON.parse(data);
	                    first_node = getHomeNode(c);
	                    json_parse = c;

	                  }
	     });

	     if(rest_param && rest_param[1] ) {
	     	current_node =  rest_param[1];

	     } else {
	     	current_node = first_node.filename;
	     	right_article_title = first_node.text;
	     }



	     md_path = file_root + current_node + 'README.md';
	     //获取md内容写在append_article_content容器内
	     $.ajax({
	         type: "GET",
	         url: md_path,
	         dataType: "text",
	         async: false,
	         success: function(data){
	         			$("#append_article_content").text(data);
	                  }
	     });

        getTreeList(json_parse,current_node);//获取左侧菜单
		refreshMD(md_path);
	    /**刷新获取 md 文档内容 */
	    function refreshMD(filePath){
	        $("#article_content").html('');
	        $("#left_box").html(str);//设置左侧菜单
	 		var mdcontent = $("#append_article_content").text();
			if(filePath) {
	            ///解析过滤图片路径。![]()
	            var cdnImagePath = file_root + current_node;

		        var mdfliter = mdcontent.replace(/!\[.*?\]\(.*?\)/g,function(match) {
		        	if(match.match(/:\/\//g)) {
		        		return match;
		        	}
		        	var t  = match.split("(");
		        	var r = t[0] + "("+ cdnImagePath + t[1];
		        	return r;
		        });
	            ///解析过滤图片路径，markdown 的第二种写法。[]:
		        mdfliter = mdfliter.replace(/\[.*?\]:.*/g,function (match) {
		        	if(match.match(/:\/\//g)) {
		        		return match;
		        	}
		        	var t = match.split(":");
		        	t[1] = t[1].replace( /^\s*/, '');
		        	r = t[0] +  ": "+ cdnImagePath + t[1];
		        	return r;
		        });
	            ///解析过滤文档链接路径
	            mdfliter = mdfliter.replace(/\[.*?\]\(.*?\)/g,function (match) {
	                var t = match.replace(/README.md/g,"index.html");
	                return t;
	            });

			} else {
	            ///直接读取初始化的文档内容。

				mdfliter = mdcontent;
	            mdfliter = mdfliter.replace(/\[.*?\]\(.*?\)/g,function (match) {
	                var t = match.replace(/README.md/g,"index.html");
	                return t;
	            });
			}

	        ///article_content 显示解析好的内容
	        editormd.markdownToHTML("article_content", {
	                markdown        :   mdfliter ,
	                //htmlDecode      : true,
	                htmlDecode      : true,
	                //toc             : false,
	                tocm            : true,    // Using [TOCM]
	                //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
	                //gfm             : false,
	                //tocDropdown     : true,
	               markdownSourceCode : false, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
	                emoji           : true,
	                taskList        : true,
	                tex             : true,  // 默认不解析
	                flowChart       : true,  // 默认不解析
	                sequenceDiagram : true,  // 默认不解析
	        });

	    }

	    //重写a标签
		$("a").live('click', function(event) {
			event.preventDefault();
	        var textValue = $(this).attr('href');
	        if ( textValue.lastIndexOf("..") > 0) {
	        	var dizhi = textValue.replace("index.html","");
	        	var start_position = textValue.lastIndexOf("..") + 2;
	        	//组装跳转地址
	        	var jump_path = dizhi.substr(start_position);//路径
	        	var ttt = jump_path.split('/');//产品名称
	        	if(ttt[1] === 'tools') {
	        		if(ttt[2] === 'ResDepot' ) {
	        			ttt[1] = 'Depot';
	        		}else if(ttt[2] === 'TextureMerger') {
	        			ttt[1] = 'Merger';
	        		} else {
	        			ttt[1] = ttt[2];
	        		}
	        	}

	        	window.location.href = source_root + 'index.html?version=' + Math.random() + '#' + ttt[1] + '____' + jump_path ;


	        } else{
	        	window.open(textValue);
	        }
		});


	    //下拉切换产品的操作
	    $("#product").change(function(){
	    	var textValue = $(this).val();
	         $("#product option").each(function (){
	            var srcValue = $(this).attr('src');
	            var txt = $(this).text();
	            if(txt == textValue ){
	            	window.location.href = source_root + 'index.html?version=' + Math.random() + '#' + srcValue ;
	            }
	         });
	    });

    ///获取首个文档
    function getHomeNode(nodes) {

            for (i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                ///不渲染不显示节点
                if(n.in_use === false) {
                    continue;
                }
                if (n.children && n.children.length > 0) { // if has children

                    var tmpc = n.children;
		            for (i = 0; i < tmpc.length; i++) {
		                var n = tmpc[i];
		                ///不渲染不显示节点
		                if(n.in_use === false) {
		                    continue;
		                }
		                if (n.children && n.children.length > 0) { // if has children
		                    break;
		                } else {
		                    return n;
		                    break;
		                }
		            }
                    break;
                } else {
                    break;
                }
            }
    }


}//准备方法结束




    function getTreeList(json_file,node_file){

        for (i = 0; i < json_file.length; i++) {
            var n = json_file[i];
            ///不渲染不显示节点
            if(n.in_use === false) {
                continue;
            }

            if (n.children && n.children.length > 0) { // if has children
            	str += '<li id="li_' + i + '" class="easytree-close" name="oneLevel">';
					str +=	'<span id="' + i + '" class="easytree-node easytree-ico-cf easytree-exp-e" name="oneLevel">';
					str +=	'<span class="easytree-expander"></span>';
					str +=	'<span class="easytree-icon"></span>';
					str +=	'<span class="easytree-title">' + n.text + '</span>';
					str +=	'</span>';
					str +=  '<ul  id="ul_' + i + '"  style="display:none" name="twoLevel">';
					//第二次循环
					for(j = 0; j < n.children.length; j++) {
						var t = n.children[j];

			            if(t.in_use === false) {
			                continue;
			            }

						if(t.isFolder === true) {
							str +=	'<li id="three_li_' + j + '" class="easytree-close" name="threeLevel">';
							str +=	'<span id="three_span_' + j + '" class="easytree-node easytree-exp-cl easytree-ico-cf" name="threeLevel">';
							str +=	'<span class="easytree-expander"></span>';
							str +=	'<span class="easytree-icon"></span>';
							str +=	'<span class="easytree-title">'+ t.text +'</span>';
							str +=	'</span>';
							str +=	'<ul  id="three_ul_' + j + '" style="display:none">';
								//第三次循环
								for(m = 0; m < t.children.length; m++) {
									var l = t.children[m];

						            if(l.in_use === false) {
						                continue;
						            }
									//判断是否这里面的节点
									if (l.filename === current_node ) {//如果在
										var tmp_span = '<span  class="easytree-node easytree-exp-n easytree-ico-c easytree-active">';
										var left_str = '<li id="three_li_' + j + '" class="easytree-close" name="threeLevel">';
										var right_str = '<li id="three_li_' + j + '" class="easytree-unclose" name="threeLevel">';
										//打开ul
										str = str.replace(left_str,right_str);
										str = str.replace('<ul  id="ul_' + i + '"  style="display:none" name="twoLevel">','<ul  id="ul_' + i + '"   name="twoLevel">');
										str = str.replace('<ul  id="three_ul_' + j + '" style="display:none">','<ul  id="three_ul_' + j + '" >');
										str = str.replace('<li id="li_' + i + '" class="easytree-close" name="oneLevel">','<li id="li_' + i + '" class="easytree-unclose" name="oneLevel">');
										$("#article_title").html(l.text);//设置md文章标题
									} else {
										var tmp_span = '<span  class="easytree-node easytree-exp-n easytree-ico-c">';
									}

									str +=	'<li class="easytree-unclose">';
									str +=	tmp_span;
									str +=	'<span class="easytree-expander"></span>';
									str +=	'<span class="easytree-icon"></span>';
									str +=	'<a href="../..' + l.filename + 'index.html">';
									str +=	'<span class="easytree-title"  egret_flag="threeMenu">' + l.text + '</span>';
									str +=	'</a>';
									str +=	'</span>';
									str +=	'</li>';

								}
							str +=	'</ul>';
							str +=	'</li>';
						} else {
							//判断是否这里面的节点
							if (t.filename === current_node ) {//如果在
								var tmp_span = '<span  class="easytree-node easytree-exp-n easytree-ico-c easytree-active">';
								var left_str = '<ul  id="ul_' + i + '"  style="display:none" name="twoLevel">';
								var right_str = '<ul  id="ul_' + i + '"   name="twoLevel">';
								//打开ul
								str = str.replace(left_str,right_str);
								str = str.replace('<li id="li_' + i + '" class="easytree-close" name="oneLevel">','<li id="li_' + i + '" class="easytree-unclose" name="oneLevel">');
								$("#article_title").html(t.text);//设置md文章标题
							} else {
								var tmp_span = '<span  class="easytree-node easytree-exp-n easytree-ico-c">';
							}
							str +=	'<li>';
							str +=	tmp_span;
							str +=	'<span class="easytree-expander"></span>';
							str +=	'<span class="easytree-icon"></span>';
							str +=	'<a href="../..' + t.filename + 'index.html">';
							str +=	'<span class="easytree-title" >' + t.text + '</span>';
							str +=	'</a>';
							str +=	'</span>';
							str +=	'</li>';
						}
					}
					str +=  '</ul>';

            } else {
            	str += '</li>';
            	break;
            }


        }//循环结束
    }

	    $("span[name='oneLevel']").click(function(e) {
	    	e.preventDefault();
	    	var curentClass,otherClass;
	    	if( $(this).parent('li').hasClass("easytree-unclose") ) {
	    		curentClass = 'easytree-close';
	    		otherClass = 'easytree-unclose';
	    		$(this).siblings("ul").hide();

	    	} else {
	    		curentClass = 'easytree-unclose';
	    		otherClass = 'easytree-close';
	    		$(this).siblings("ul").show();
	    	}
	    	$(this).parent('li').removeClass(otherClass).addClass(curentClass);
	    	$(this).parent('li').siblings().removeClass('easytree-unclose').addClass('easytree-close');
	    	$(this).parent('li').siblings().children("ul").hide();

	    });

	    $("span[name='threeLevel']").click(function(e) {
	        e.preventDefault();
	        e.stopPropagation();

	      	$(this).siblings('ul').toggle();

	    });

	    // 修改左侧菜单栏高度
	    function resize(){
		    var screenH = document.documentElement.clientHeight-55;
		    $('#treelist').css({'height':screenH});
	    }
	    window.onresize = function(){
	    	resize();
		}
	    resize();

})();//结束