//#region runtimeImports
var { WorkerMgr } = require('@/app/core/workerMgr');
//#endregion runtimeImports



WorkerMgr.prototype.getURL = function () {
	var url = _url_.js('/spa/battci/worker/launcher.js?v=<*filetime=js/spa/battci/worker/launcher.js>');

	return this.prepareURL(url);
};

WorkerMgr.prototype.getScriptsRoot = function () {
	return _url_.js('/spa/battci/worker/');
};