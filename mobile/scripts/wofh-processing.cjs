const cssbaseBuilder = require('wofh-builder-cssbase');

(async () => {
	try{
		await cssbaseBuilder.run({
			pathSrc: './dist/platforms/android/css/',
			pathDist: './dist/platforms/android/css/',
			rootFolder: 'android',
			base: 'https://content.jjbox.ru/battlecircles/'
		});
		await cssbaseBuilder.run({
			pathSrc: './dist/platforms/ios/css/',
			pathDist: './dist/platforms/ios/css/',
			rootFolder: 'ios',
			base: 'https://content.jjbox.ru/battlecircles/'
		});
	}
	catch(e){
		console.error(e);
		
		process.exit(1);
	}
})();