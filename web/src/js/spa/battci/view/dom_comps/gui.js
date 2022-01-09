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

	addNotif(){
		this.notif.other[Notif.get('fps')] = (fps) => {
			this.$fps.val(fps);
		};
	}

	cacheCont($cont){
		this.$fps = $cont.find('.gui__fps');
	}
}



module.exports = { DOMComp_Gui };



//#region offlineImports
const { Notif } = require('@/app/core/notif');
//#endregion offlineImports