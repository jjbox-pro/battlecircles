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
		this.notif.other[Notif.get('nf_fps')] = (fps) => {
			this.$gui__fps.val(fps);
		};

		this.notif.other[Notif.get('nf_ammo')] = (info) => {
			const $el = this[`$ammo__${info.type}_count`];

			$el.count = $el.count||[];

			$el.count[info.index||0] = info.count;

			this[`$ammo__${info.type}_count`].text($el.count.join('/'));
		};
	}

	cacheCont($cont){
		this.$gui__fps = $cont.find('.gui__fps');

		this.$ammo__person_count = $cont.find('.ammo__person_count');
		this.$ammo__weapon_count = $cont.find('.ammo__weapon_count');
	}
}



module.exports = { DOMComp_Gui };



//#region offlineImports
const { Notif } = require('@/app/core/notif');
//#endregion offlineImports