//#region runtimeImports
var { Manager } = require('@/app/core/manager');
//#endregion runtimeImports



class StateMgr extends Manager{
    constructor(){
        super();
    }
}


const stateMgr = new StateMgr();



module.exports = {StateMgr, stateMgr};