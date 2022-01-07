class Manager {
    static get super() {
        return Object.getPrototypeOf(this).prototype;
    }

    constructor() { }

    init() {
        this.initNotifListeners();

        return this;
    }

    initNotifListeners() {
        this.notifHandler = notifMgr.getHandler();
    }

    getNotifHandler() {
        return this.notifHandler;
    }
}



module.exports = { Manager }



//#region offlineImports
const { notifMgr } = require('@/app/core/notifMgr');
//#endregion offlineImports