function _url_(uri, base, root) {
    if ((uri || '').charAt(0) !== '/')
        return uri;

    return (base || _url_.base) + root + uri;
}

//_url_.base = location.href.split(/[/\\]html[/\\]/)[0];

_url_.base = document.currentScript.src.split(/[/\\]js[/\\]/)[0];

_url_.params = (() => {
    var params = {};

    location.search.replace(/^\?/, '').split('&').forEach(function (item) {
        item = item.split('=');

        params[item[0]] = item[1] || true;
    });

    return params;
})();

_url_.server = (() => {
    const server = { protocol: 'https:', main: {}, game: {} },
        mainServer = _url_.params.mainServer,
        gameServer = _url_.params.gameServer || (location.host);

    if (mainServer) {
        server.main.domain = mainServer;
        server.main.origin = server.protocol + '//' + mainServer;
    }

    if (gameServer) {
        server.game.domain = gameServer;
        server.game.origin = server.protocol + '//' + gameServer;
    }

    return server;
})();


_url_.css = (href, base, root) => {
    return _url_(href, base, typeof (root) === 'string' ? root : '/css');
};
_url_.js = (src, base, root) => {
    return _url_(src, base, typeof (root) === 'string' ? root : '/js');
};

_url_.img = (src, base, root) => {
    return _url_(src, base, typeof (root) === 'string' ? root : _url_.img.root);
};
_url_.img.root = '/cont/img';
_url_.snd = (src, base, root) => {
    return _url_(src, base, typeof (root) === 'string' ? root : _url_.snd.root);
};
_url_.snd.root = '/cont/snd';

_url_.style = (href, base, root) => {
    return '<link href="' + _url_.css(href, base, root) + '" rel="stylesheet" type="text/css">';
};
_url_.style.load = function (href, opt) {
    return new Promise((resolve, reject) => {
        opt = opt || {};

        const $link = document.createElement('link');

        $link.setAttribute('rel', 'stylesheet');
        $link.setAttribute('type', 'text/css');

        $link.async = false;

        $link.href = _url_.css(href, opt.base, opt.root);

        $link.onload = function () {
            resolve();

            this.onload = this.onerror = null;
        };
        $link.onerror = function (e) {
            reject(e);

            this.onload = this.onerror = null;
        };

        (opt.parentNode || document.head).appendChild($link);
    });
};
_url_.script = (src, base, root) => {
    return '<script src="' + _url_.js(src, base, root) + '" type="text/javascript"></script>';
};
_url_.script.load = function (src, opt) {
    return new Promise((resolve, reject) => {
        opt = opt || {};

        const $script = document.createElement('script');

        $script.type = opt.type || 'text/javascript';

        $script.async = opt.async || false;

        $script.src = _url_.js(src, opt.base, opt.root);

        $script.onload = function () {
            resolve();

            this.onload = this.onerror = null;
        };
        $script.onerror = function (e) {
            reject(e);

            this.onload = this.onerror = null;
        };

        (opt.parentNode || document.head).appendChild($script);
    });
};
_url_.exec = function (funk) {
    funk();

    return '';
};
_url_.exec.load = function (funk) {
    return new Promise(funk);
};


_url_.getEntryPoint = (spaName, platformCode) => {
    let entryPoint = _url_.base + '/html/spa/' + spaName;

    if (typeof (platformCode) === 'number')
        entryPoint += '/platforms/' + platformCode;

    entryPoint += '/index.html?'

    return entryPoint;
};

_url_.getPropValue = (propName, obj = _url_) => {
    return obj[propName];
};

_url_.onload = () => {
    throw new Error('-Exception-: callback "onload" must be implemented by application!');
};


(function loadIncludes() {
    if (!globalThis._include_.list){
        document.addEventListener('DOMContentLoaded', _url_.onload);

        return;
    }

    let promiseArr, include, includeOpt;

    (function loadNextInclude() {
        promiseArr = [];

        while((include = globalThis._include_.list.shift())){
            includeOpt = include[1] || {};

            promiseArr.push(_url_[includeOpt.type || 'script'].load.apply(_url_, include[0]()));

            if( includeOpt.await )
                break;
        }

        if( promiseArr.length )
            return Promise.all(promiseArr).then(loadNextInclude);

        return Promise.resolve();
    })()
        .then(() => {
            delete globalThis._include_;

            if (document.readyState == 'loading')
                document.addEventListener('DOMContentLoaded', _url_.onload);
            else
                _url_.onload();
        })
        .catch(e => {
            console.error(e);
        });
})();


(function initLib() {
    const _registry = [];

    class Lib{
        regCB(cb) {
            _registry.push(cb);
            
            return cb;
        }
        
        runCB() {
            for (var i in _registry)
                _registry[i]();
        }
    }

    _url_.lib = new Lib();
})();



module.exports = _url_;