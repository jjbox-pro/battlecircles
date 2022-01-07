//#region runtimeImports
var { LS, ls } = require('@/app/core/lsMgr');
//#endregion runtimeImports



LS.maParams = {
	MiniMapOn: 'MiniMapOn',
	MActionsOn: 'MActionsOn',
	ChatLastUnreadMsg: 'ChatLastUnreadMsg',
	ChatLastViewed: 'ChatLastViewed',
	AnnLastUnreadAdminAnn: 'AnnLastUnreadAdminAnn',
	AnnLastViewed: 'AnnLastViewed'
};

LS.def.MobileAccept = true;

LS.init(ls, LS.maParams);