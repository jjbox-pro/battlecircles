module.exports = require('./appl');



//#region runtimeImports
var { appl } = require('./appl');
//#endregion runtimeImports



_url_.onload = () => {
    appl.init();
};