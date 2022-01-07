(function (global) {
	global.onerror = function (msg, url, lineNo, columnNo, systemError) {
		var error = {
			msg: msg,
			url: url,
			lineNo: lineNo,
			columnNo: columnNo,
			stack: systemError ? systemError.stack : ''
		};

		alert('Error: ' + JSON.stringify(error, undefined, 2));

		global.onerror = null;
	};
	
	_url_.img = function(src){
        return 'https://content.jjbox.ru/cont/img' + src;
    };
    _url_.snd = function(src){
        return 'https://content.jjbox.ru/cont/snd' + src;
    };
	
	globalThis._include_.add(function () { return new Array('/../../cordova.js'); });
})(this);