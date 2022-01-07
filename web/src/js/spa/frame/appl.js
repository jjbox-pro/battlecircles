class Appl {
    init() {
        this.initCrossDomain();

        this.initFrame();

        this.finishInit();
    }

    initCrossDomain() {
        if (location.host)
            document.domain = location.host.split(':')[0].split('.').splice(-2).join('.');
    }

    initFrame() {
        globalThis.frame.src = this.getEntryUrl();

        globalThis.frame.hidden = false;
    }

    finishInit() {
        const scripts = [].slice.call(document.documentElement.getElementsByTagName('script') || []);

        for (let i = 0; i < scripts.length; ++i)
            scripts[i].remove();
    }

    getEntryUrl() {
        const contentServer = /test/.test(location.host) ? 'content.jjbox.ru/battlecircles' : 'content.jjbox.ru/battlecircles';

        let url = 'https://' + contentServer + '/html/spa/battci/platforms/wb/index.html?';

        url += 'gid=' + this.getUid(10);
        url += '&lang=' + lg('language');
        url += '&mainServer=' + location.host;
        url += '&v=<*filetime=html/spa/battci/platforms/wb/index.html>';

        url += location.search.replace(/^\?/, '&');

        return url;
    }

    getUid(length) {
        var uid = (document.cookie.match(/_app_uid_=(.*?)(;|$)/) || [])[1] || '';

        if (uid)
            return uid;

        var timestamp = Date.now() + '',
            result = timestamp.substring(3, timestamp.length - 3),
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charactersLength = characters.length - 1;

        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));

        document.cookie = '_app_uid_=' + result;

        return result;
    }
}



const appl = new Appl();



module.exports = { appl };