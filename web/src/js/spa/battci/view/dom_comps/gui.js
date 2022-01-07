//#region runtimeImports
var { DOMComp } = require('@/app/view/comp/dom_comp');
//#endregion runtimeImports



class DOMComp_Gui extends DOMComp {
	constructor() {
		super();
	}
	
	calcName() {
		return 'gui';
	}
}



module.exports = { DOMComp_Gui };