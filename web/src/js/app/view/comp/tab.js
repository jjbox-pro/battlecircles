//#region runtimeImports
var { utils } = require('@/app/core/utils');
var { Block } = require('@/app/view/comp/block');
//#endregion runtimeImports



function Tab(parent){
	Tab.superclass.constructor.apply(this, arguments);
	
	this.initTab();
}
	
utils.extend(Tab, Block);


Tab.prototype.initTab = function(){};

Tab.prototype.bind = function(){};

Tab.prototype.applyStatus = function(){
    this.tab.removeClass('-disabled');
};

Tab.prototype.afterOpenTab = function(){
};

Tab.prototype.onDisplay = function(){};

Tab.prototype.getOffsetTop = function(){
    return this.wrp.offset().top;
};
// Если был асинхронный запрос получения данных, проверям активность вкладки
Tab.prototype.beforeResize = function(){
    if( this.tabs )
        this.wrp.toggleClass('-hidden', this.tabs.activeTab && this != this.tabs.activeTab);
};

Tab.prototype.isClickable = function(){
    return true;
};

Tab.prototype.getHref = function(){
    return '';
};

Tab.prototype.getIcon = function(){
    return false;
};

Tab.prototype.getCls = function(){
    return '';
};

Tab.prototype.getAttrs = function(){
    return '';
};

Tab.prototype.getLinkClass = function(){
    return this.tabs ? this.tabs.linkClass.slice(1) : 'js-tabLink';
};

Tab.prototype.isActiveTab = function(){
    return this.tabs && this.tabs.activeTab == this;
};

Tab.prototype.onHide = function(){};

Tab.prototype.updScroll = function(){
    Tab.superclass.updScroll.apply(this, arguments);

    if( this.table && this.table.scroll )
        this.table.scroll.update();
};





function Tabs(cont, parent, options){
	this.options = options||{};
	
    this.linkClass = '.' + (this.options.linkClass||'js-tabLink');
    this.wrpClass = '.js-tabWrp';
    this.linkField = 'tab';
    
    this.parent = parent;//родитель
    this.cont = cont;//контейнер
    this.tabCont = this.cont.find('.tabs-cont');//контейнер для вкладок - там выделяются места для вкладок, для которых нет определенного в верстке врапера
    
    this.activeTab = false;//поле по которому сортируем
    this.tabs = {};
    
    this.bind();
}

	Tabs.prototype.bind = function(){
		var self = this;
		
		this.cont.find(this.linkClass).addClass('-disabled');
		
		this.cont.on('click', this.linkClass, function(){
			if ( $(this).hasClass('-disabled') )
				return;
			
			var tabName = $(this).data(self.linkField);
			
			self.openTab(tabName||false);
		});
	};

Tabs.prototype.addTabs = function(tabs){
    for(var tab in tabs){
        if(tabs[tab] instanceof Tab)
            this.addTab(tabs[tab]);
    }
};

Tabs.prototype.addTab = function(tab){
    this.tabs[tab.name] = tab;
	
	tab.tabs = this;
    
    //присоединяем кнопку
    tab.tab = this.cont.find(this.linkClass+'[data-'+this.linkField+'="'+tab.name+'"]');
	
    if(tab.tab.length == 0){
        tab.tab = $(tmplMgr.tabs.tab(tab));
		
        this.cont.find('.tabs-wrp').append(tab.tab);
    }
    
    //ищем врапер, если не находим, создаём
    var wrp = this.cont.find('.'+tab.getTmplWrpClass());
    if(wrp.length == 0){
        wrp = $('<div class="tab-wrp '+tab.getTmplWrpClass()+'"></div>');
		
        this.tabCont.append(wrp);
    }
    
    tab.applyStatus();
};
//открывает вкладку, если пустота - отключает все вкладки
Tabs.prototype.openTab = function(tab, forceOpen){
    if( typeof(tab) == 'string' )
		tab = this.getTab(tab);
    
	if( !forceOpen && this.notOpenTab(tab) )
        return;
	
    if( this.activeTab == tab )
        return;
    
    if( this.activeTab )
        this.activeTab.onHide();
    
    this.onHideTab.call(this.parent||this, this.activeTab);
	
    this.activeTab = tab;
	
    if( this.activeTab )
        this.activeTab.onDisplay();
    
	var self = this;
	
    //старые выделялки
    this.cont.find(this.linkClass).each(function(index, $el){
        $el = $($el);
		
        $el.toggleClass('-active', self.activeTab && $el.data(self.linkField) == self.activeTab.name);
    });
    
    //новые выделялки
    for(tab in this.tabs){
        tab = this.tabs[tab];
        
		tab.tab.toggleClass('-active', this.activeTab && tab == this.activeTab);
		
        if( tab.wrp )
            tab.wrp.toggleClass('-hidden', this.activeTab && tab != this.activeTab);
    }
	
    if( this.activeTab )
        this.activeTab.afterOpenTab();
	
	if( this.activeTab )
		this.activeTab.updScroll();
	
    this.onOpenTab.call(this.parent||this, this.activeTab);
	
	return this.activeTab;
};

Tabs.prototype.getTab = function(tabName){
	return this.tabs[tabName];
};

Tabs.prototype.getTab = function(tabName){
	return this.tabs[tabName];
};

Tabs.prototype.notOpenTab = function(){
	return false;
};

Tabs.prototype.onOpenTab = function(tab){};

Tabs.prototype.onHideTab = function(tab){};

Tabs.prototype.reload = function(){
	var $tabs = this.cont.find('.tabs-wrp').html(''),
		activeTab = this.activeTab;
	
	for(var tab in this.tabs){
		tab = this.tabs[tab];
		tab.tab = $(tmplMgr.tabs.tab(tab));
		$tabs.append(tab.tab);
	}
	
	this.activeTab = false;
	
	this.openTab(activeTab);
};



module.exports = {Tab, Tabs};



//#region offlineImports
var { tmplMgr } = require('@/app/core/tmplMgr');
//#endregion offlineImports