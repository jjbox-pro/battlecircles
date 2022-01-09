const { app, BrowserWindow, shell, screen, ipcMain } = require('electron');
const path = require('path');
const { URL } = require('url');
const child_process = require('child_process');
const fs = require('fs');
const config = require('../project.config.js');


app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-http-cache');


const isWebPlatform = process.argv[2] ? true : false;
const platformCode = isWebPlatform ? 'wb' : 'st';
const entryPoint = `/html/spa/battci/platforms/${platformCode}/index.html`;
const rootname = path.resolve(__dirname, '../', isWebPlatform ? config.distFolderName : 'dist');
const preloadFilePath = path.resolve(__dirname, '../preload.js');
const onWindowShown = () => {
	console.log('Start watchig for ~watcher.txt');

	let duplicateTO;

	fs.watch('./~watcher.txt', (event, filename) => {
		clearTimeout(duplicateTO);

		duplicateTO = setTimeout(() => {
			console.log('Do reload!', filename);

			mainWindow.reload();
		}, 100);
	});
};
const devTools = true;

const initAppData = () => {
	/*
		process.argv
		// Системные аргументы
		process.argv[0] - директория electron.exe
		// Пользовательские аргументы
		process.argv[1] - домен
		process.argv[2] - гет параметр gid
		process.argv[3] - гет параметр platform
		process.argv[4] - id в стиме
	*/

	if (isWebPlatform)
		appData.getParams = '?gid=47019618_CFNiaOKDgM';
	else {
		appData.steamId = 'Your steam id';
		appData.getParams = '?platform=st&gid=47019619_CFNiaOKDgM';
	}

	appData.getParams += '&lang=ru';
	appData.getParams += '&mainServer=jjbox.ru';
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
		icon: path.resolve(rootname, 'cont/img/logo.png'),
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