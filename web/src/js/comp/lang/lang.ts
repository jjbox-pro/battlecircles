declare const _url_: { params: { lang?: string } };

let _lang: string = '', _text: any = {};

const _cache: any = {}, _registry: Array<Function> = [];

export const lg = (() => {
	let i: number, tag: string | string[], result: string;

	function lg(): string {
		result = '';

		for (i = 0; i < arguments.length; i++) {
			tag = arguments[i].split('/');
			tag = _text[tag[0]][tag[1] || 0];

			if (tag === undefined) {
				//console['print']('%c --> Empty text tag: ' + arguments[i], 'color: pink');

				tag = '---empty---';
			}

			result += tag;
		}

		return result;
	};


	lg.ids = { ru: 'ru', en: 'en' } as any;

	lg.cache = {} as any;
	lg.cache[lg.ids.ru] = '<*filetime=js/text/ru/chunk_text.js>';
	lg.cache[lg.ids.en] = '<*filetime=js/text/en/chunk_text.js>';


	lg.isLangInCache = function (lang: string) {
		return !!_cache[lang];
	};

	lg.setText = function (lang: string, text: object) {
		_cache[lang] = text;

		return lg.selectLang(lang);
	};

	lg.selectLang = function (lang: string) {
		var text = _cache[lang];

		if (text) {
			_lang = lang;

			_text = text;
		}

		return lg;
	};

	lg.getLang = function () {
		return _lang;
	};

	lg.regCB = function (cb: Function) {
		_registry.push(cb);

		return cb;
	};

	lg.runCB = function () {
		for (var i in _registry)
			_registry[i]();
	};

	lg.getCache = function (lang: string) {
		return lg.cache[lang];
	};

	lg.getRegistry = function () {
		return _registry;
	};

	return lg;
})();

(function setDefSettings() {
	function getBrowserLang(def: string) {
		return (global.navigator.languages && global.navigator.languages[0] || global.navigator.language || '').split('-')[0].toLowerCase() || (def || 'en');
	};

	let lang = _url_.params.lang;

	if (!lang)
		lang = getBrowserLang('en');

	if (!lg.ids[lang])
		lang = 'en';


	_text = { language: [_lang = lang] };
})();