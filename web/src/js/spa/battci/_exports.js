const e = Object.assign||function(me, m){for(var k in m)me[k] = m[k];}

e(module.exports, require('@/app/core/tmplMgr'));

e(module.exports, require('@/app/core/domMgr'));


e(module.exports, require('@/spa/battci/core/stateMgr'));

e(module.exports, require('@/spa/battci/core/tmplMgr'));

e(module.exports, require('@/spa/battci/core/workerMgr'));

e(module.exports, require('@/spa/battci/view/dom_comps/app'));