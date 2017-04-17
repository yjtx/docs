module xfkdb{
    export class indexeddb{
        public constructor(){console.log("111");}
        
        public openDB (name) {
            
            var request=window.indexedDB.open(name);
            
            request.onerror=function(e){
                console.log('OPen Error!');
            };
            request.onsuccess=function(e){
                myDB.db=e.target.result;
            };
        }

        var myDB={
            name:'test',
            version:1,
            db:null
        };
    }
}