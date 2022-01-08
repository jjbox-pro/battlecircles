class ReqMgr {
	constructor(){
		this.iface = 'ajax';
		
		this.reqId = 0;

		this.respList = {};
	}
}


ReqMgr.prototype.origins = {};


ReqMgr.prototype.init = function () {
	this.initIFace();

	this.initBaseNames();
};

ReqMgr.prototype.initIFace = function () { };

ReqMgr.prototype.initBaseNames = function () {
	this.baseNames = {
		list: {},
		single: {},
	};
};

ReqMgr.prototype.send = function (command, params, options) {
	options = this.prepareOptions(options);

	params = this.addNA(params);

	var iface = utils.upFirstLetter(options.iface || this.iface);

	if (this['send' + iface](command, params, options))
		return;
};

ReqMgr.prototype.prepareOptions = function (options) {
	options = options || {};

	options.err = options.err || {};

	options.ignoreList = options.ignoreList || [0];

	if (options.ignoreListAdd)
		options.ignoreList = options.ignoreList.concat(options.ignoreListAdd);

	options.method = options.method || 'POST';

	this.initCallbacks(options);

	return options;
};

ReqMgr.prototype.initCallbacks = function (options) {
	if (options.callback instanceof Function)
		options.callback = { onSuccess: options.callback };
	else if (options.callback instanceof Array) {
		options.callback = {
			onSuccess: options.callback[0],
			onFail: options.callback[1],
			onOver: options.callback[2]
		};
	}
	else
		options.callback = options.callback || {};
};

ReqMgr.prototype.addNA = function (req) {
	if (!req) req = {};

	return req;
};

ReqMgr.prototype.sendAjax = function (command, params, options) {
	console.log('%c --> sendAjax ' + command, 'color: lightblue', params, options);

	command = this.prepareRequestUrl(command);

	$.ajax({
		method: options.method,
		type: options.method,
		url: this.isAbsoluteUrl(command) ? command : reqMgr.getOriginHost(options.host) + '/' + command,
		data: params,
		dataType: 'json'
	}).done(function (resp) {
		reqMgr.processResp(resp, options);
	});
};

ReqMgr.prototype.setOrigin = function (origin) {
	this.origin = origin;

	return this;
};

ReqMgr.prototype.getOrigin = function () {
	return this.origin;
};

ReqMgr.prototype.getOriginHost = function (host) {
	return host||this.getOrigin();
};

ReqMgr.prototype.isAbsoluteUrl = function (url) {
	return /^(https|http)/.test(url);
};

ReqMgr.prototype.prepareRequestUrl = function (url) {
	var domain = this.getOrigin();

	if (domain && !this.isAbsoluteUrl(url))
		url = domain + (url[0] == '/' ? '' : '/') + url;

	return url;
};

ReqMgr.prototype.processResp = function (resp, options, reqId) {
	if (resp && resp.error !== undefined && !utils.inArray(options.ignoreList, resp.error) && !options.ignoreAll) {
		var error = '';
		
		if (options.err[resp.error] !== undefined) {
			error = options.err[resp.error]; // Если пустая строка - алерт показан не будет

			error = error instanceof Function ? error(resp) : error;
		}
		else if (options.errDef)
			error = options.errDef;
		else
			error = tmplMgr.alert.def(resp.error);

		this.showAlert(error);

		if (options.callback.onFail)
			options.callback.onFail(resp, reqId);
	} else {
		if (!options.noConvertData)
			this.convertData(resp, options);

		if (options.unpack)
			resp = options.unpack(resp) || resp;

		if (options.callback.onSuccess)
			options.callback.onSuccess(resp, reqId);
	}

	if (options.callback.onOver)
		options.callback.onOver(resp, reqId);
};

ReqMgr.prototype.unsetRespOptions = function (uid) {
	this.respList[uid] = null;

	delete this.respList[uid];
};

ReqMgr.prototype.respWorker = function (resp, reqId) {
	var options = this.respList[reqId];

	if (!options)
		return;

	this.processResp(resp, options, reqId);

	this.unsetRespOptions(reqId);
};

ReqMgr.prototype.showAlert = function (text) {
	if (text)
		Notif.sendNotif(Notif.ids.reqError, text);
};

ReqMgr.prototype.convertData = function () { };

ReqMgr.prototype.getConvertNames = function (options) {
	return options.baseNames || utils.clone(this.baseNames);
};

ReqMgr.prototype.updReqId = function () {
	this.reqId++;
};

ReqMgr.prototype.getCurReqId = function () {
	return this.reqId;
};


var reqMgr = new ReqMgr();



module.exports = { ReqMgr, reqMgr };



//#region offlineImports
var { utils } = require('@/app/core/utils');
var { tmplMgr } = require('@/app/core/tmplMgr');
var { Notif } = require('@/app/core/notif');
//#endregion offlineImports