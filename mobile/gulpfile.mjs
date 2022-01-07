import gulp from 'gulp';
import del from 'del';

import config from './project.config.js';



const 	inputSrcDirName = '../web/' + config.distFolderName,
		inputContDirName = config.contFolderName,
		outputDirName = 'dist/platforms';

const filter = (outputBaseDir) => {
	const filter = [];

	if( config.buildMode === 'prod' )
		filter.push(`./${outputBaseDir}/js/**/*.map`);
	
	return filter;
};


//#region android
const outputDirName_android = outputDirName + '/android',
	platform_android = {
		code: 'an',
		codeExt: 'an'
	};

export const clean_android = () => {
	return del([
		`./${outputDirName_android}/css`,
		`./${outputDirName_android}/html`,
		`./${outputDirName_android}/js`,
		`./${outputDirName_android}/cont`
	]);
};


export const css_android = () => {
	return gulp
		.src([
			`${inputSrcDirName}/css/mobile/**`,
			`${inputSrcDirName}/css/mobileApp/**`,
			`${inputSrcDirName}/css/platforms/${platform_android.code}/**`,
			`${inputSrcDirName}/css/*.css`,
			`${inputSrcDirName}/css/spa/battci/*.css`,
			`!${inputSrcDirName}/css/admin.css`,
		], { base: `./${inputSrcDirName}/css` })
		.pipe(gulp.dest(`${outputDirName_android}/css`));
};


export const html_android = () => {
	return gulp
		.src([
			`${inputSrcDirName}/html/**/spa/?(battci)/platforms/${platform_android.code}/**`,
		], { base: `./${inputSrcDirName}/html` })
		.pipe(gulp.dest(`${outputDirName_android}/html`));
};


export const js_android = () => {
	return gulp.src([
		`${inputSrcDirName}/js/comp/**`,
		`${inputSrcDirName}/js/spa/*.js`,
		`${inputSrcDirName}/js/spa/?(battci)/*.*`,
		`${inputSrcDirName}/js/spa/?(battci)/mobile/**`,
		`${inputSrcDirName}/js/spa/?(battci)/platforms/${platform_android.codeExt}/**`,
		`${inputSrcDirName}/js/spa/battci/worker/**`,
		//`${inputSrcDirName}/js/templates/?(battci_phoneapp)/**`,
		`${inputSrcDirName}/js/templates/battci/**`,
		`${inputSrcDirName}/js/text/**`,
	], { base: `./${inputSrcDirName}/js`, ignore: `./**/*`})
		.pipe(gulp.dest(`${outputDirName_android}/js`));
};


export const filter_android = () => {
	return del(filter(outputDirName_android));
};


export const cont_android = () => {
	return gulp.src([
		`${inputContDirName}/cont/**`,
	])
		.pipe(gulp.dest(`${outputDirName_android}/cont`))
};


const tasks_android = [css_android, html_android, js_android];

if( false && !fs.existsSync(`./${outputDirName_android}/cont`) )
	tasks_android.push(cont_android);
//#endregion android

//#region ios
const outputDirName_ios = outputDirName + '/ios',
	platform_ios = {
		code: 'io',
		codeExt: 'io'
	};

export const clean_ios = () => {
	return del([
		`./${outputDirName_ios}/css`,
		`./${outputDirName_ios}/html`,
		`./${outputDirName_ios}/js`,
		`./${outputDirName_ios}/cont`
	]);
};


export const css_ios = () => {
	return gulp
		.src([
			`${inputSrcDirName}/css/mobile/**`,
			`${inputSrcDirName}/css/mobileApp/**`,
			`${inputSrcDirName}/css/platforms/${platform_ios.code}/**`,
			`${inputSrcDirName}/css/spa/battci/*.css`,
			`${inputSrcDirName}/css/*.css`,
			`!${inputSrcDirName}/css/admin.css`,
		], { base: `./${inputSrcDirName}/css` })
		.pipe(gulp.dest(`${outputDirName_ios}/css`));
};


export const filter_ios = () => {
	return del(filter(outputDirName_ios));
};


export const html_ios = () => {
	return gulp
		.src([
			`${inputSrcDirName}/html/**/spa/?(battci)/platforms/${platform_ios.code}/**`,
		], { base: `./${inputSrcDirName}/html` })
		.pipe(gulp.dest(`${outputDirName_ios}/html`));
};


export const js_ios = () => {
	return gulp.src([
		`${inputSrcDirName}/js/comp/**`,
		`${inputSrcDirName}/js/spa/*.js`,
		`${inputSrcDirName}/js/spa/?(battci)/*.*`,
		`${inputSrcDirName}/js/spa/?(battci)/mobile/**`,
		`${inputSrcDirName}/js/spa/?(battci)/platforms/${platform_ios.codeExt}/**`,
		`${inputSrcDirName}/js/spa/battci/worker/**`,
		//`${inputSrcDirName}/js/templates/?(battci_phoneapp)/**`,
		`${inputSrcDirName}/js/templates/battci/**`,
		`${inputSrcDirName}/js/text/**`,
	], { base: `./${inputSrcDirName}/js` })
		.pipe(gulp.dest(`${outputDirName_ios}/js`))
};


export const cont_ios = () => {
	return gulp.src([
		`${inputContDirName}/cont/**`,
	])
		.pipe(gulp.dest(`${outputDirName_ios}/cont`))
};


const tasks_ios = [css_ios, html_ios, js_ios];

if( false && !fs.existsSync(`./${outputDirName_ios}/cont`) )
	tasks_ios.push(cont_ios);
//#endregion ios


const tasks = [
	clean_android,
	gulp.parallel(...tasks_android),
	filter_android,
	clean_ios,
	gulp.parallel(...tasks_ios),
	filter_ios
]

export default gulp.series(...tasks);