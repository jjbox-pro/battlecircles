import gulp from 'gulp';
import del from 'del';
import fs from 'fs';

import config from './project.config.js';



const 	outputDirName = 'dist',
		inputSrcDirName = config.distFolderName;


export const clean = () => {
	return del([
		`./${outputDirName}/css`,
		`./${outputDirName}/html`,
		`./${outputDirName}/js`,
		`./${outputDirName}/cont`,
	]);
};


export const css = () => {
	return gulp
			.src([
				`${inputSrcDirName}/css/platforms/st/**`, 
				`${inputSrcDirName}/css/spa/battci/*.css`,
				`${inputSrcDirName}/css/*.css`,
				`!${inputSrcDirName}/css/admin.css`,
			], {base: `./${inputSrcDirName}/css`})
			.pipe(gulp.dest(`${outputDirName}/css`));
};


export const html = () => {
	return gulp
		.src([
			`${inputSrcDirName}/html/spa/?(battci)/platforms/st/**`,
		], {base: `./${inputSrcDirName}/html`})
		.pipe(gulp.dest(`${outputDirName}/html`));
};


export const js = () => {
	return gulp.src([
			`${inputSrcDirName}/js/comp/**`,
			`${inputSrcDirName}/js/spa/?(battci)/*.*`,
			`${inputSrcDirName}/js/spa/?(battci)/platforms/st/**`,
			`${inputSrcDirName}/js/spa/battci/worker/**`,
			`${inputSrcDirName}/js/templates/?(battci)/**`,
			`${inputSrcDirName}/js/text/**`,
		], {base: `./${inputSrcDirName}/js`})
		.pipe(gulp.dest(`${outputDirName}/js`))
};


export const cont = () => {
	return gulp.src([
		`${inputSrcDirName}/cont/**`,
	])
		.pipe(gulp.dest(`${outputDirName}/cont`))
};


const tasks = [css, html, js];

//if( !fs.existsSync(`./${outputDirName}/cont`) )
	tasks.push(cont);



export default gulp.series(clean, gulp.parallel(...tasks));