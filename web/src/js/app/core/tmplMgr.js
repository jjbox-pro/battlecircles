//#region runtimeImports
var { Manager } = require('@/app/core/manager');
//#endregion runtimeImports



class TmplMgr extends Manager {
	static templatesVersions = {};

	loadTemplates(name) {
		var templatesFileName = this.getTemplatesFileName(name) + this.getTemplatesFileNamePostfix(),
			templatesFileVersion = this.getTemplatesFileVersion(templatesFileName);
		
		return _url_.script.load('/templates/' + templatesFileName + '/templates.js?v=' + templatesFileVersion);
	}
	
	getTemplatesFileName() {
		throw new Error('-Exception-: method "getTemplatesFileName" must be implemented!');
	}
	
	getTemplatesFileNamePostfix() {
		return '';
	}
	
	getTemplatesFileVersion(templatesFileName) {
		return TmplMgr.templatesVersions[templatesFileName];
	}
}


const tmplMgr = new TmplMgr();



module.exports = { TmplMgr, tmplMgr };