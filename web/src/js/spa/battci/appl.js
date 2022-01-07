//#region runtimeImports
const { ApplBase } = require('@/app/core/appl');
//#endregion runtimeImports



class Appl extends ApplBase {
    checkRequirements() {
        return !!globalThis.WebSocket;
    }
}


const appl = new Appl();



module.exports = { Appl, appl };