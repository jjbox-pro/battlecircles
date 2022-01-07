const 	{utils} = require('jjbox-utils'),
		child_process = require("child_process");

const 	argv = utils.prepareArgv(process.argv),
		argp = utils.prepareArgp(argv);


module.exports = function(ctx) {
	utils.log('Running: ' + ctx.hook);
	
	
	(() => {
		utils.log('<--- Starting cleaning config icon and splash tags --->');
		
		let configText = utils.readFile('config.xml');
		
		configText = configText.replace(/<(icon|splash).+?\/>[\r\n\t ]*/g, '');
		
		utils.writeFile('config.xml', configText);
		
		utils.log('<--- done --->');
	})();
	
	
	(() => {
		if( utils.isDirExist('plugins') )
			return;
		
		utils.log('<--- Plugins installing --->');
		
		let plugins = [
			'npx cordova plugin add https://github.com/jjbox-pro/cordova-plugin-platform-accessor.git',
			'npx cordova plugin add cordova-plugin-nativestorage',
			'npx cordova plugin add cordova-plugin-android-permissions',
			'npx cordova plugin add cordova-plugin-splashscreen'
		];
		
		for(var plugin of plugins)
			child_process.execSync(plugin, {cwd: ctx.opts.projectRoot, stdio: 'inherit'});
		
		function excludePlatformFromPlugin(pluginName, platform){
			pluginName = ['plugins', pluginName, 'plugin.xml'].join('/');

			utils.saveFile(pluginName, utils.readFile(pluginName).replace(new RegExp(`<platform name="${platform}">(.|[\n\r\t])+?</platform>`), `<!-- platform: ${platform} excluded -->`));
		}
		
		//excludePlatformFromPlugin('cordova-plugin-googleplus', 'ios'); // Googleplus has conflict with firebase on ios platform
		
		utils.log('<--- done --->');
	})();
};

