var config = require('./project.config.js');



module.exports = {
    pathSrc: config.distFolder + '/',
	pathDist: config.distFolder + '/',
    getFilesOpt: {
        exludedDirs: ['cont']
    }
};