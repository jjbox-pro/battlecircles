//#region runtimeImports
var { WorkerMgr } = require('@/app/core/workerMgr');
//#endregion runtimeImports



WorkerMgr.prototype.prepareURL = function (url) {
	return url;
};