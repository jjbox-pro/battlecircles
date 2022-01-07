//#region runtimeImports
var { utils } = require('@/app/core/utils');

var { Block } = require('@/app/view/comp/block');
var { bMMenu_mute, bMMenu_towns } = require('@/app/view/town/mainmenu');

var { Bar } = require('@/app/mobile/view/comp/m.bar');
//#endregion runtimeImports



function StatusBar() {
	StatusBar.superclass.constructor.apply(this, arguments);
}

utils.extend(StatusBar, Bar);


StatusBar.prototype.calcName = function () { return 'statusBar'; };

StatusBar.prototype.calcTmplFolder = function () { return tmplMgr.statusBar; };

StatusBar.prototype.calcChildren = function () {
	this.children.statusBar = bStatusBar_info;
};


StatusBar.prototype.getSide = function () { return 'top'; };

StatusBar.prototype.setExpand = function () { };

StatusBar.prototype.toggleExpand = function () { };

StatusBar.prototype.isExpanded = function () { return true; };



function bStatusBar_info() {
	this.name = 'info';

	bStatusBar_info.superclass.constructor.apply(this, arguments);
}

utils.extend(bStatusBar_info, Block);


bStatusBar_info.prototype.initOptions = function () {
	bStatusBar_info.superclass.initOptions.apply(this, arguments);

	this.options.inactive = true;
};

bStatusBar_info.prototype.addNotif = function () {
	this.notif.other[Notif.ids.mobToggleBars] = function (data) {
		if (this.wrp)
			this.wrp.find('.info-bars').toggleClass('-state-minimized', data.hide);
	};

	if (debug.isAdmin() || debug.isTest() || debug.isNA()) {
		this.notif.other[Notif.ids.sysConsoleError] = function () {
			if (this.wrp)
				this.wrp.find('.test-consoleErrors').toggleClass('-type-error', ls.getConsoleErrors([]).length > 0);
		};
	}
};

bStatusBar_info.prototype.calcChildren = function () {
	this.children.mute = bMMenu_mute;

	this.children.clock = pClock;

	this.children.towns = bStatusBar_towns;
};

bStatusBar_info.prototype.bindEvent = function () {
	this.wrp
		.on('click', '.info-fullScreen', function () {
			notifMgr.runEvent(Notif.ids.applToggleFrame);
		})
		.on('click', '.info-bars', function () {
			wndMgr.toggleBars(!ls.getLandscapeNoPanels());
		})
		.on('click', '.info-mute', function () {
			notifMgr.runEvent(Notif.ids.sndStoreGlobalVolume, $(this).hasClass('-active') ? Snd.volume.min : Snd.volume.max);
		});
};


bStatusBar_info.prototype.afterContSet = function () {
	this.$controlsWrp = this.wrp.find('.info-controls-wrp');
};



bMMenu_mute.prototype.calcTmplFolder = function () {
	return tmplMgr.mmenu.mute;
};



function bStatusBar_towns(parent) {
	bStatusBar_towns.superclass.constructor.apply(this, arguments);
}

utils.extend(bStatusBar_towns, bMMenu_towns);


bStatusBar_towns.prototype.calcTmplFolder = function () {
	return tmplMgr.mmenu.towns;
};

bStatusBar_towns.prototype.afterContSet = function () {
	this.$townName = this.wrp.find('.mmenu-towns-name');
};

bStatusBar_towns.prototype.makeResize = function () {
	this.$townName.css('max-width', this.wrp.width() - this.parent.$controlsWrp.width() - 50);
};



module.exports = { StatusBar, bStatusBar_info, bStatusBar_towns };



//#region offlineImports
var { debug } = require('@/app/core/debug');
var { ls } = require('@/app/core/lsMgr');
var { notifMgr, Notif } = require('@/app/core/notifMgr');
var { tmplMgr } = require('@/app/core/tmplMgr');
var { wndMgr } = require('@/app/core/wndMgr');
var { Snd } = require('@/app/core/snd');

var { pClock } = require('@/app/view/block/b.clock');
//#endregion offlineImports