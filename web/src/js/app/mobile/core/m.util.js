//#region runtimeImports
var { utils } = require('@/app/core/utils');
//#endregion runtimeImports



utils.isTouchDevice = function(){
	return true;
};

utils.isMobileDevice = function(){
	return true;
};

utils.symbol = {
	delegate: Symbol('delegate')
};