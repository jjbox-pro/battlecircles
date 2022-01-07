const path = require('path');
const config = require('./project.config.js');



module.exports = {
    pathToCSS: path.join(config.distFolder, 'css', '/'),
    pathToImg: './src/cont/'
};