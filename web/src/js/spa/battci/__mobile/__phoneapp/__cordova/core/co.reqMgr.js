//#region runtimeImports
var { ReqMgr } = require('@/app/core/reqMgr');
//#endregion runtimeImports



ReqMgr.prototype.openLink = function(href){
	location = href;
};