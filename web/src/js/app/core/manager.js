class Manager {
    static get super() {
        return Object.getPrototypeOf(this).prototype;
    }

    constructor(...args) { }

    init() {
        this.initNotifListeners();

        return this;
    }

    initNotifListeners() {
        this.notifHandler = Notif.getHandler();
    }

    getNotifHandler() {
        return this.notifHandler;
    }
}



module.exports = { Manager }



//#region offlineImports
const { Notif } = require('@/app/core/notif');
//#endregion offlineImports