//#region runtimeImports
var { StateMgr } = require('@/app/core/stateMgr');
//#endregion runtimeImports



StateMgr.prototype.initNotifListeners = function(){
	StateMgr.super.initNotifListeners.apply(this, arguments);

	notifMgr.addListener(Notif.ids.stateApplData, this.notifHandler, applData => {
		Object.assign(this.__appl, applData);
	});
}
	
StateMgr.prototype.initGame = function (rawInitData) {
	
};

StateMgr.prototype.updateGame = function(rawNewData){
	this.initGame(rawNewData);
}

StateMgr.prototype.initPlatform = function () {
	throw new Error('-Exception-: method "initPlatform" must be implemented by specific platform!');
};



//#region offlineImports
var { notifMgr, Notif } = require('@/app/core/notifMgr');
//#endregion offlineImports