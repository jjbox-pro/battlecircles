const { app, BrowserWindow, shell, screen, ipcMain } = require('electron');
const path = require('path');
const { URL } = require('url');
const child_process = require('child_process');
const fs = require('fs');

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-http-cache');


const entryPoint = '/html/spa/battci/platforms/st/index.html';
const rootname = path.resolve(__dirname, 'dist');
const preloadFilePath = path.resolve(__dirname, 'preload.js');
const onWindowShown = () => {};
const devTools = false;

const initAppData = () => {
	/*
		process.argv
		// Системные аргументы
		process.argv[0] - директория electron.exe
		// Пользовательские аргументы
		process.argv[1] - гет параметр lang
		process.argv[2] - гет параметр gid
		process.argv[3] - гет параметр platform
		process.argv[4] - id в стиме
	*/

	appData.steamId = process.argv[4];

	appData.getParams = 	'?platform=' + process.argv[3] + 
							'&gid=' + process.argv[2] +
							'&lang=' + process.argv[1] + 
							'&mainServer=' + process.argv[1] + '.jjbox.ru';
};


let mainWindow;

const appData = {};
const appMethods = {
	getAppData: function () {
		return appData;
	},

	loadURL: function (url, search, hash) {
		if( url[0] === '/' ){
			url = new URL(path.join(rootname, url));

			url.protocol = 'file:';
			url.search = search;
			url.hash = hash;

			url = url.href;
		}

		mainWindow.loadURL(url);
	},

	openLink: function (href) {
		shell.openExternal(href);
	},

	closeApp: function () {
		mainWindow.close();
	}
};

function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	mainWindow = new BrowserWindow({
		width: width - 20,
		height: height - 20,
		center: true,
		icon: path.resolve(rootname, 'cont/img/favicon.ico'),
		webPreferences: {
			preload: preloadFilePath
		}
	});

	mainWindow.setMenu(null);

	if( devTools )
		mainWindow.webContents.openDevTools();

	mainWindow.toLog = function () {
		var output = [];

		for (var arg in arguments) {
			output.push(JSON.stringify(arguments[arg]))
		}

		this.webContents.executeJavaScript('console.warn(' + output.join(',') + ')');
	};

	mainWindow.on('closed', () => { mainWindow = null });

	setTimeout(() => {
		mainWindow.maximize();

		onWindowShown();
	}, 100);

	appMethods.loadURL(entryPoint, appData.getParams);
};

app.on('ready', () => {
	initAppData();

	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});



ipcMain.on('main', (event, method, ...args) => {
	method = appMethods[method];

	if (method)
		event.returnValue = method(...args);
});