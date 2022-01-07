module.exports = require('./_exports.js');



//#region runtimeImports
var { appl } = require('./appl');
//#endregion runtimeImports



_url_.onload = () => {
    appl.init();
};