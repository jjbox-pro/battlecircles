//#region runtimeImports
var { utils } = require('@/app/core/utils');

var { Panel } = require('@/app/mobile/view/comp/m.panel');
//#endregion runtimeImports



utils.reOverrideMethod(Panel, 'initOptions', function __method__(){
	__method__.origin.apply(this, arguments);
    
    this.options.expanded = true;
    this.options.inactive = true;
});