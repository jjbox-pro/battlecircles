//#region runtimeImports
var { utils } = require('@/app/core/utils');
var { ApplBase } = require('@/app/core/appl');
//#endregion runtimeImports



utils.overrideMethod(ApplBase, 'init', function __method__(deviceReady){
	if( deviceReady )
        __method__.origin.apply(this, arguments);
});

ApplBase.prototype.reloadNow = function(){
    location.reload();
};