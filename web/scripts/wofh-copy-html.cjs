const path = require('path');
const { utils } = require('jjbox-utils');

const config = require('../project.config.js');



const 	outputDir = path.join(config.distFolder, 'html'),
		inputDir = path.resolve('./src/html/gen');


utils.copyDir(inputDir, outputDir);