//#region runtimeImports
import { Manager } from '@/app/core/manager';
//#endregion runtimeImports



export class WndMgr extends Manager {
	private list: Array<Wnd> = [];
	private zOffset: number = 1500;

	constructor(...args: any) {
		super(...args);
	}

	push(wnd: Wnd){
		this.list.push(wnd);
	}
}


export const wndMgr = new WndMgr();



wndMgr.push(new Wnd);



//#region offlineImports
// const { utils } = require('@/app/core/utils');
// const { tmplMgr } = require('@/app/core/tmplMgr');
// const { notifMgr, Notif } = require('@/app/core/notifMgr');

import { Wnd } from '@/app/view/comp/wnd';
//#endregion offlineImports