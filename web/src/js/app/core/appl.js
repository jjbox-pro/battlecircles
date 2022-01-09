class ApplBase{
    init(){
        this.initNotifListeners();

        this.initComponents()
            .then(() => this.loadData())
            .then(() => this.finishInit());
    }

    initNotifListeners() {
        this.notifHandler = Notif.getHandler();
    }

    initComponents() {
        return new Promise(resolve => {
            domMgr.init();
            
            resolve();
        });
    }

    loadData() {
        const loaders = this.getLoaders();
        
        return Promise.all(loaders);
    }

    getLoaders(){
        const loaders = [tmplMgr.loadTemplates()];
    
        return loaders;
    }

    finishInit() {
        this.bindEvents();

        this.onInited();
    }
    
    bindEvents() {
        window.onresize = () => {
            this.onResize();
        };
    }

    onResize(){
        Notif.sendNotif(Notif.ids.nf_onAppResize, {
            width: globalThis.innerWidth,
            height: globalThis.innerHeight
        });
    }

    onInited() {
        this.inited = true;
    
        //[].slice.call(document.documentElement.getElementsByTagName('script')||[]).forEach($script=>$script.remove());
    
        Notif.sendNotif(Notif.ids.nf_onApplInited);
    }


    isInited() {
        return this.inited;
    }
    
    reload() {
        this.reloadNow();
    }
    
    reloadNow() {
        location = location.origin + location.pathname + location.search + location.hash;
    }
    
    setLocation(url) {
        location = url;
    }
}



module.exports = { ApplBase };



//#region offlineImports
const { Notif } = require('@/app/core/notif');
const { tmplMgr } = require('@/app/core/tmplMgr');

const { domMgr } = require('@/app/core/domMgr');
//#endregion offlineImports