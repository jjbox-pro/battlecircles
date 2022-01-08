class Notif {
	static ids = {};
	static notifs = {};
	static handler = 0;
	static delay = 500;
	static sDelay = 250;

	static init() { }

	static add = (() => {
		var handler = 0, i;

		return function (ids) {
			if (typeof (ids) === 'string') {
				this.ids[ids] = ++handler;

				return;
			}

			for (i = 0; i < ids.length; i++)
				this.ids[ids[i]] = ++handler;
		};
	})();

	static get(notifName) {
		if (typeof (this.ids[notifName]) === 'undefined')
			this.add(notifName);

		return this.ids[notifName];
	}

	static getHandler() {
		return ++this.handler;
	}

	static toArray(params) {
		return Array.isArray(params) ? params : [params];
	}

	static addListener(notifId, handler, cb, context) {
		var notifData = {};

		if (typeof (notifId) === 'object') {
			notifData = notifId;

			notifId = notifData.id;
		}
		else {
			if (typeof (cb) === 'object') {
				notifData = cb;

				cb = notifData.cb || notifData.callback;
			}
			else if (cb && typeof (cb.params) !== 'undefined')
				notifData.params = cb.params;
		}

		this.attachNotif(new Notif(notifData, notifId, handler, cb, context));

		return this;
	}

	static attachNotif(notif) {
		var notifId = notif.getId();

		this.notifs[notifId] = this.notifs[notifId] || {};

		return this.notifs[notifId][notif.getHandler()] = notif;
	}

	static removeListener(notif, handler) {
		if (typeof (notif) === 'object')
			notif = notif.id;

		delete this.notifs[notif][handler];
	}

	static removeListeners(handler, list) {
		list = list || this.notifs;

		var notif;

		if (Array.isArray(list))
			for (notif in list)
				this.removeListener(list[notif], handler);
		else
			for (notif in list)
				this.removeListener(notif, handler);
	}

	static sendNotif(notifId, data, ...restParams) {
		const notifs = this.notifs[notifId];

		if (!notifs)
			return this;

		let notif, handler;

		for (handler in notifs) {
			notif = notifs[handler];

			notif.callback.apply(notif.context, [data, notif, ...restParams]); // Формат [первый параметр, нотификация, остальные параметры]

			if (notif.once)
				this.removeListener(notif, handler);
		}

		return this;
	}


	constructor(notifData, notifId, handler, callback, context) {
		Object.assign(this, notifData);

		this.id = this.id || notifId;
		this.handler = this.handler || handler;
		this.callback = this.callback || callback;
		this.context = this.context || context;

		if (typeof (this.params) !== 'undefined')
			this.paramsArr = Notif.toArray(this.params);
		else
			delete this.params;
	}

	getId() {
		return this.id;
	}

	getHandler() {
		return this.handler;
	}
}



module.exports = { Notif };