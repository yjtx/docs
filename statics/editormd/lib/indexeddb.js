var indexeddb = (function () {
    function indexeddb() {
        this.db = null;
        this.dbName = "editormddb";
        this.tableName = "res";
        this.list = [];
        this.uploadURL = "";
        this.$ = jQuery;
    }
    indexeddb.prototype.delete = function () {
        var deleteDbRequest = window.indexedDB.deleteDatabase(this.dbName);
        deleteDbRequest.onsuccess = function (event) {
            console.log("success delete db");
        };
        deleteDbRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };
    };
    indexeddb.prototype.close = function () {
        this.db.close();
    };
    indexeddb.prototype.all = function (calls) {
        var $_this = this;
        var request = indexedDB.open($_this.dbName);
        request.onupgradeneeded = function () {
            var db = request.result;
            if (!db.objectStoreNames.contains($_this.tableName))
                db.createObjectStore($_this.tableName, { keyPath: "id" });
        };
        request.onsuccess = function () {
            $_this.list = [];
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects = store.openCursor();
            objects.onsuccess = function (e) {
                var cursor = objects.result;
                if (cursor) {
                    $_this.list.push(cursor.value);
                    cursor.continue();
                }
                else {
                    if (calls)
                        calls($_this.list);
                }
            };
        };
    };
    indexeddb.prototype.get = function (key, calls) {
    };
    indexeddb.prototype.put = function (item, isReplace) {
        if (isReplace === void 0) { isReplace = false; }
        var $_this = this;
        var request = indexedDB.open($_this.dbName);
        request.onupgradeneeded = function () {
            var db = request.result;
            if (!db.objectStoreNames.contains($_this.tableName))
                db.createObjectStore($_this.tableName, { keyPath: "id" });
        };
        request.onsuccess = function () {
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects = store.get(item.id);
            objects.onsuccess = function (e) {
                var item1 = e.target.result;
                if (isReplace) {
                    store.put(item);
                }
                else {
                    if (item1 === undefined) {
                        store.put(item);
                    }
                }
                $_this.uploadAll();
            };
        };
    };
    indexeddb.prototype.uploadAll = function () {
        var $_this = this;
        $_this.all(function (data) {
            for (var i = 0; i < $_this.list.length; i++) {
                if ($_this.list[i].status === 0) {
                    $_this.updateStatus($_this.list[i]);
                    break;
                }
            }
        });
    };
    indexeddb.prototype.updateStatus = function (item) {
        var $_this = this;
        var request = indexedDB.open($_this.dbName);
        request.onupgradeneeded = function () {
            var db = request.result;
            if (!db.objectStoreNames.contains($_this.tableName))
                db.createObjectStore($_this.tableName, { keyPath: "id" });
        };
        request.onsuccess = function () {
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects = store.get(item.id);
            objects.onsuccess = function (e) {
                var item1 = e.target.result;
                if (item1 !== undefined && item1.status === 0) {
                    $_this.ajax(item);
                }
            };
        };
    };
    indexeddb.prototype.status = function (item, statuss) {
        var $_this = this;
        var request = indexedDB.open($_this.dbName);
        request.onupgradeneeded = function () {
            var db = request.result;
            if (!db.objectStoreNames.contains($_this.tableName))
                db.createObjectStore($_this.tableName, { keyPath: "id" });
        };
        request.onsuccess = function () {
            var db = request.result;
            var tx = db.transaction($_this.tableName, "readwrite");
            var store = tx.objectStore($_this.tableName);
            var objects = store.get(item.id);
            objects.onsuccess = function (e) {
                var item1 = e.target.result;
                item1.status = statuss;
                store.put(item1);
            };
        };
    };
    indexeddb.prototype.ajax = function (item) {
        var $_this = this;
        $.ajax({
            type: 'POST',
            data: item,
            url: $_this.uploadURL,
            dataType: "json",
            success: function (data) {
                if (data.success == 1) {
                    $_this.status(item, 1);
                }
                else {
                    console.log("error indexeddb ajax upload");
                }
                $_this.uploadAll();
            },
            error: function (e) { console.log("error indexeddb ajax " + e); }
        });
    };
    return indexeddb;
}());
