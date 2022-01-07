const { contextBridge, ipcRenderer } = require('electron');

let appData = ipcRenderer.sendSync('main', 'getAppData');

contextBridge.exposeInMainWorld('electronProcess', {
	getAppData: () => appData,
	
	loadURL: (...args) => ipcRenderer.send('main', 'loadURL', ...args),
	openLink: (...args) => ipcRenderer.send('main', 'openLink', ...args),
	closeApp: (...args) => ipcRenderer.send('main', 'closeApp', ...args),
	// setGameServer: (...args) => appData = ipcRenderer.sendSync('main', 'setGameServer', ...args),
	// setLang: (...args) => appData = ipcRenderer.sendSync('main', 'setLang', ...args)
});