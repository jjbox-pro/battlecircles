//#region runtimeImports
var { StateMgr } = require('@/app/core/stateMgr');
//#endregion runtimeImports



StateMgr.prototype.initPlatform = function () {
	this.platform = {
		name: 'ios',
		id: 'io'
	};
};