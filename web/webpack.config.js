const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');

const config = require('./project.config.js');



const isPord = config.buildMode === 'prod',
	isDev = !isPord,
	eslintEnable = false && isDev,
	replacerEnable = false,
	useBabel = true;


const outputDir = config.distFolder;


class Replacer {
	apply(compiler) {
		compiler.hooks.afterCompile.tap('Replacer', (/*params*/) => {
			console.log('----> Replacer <----');
		});
	}
}



module.exports = {
	mode: isDev ? 'development' : 'production',
	target: ['web', 'es5'],
	entry: (() => {
		const entry = {};

		const addEntry = (mark, entryName, body) => {
			if (!mark) return;
			else if (!body) { body = entryName; entryName = mark; }

			if (typeof (body) === 'function')
				body = body();

			entry[entryName] = body;
		};
		const addEntryGroup = (mark, callback) => {
			if (!mark)
				return;

			callback();
		};


		addEntryGroup('components', () => {
			addEntry('launcher', 'comp/launcher/chunk_launcher', {
				import: './src/js/comp/launcher/entry.js',
				library: { name: '_url_', type: 'assign' },
			});

			addEntryGroup('lang', () => {
				addEntry('comp/lang/chunk_lang', {
					import: './src/js/comp/lang/entry.js',
					library: { name: 'lg', type: 'assign' },
				});
				addEntry('text/ru/chunk_text', {
					import: './src/js/gen/text/ru/lang.js'
				});
				addEntry('text/en/chunk_text', {
					import: './src/js/gen/text/en/lang.js'
				});
			});
		});
		addEntryGroup('battci', () => {
			addEntryGroup('chunks', () => {
				addEntry('spa/battci/chunk_battci', {
					import: './src/js/spa/battci/entry.js',
					library: {name: 'jj',type: 'assign'},
				});
				addEntry('spa/battci/admin/hKd32kdhzP/chunk_battci_admin', {
					import: './src/js/spa/battci/__admin/hKd32kdhzP/entry.js',
					dependOn: 'spa/battci/chunk_battci',
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('spa/battci/mobile/chunk_battci_mobile', {
					import: './src/js/spa/battci/__mobile/entry.js',
					dependOn: 'spa/battci/chunk_battci',
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('spa/battci/mobile/phoneapp/chunk_battci_phoneapp', {
					import: './src/js/spa/battci/__mobile/__phoneapp/entry.js',
					dependOn: 'spa/battci/mobile/chunk_battci_mobile',
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('spa/battci/mobile/phoneapp/cordova/chunk_battci_cordova', {
					import: './src/js/spa/battci/__mobile/__phoneapp/__cordova/entry.js',
					dependOn: 'spa/battci/mobile/phoneapp/chunk_battci_phoneapp',
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('spa/battci/admin/hKd32kdhzP/mobile/phoneapp/chunk_battci_phoneapp_admin', {
					import: './src/js/spa/battci/__admin/hKd32kdhzP/__mobile/__phoneapp/entry.js',
					dependOn: ['spa/battci/admin/hKd32kdhzP/chunk_battci_admin', 'spa/battci/mobile/phoneapp/chunk_battci_phoneapp'],
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('spa/battci/worker/chunk_battci_worker', {
					import: './src/js/spa/battci/__worker/entry.js',
					library: {name: 'jj',type: 'assign'}
				});
			});

			addEntryGroup('templates', () => {
				addEntry('templates/battci/templates', {
					import: './src/js/gen/templates/battci/templates',
					dependOn: 'spa/battci/chunk_battci'
				});
				addEntry(false, 'templates/battci_mobile/templates', {
					import: './src/js/gen/templates/battci_mobile/templates',
					dependOn: 'spa/battci/mobile/chunk_battci_mobile'
				});
				addEntry(false, 'templates/battci_phoneapp/templates', {
					import: './src/js/gen/templates/battci_phoneapp/templates',
					dependOn: ['spa/battci/mobile/chunk_battci_mobile', 'spa/battci/mobile/phoneapp/chunk_battci_phoneapp']
				});
				addEntry(false, 'templates/battci_admin_hKd32kdhzP/templates', {
					import: './src/js/gen/templates/battci_admin_hKd32kdhzP/templates',
					dependOn: 'spa/battci/admin/hKd32kdhzP/chunk_battci_admin'
				});
				addEntry(false, 'templates/battci_mobile_admin_hKd32kdhzP/templates', {
					import: './src/js/gen/templates/battci_mobile_admin_hKd32kdhzP/templates',
					dependOn: ['spa/battci/admin/hKd32kdhzP/chunk_battci_admin', 'spa/battci/mobile/chunk_battci_mobile']
				});
				addEntry(false, 'templates/battci_phoneapp_admin_hKd32kdhzP/templates', {
					import: './src/js/gen/templates/battci_phoneapp_admin_hKd32kdhzP/templates',
					dependOn: 'spa/battci/admin/hKd32kdhzP/mobile/phoneapp/chunk_battci_phoneapp_admin'
				});
			});

			addEntryGroup('platforms', () => {
				addEntry('platform_wb', 'spa/battci/platforms/wb/chunk_battci_web', {
					import: './src/js/spa/battci/__platforms/wb/entry.js',
					dependOn: 'spa/battci/chunk_battci',
					library: {name: 'jj', type: 'assign-properties'}
				});
				addEntry('platform_st', 'spa/battci/platforms/st/chunk_battci_steam', {
					import: './src/js/spa/battci/__platforms/st/entry.js',
					dependOn: 'spa/battci/chunk_battci',
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('platform_an', 'spa/battci/platforms/an/chunk_battci_android', {
					import: './src/js/spa/battci/__platforms/an/entry.js',
					dependOn: 'spa/battci/mobile/phoneapp/cordova/chunk_battci_cordova',
					library: {name: 'jj',type: 'assign-properties'}
				});
				addEntry('platform_ios', 'spa/battci/platforms/io/chunk_battci_ios', {
					import: './src/js/spa/battci/__platforms/io/entry.js',
					dependOn: 'spa/battci/mobile/phoneapp/cordova/chunk_battci_cordova',
					library: {name: 'jj',type: 'assign-properties'}
				});
			});
		});
		addEntryGroup('frame', () => {
			addEntry('spa/frame/chunk_frame', {
				import: './src/js/spa/frame/entry.js',
				library: { name: 'jj', type: 'assign' },
			});
		});

		return entry;
	})(),
	optimization: {
		// splitChunks: {
		// 	chunks: (chunk) => {
		// 		// exclude `worker/world_worker_chunk`

		// 		return 	[
		// 			'worker/world_worker_chunk',
		// 			'spa/glagna/chunk_glagna',
		// 			'spa/report/chunk_report',
		// 			'spa/admin_hKd32kdhzP/chunk_admin',
		// 		].indexOf(chunk.name) === -1;
		// 	}
		// }
	},
	output: {
		path: path.resolve(outputDir, 'js'),
		filename: '[name].js'
	},
	devtool: isDev ? 'source-map' : 'source-map',//false,
	resolve: {
		extensions: ['.scss', '.ts', '.tsx', '.js', '.json'], // Extensions which may be ignored by "import"
		alias: { 
			'@': path.resolve('./', 'src/js'),
			'@battci': path.resolve('./', 'src/js/spa/battci'),
		}
	},
	plugins: (() => {
		const plugins = [];

		if (replacerEnable)
			plugins.push(new Replacer());

		if (eslintEnable)
			plugins.push(new ESLintPlugin({
				context: path.resolve('./src'),
				exclude: ['node_modules', 'gen'],
				fix: true,
				quiet: true,
				threads: true,
				// cache: true,
				// cacheLocation: path.resolve('./node_modules/.cache/eslint')
			}));

		return plugins;
	})(),
	module: {
		rules: (() => {
			const rules = [
				{
					test: /\.m?js$/,
					resolve: {
						fullySpecified: false, // To use module names without extension
					},
				}
			];

			if (useBabel) {
				rules.push({
					test: /\.(ts|js)x?$/,
					include: path.resolve('./src/js'),
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									"@babel/preset-env",
									{
										targets: {
											chrome: "39"
										}
									}
								]
								// ,
								// [
								// 	"@babel/preset-typescript",
								// 	{
								// 		// Ensure that .d.ts files are created by tsc, but not .js files
								// 		"declaration": true,
								// 		// Ensure that Babel can safely transpile files in the TypeScript project
								// 		"isolatedModules": true
								// 	}
								// ]
							],
							compact: false, // If true, all optional newlines and whitespace will be omitted if file size more than 500kb.
							cacheCompression: false,
							cacheDirectory: true,
						}
					}
				});

				rules.push({ 
					test: /\.tsx?$/, 
					loader: "ts-loader" 
				})
			}

			return rules;
		})()
	},
	cache: { type: 'filesystem', compression: false }
};