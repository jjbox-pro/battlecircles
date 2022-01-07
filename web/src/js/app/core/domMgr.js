//#region runtimeImports
var { Manager } = require('@/app/core/manager');
//#endregion runtimeImports



class DOMMgr extends Manager {
	constructor() {
		super();
	}

	init(){
		super.init();

		return this;
	}

	initNotifListeners() {
		super.initNotifListeners();

		notifMgr.addListener(Notif.get('nf_onApplInited'), this.getNotifHandler(), {
			once: true,
			cb: () => (this.app = new DOMComp_App()).show()
		});
	}
}


const domMgr = new DOMMgr();



module.exports = { DOMMgr, domMgr }



//#region offlineImports
const { notifMgr, Notif } = require('@/app/core/notifMgr');

const { DOMComp_App } = require('@/app/view/dom_comps/app');
//#endregion offlineImports