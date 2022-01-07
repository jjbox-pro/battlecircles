//#region runtimeImports
var { utils } = require('@/app/core/utils');
var { Manager } = require('@/app/core/manager');
//#endregion runtimeImports


function SndMgr() {
	this.list = []; // Список звуковых источников 
}

utils.extend(SndMgr, Manager);

SndMgr.storageGlobalVolume = function (val, callback) {
	if (val === undefined)
		return ls.getAudioGlobalVolume(Snd.volume.def);

	ls.setAudioGlobalVolume(val);

	if (callback)
		callback();

	return;
};


SndMgr.prototype.init = function () {
	SndMgr.superclass.init.apply(this, arguments);

	this.setGlobalVolume();

	if (this.isSndContexAvail())
		notifMgr.runEvent(Notif.ids.sndInitSources);
	else
		$(document).one('click', function () {
			notifMgr.runEvent(Notif.ids.sndInitSources);
		});

	return this;
};

SndMgr.prototype.initNotifListeners = function () {
	notifMgr
		.addListener({ id: Notif.ids.sndInitSources, once: true }, 'sound', function () {
			this.initSoundSources();
		}, this)
		.addListener(Notif.ids.sndStoreGlobalVolume, 'sound', function (val, notif, noStorage) {
			if (val != +val)
				return;

			if (noStorage) {
				sndMgr.setGlobalVolume(val);

				return;
			}

			SndMgr.storageGlobalVolume(val, function () {
				sndMgr.setGlobalVolume(val);
			});
		}, this)
		.addListener(Notif.ids.sndVibrate, 'sound', this.vibrate, this);
};


SndMgr.prototype.isSndContexAvail = function () {
	return Howler.ctx && Howler.ctx.state == 'running';
};

SndMgr.prototype.initSoundSources = function () {
	this.addSnd(EventSnd); // Добавляем источник событийных звуков
	this.addSnd(MusicSnd); // Сразу добавляем и включаем фоновую музыку
	this.addSnd(AmbientSnd); // Сразу добавляем и включаем фоновые звук
	this.addSnd(NoiseSnd); // Сразу добавляем и включаем фоновые короткие звуки

	this.inited = true;

	return this;
};

SndMgr.prototype.getSndList = function () {
	var list = [];

	for (var snd in this.list)
		list.push(this.list[snd]);

	return list;
};

SndMgr.prototype.removeSnd = function (/*Snd*/) { };

SndMgr.prototype.refreshSnd = function () {
	var list = this.getSndList();

	for (var snd in list)
		list[snd].reload();
};

SndMgr.prototype.getSndByType = function (type) {
	var list = [];
	for (var snd in this.list) {
		snd = this.list[snd];

		if (snd.constructor == type)
			list.push(snd);
	}

	return list;
};

SndMgr.prototype.getFirstSndByType = function (type) {
	for (var snd in this.list) {
		snd = this.list[snd];

		if (snd.constructor == type)
			return snd;
	}

	return false;
};

SndMgr.prototype.getLength = function () {
	return this.list.length;
};

SndMgr.prototype.isEmpty = function () {
	return !this.list.length;
};

SndMgr.prototype.addSnd = function (type) {
	var data = type.prepareData();

	if (!data)
		return;

	var snd = new type();

	snd.init(); // Источник всегда инициализируем

	this.list.push(snd);

	return snd;
};

SndMgr.prototype.stopAllSnd = function () {
	for (var snd in this.list)
		this.list[snd].stop();
};

SndMgr.prototype.playAllSnd = function () {
	for (var snd in this.list)
		this.list[snd].play();
};

SndMgr.prototype.setGlobalVolume = function (val) {
	val = +(val !== undefined ? val : SndMgr.storageGlobalVolume());

	Howler.volume(val);

	notifMgr.runEvent(Notif.ids.sndGlobalVolume);
};

SndMgr.prototype.getGlobalVolume = function () {
	return Howler.volume();
};

SndMgr.prototype.getRandomTrack = function (list) {
	var random = utils.random(utils.sizeOf(list)),
		i = 0;

	for (var track in list) {
		if (random == i++)
			return list[track];
	}
};

SndMgr.prototype.vibrate = function (duration) {
	try {
		window.navigator.vibrate(duration);
	}
	catch (e) { }
};


var sndMgr = new SndMgr();



module.exports = { SndMgr, sndMgr };



//#region offlineImports
var { ls } = require('@/app/core/lsMgr');
var { notifMgr, Notif } = require('@/app/core/notifMgr');
var { AmbientSnd, EventSnd, MusicSnd, NoiseSnd, Snd } = require('@/app/core/snd');
//#endregion offlineImports