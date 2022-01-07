module.exports = require('./_exports.js');



//#region runtimeImports
var { appl } = require('@/spa/battci/appl');
//#endregion runtimeImports



var cordovaApp = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function() {
        function initApp(){
			appl.init(true);
		}
		
        initApp();
    }
};

cordovaApp.initialize();