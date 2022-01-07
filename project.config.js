const path = require('path');



const distFolderName = '~dist';
const contFolderName = 'cont'



module.exports = {
	buildMode: 'dev',
	distFolderName,
	contFolderName,
	distFolder: path.resolve(__dirname, './' + distFolderName),
	contFolder: path.resolve(__dirname, './' + distFolderName + '/' + contFolderName)
};