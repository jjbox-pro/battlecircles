//#region runtimeImports
var { DOMComp } = require('@/app/view/comp/dom_comp');
//#endregion runtimeImports



class DOMComp_Game extends DOMComp {
	constructor() {
		super();
	}
	
	calcName() {
		return 'game';
	}

	initLoop(){
		this.processInterval = 17;
	}
}



module.exports = { DOMComp_Game };