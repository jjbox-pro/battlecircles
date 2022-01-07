const platformBuilders = require('wofh-builder-platforms');
const langBuilder = require('wofh-builder-lang');
const cssBuilder = require('wofh-builder-css');
const tmplBuilder = require('wofh-builder-tmpl');

(async () => {
	try{
		await platformBuilders.run();
		await langBuilder.run();
		await cssBuilder.run();
		await tmplBuilder.run();
	}
	catch(e){
		console.error(e);
		
		process.exit(1);
	}
})();