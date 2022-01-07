const 	{utils} = require('jjbox-utils');

const 	argv = utils.prepareArgv(process.argv),
		argp = utils.prepareArgp(argv);
		

module.exports = function(ctx) {
	utils.log('Running: ' + ctx.hook);
	
	
	(function(){
		let platform = ctx.opts.platforms[0];
		
		if( !platform )
			return;

		utils.makeSymlink(ctx.opts.projectRoot + '/dist/platforms/' + platform, 'www/dist', 'junction'); // The type argument is only available on Windows and ignored on other platforms.
	})();
};
