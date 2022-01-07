//#region runtimeImports
var { DOMComp } = require('@/app/view/comp/dom_comp');
//#endregion runtimeImports



class DOMComp_App extends DOMComp {
	constructor() {
		super();
	}
	
	calcName() {
		return 'app';
	}
}



module.exports = { DOMComp_App };