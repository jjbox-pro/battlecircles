function ApplWorker() { }


ApplWorker.prototype.init = function (data) {
	this.initScripts(data);

	this.initAppl(data);

	this.postMessage({ handler: 'onInit' });

	return this;
};

ApplWorker.prototype.initScripts = function (data) {
	Object.assign(debug, data.debug);
};

ApplWorker.prototype.initAppl = function () {
	
};


ApplWorker.prototype.updWorker = function (data) {
	var result = { handler: 'onUpdWorker', uid: data.uid };

	applWorker.postMessage(result);
};



ApplWorker.prototype.postMessage = function (data, transferableList) {
	postMessage(data, transferableList);
};

ApplWorker.prototype.onmessage = function (data) {
	if (data.init)
		this.init(data);
	else if (data.updWorker)
		this.updWorker(data);
};


var applWorker = new ApplWorker();



module.exports = { ApplWorker, applWorker };



//#region offlineImports
var { debug } = require('@/app/core/debug');
//#endregion offlineImports