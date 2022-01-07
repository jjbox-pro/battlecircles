const cacheBuilder = require('wofh-builder-cache');

(async () => {
	try{
		await cacheBuilder.run();
	}
	catch(e){
		console.error(e);
		
		process.exit(1);
	}
})();