//#region runtimeImports
var { DOMComp } = require('@/app/view/comp/dom_comp');
//#endregion runtimeImports



class Interface extends DOMComp {
	constructor(){
		super(...arguments);
	}
}


Interface.prototype.setId = function (id) { };

Interface.prototype.getId = function () {
	return '';
};

Interface.prototype.show = function () {
	wndMgr.clearList();

	Interface.super.show.apply(this, arguments);
};

Interface.prototype.close = function () {
	this.clearWrp();

	this.onRemove();

	// Пока не чистим, т.к. чилд может использоватся при отложенных вызовах, когда интерфейс уже высвободил ресурсы
	//this.clearChildren(); // Чтобы не висели лишние объекты в памяти у закрывшегося интерфейса
};


Interface.prototype.onIdChange = function (newId) {
	this.setId(newId);

	this.show();
};


Interface.prototype.initStaticNotif = function () { };

Interface.prototype.esc = function () { };

Interface.prototype.update = function () {
	this.show();
};



module.exports = {Interface};



//#region offlineImports
var { wndMgr } = require('@/app/core/wndMgr');
//#endregion offlineImports