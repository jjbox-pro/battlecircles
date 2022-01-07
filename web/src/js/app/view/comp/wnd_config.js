/*-config-*/
//#region runtimeImports
var { Wnd } = require('@/app/view/comp/wnd');
//#endregion runtimeImports



Wnd.prototype.getCloseSound = function(){
	return EventSnd.events.sysWndClose;
};



//#region offlineImports
var { EventSnd } = require('@/app/core/snd');
//#endregion offlineImports