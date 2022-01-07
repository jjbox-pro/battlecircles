//#region runtimeImports
var { Interface } = require('@/app/view/comp/interface');
//#endregion runtimeImports



Interface.prototype.show = Interface.superclass.show;

Interface.prototype.dataReceived = function(){
	this.ready = false;
	
	this.afterDataReceived();
};