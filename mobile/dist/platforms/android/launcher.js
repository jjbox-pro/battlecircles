app.googleAccountErrors = {
	IGN_IN_CANCELLED: 12501,
	SIGN_IN_FAILED: 12500,
	SIGN_IN_REQUIRED: 4,
	INTERNAL_ERROR: 8,
	NETWORK_ERROR: 7
};
	
app.googleAccountWebClientId = '';
	
app.getPlatformAccountInfo = function(platformData, callback){
	callback(null);

	//app.getGoogleAccountInfo(platformData, callback);
};
	
	app.getGoogleAccountInfo = function(platformData, callback) {
		window.plugins.googleplus.trySilentLogin({
			//webClientId: app.googleAccountWebClientId
		}, 
		callback,
		function(errorCode){
			if( errorCode == app.googleAccountErrors.SIGN_IN_REQUIRED )
				app.requestGoogleAccountInfo(callback);
			else
				alert('Error of google trySilentLogin: ' + errorCode);
		});
	};
		
		app.requestGoogleAccountInfo = function(callback) {
			window.plugins.googleplus.login({
				//webClientId: app.googleAccountWebClientId
			}, 
			callback,
			function(errorCode){
				if( errorCode == app.googleAccountErrors.IGN_IN_CANCELLED ){
					var result = app.confirmPlatformAccountAbort();
					
					if( result )
						callback(null);
					else
						app.requestGoogleAccountInfo(callback);
				}
				else
					alert('Error of google login: ' + errorCode);
			});
		};