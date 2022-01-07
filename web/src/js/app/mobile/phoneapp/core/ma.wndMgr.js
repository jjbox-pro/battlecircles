//#region runtimeImports
var { debug } = require('@/app/core/debug');
var { utils } = require('@/app/core/utils');
var { WndMgr } = require('@/app/core/wndMgr');
//#endregion runtimeImports



WndMgr.prototype.setWndAnimDependances = function(wndSwipeTime){
    this.setAnimDependances(wndSwipeTime, 'wndAnimDependances', 
        '.-if-mobApp .-type-multy .screenPage-screen-wrp:before,' + 
		'.-if-mobApp .-type-multy .screenPage-screen-wrp:after,' + 
        '.-if-mobApp .screenPage-screenTitle,' +
        '.-if-mobApp .screenPage-wrp,' + 
        '.-if-mobApp .screenPage-screen-wrp .screenPage-transition-wrp');
};

utils.overrideMethod(WndMgr, 'getBarAnimCssRules', function __method__(){
	var cssRulse = __method__.origin.apply(this, arguments);
    
    //cssRulse.push('.-if-mobApp .-state-barAnimation .rate-list-wrp');
    
    return cssRulse;
});

utils.overrideMethod(WndMgr, 'createWnd', function __method__(type, id, data, params){
	var wnd = __method__.origin.apply(this, arguments);

	if( !wnd.options.useCache )
		return wnd;
	
	var wndCached = this.screens[wnd.getName()];

	if( wndCached ){
		var wndList = wndCached.getConflictWnd();

		if( !wndList.length )
			wndCached.appendToList();

		return wndCached;
	}
	else
		this.screens[wnd.getName()] = wnd;

	return wnd;
});

utils.overrideMethod(WndMgr, 'calcSwipeDir', function __method__(wnd){
	if( wnd instanceof InfScreenWnd )
		return -1;
	
	return __method__.origin.apply(this, arguments);
});

WndMgr.prototype.canSwipeNext = function(nextWnd, wnd){
	return !(!nextWnd || nextWnd == wnd || nextWnd.parent == wnd);
};

WndMgr.prototype.getSwipedWndList = function(excludeList){
	return this.getWndList({filter: function(wnd){
		return !wnd.options.swiped;
	}, excludeList: excludeList});
};

WndMgr.prototype.addChat = function(id, data){
    if( debug.isTest() )
        return;
    
	var wnd = new mwChat(id, data);
	
	if( wndMgr.getScreen().constructor == mwChat )
		return;
	
	wnd.options.inactive = true;
	
	wnd = this.prepareWndToAdd(wnd);
	
	wnd.options.inactive = false;
	
	wnd.hideCont();
	
	return wnd;
};

WndMgr.prototype.isLandscape = function(size){
	size = size||this.getWindowSize();
	
	return size.width > size.height;
};



//#region offlineImports
var { wndMgr } = require('@/app/core/wndMgr');

var { InfScreenWnd } = require('@/app/mobile/view/comp/m.wnd');
var { mwChat } = require('@/app/mobile/view/wnd/m.w.chat');
//#endregion offlineImports