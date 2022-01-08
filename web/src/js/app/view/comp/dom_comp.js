class DOMComp {
	static get super() {
        return Object.getPrototypeOf(this).prototype;
    }

	static pendingReqCount = 0;

	static prepareData() {
		return {};
	}

	constructor() {
		this.init.apply(this, arguments);
	}
}


DOMComp.prototype.init = function (parent = domMgr.app) {
	this.parent = parent;

	this.name = this.calcName();

	this.fullName = this.calcFullName(); // Полное имя (с учётом имени родителя)

	this.tmpl = this.calcTmplFolder();

	this.initOptions();

	this.timeouts = {};

	this.plugins = {};

	this.initStaticData();

	this.state = {};

	// temp setter/getter for wrp and cont props
	Object.defineProperties(this, {
		wrp: {
			set: function($wrp){
				this.$wrp = $wrp;
			},
	
			get: function() { 
				return this.$wrp;
			}
		},
		cont: {
			set: function($cont){
				this.$cont = $cont;
			},
	
			get: function() { 
				return this.$cont;
			}
		}
	});
};

DOMComp.prototype.calcName = function () { return this.name || ''; };

DOMComp.prototype.getName = function () { return this.name; };

DOMComp.prototype.getHashName = function () { return this.hashName || this.name; };

DOMComp.prototype.calcTypeName = function () { return ''; };

DOMComp.prototype.getTypeName = function (postFix) {
	var typeName = this.calcTypeName() || '';

	if (typeName)
		typeName += (postFix || '');

	return typeName;
};

//собираем полное имя
DOMComp.prototype.calcFullName = function () {
	if (this.parent)
		return this.parent.name + '-' + this.name;
	else
		return this.name;
};

DOMComp.prototype.getFullName = function () {
	return this.fullName || '';
};
//выбираем папку шаблона
DOMComp.prototype.calcTmplFolder = function () {
	if (this.tmpl)
		return this.tmpl;

	let tmpl = tmplMgr[this.name];

	if (this.parent)
		tmpl = this.parent.tmpl[this.name]||tmpl;

	return tmpl;
};

DOMComp.prototype.initOptions = function () {
	this.options = this.options || {}; // this.options могут быть установлены раньше вызова конструктора верхнего уровня
	this.options.resizeParent = true;//если компонент ресайзится, то ресайз передаётся родителю
	this.options.clearData = true;
};

DOMComp.prototype.initStaticData = function () {
	this.staticData = {};
};


DOMComp.prototype.getId = function () {
	return this.id;
};

DOMComp.prototype.beforeSetHash = function () { };


DOMComp.prototype.initNotif = function () {
	this.resetNotif();

	this.addBaseNotif();

	this.addNotif();

	this.connectNotif();
};

DOMComp.prototype.resetNotif = function () {
	delete this.reInitNotif;

	this.detachNotif();

	this.notif = { show: [], other: {} }; // show - действия на показ блока, other - любые другие действия
};

DOMComp.prototype.addBaseNotif = function () { };

DOMComp.prototype.addNotif = function () { };

DOMComp.prototype.connectNotif = function () {
	this.notifHandler = this.getNotifHandler();

	this.attachNotif();
};

DOMComp.prototype.detachNotif = function () {
	//отключаем нотификации
	this.doChildren('detachNotif');

	if (this.notifHandler) {
		for (var notifList in this.notif)
			this.detachNotifList(this.notif[notifList]);

		this.resetNotifHandler();
	}
};

DOMComp.prototype.detachNotifElem = function (notif) {
	Notif.removeListener(notif, this.notifHandler);
};

DOMComp.prototype.detachNotifList = function (list) {
	Notif.removeListeners(this.notifHandler, list);
};

DOMComp.prototype.detachNotifOther = function () {
	if (!this.notif)
		return;

	this.detachNotifList(this.notif.other);

	this.reInitNotif = true;
};

DOMComp.prototype.resetNotifHandler = function () {
	this.notifHandler = 0;
};

DOMComp.prototype.getNotifHandler = function () {
	return Notif.getHandler();
};

DOMComp.prototype.attachNotif = function () {
	if (!this.notifHandler)
		return;

	let notif;

	for (notif in this.notif.show)
		Notif.addListener(this.notif.show[notif], this.notifHandler, this.show, this);

	// Разные
	for (notif in this.notif.other) {
		if (typeof (this.notif.other[notif]) === 'function')
			Notif.addListener(+notif, this.notifHandler, this.notif.other[notif], this);
		else
			Notif.addListener(this.notif.other[notif], this.notifHandler, null, this);
	}
};


DOMComp.prototype.initChildren = function () {
	var childrenNew,
		childrenWas = this.children || {},
		childrenActual = {},
		extChildrenData,
		childName;

	this.children = {};

	this.calcChildren();

	childrenNew = this.children;

	this.children = {};

	extChildrenData = this.getExtChildrenData(childrenNew, childrenWas);

	for (childName in childrenWas) {
		if (childrenWas[childName].isActualChild(childrenNew[childName], extChildrenData)) {
			childrenActual[childName] = true;

			continue;
		}

		childrenWas[childName].onRemove();

		if (!this.options.__newChildInit)
			delete this[childName];
	}

	for (childName in childrenNew) {
		this.initChild(childName, childrenNew[childName]);

		if (childrenActual[childName])
			this.restoreChild(this.children[childName], childrenWas[childName]); // Восстанавливаем необходимые данные от ранее существовавшего потомка
	}
};

DOMComp.prototype.calcChildren = function () { };

DOMComp.prototype.getExtChildrenData = function (childrenNew, childrenWas) { };

DOMComp.prototype.isActualChild = function (constructor) {
	return constructor && constructor == this.constructor;
};

DOMComp.prototype.initChild = function (name, cls) {
	return this.children[name] = new cls(this);
};

DOMComp.prototype.restoreChild = function (childNew, childWas) {
	childNew.children = childWas.children;

	childNew.restoreStaticData(childWas);

	childWas.onRemove(true);
};

DOMComp.prototype.restoreStaticData = function (childWas) {
	this.staticData = childWas.staticData;
};

DOMComp.prototype.resetChildren = function () {
	this.doChildren('onRemove');

	this.clearChildren();
};

DOMComp.prototype.clearChildren = function () {
	if (!this.options.__newChildInit)
		for (var child in this.children)
			delete this[child];

	this.children = {};
};

DOMComp.prototype.doChildren = function (command, params) {
	for (var child in this.children) {
		if (this.children[child])
			this.children[child][command](params);
	}
};

DOMComp.prototype.getChild = function (name) {
	return this.children[name];
};


DOMComp.prototype.bindBaseEvent = function () {
	var self = this;

	// Перенести в клаcc Panel 
	// this.wrp.on('mousedown', function(){
	//     if( (self.parent instanceof Interface && !self.options.inactive) || self.options.activatable)
	//         wndMgr.setActiveWnd(self);
	// });
};

DOMComp.prototype.bindEvents = function () { };

DOMComp.prototype.bindEvent = function () { }; // depricated

DOMComp.prototype.onFirstDraw = function () {
	this.bindAllEvent();
};

DOMComp.prototype.bindAllEvent = function () {
	this.bindBaseEvent();

	this.bindEvent();
	this.bindEvents();
};

DOMComp.prototype.beforeResize = function () { };

//действия на изменение размера
//усли выставлен параметр - оповещаем дочерние элементы, если не выставлен - родительские
DOMComp.prototype.resize = function (dirDown) {
	if (!this.$wrp)
		return;

	this.makeResize();

	if (dirDown)
		this.doChildren('resize', dirDown);
	else if (this.options.resizeParent && this.parent && this.parent.isReady())
		this.parent.resize(false, this);
};

DOMComp.prototype.makeResize = function () { };
//формирование данных для шаблона - используются данные блока, синхронная работа
DOMComp.prototype.getTmplData = function () {
	return this.data;
};
//получение главного шаблона
DOMComp.prototype.getTmpl = function () {
	return this.tmpl;
};
//проверяем, стоит ли показывать - ЗАГЛУШКА
DOMComp.prototype.canDisplay = function () {
	return true;
};

DOMComp.prototype.getBaseType = function () { return ''; };

DOMComp.prototype.getBaseTypeClass = function (postFix) {
	return this.getBaseType() + (postFix || '');
};

DOMComp.prototype.getTypeClass = function (postFix) {
	return this.getTypeName(postFix);
};

DOMComp.prototype.getTypeWrpClass = function () {
	return this.getTypeClass('-wrp');
};
//получаем название класса
DOMComp.prototype.getTmplClass = function (postFix) {
	var tmplClass = this.getFullName() || '';

	if (tmplClass)
		tmplClass += (postFix || '');

	return tmplClass;
};
//получаем название класса для врапера
DOMComp.prototype.getTmplWrpClass = function () {
	return this.getTmplClass('-wrp');
};

{ // html_wrp_work
	DOMComp.prototype.setWrp = function () {
		let $parentWrp;

		if (this.parent)
			$parentWrp = this.parent.$cont || this.parent.$wrp;
		else
			$parentWrp = $(document.body);

		let $wrp = $parentWrp.find('.' + this.getWrpClass());

		if (!$wrp.length){
			if (!this.parent)
				throw new Error('-Exception-: component wrapper must be specified!');

			$wrp = this.createWrp();

			$parentWrp.append($wrp);
		}

		this.$wrp = $wrp;

		//this.$wrpDom = $wrp;
		
		//this.$wrp = $('<div>');
	};

	DOMComp.prototype.createWrp = function(){
		const blockType = this.getBlockType();

		return $(`<${blockType} class="${this.getWrpClass()}"></${blockType}>`);
	};

	DOMComp.prototype.getWrpClass = function(){
		return this.getName();
	};

	DOMComp.prototype.modifyWrp = function($wrp){
		return $wrp;
	};

	DOMComp.prototype.getBlockType = function(){
		return 'div';
	};
}


{ // html_cont_work
	DOMComp.prototype.setCont = function () {
		// Создаём контент и оборачиваем его в обёртку
		this.wrapCont(this.createCont());

		// Кеширование контента до вставки во враппер
		this.cacheCont(this.$cont);

		// Модификация контента до вставки во враппер
		this.modifyCont(this.$cont);

		// Контент готов ко вставке во враппер
		this.onContReady(this.$cont);

		// Пишем его во врапер
		this.addContToWrp(this.$cont);
	};

	DOMComp.prototype.wrapCont = function ($cont) {
		this.$cont = $('<div>').html($cont);

		$cont = this.$cont.children();

		if ($cont.length === 1)
			this.$cont = $cont;

		this.$cont.addClass(this.getName() + '__cont');
	};

	DOMComp.prototype.cacheCont = function () { };

	DOMComp.prototype.modifyCont = function () { };

	DOMComp.prototype.onContReady = function () { };

	DOMComp.prototype.addContToWrp = function () {
		this.$wrp.html(this.getContents());

		this.assignCont();
	};

	DOMComp.prototype.getContents = function () {
		return this.$cont.contents();
	};

	DOMComp.prototype.assignCont = function () {
		this.$cont = this.$wrp;
	};
}

DOMComp.prototype.deleteWrp = function () {
	if (!this.$wrp)
		return;

	this.$wrp.unbind().off();

	delete this.$wrp;
};

DOMComp.prototype.removeWrp = function () {
	if (this.$wrp)
		this.$wrp.remove();
};

//удаляем блок
DOMComp.prototype.clearWrp = function () {
	// убираем детей
	this.doChildren('clearWrp');

	this.clearGarbage();

	this.destroyScroll(); // Уничтожение скролла должно происходить до чистки враппера иначе будет утечка памати

	// убираем контент
	if (this.$wrp)
		this.$wrp.empty();
};

DOMComp.prototype.clearGarbage = function () { };
//создаём контент для установки во врапер
DOMComp.prototype.createCont = function () {
	var tmpl = this.getTmpl();

	return tmpl.call(this, this.getTmplData());
};

DOMComp.prototype.refresh = function () {
	this.show();
};

DOMComp.prototype.allowShow = function () {
	return !this.isRemoved() && (!this.parent || (!this.parent.dataReceiving && this.parent.allowShow()));
};
// Показываем блок, если возможно
DOMComp.prototype.show = function () {
	if (!this.allowShow())
		return this;

	if (this.options.hasReqData) {
		if (!this.prepareReq())
			return this;
	}

	this.data = (this.data && !this.options.clearData) ? this.data : {};

	this.dataReceiving = true;

	this.getData();

	return this;
};
//функция сбора данных, по завершении нужно выполнить this.dataReceived()
DOMComp.prototype.getData = function () {
	this.dataReceived();
};
// Данные блока получены - отображаем блок
DOMComp.prototype.dataReceived = function () {
	this.ready = false;

	var firstDraw = this.isFirstDraw();

	this.afterDataReceived();

	if (this.needInitNotif(firstDraw))
		this.initNotif();

	this.clearWrp(firstDraw);

	if (!this.canDisplay()) {
		this.drawIsOver(true);

		return;
	}

	if (firstDraw)
		this.setWrp();

	if (!this.$wrp) {
		this.drawIsOver(true);

		return;
	}

	this.modifyWrp(this.$wrp);

	if (this.needInitChildren(firstDraw))
		this.initChildren();

	this.setCont(firstDraw);

	this.afterContSet(firstDraw);

	if (firstDraw)
		this.onFirstDraw();	

	this.beforeShowChildren(firstDraw);

	this.showChildren();

	this.afterDraw(firstDraw);

	this.drawIsOver();

	this.drawn = true;

	this.onDataReceived(firstDraw);

	this.ready = true;
};

DOMComp.prototype.needInitNotif = function (firstDraw) {
	return firstDraw || !this.notifHandler || this.reInitNotif;
};

DOMComp.prototype.needInitChildren = function (firstDraw) {
	var needInit = firstDraw;

	if (this.reInitChildren) {
		needInit = true;

		delete this.reInitChildren;
	}

	return needInit;
};

DOMComp.prototype.drawIsOver = function (noWrp) {
	var firstShow = !this.wasShown();

	if (noWrp) {
		this.resetChildren();

		this.reInitChildren = true;
	}

	if (!this.isChildrenShown()) {
		this.applyResize(firstShow);

		return;
	}

	if (!noWrp) {
		this.shown = true;

		this.afterShowChildren(firstShow);

		this.applyResize(firstShow);

		this.afterShow(firstShow);

		this.afterAllShow(firstShow);
	}

	if (this.parent)
		this.parent.setChildShown(this);
};

DOMComp.prototype.applyResize = function (firstShow) {
	this.beforeResize(firstShow);

	this.resize();

	this.afterResize(firstShow);
};

DOMComp.prototype.wasDrawn = function () {
	return this.drawn;
};

DOMComp.prototype.isReady = function () {
	return this.ready;
};

DOMComp.prototype.wasShown = function () {
	return this.shown;
};

DOMComp.prototype.isFirstDraw = function () {
	return !this.$wrp || !this.parent;
};

DOMComp.prototype.afterContSet = function () { };

DOMComp.prototype.afterDataReceived = function () {
	this.dataReceiving = false;

	if (this.options.hasReqData)
		this.resetReq();
};

DOMComp.prototype.onDataReceived = function () { };

//действия перед показом детей
DOMComp.prototype.beforeShowChildren = function () { };

DOMComp.prototype.showChildren = function () {
	this.doChildren('deleteWrp');

	this.shownChildren = {};

	this.doChildren('show');
};

DOMComp.prototype.setChildShown = function (child) {
	if (this.shownChildren[child.name])
		return;

	this.shownChildren[child.name] = true;

	if (this.isReady() && this.isChildrenShown())
		this.drawIsOver();
};

DOMComp.prototype.isChildrenShown = function () {
	for (var child in this.children) {
		if (!this.shownChildren[this.children[child].name])
			return false;
	}

	return true;
};


DOMComp.prototype.afterShowChildren = function () { };

DOMComp.prototype.afterShow = function () { };

DOMComp.prototype.afterAllShow = function () { };

//действия выполняемые после показа блока (например переподключение слайдеров)
DOMComp.prototype.afterDraw = function () { };
// Действия выполняемые после пересчета размеров дочерних или родительских элементов
DOMComp.prototype.afterResize = function () { };
//размеры контейнера
DOMComp.prototype.getSizePx = function (opt) {
	opt = opt || {};

	var marg = opt.marg || false;

	if (this.$cont)
		return utils.getElemSize(this.$cont, {
			getSize: function ($cont) {
				return {
					width: $cont.outerWidth(marg),
					height: $cont.outerHeight(marg)
				};
			},
			ignoreHidden: opt.ignoreHidden
		});

	return { width: 0, height: 0 };
};

DOMComp.prototype.isInstanceOf = function (Type) {
	return this instanceof Type;
};


DOMComp.prototype.initScroll = function (opt) {
	opt = opt || {};

	this.$scroll = opt.$scroll || this.getScrollTag(opt.cls);

	// if (this.$scroll.length)
	// 	this.$scroll = IScroll.add(this.$scroll, opt);
	// else
	// 	delete this.$scroll;

	return this;
};

DOMComp.prototype.getScrollTag = function (cls) {
	return this.$wrp.find(cls || '.js-scroll-wrp');
};

DOMComp.prototype.updScroll = function (forceUpdate) {
	if (this.$scroll)
		this.$scroll.update(forceUpdate);

	return this;
};

DOMComp.prototype.doScroll = function (method, val, opt) {
	if (this.$scroll)
		this.$scroll.do(method, [val, opt]);

	return this;
};

DOMComp.prototype.destroyScroll = function () {
	if (this.$scroll)
		this.$scroll.remove();

	delete this.$scroll;

	return this;
};

DOMComp.prototype.$getScrollWrp = function () {
	return this.$scroll.$getWrp();
};


DOMComp.prototype.onRemove = function (noChildren) {
	this.setRemovedState();

	this.unbindEvents();

	this.detachNotif();

	this.removeTables();

	this.clearAllTimeouts(true);

	this.removePlugins(true);

	if (!noChildren)
		this.doChildren('onRemove');
};

DOMComp.prototype.setRemovedState = function () {
	this.removed = true;

	return this;
};

DOMComp.prototype.unbindEvents = function () {};

DOMComp.prototype.isRemoved = function () {
	return this.removed;
};

DOMComp.prototype.toggleDisplay = function (show) {
	if (this.$wrp)
		this.$wrp.toggleClass('-hidden', !show);
};

DOMComp.prototype.showCont = function () {
	if (this.$wrp)
		this.$wrp.removeClass('-hidden');
};

DOMComp.prototype.hideCont = function () {
	if (this.$wrp)
		this.$wrp.addClass('-hidden');
};

DOMComp.prototype.isContHidden = function () {
	return !this.$wrp || this.$wrp.hasClass('-hidden');
};

/* Отслеживание таблиц (пока они не переведены на block) */

DOMComp.prototype.appendTable = function (table) {
	if (!this.tables)
		this.tables = [];

	var _table;

	for (var i = 0; i < this.tables.length; i++) {
		_table = this.tables[i];

		if (!utils.inDOM(_table.cont.get(0)) || _table.cont.get(0) == table.cont.get(0)) {
			this.tables[i].onRemove();

			this.tables.splice(i, 1);

			break;
		}
	}

	this.tables.push(table);
};

DOMComp.prototype.removeTables = function () {
	for (var table in this.tables) {
		this.tables[table].onRemove();
	}
};

/* Работа с асинхронными данными */

DOMComp.prototype.logReq = function () {
	//return debug.logReq.apply(debug, arguments);
};

DOMComp.prototype.prepareReq = function () {
	this.logReq('a--> prepareReq <--');
	this.logReq('a--> this.dataReceiving <--', this.dataReceiving || false);
	this.logReq('a--> this.reqId', this.reqId);

	this.resetReqId();

	this.logReq('a--> this.reqId', this.reqId);

	if (this.dataReceiving) {
		/*
			Флаг указывающий, что полученные ответы и запросы ожидающие отправки более неактуальны (будут проигнорированы в момент обработки)
			и необходимо заново запросить актуальные данные.
		*/
		this.needUpdData = true;

		this.logReq('a--> this.needUpdData', this.needUpdData);
		this.logReq('a-------------------------------------------');

		return false;
	}

	this.needUpdData = false;

	this.logReq('a--> this.needUpdData', this.needUpdData);
	/*
		Идентификатор отложенных запросов.
		При каждом вызове show создаётся новый id для последующих запросов.
		Если происходит попытка отправить запрос с неактуальный id, такой запрос игнорируется.
		Такая ситуация может произойти если блок параллельно отправляет несколько запросов.
	*/
	this.pendingReqId = this.updPendingReqCount();

	this.logReq('a--> this.pendingReqId', this.pendingReqId);
	/*
		Если данный флаг установлен в момент вызова tryProcessResp, то ответ не актуален и не обрабатывается.
		Такая ситуация может возникнуть если блок параллельно отправляет несколько запросов. 
		Установка флага в false происходит непосредственно в момент отправки запроса в функции tryGetReqData.
	*/
	this.waitingReqSend = true;

	this.logReq('a--> this.waitingReqSend', this.waitingReqSend);

	this.logReq('a-------------------------------------------');

	this.clearAllTimeouts();

	this.removePlugins();

	this.detachNotifOther();

	this.doChildren('detachNotif');

	return true;
};
/*
	Для получения данных от сервера в блоке используется конструкция getReqData => tryProcessResp.
	getReqData запоминает id текущего запроса, который используется для проверки необходимости обрабатывать ответ в tryProcessResp.
	P.S. Абсолютное большинство запросов в блоках должно делаться через getReqData => tryProcessResp.
*/
DOMComp.prototype.getReqData = function (callback, opt) {
	this.logReq('a--> getReqData <--');

	this.logReq('a--> this.pendingReqId', this.pendingReqId);

	setTimeout(this.tryGetReqData.bind(this, this.pendingReqId, callback, opt), 0);

	this.logReq('a-------------------------------------------');
};

DOMComp.prototype.tryGetReqData = function (pendingReqId, callback, opt) {
	this.logReq('a--> tryGetReqData <--');

	if (this.isRemoved()) {
		this.logReq('a--> isRemoved', true);
		this.logReq('a-------------------------------------------');

		return;
	}

	opt = opt || {};

	if (opt.noChecks) {
		this.logReq('a--> noChecks', true);
		this.logReq('a--> this.canReqData', true);

		callback.call(this);

		this.logReq('a-------------------------------------------');

		return;
	}

	this.logReq('a--> pendingReqId', pendingReqId);
	this.logReq('a--> this.pendingReqId', this.pendingReqId);

	if (!this.canReqData(pendingReqId)) {
		this.logReq('a--> this.canReqData', false);
		this.logReq('a-------------------------------------------');

		return;
	}

	this.logReq('a--> this.needUpdData', this.needUpdData);

	if (this.needUpdData) {
		this.logReq('a--> this.canReqData', false);
		this.logReq('a-------------------------------------------');

		this.updReqData();

		return;
	}

	this.logReq('a--> this.canReqData', true);

	this.waitingReqSend = false;

	callback.call(this);

	var reqId = reqMgr.getCurReqId();
	// Если в блок отправляет несколько параллельных запросов, сохраняем минимальный reqId
	this.reqId = opt.minReqId ? Math.min(this.reqId || 999999999999, reqId) : reqId;

	this.logReq('a--> reqId', reqId);
	this.logReq('a--> this.reqId', this.reqId);
	this.logReq('a-------------------------------------------');
};

DOMComp.prototype.tryProcessResp = function (resp, reqId, callbacks, opt) {
	this.logReq('a--> tryProcessResp <--');

	if (this.isRemoved()) {
		this.logReq('a--> isRemoved', true);
		this.logReq('a--> canProcessResp', false);
		this.logReq('a-------------------------------------------');

		return;
	}

	if (callbacks instanceof Function)
		callbacks = { onSuccess: callbacks };

	opt = opt || {};

	if (opt.noChecks) {
		this.logReq('a--> noChecks', true);
		this.logReq('a--> canProcessResp', true);

		callbacks.onSuccess.call(this, resp);

		this.logReq('a-------------------------------------------');

		return;
	}

	this.logReq('a--> reqId', reqId);
	this.logReq('a--> this.reqId', this.reqId);
	this.logReq('a--> this.needUpdData', this.needUpdData);
	this.logReq('a--> this.waitingReqSend', this.waitingReqSend);

	if (!this.canProcessResp(reqId)) {
		this.logReq('a--> canProcessResp', false);

		this.logReq('a-------------------------------------------');

		if (callbacks.onFail)
			callbacks.onFail.call(this, resp);

		if (this.needUpdData)
			this.updReqData();

		return;
	}

	this.logReq('a--> canProcessResp', true);

	this.logReq('a-------------------------------------------');

	callbacks.onSuccess.call(this, resp);
};

DOMComp.prototype.canProcessResp = function (reqId) {
	var canProcess = (!this.reqId || reqId >= this.reqId) && !this.needUpdData && !this.waitingReqSend;

	if (!canProcess || !this.parent)
		return canProcess;

	return this.parent.canProcessResp(reqId);
};

DOMComp.prototype.canReqData = function (pendingReqId) {
	var canReq = (!this.pendingReqId || pendingReqId >= this.pendingReqId);

	if (!canReq || !this.parent)
		return canReq;

	return this.parent.canReqData(pendingReqId);
};

DOMComp.prototype.updReqData = function () {
	this.needUpdData =
		this.dataReceiving = false;

	this.show();
};

DOMComp.prototype.resetReqId = function () {
	this.reqId = 0;
};

DOMComp.prototype.resetReq = function () {
	this.needUpdData = this.waitingReqSend = false;
};

DOMComp.prototype.updPendingReqCount = function () {
	return ++DOMComp.pendingReqCount;
};

/* Таймерами */

DOMComp.prototype.setTimeout = function (callback, delay) {
	// Игнорируем большую задержку
	if (delay > timeMgr.maxTimeoutDelay)
		return;

	const timeoutId = setTimeout(() => {
		callback.call(this);

		// После срабатывания тймера удаляем timeoutId из списка timeouts
		this.delTimeoutId(timeoutId);
	}, delay);

	this.timeouts[timeoutId] = { id: timeoutId };
	
	return timeoutId;
};

DOMComp.prototype.clearTimeout = function (timeoutId) {
	if (this.timeouts[timeoutId]) {
		clearTimeout(timeoutId);

		this.delTimeoutId(timeoutId);
	}
};

DOMComp.prototype.delTimeoutId = function (timeoutId) {
	delete this.timeouts[timeoutId];
};

DOMComp.prototype.clearAllTimeouts = function (noChildren) {
	for (var timeoutId in this.timeouts)
		clearTimeout(timeoutId);

	this.timeouts = {};

	if (!noChildren)
		this.doChildren('clearAllTimeouts');
};

/* Делегирование (вызов методов родителей в цепочке прототипов) */

DOMComp.prototype.delegate = function (methodName, constructor, args) {
	return utils.delegate(this, methodName, constructor, args);
};

/* Плагинами */

DOMComp.prototype.setPlugin = function (Plugin, opt) {
	new Plugin(this, opt);
};

DOMComp.prototype.removePlugins = function (noChildren) {
	for (var plugin in this.plugins)
		this.plugins[plugin].onRemove();

	this.plugins = {};

	if (!noChildren)
		this.doChildren('removePlugins');
};



module.exports = { DOMComp };



//#region offlineImports
var { utils } = require('@/app/core/utils');
var { Notif } = require('@/app/core/notif');
var { timeMgr } = require('@/app/core/timeMgr');
var { tmplMgr } = require('@/app/core/tmplMgr');
var { reqMgr } = require('@/app/core/reqMgr');

var { domMgr } = require('@/app/core/domMgr');
//#endregion offlineImports