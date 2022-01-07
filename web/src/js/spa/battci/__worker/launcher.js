self.window = self;


(function(){
    function Launcher(){}


    Launcher.prototype.init = function(data){
        self.lg = function(){return '';};
        self.lg.regCB = function(cb){return cb;};
        
        self._url_ = function(){};
        self._url_.lib = {};
        self._url_.lib.regCB = function(cb){cb();};
        
        this.importScripts(data);
    };

    Launcher.prototype.importScripts = function(data){
        self.importScripts(
            data.root + 'lib_battci_worker.js?v=<*filetime=js/spa/battci/worker/lib_battci_worker.js>',
            data.root + 'chunk_battci_worker.js?v=<*filetime=js/spa/battci/worker/chunk_battci_worker.js>'
        );
    };

    Launcher.prototype.setLocalStorage = function (localStorage) {
        self.localStorage = localStorage;
    };

    Launcher.prototype.onmessage = function (data) {
        if (data.localStorage)
            this.setLocalStorage(data.localStorage);

        if (data.init)
            this.init(data);


        wh.applWorker.onmessage(data);
    };


    var launcher = new Launcher();


    self.onmessage = function (event) {
        launcher.onmessage(event.data[0]);
    };
})();