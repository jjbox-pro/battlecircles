//#region runtimeImports
const { DOMComp } = require('@/app/view/comp/dom_comp');
//#endregion runtimeImports



class Wnd extends DOMComp{
	constructor(id, data, params, parent){
		super(parent);
		
		this.setId(id);
		
		this.setData(data);
		
		this.setParams(params);
		
		this.tmplWrp = this.calcTmplWrp();
		
		this.initWndOptions();
	}
}


Wnd.prepareData = function(id, data){
	return data||{};
};


Wnd.prototype.calcFullName = function(){
	return this.name;
};

Wnd.prototype.getTypeName = function(postFix){
	var typeName = Wnd.superclass.getTypeName.apply(this, arguments);
	
	if( typeName )
		typeName = this.getBaseType() + '-' + typeName;
	
	return typeName;
};

Wnd.prototype.getBaseType = function(){return 'wnd';};

Wnd.prototype.getTypeClass = function(postFix){
	var typeClass = Wnd.superclass.getTypeClass.apply(this, arguments);
	
	return this.getBaseTypeClass(postFix) + (typeClass ? ' ' + typeClass : '');
};

Wnd.prototype.getTmplClass = function(){
	var tmplClass = Wnd.superclass.getTmplClass.apply(this, arguments)||'';
	
	if( tmplClass )
		tmplClass = this.getBaseType() + '-' + tmplClass;
	
	return tmplClass;
};

Wnd.prototype.getExtWrpClass = function(){return '';};

Wnd.prototype.getExtClass = function(){
	var cls = '';

	if( this.options.moving )
		cls += ' -type-moving';

	return cls;
};

Wnd.prototype.bindBaseEvent = function(){
	var self = this;

	if( this.options.moving ){
		this.$wrp.draggable({
			handle: '.wnd-header-wrp, .wnd-borders-wrp, .-draggable', 
			cancel: '.js-account-header, .js-country-editName',
			containment:[-10000, 0,  10000, 10000], 
			drag: function( event, ui ) {
				if( !self.options.moving )
					return false;
				else
					self.saveWndPos(ui.position);
			}
		});
	}

	this.$wrp
		.on('mousedown', function(){
			wndMgr.setActiveWnd(self);
		})
		.on('click', '.js-wnd-close', function(){
			self.close();
		});

	if( this.options.showBack ){
		this.$wrp.on('click', '.wnd-back-wrp', function(e){
			if( self.options.canClose )
				self.close();
		});
	}

	if( this.options.showMinimize ){
		this.$wrp.on('click', '.js-wnd-minimize', function(){
			if( !$(this).data('-state-minimizing') )
				self.minimize($(this));
		});
	}
};

Wnd.prototype.isFirstDraw = function(){
	return !this.$wrp;
};

Wnd.prototype.getTmplWrpData = function(cont){
	var data = {cont: cont, wnd: this};

	return data;
};

Wnd.prototype.createCont = function(){
	// Получаем контент
	var cont = Wnd.superclass.createCont.apply(this);

	// Оборачиваем в оконную обёртку
	if( this.tmplWrp )
		return this.tmplWrp(this.getTmplWrpData(cont));   
	else
		return cont;
};

Wnd.prototype.setWrp = function(){
	if( this.$wrp )
		this.$wrp.remove();
	
	this.$wrp = $('<div class="' + this.getTypeWrpClass() + ' ' + this.getTmplWrpClass() + ' ' + this.getExtWrpClass() + '"></div>');
	
	this.appendWrp();
};

Wnd.prototype.appendWrp = function(){
	this.parent.$wrp.append(this.$wrp);
};

Wnd.prototype.removeWrp = function(){
	if( !this.$wrp )
		return;
	
	this.$wrp.remove();

	delete this.$wrp;
    
    this.stopSound();
    
	this.playSound(this.getCloseSound());
};

Wnd.prototype.afterResize = function(firstShow){
	if( firstShow )
		this.setAutoPos();
};

Wnd.prototype.onIdentShow = function(){};

Wnd.prototype.onFirstShow = function(){};

Wnd.prototype.onDataReceived = function(firstDraw, opt){
	if( firstDraw && !this.ignoreFirstDraw )
		wndMgr.onWndFirstShow(this, opt);
	else if( this.active ){
		this.setActive(true);

		wndMgr.updateZ();
	}
};

Wnd.prototype.setId = function(id){
	this.id = '';
	
	if( typeof(id) == 'string' || typeof(id) == 'number' )
		this.id = id;
};

Wnd.prototype.setData = function(data){
	this.data = data||{};
};

Wnd.prototype.setParams = function(params){};

Wnd.prototype.calcTmplWrp = function(){
	return tmplMgr.wnd.wrp;
};

Wnd.prototype.initWndOptions = function(){
	this.options.setHash = true;
	this.options.canClose = true;
	this.options.canCloseAll = true;
	this.options.showBack = false;
	this.options.moving = true;
	this.options.showBorders = true;
	this.options.showButtons = true;
	this.options.clearData = false;
};
//получаем идентичные окна
Wnd.prototype.getIdentWnd = function(){
	var wndList = wndMgr.getWndByType(this.constructor);

	for (var wnd in wndList) {
		wnd = wndList[wnd];

		if( wnd.id == this.id )
			return this.prepareIdentWnd(wnd);
	}

	return false;
};

    Wnd.prototype.prepareIdentWnd = function(identWnd){
        return identWnd;
    };

//получаем конфликтующие окна - их нужно будет удалить перед добавлением нового окна
Wnd.prototype.getConflictWnd = function(){
	return wndMgr.getWndByType(this.constructor);
};

Wnd.prototype.saveWndPos = function(pos){
	var wndPos = ls.getWndPos({});

	if (wndPos && this.name){
		if(!pos)
			pos = this.cont.offset();

		wndPos[this.name] = pos;

		ls.setWndPos(wndPos);
	}
};
//установить позицию по умолчанию
Wnd.prototype.setAutoPos = function(){
	var wndPos = ls.getWndPos({});

	if( this.defaultPos )
		this.setStoredPos();
	else if( wndPos ){
		if(wndPos[this.name] && typeof(this.name) != 'undefined'){
			this.defaultPos = {
				left: wndPos[this.name].left,
				top: wndPos[this.name].top
			};

			this.setStoredPos(true);
		} 
		else
			this.moveToCenter();
	}
	else
		this.moveToCenter();
};

Wnd.prototype.widenToScr = function(){
	this.$wrp.css({width: '100%', height: '100%'});
};
//установить позицию из сохранённых данных
Wnd.prototype.setStoredPos = function(forceDelPos){
	this.moveToPos(this.defaultPos);

	if( forceDelPos || this.wasShown() )
		delete this.defaultPos;
};
//установить позицию в центр экрана
Wnd.prototype.moveToCenter = function(){
	var posX = -this.cont.outerWidth()/2,
		posY = -this.cont.outerHeight()/2,
		left = $(window).width()/2 + window.pageXOffset,
		top = $(window).height()/2 + window.pageYOffset;

	top = Math.max(0, top + posY);
	left = Math.max(0, left + posX);

	this.moveToPos(left, top);
};

Wnd.prototype.moveToPos = function(posOrX, y){
	// При определённых обстоятельствах враппер уже удалён при вызове функции
	if( !this.$wrp )
		return;
	
	var pos;
	
	if( posOrX instanceof Object )
		pos = posOrX;
	else
		pos = {x: posOrX, y: y};
	
	this.$wrp.css({
		left: pos.left === undefined ? pos.x : pos.left, 
		top: pos.top === undefined ? pos.y : pos.top
	});
};

Wnd.prototype.getPos = function(){
	if( this.$wrp )
		return this.$wrp.offset();

	return {top: 0, left: 0};
};

Wnd.prototype.beforeClose = function(result){};

Wnd.prototype.close = function(result){
	var dontClose = this.beforeClose(result);

	if( !dontClose )
		this.delete(result);
};

Wnd.prototype.onRemove = function(){
	if( this.$wrp && this.options.moving )
		this.$wrp.draggable('destroy');
	
	Wnd.superclass.onRemove.apply(this, arguments);
};

Wnd.prototype.delete = function(result){
	wndMgr.removeWnd(this);

	this.onRemove();
	
	this.onClose(result);

	this.deleteWrp();
};

Wnd.prototype.activate = function(){
	wndMgr.setActiveWnd(this);
};

Wnd.prototype.deleteWrp = function(){
	this.clearWrp();

	this.removeWrp();
};

Wnd.prototype.onClose = function(result){};

Wnd.prototype.escClose = function(){
	if( this.options.canClose )
		this.close();
};

Wnd.prototype.minimize = function($el){
	var self = this,
		$wrp = this.$wrp,
		$contWrp = $wrp.find('.wnd-cont-wrp'),
		minimized = $wrp.hasClass('-state-minimized'),
		height = $wrp.find('.wnd-header-wrp').height(),
		pos = $wrp.offset();

	if( minimized ) {
		pos = $wrp.data('oldPos');

		$wrp.toggleClass('-state-minimized', !minimized);
	} else {
		$wrp.data('oldPos', utils.clone(pos));

		pos.top = utils.getWindowHeight(-height);
		pos.left = utils.getWindowWidth() * 0.5;
	}

	$el	.data('-state-minimizing', true)
		.attr('data-title', minimized ? lg('wnd-minimize/0') : lg('wnd-minimize/1'));


	$wrp.animate({
		top: pos.top,
		left: pos.left
	}, 200, function(){
		$wrp.toggleClass('-state-minimized', !minimized);

		self.onEndMinimize();

		$el.removeData('-state-minimizing');
	});

	$contWrp.animate({
		width: 'toggle',
		height: 'toggle'
	}, 200, 'linear');
};

Wnd.prototype.onEndMinimize = function(){};

Wnd.prototype.playSound = function(event){
	Notif.sendNotif(Notif.ids.sndPlayEvent, event);
};

Wnd.prototype.getCloseSound = function(){};

Wnd.prototype.stopSound = function(){};

Wnd.prototype.hasHeader = function(){
	return this.tmpl.header;
};

Wnd.prototype.getHeaderCont = function(data){
	return this.tmpl.header(data||this.data);
};

Wnd.prototype.setHeaderCont = function(data){
	if( this.hasHeader() )
		this.$wrp.find('.wnd-header-wrp').html(this.getHeaderCont(data));
};

Wnd.prototype.setClipboard = function(data){
	this.$wrp.find('.js-clipboard-wrp').html(snip.clipboard(data));
};

Wnd.prototype.getName = function(noHash){
	return this.name+(noHash ? '' : this.getId());
};

Wnd.prototype.setZ = function(z){
	if( this.$wrp )
		this.$wrp.css('z-index', z);
};

Wnd.prototype.appendToList = function(){
	wndMgr.push(this);
};

Wnd.prototype.insertToList = function(pos){
	wndMgr.insert(pos, this);
};



module.exports = {
	Wnd
}



//#region offlineImports
const { utils } = require('@/app/core/utils');
const { ls } = require('@/app/core/lsMgr');
const { Notif } = require('@/app/core/notif');
const { snip } = require('@/app/core/snipet');
const { tmplMgr } = require('@/app/core/tmplMgr');
const { wndMgr } = require('@/app/core/wndMgr');
//#endregion offlineImports