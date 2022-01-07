const path = require('path');
const config = require('./project.config.js');



module.exports = {
    pathStaticSrc: './src/html/',
	pathStaticDist: path.join(config.distFolder, 'html', '/'),
    staticInputFolders: [],
    langs: ['ru', 'en']
};