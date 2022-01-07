const fs = require('fs');
const config = require('../project.config.js');

(() => {
	if( !fs.existsSync(config.distFolderName) )
		fs.mkdirSync(config.distFolderName);
})();