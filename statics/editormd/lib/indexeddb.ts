class indexeddb{
    public constructor(){
       
    }
   
   
    private db:any=null;
    private dbName="editormddb";
    private tableName="res";
    public list=[];
    public uploadURL="";
    public $:any = jQuery;

   
    public delete(){
        var deleteDbRequest = window.indexedDB.deleteDatabase(this.dbName);
        deleteDbRequest.onsuccess = function (event) {
            console.log("success delete db");
        };
        deleteDbRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };
    }
   
   
    public close(){
        this.db.close();
    }
   

    public all(calls){
       
        var $_this=this;
        var request = indexedDB.open($_this.dbName);

        request.onupgradeneeded = function() {
            var db = request.result;
            if(!db.objectStoreNames.contains($_this.tableName))
            db.createObjectStore($_this.tableName, {keyPath: "id"});
        };
        request.onsuccess = function() {
            $_this.list=[];
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects=store.openCursor();
            objects.onsuccess=function(e){
                var cursor = objects.result;
                if (cursor) {
                    $_this.list.push(cursor.value)
                    cursor.continue();
                } else {
                    if(calls)
                    calls($_this.list);
                }
               
            };
        };
       
    }
    public get(key:any,calls){
       
    }
    
    public put(item:any,isReplace:boolean=false){
       
        var $_this=this;
        var request = indexedDB.open($_this.dbName);

        request.onupgradeneeded = function() {
            var db = request.result;
            if(!db.objectStoreNames.contains($_this.tableName))
            db.createObjectStore($_this.tableName, {keyPath: "id"});
        };

        request.onsuccess = function() {
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects=store.get(item.id);
            objects.onsuccess=function(e){
                var item1=e.target.result;
                if(isReplace)
                {
                    store.put(item);
                }
                else{
                    if (item1 === undefined)
                    {
                        store.put(item);
                    }
                }
                $_this.uploadAll();
            };
        };

    }
    
    public uploadAll(){
        var $_this=this;
        $_this.all(function(data)
        {
            for(var i=0;i<$_this.list.length;i++)
            {
                if($_this.list[i].status===0)
                {
                   $_this.updateStatus($_this.list[i]);
                   break;
                }
            }
        });
    }
    
    private updateStatus(item){
        var $_this=this;
        var request = indexedDB.open($_this.dbName);

        request.onupgradeneeded = function() {
            var db = request.result;
            if(!db.objectStoreNames.contains($_this.tableName))
            db.createObjectStore($_this.tableName, {keyPath: "id"});
        };

        request.onsuccess = function() {
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects=store.get(item.id);
            objects.onsuccess=function(e){
                var item1=e.target.result;
                if (item1 !== undefined && item1.status===0)
                {
                    $_this.ajax(item);
                    
                }
            };
        };
    }
    
    private status(item:any,statuss:number){
        var $_this=this;
        var request = indexedDB.open($_this.dbName);

        request.onupgradeneeded = function() {
            var db = request.result;
            if(!db.objectStoreNames.contains($_this.tableName))
            db.createObjectStore($_this.tableName, {keyPath: "id"});
        };

        request.onsuccess = function() {
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects=store.get(item.id);
            objects.onsuccess=function(e){
                var item1=e.target.result;
                item1.status=statuss;
                store.put(item1);
            };
        };
    }
    
    private ajax(item){
        var $_this=this;
        $.ajax({
            type: 'POST',
            data:item,
            url: $_this.uploadURL,
            dataType:"json",
            success: function(data)
            {
                if(data.success==1)
                {
                    $_this.status(item,1);
                }
                else{
                    console.log("error indexeddb ajax upload");
                }
                $_this.uploadAll();

            },
            error:function(e){console.log("error indexeddb ajax "+e);}
            
        });
    }
}