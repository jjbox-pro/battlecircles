const 	{utils} = require('jjbox-utils'),
		child_process = require("child_process");

const 	argv = utils.prepareArgv(process.argv),
		argp = utils.prepareArgp(argv);


module.exports = function(ctx) {
	utils.log('Running: ' + ctx.hook);
	
	
	(() => {
		utils.makeSymlink(ctx.opts.projectRoot, 'icongenie/src-cordova', 'junction'); // The type argument is only available on Windows and ignored on other platforms.
	
		child_process.execSync('npx icongenie generate -m cordova -i src-cordova/res/icon.png --theme-color 000', {cwd: 'icongenie/', stdio: 'inherit'});
	})();
};
