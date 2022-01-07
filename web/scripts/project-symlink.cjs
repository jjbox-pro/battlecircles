const {utils} = require('jjbox-utils');
const config = require('../project.config.js');

(() => {
	utils.makeSymlink(config.distFolder, config.distFolderName, 'junction'); // The type argument is only available on Windows and ignored on other platforms.
})();