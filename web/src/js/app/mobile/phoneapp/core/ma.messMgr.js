//#region runtimeImports
var { utils } = require('@/app/core/utils');
var { Manager } = require('@/app/core/manager');
//#endregion runtimeImports



function MessMgr() { }

utils.extend(MessMgr, Manager);


MessMgr.prototype.init = function () {
	MessMgr.superclass.init.apply(this, arguments);

	this.list = [];
	this.thredPos = [];

	return this;
};

MessMgr.prototype.initNotifListeners = function () {
	Notif
		.addListener(Notif.ids.accMessage, 'messMgr', function (mess) {
			var pos = this.thredPos.indexOf(mess.thread);

			if (pos < 0 || !this.list[pos]) {
				this.load(0);

				return;
			}

			var updMess = this.splice(pos);

			updMess.lastacc = mess.writer;
			updMess.time = mess.time;
			updMess.isread = 0;
			updMess.reply = true;

			this.unshift(updMess, pos);

			Notif.sendNotif(Notif.ids.accMessageUpdate, updMess);
		}, this)
		.addListener(Notif.ids.accMessageNew, 'messMgr', function (messNew) {
			messNew.account1 = messNew.creater;
			messNew.account2 = messNew.receiver;
			messNew.lastacc = messNew.creater.id;
			messNew.id = messNew.thread;

			messNew = reqMgr.getMessageList.prepareMessage(messNew);

			messNew.isread = 0;
			messNew.new = true;

			this.unshift(messNew);

			Notif.sendNotif(Notif.ids.accMessageUpdate, messNew);
		}, this);
};

MessMgr.prototype.load = function (pos) {
	reqMgr.getMessageList(pos, function (resp) {
		for (var i = 0; i < resp.list.length; i++) {
			messMgr.thredPos[resp.first + i] = resp.list[i].id;

			messMgr.list[resp.first + i] = resp.list[i];
		}

		Notif.sendNotif(Notif.ids.accMessagesLoaded, resp);
	});
};

MessMgr.prototype.getMessagesRange = function (from, to) {
	from = from || 0;
	to = from + (to || 15);

	return {
		first: from,
		prev: !!this.list[from--],
		next: !!this.list[to++],
		list: this.list.slice(from, to)
	};
};

MessMgr.prototype.unshift = function (mess) {
	this.thredPos.unshift(mess.id);

	this.list.unshift(mess);
};

MessMgr.prototype.splice = function (pos) {
	this.thredPos.splice(pos, 1);

	return this.list.splice(pos, 1)[0];
};


var messMgr = new MessMgr();



module.exports = {messMgr};



//#region offlineImports
var { Notif } = require('@/app/core/notif');
var { reqMgr } = require('@/app/core/reqMgr');
//#endregion offlineImports