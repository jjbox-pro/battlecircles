import fs from 'fs';
import gulp from 'gulp';
import del from 'del';
import concat from 'gulp-concat';
import merge from 'merge-stream';
import rename from 'gulp-rename';
import terser from 'gulp-terser';

import config from './project.config.js';



fs.writeFileSync('~timing', `${Date.now()}`, `utf8`); // Save build starting timestamp



const outputDir = config.distFolder;
const inputDirName = 'src';

let globalTasks = [];

const addTask = (mark, task) => {
	if (!mark) return;
	else if (!task) { task = mark; }

	if (typeof (task) === 'function')
		task = task();

	globalTasks.push(task);
};
const addTaskGroup = (mark, callback) => {
	if (!mark)
		return;

	callback();
};


export const clean = () => {
	return del([
		`./${inputDirName}/html/gen/**`,
		`./${inputDirName}/js/gen/**`,

		`${outputDir}/css`,
		`${outputDir}/html`,
		`${outputDir}/js`,
	], {force: true});
};


export const scripts = () => {
	const tasks = (() => {
		globalTasks = [];

		addTaskGroup('battci', () => {
			addTask('lib', gulp
				.src([
					`${inputDirName}/js/lib/jquery-1.12.4.min.js`,
					`${inputDirName}/js/lib/jquery-ui-1.9.1.cstm.min.js`,
					`${inputDirName}/js/lib/clipboard.min.js`,
					`${inputDirName}/js/lib/sound/howler-2.2.1.min.js`,
					`${inputDirName}/js/lib/moment.min.js`,
					`${inputDirName}/js/lib/device.min.js`,
				])
				.pipe(concat('lib_battci.js'))
				.pipe(gulp.dest(`${outputDir}/js/spa/battci`))
			);

			addTask('lib_mobile', () => gulp
				.src([`${inputDirName}/js/lib/moment.min.js`])
				.pipe(concat('lib_battci_mobile.js'))
				.pipe(gulp.dest(`${outputDir}/js/spa/battci/mobile`))
			);

			addTask('lib_worker', () => gulp
				.src([`${inputDirName}/js/lib/moment.min.js`])
				.pipe(concat('lib_battci_worker.js'))
				.pipe(gulp.dest(`${outputDir}/js/spa/battci/worker`))
			);
		});

		return globalTasks;
	})();

	return merge(tasks);
};


export const copy = () => {
	const tasks = (() => {
		globalTasks = [];
		
		addTaskGroup('battci', () => {
			addTask('admin', gulp
				.src([
					`${inputDirName}/js/spa/battci/__admin/cache.js`,
				])
				.pipe(gulp.dest(function () {
					return `${outputDir}/js/spa/battci/admin`;
				}))
			);

			addTask('cordova', gulp
				.src([
					`${inputDirName}/js/spa/battci/__mobile/__phoneapp/__cordova/include0.js`,
				])
				.pipe(gulp.dest(function () {
					return `${outputDir}/js/spa/battci/mobile/phoneapp/cordova`;
				}))
			);

			addTask('worker', gulp
				.src([`${inputDirName}/js/spa/battci/__worker/launcher.js`])
				.pipe(gulp.dest(`${outputDir}/js/spa/battci/worker`))
			);
			
			addTask('cont', gulp
				.src([`${inputDirName}/cont/**`])
				.pipe(gulp.dest(`${outputDir}/cont`))
			);
		});

		return globalTasks;
	})();

	return merge(tasks);
};



export default gulp.series(
	clean,
	gulp.parallel(scripts, copy)
);