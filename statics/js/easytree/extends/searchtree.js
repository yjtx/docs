///easytree 扩展函数
var easyTreeExtends = (function(){
    ///传入 easytree 对象
    var ext = function( easytree ) {
        this.easytree = easytree;
    }
    ///搜索某个节点
    ext.prototype.search = function ( txt ) {
        if( txt ){
            var nodes = this.easytree.getAllNodes();
        } else {
            console.warn( "wrong input serch val" );
        }
        res = [];
        return searchNode( nodes,txt );
    }
    var res = [];
    function searchNode(nodes, txt) {
            var i = 0;
            for (i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var t = n.text;
                if( n.text.match(txt) ) {
                    //sava result
                    res.push( n );
                }
                var hasChildren = n.children && n.children.length > 0;
                if (hasChildren) {
                    searchNode(n.children, txt);
                }
            }

            return res;
        }
    ///获取首个节点
    ext.prototype.getHomeNode = function ( nodes,toggleNode,callback ) {  
            var easytree = this.easytree;    
            for (i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                ///不渲染不显示节点
                if(n.in_use === false) {
                    continue;
                } 
                if (n.children && n.children.length > 0) { // if has children
                    this.getHomeNode( n.children,toggleNode,callback );
                    if( toggleNode ) {
                        easytree.toggleNode( n.id );
                    }
                    break;
                } else {
                    callback( n );
                    break;
                }
            }
    }
    ///根据 filename / id 字段获取 node 节点
    ext.prototype.getNodeByFileName = function (nodes,name,links,type) {
            var easytree = this.easytree;
            var i = 0;
            if( !nodes ) {
                nodes = easytree.getAllNodes();
            }
            if( !links) {
                links = [];
            }

            for (i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                switch (type) {
                    case "id":
                        var t = n.id;
                        break;   
                    default:
                        var t = n.filename;
                        break;
                }
                if (t == name) {
                    return n;
                }
                var hasChildren = n.children && n.children.length > 0;
                if (hasChildren) {
                    ///links获得层级结构
                    links.push( n.id );
                    var node = this.getNodeByFileName(n.children, name, links, type);
                    if ( node ) {
                        node.links = links; 
                        return node;
                    }
                } 
            }
            return null;
    }
    ///折叠node
    ext.prototype.toggleNode = function (node,nodes) {
            var easytree = this.easytree;
            if(!nodes)
                nodes = easytree.getAllNodes();

            var pid = node.id.split("_");
            var str = "";
            for(var i in pid) {
                if( i == 0) {
                    str = pid[i]
                } else if( i == pid.length - 1) {
                    break;
                } else {
                    str += "_" + pid[i];  
                }
            }
            
            var parentsNode = easytree.getNode(str);
            
            if( parentsNode ) {
                if( !parentsNode.isExpanded ){
                    easytree.toggleNode( parentsNode.id );
                    this.toggleNode( parentsNode,nodes );
                }
            } else {
                return str;
            }
    }
    return ext;
})();