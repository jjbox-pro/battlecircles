//#region runtimeImports
const { DOMComp_App } = require('@/app/view/dom_comps/app');
//#endregion runtimeImports



DOMComp_App.prototype.calcChildren = function(){
	this.children.game = DOMComp_Game;
	this.children.gui = DOMComp_Gui;
};

DOMComp_App.prototype.afterShow = function(){
	Notif.sendNotif(Notif.ids.nf_onAppRendered);
};



//#region offlineImports
const { Notif } = require('@/app/core/notif');

const { DOMComp_Game } = require('@/spa/battci/view/dom_comps/game');
const { DOMComp_Gui } = require('@/spa/battci/view/dom_comps/gui');
//#endregion offlineImports