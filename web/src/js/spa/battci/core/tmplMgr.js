//#region runtimeImports
var { TmplMgr } = require('@/app/core/tmplMgr');
//#endregion runtimeImports



TmplMgr.templatesVersions.battci = '<*filetime=js/templates/battci/templates.js>';


TmplMgr.prototype.getTemplatesFileName = function () {
	return 'battci';
};