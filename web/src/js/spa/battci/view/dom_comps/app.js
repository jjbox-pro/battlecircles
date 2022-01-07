//#region runtimeImports
const { DOMComp_App } = require('@/app/view/dom_comps/app');
//#endregion runtimeImports



DOMComp_App.prototype.calcChildren = function(){
	this.children.game = DOMComp_Game;
	this.children.gui = DOMComp_Gui;
};



//#region offlineImports
const { DOMComp_Game } = require('@/spa/battci/view/dom_comps/game');
const { DOMComp_Gui } = require('@/spa/battci/view/dom_comps/gui');
//#endregion offlineImports