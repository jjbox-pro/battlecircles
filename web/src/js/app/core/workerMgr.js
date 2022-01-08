//#region runtimeImports
var { Manager } = require('@/app/core/manager');
//#endregion runtimeImports



class WorkerMgr extends Manager {
	constructor(){
		super();

		this.setActive(false);
	}
}


WorkerMgr.prototype.init = function () {
	try{
		this.worker = new Worker(this.getURL());
	}
	catch(e){
		this.onInitError(e);

		return this;
	}

	this.bind(this.worker, this.onmessage);

	this.postMessage({
		init: true,
		root: this.getScriptsRoot()
	});

	return this;
};

WorkerMgr.prototype.getURL = function () {
	throw new Error('-Exception-: callback "getURL" must be implemented by application!');
};

WorkerMgr.prototype.prepareURL = function (url) {
	if( _url_.base === location.origin )
		return url;
		
	return URL.createObjectURL(new Blob(['importScripts("'+url+'");'], { type: 'text/javascript' })); // To avoid CORS
};

WorkerMgr.prototype.getScriptsRoot = function () {
	return _url_.js('/');
};

WorkerMgr.prototype.bind = function (worker, onmessage) {
	worker.onmessage = onmessage.bind(this);
};


WorkerMgr.prototype.setActive = function (active) {
	this.active = active;
};

WorkerMgr.prototype.isActive = function () {
	return this.active;
};

WorkerMgr.prototype.postMessage = function (data) {
	if (!this.worker)
		return;

	this.worker.postMessage([data]);
};

WorkerMgr.prototype.onmessage = function (event) {
	var data = event.data;

	if (data.handler)
		this[data.handler](data);
};

WorkerMgr.prototype.onInit = function () {
	this.setActive(true);

	Notif.sendNotif(Notif.ids.applCompInited);
};

WorkerMgr.prototype.onInitError = function (e) {
	if( e )
		console.warn(e);

	this.setActive(false);

	Notif.sendNotif(Notif.ids.applCompInited);
};

WorkerMgr.prototype.onUpdWorker = function (data) {
	this.sendToReqMgr(data);
};

WorkerMgr.prototype.sendToReqMgr = function (data) {
	var uid = data.uid;

	delete data.uid;
	delete data.handler;

	reqMgr.respWorker(data, uid);
};


const workerMgr = new WorkerMgr();



module.exports = { WorkerMgr, workerMgr };



//#region offlineImports
const { reqMgr } = require('@/app/core/reqMgr');
const { Notif } = require('@/app/core/notif');
//#endregion offlineImports