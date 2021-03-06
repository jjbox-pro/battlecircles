//#region runtimeImports
var { utils } = require('@/app/core/utils');
//#endregion runtimeImports



function Snd(){}

Snd.prepareData = function(){
    return true;
};

Snd.type = {
    music: MusicSnd,
    ambient: AmbientSnd,
    noise: NoiseSnd,
    event: EventSnd
};

Snd.volume = {
    max: 1,
    min: 0,
    def: 0.5
};

Snd.__dIdParams = {
    nodeId: 0,
    __threadId: 1,
    node: 2
};

Snd.volumeBase = 100;

Snd.callbacks = {
    onload: function(__threadId){
        this._snd_.onSndNodeLoad(__threadId, this);
    },
    onloaderror: function(__threadId){
        this._snd_.onSndNodeLoadError(__threadId, this);
    },
    onplay: function(__threadId){
        this._snd_.onSndNodePlay(__threadId, this);
    },
    onplayerror: function(__threadId){
        this._snd_.onSndNodePlayError(__threadId, this);
    },
    onpause: function(__threadId){
        this._snd_.onSndNodePause(__threadId, this);
    },
    onstop: function(__threadId){
        this._snd_.onSndNodeStop(__threadId, this);
    },
    onend: function(__threadId){
        this._snd_.onSndNodeEnd(__threadId, this);
    }
};


Snd.prototype.init = function(){
    this.setVolume(this.constructor.storageVolume());
    
    this.loop = false;
    this.html5 = false;
    this.autoplay = false;
    
    this.sndNodesCache = {};
    
    this.activeSndNodes = {};
    
    this.initNotif();
    
    this.inited = true;
    
    return this;
};
    
    Snd.prototype.initNotif = function(){
        this.notifHandler = Notif.getHandler();
        
        Notif.addListener(Notif.ids.sndGlobalVolume, this.notifHandler, this.onGlobalVolumeChanged, this);
        Notif.addListener({id: Notif.ids.sndVolume, params: [this.constructor]}, this.notifHandler, this.onVolumeChanged, this);
        Notif.addListener({id: Notif.ids.sndVolumeOn, params: [this.constructor]}, this.notifHandler, this.onVolumeOn, this);
        Notif.addListener({id: Notif.ids.sndVolumeOff, params: [this.constructor]}, this.notifHandler, this.onVolumeOff, this);
    };
    
Snd.prototype.isInited = function(){
    return this.inited;
};

    
Snd.prototype.play = function(track){
    if( !this.canPlay(track) )
        return [0, 0, null];
    
    var sndNode = this.getSndNode(track);
    
    this.beforePlay(sndNode);
    
    var __threadId = sndNode.play();
    
    if( __threadId )
        this.onSndNodePlayReady(__threadId, sndNode);
    
    return [sndNode.getId(), __threadId, sndNode]; // __dId - ?????????????? ?????????????????????????? 0 - id ?????????????????? ????????, 1 - id ?????????????????? ???????????? ?? ????????
};

    Snd.prototype.canPlay = function(track){
        return track && this.getVolume();
    };
    
    Snd.prototype.beforePlay = function(sndNode){
        sndNode.updVolume();
    };

Snd.prototype.pause = function(__dId){
    if( arguments.length ){
        if( __dId ){
            __dId = utils.toArr(__dId);
            
            this.doSndNode(this.getActiveSndNode(__dId[Snd.__dIdParams.nodeId]), 'pause', [__dId[Snd.__dIdParams.__threadId]]);
        }
        
        return this;
    }
    
    this.doSndNodes('pause');
    
    return this;
};

Snd.prototype.stop = function(__dId){
    if( arguments.length ){
        if( __dId ){
            __dId = utils.toArr(__dId);
            
            this.doSndNode(this.getActiveSndNode(__dId[Snd.__dIdParams.nodeId]), 'stop', [__dId[Snd.__dIdParams.__threadId]]);
        }
        
        return this;
    }
    
    this.doSndNodes('stop');
    
    return this;
};

Snd.prototype.setVolume = function(volume){
    if( this.volume == volume || volume === undefined )
        return;
    
    this.volume = +volume;
    
    this.checkVolume(true);
    
    return this;
};

Snd.prototype.getVolume = function(){
    return sndMgr.getGlobalVolume() && this.volume; // Consider into account global volume
};

Snd.prototype.checkVolume = function(checkSndNodes){
    if( this.getVolume() ){
        if( !this.isActive() )
            Notif.sendNotif(Notif.ids.sndVolumeOn, [this.constructor]);
        
        if( checkSndNodes )
            this.doSndNodes('updVolume');
    }
    else
        Notif.sendNotif(Notif.ids.sndVolumeOff, [this.constructor]);
    
    return this;
};

Snd.prototype.isPlaying = function(){
    return this.isActive();
};

Snd.prototype.isActive = function(){
    return !utils.isEmpty(this.activeSndNodes);
};


Snd.prototype.onGlobalVolumeChanged = function(){
    this.checkVolume();
};

Snd.prototype.onVolumeChanged = function(paramsArr, notif, val){
    if( val != +val )
        return;
    
    val = +val;
    
    this.constructor.storageVolume(val);
    
    this.setVolume(val);
};

Snd.prototype.onVolumeOn = function(){};

Snd.prototype.onVolumeOff = function(){
    this.pause();
};


Snd.prototype.getSndNode = function(track){
    var sndNode = this.sndNodesCache[track.getId()];
    
    if( sndNode )
        return sndNode;
    
    sndNode = new SndNode(this.getSndNodeOpt(track));
    
    return this.sndNodesCache[track.getId()] = sndNode;
};

    Snd.prototype.getSndNodeOpt = function(track){
        var opt = {
            src: track.getSrc(),
            loop: this.loop,
            volume: this.getVolume() * track.getFactor(),
            html5: this.html5,
            autoplay: this.autoplay,
            
            _snd_: this,
            _sndTrack_: track
        };
        
        for(var callback in this.constructor.callbacks)
            opt[callback] = this.constructor.callbacks[callback];
    
        return opt;
    };

Snd.prototype.getActiveSndNode = function(sndNodeId){
    return this.activeSndNodes[sndNodeId];
};

Snd.prototype.appendSndNodeToActive = function(sndNode){
    this.activeSndNodes[sndNode.getId()] = sndNode;
    
    return this;
};

Snd.prototype.removeSndNodeToActive = function(sndNode){
    delete this.activeSndNodes[sndNode.getId()];
    
    return sndNode;
};


Snd.prototype.doSndNodes = function(command, args){
    for(var sndNode in this.activeSndNodes)
        this.doSndNode(this.activeSndNodes[sndNode], command, args);
};

Snd.prototype.doSndNode = function(sndNode, command, args){
    if( !sndNode )
        return;
    
    return sndNode[command].apply(sndNode, args);
};


Snd.prototype.onSndNodeLoad = function(__threadId, sndNode){};

Snd.prototype.onSndNodeLoadError = function(__threadId, sndNode){};

Snd.prototype.onSndNodePlayReady = function(__threadId, sndNode){
    this.appendSndNodeToActive(sndNode);
};

Snd.prototype.onSndNodePlay = function(__threadId, sndNode){};

Snd.prototype.onSndNodePlayError = function(__threadId, sndNode){
    this.removeSndNodeToActive(sndNode);
};

Snd.prototype.onSndNodePause = function(__threadId, sndNode){
    this.removeSndNodeToActive(sndNode);
};

Snd.prototype.onSndNodeStop = function(__threadId, sndNode){
    this.removeSndNodeToActive(sndNode);
};

Snd.prototype.onSndNodeEnd = function(__threadId, sndNode){
    this.removeSndNodeToActive(sndNode);
};



/***************************
 * ???????????????? ?????????????? ???????????? *
 ***************************/

function MusicSnd(){
    MusicSnd.superclass.constructor.apply(this, arguments);
}

MusicSnd.prepareData = function(){
    return debug.isTest('later');
};

MusicSnd.storageVolume = function(val){
    return val === undefined ? ls.getAudioMusicVolume(Snd.volume.def) : ls.setAudioMusicVolume(val);
};

MusicSnd.storageEnable = function(val){
    return val === undefined ? ls.getAudioMusicOn() : ls.setAudioMusicOn(val);
};

utils.extend(MusicSnd, Snd);


MusicSnd.prototype.init = function(){
    MusicSnd.superclass.init.apply(this, arguments);
    
    this.extendTrackList();
    
    this.html5 = true;
    
    this.trackList = [];
    
    this.playRandomTrack();
};

MusicSnd.prototype.play = function(track){
    track = track||this.getCurrentTrack()||this.getRandomTrack();
    
    return MusicSnd.superclass.play.call(this, track);
};

MusicSnd.prototype.beforePlay = function(sndNode){
    MusicSnd.superclass.beforePlay.apply(this, arguments);
    
    this.stop();
};

MusicSnd.prototype.playRandomTrack = function() {
    this.play(this.getRandomTrack());
};

MusicSnd.prototype.getRandomTrack = function() {
    if( !this.trackList.length )
        this.trackList = MusicSnd.trackList.slice(0);

    var index = utils.random(this.trackList.length);

    return this.trackList.splice(index, 1)[0];
};

MusicSnd.prototype.getTrackName = function(){
    return MusicSnd.storageVolume() ? this.track.name.split('/').pop() : '';
};

MusicSnd.prototype.extendTrackList = function() {
    if( !MusicSnd.trackList.length )
        MusicSnd.trackList.push(new Track(''));
};


MusicSnd.prototype.onVolumeOn = function(){
    this.play();
    
    //this.playRandomTrack();
};


MusicSnd.prototype.onSndNodeEnd = function() {
    MusicSnd.superclass.onSndNodeEnd.apply(this, arguments);
    
    this.playRandomTrack();
};

MusicSnd.prototype.onSndNodePlayReady = function(__threadId, sndNode) {
    MusicSnd.superclass.onSndNodePlayReady.apply(this, arguments);
    
    this.setCurrentTrack(sndNode.getSndTrack());
    
    Notif.sendNotif(Notif.ids.sndBackChange, sndNode._sndTrack_.getName());
};

MusicSnd.prototype.onSndNodePause = function() {
    MusicSnd.superclass.onSndNodePause.apply(this, arguments);
    
    Notif.sendNotif(Notif.ids.sndBackChange, '--- paused ---');
};

MusicSnd.prototype.onSndNodeStop = function() {
    MusicSnd.superclass.onSndNodeStop.apply(this, arguments);

    Notif.sendNotif(Notif.ids.sndBackChange, '');
};


MusicSnd.prototype.setCurrentTrack = function(track){
    this.currentTrack = track;
    
    return this;
};

MusicSnd.prototype.getCurrentTrack = function(){
    return this.currentTrack;
};



/***************************
 * ???????????????? ?????????????? ???????????? *
 ***************************/

function AmbientSnd(){
    AmbientSnd.superclass.constructor.apply(this, arguments);
}

AmbientSnd.prepareData = function(){
    return debug.isTest('later');
};

AmbientSnd.storageEnable = function(val){
    return val === undefined ? ls.getAudioAmbientOn() : ls.setAudioAmbientOn(val);
};

AmbientSnd.storageVolume = function(val){
    return val === undefined ? ls.getAudioAmbientVolume(Snd.volume.def) : ls.setAudioAmbientVolume(val);
};

utils.extend(AmbientSnd, Snd);


AmbientSnd.prototype.init = function(){
    AmbientSnd.superclass.init.apply(this, arguments);
    
    this.extendTrackList();
    
    this.loop = true;
    this.html5 = true;
    
    this.trackList = [];
    
    for( var track in AmbientSnd.trackList )
        this.trackList.push(AmbientSnd.trackList[track]);
    
    this.play();
};

AmbientSnd.prototype.play = function(){
    for( var track in this.trackList )
        MusicSnd.superclass.play.call(this, this.trackList[track]);
    
    return this;
};

// ?????????????????? ?????????????? ???????????????????? ???????????? ???????????????????? AmbientSnd ?????????????? ??????????????
AmbientSnd.prototype.extendTrackList = function() {
    if( !wofh.town )
        return;

    var slotList = wofh.town.getSlots().getList(),
        tracks,
        added = {};

    for(var slot in slotList){
        slot = slotList[slot];

        tracks = EventSnd.buildTrackList[slot.id];
        for(var track in tracks){
            track = tracks[track];

            if( track.data.type === Snd.type.ambient && !added[slot.id] ){
                added[slot.id] = true;

                AmbientSnd.trackList.push(track.clone());
            }
        }
    }
};


AmbientSnd.prototype.onVolumeOn = function(){
    this.play();
};



/**************************
 * ???????????????? ???????????????? ???????? *
 **************************/

function NoiseSnd(){
    NoiseSnd.superclass.constructor.apply(this, arguments);
}

NoiseSnd.prepareData = function(){
    return debug.isTest('later');
};

NoiseSnd.storageEnable = function(val){
    return val === undefined ? ls.getAudioNoiseOn() : ls.setAudioNoiseOn(val);
};

NoiseSnd.storageVolume = function(val){
    return val === undefined ? ls.getAudioNoiseVolume(Snd.volume.def) : ls.setAudioNoiseVolume(val);
};

utils.extend(NoiseSnd, Snd);


NoiseSnd.prototype.init = function(){
    NoiseSnd.superclass.init.apply(this, arguments);
    
    this.extendTrackList();
    
    this.delay = [1, 2]; // ???????????????? ?????????? ??????????????
    
    this.trackList = [];
    
    this.playRandomTrack();
};

NoiseSnd.prototype.play = function(track, delay){
    this.clearTimeout();
    
    delay = delay === undefined ? this.delay[0] + utils.random(this.delay[1]) : delay;
    
    var self = this;
    
    this.timeOutId = setTimeout(function(){
        NoiseSnd.superclass.play.call(self, track);
    }, delay * 1000);
};

NoiseSnd.prototype.stop = function(){
    this.clearTimeout();
    
    NoiseSnd.superclass.stop.apply(this);
};

NoiseSnd.prototype.playRandomTrack = function(delay) {
    this.play(this.getRandomTrack(), delay);
};

NoiseSnd.prototype.getRandomTrack = function() {
    if( !this.trackList.length )
        this.trackList = NoiseSnd.trackList.slice(0);

    var index = utils.random(this.trackList.length);

    return this.trackList.splice(index, 1)[0];
};

NoiseSnd.prototype.isActive = function() {
    return !!this.timeOutId || NoiseSnd.superclass.isActive.apply(this, arguments);
};

// ?????????????????? ?????????????? ???????????????????? ???????????? ???????????????????? AmbientSnd ?????????????? ??????????????
NoiseSnd.prototype.extendTrackList = function() {
    if( !wofh.town )
        return;

    var slotList = wofh.town.getSlots().getList(),
        tracks;

    for(var slot in slotList){
        slot = slotList[slot];

        tracks = EventSnd.buildTrackList[slot.id];
        for(var track in tracks){
            track = tracks[track];

            if( track.data.type === Snd.type.noise )
                NoiseSnd.trackList.push(track.clone());
        }
    }

    if( !NoiseSnd.trackList.length )
        NoiseSnd.trackList.push(new Track(''));
};


NoiseSnd.prototype.onVolumeOn = function(delay){
    //this.play();
    
    this.playRandomTrack(delay);
};

NoiseSnd.prototype.onVolumeOff = function(){
    this.stop();
};


NoiseSnd.prototype.onSndNodeEnd = function() {
    NoiseSnd.superclass.onSndNodeEnd.apply(this, arguments);

    this.playRandomTrack();
};


NoiseSnd.prototype.setCurrentTrack = function(track){
    this.currentTrack = track;
    
    return this;
};

NoiseSnd.prototype.getCurrentTrack = function(){
    return this.currentTrack;
};


NoiseSnd.prototype.clearTimeout = function(){
    clearTimeout(this.timeOutId);
    
    delete this.timeOutId;
};



/******************************
 * ???????????????? ???????????????????? ???????????? *
 ******************************/

function EventSnd(){
    EventSnd.superclass.constructor.apply(this, arguments);
}

utils.extend(EventSnd, Snd);


EventSnd.events = {
    sysWndOpen: 0, // ???????????????? ????????
    sysWndClose: 1, // ???????????????? ????????
    sysButtonEnter: 2, // ?????????????????? ???? ????????????
    sysButtonLeave: 3, // ???????? ?? ????????????
    sysButtonClick: 4, // ???????? ???? ????????????
    sysButtonCloseEnter: 5, // ?????????????????? ???? ???????????? ???????????????? ????????
    sysButtonCloseClick: 6, // ?????????????? ???? ???????????? ???????????????? ????????
    sysTextLinkEnter: 7, // ?????????????????? ???? ?????????????????? ????????????
    sysTextLinkClick: 8, // ?????????????? ???? ?????????????????? ????????????
    sysCheckboxClick: 9, // ???????? ???? ????????????????
    sysRadioClick: 10, // ???????? ???? ?????????? ????????????
    sysSelectOptionEnter: 11, // ?????????????????? ???? ?????????? ????????
    sysSelectClick: 12, // ???????? ???? ?????????????????????? ????????
    sysSelectOptionChange: 13, // ?????????? ???????????? ????????
    sysQuestionEnter: 14, // ?????????????????? ???? ????????????
    sysLuckEnter: 15, // ?????????????????? ???? ??????????
    sysLuckClick: 16, // ???????? ???? ??????????
    sysLuckLeave: 17, // ???????? ?? ??????????
    townAttack: 300, // ?????????? ???? ??????????
    townBuildEnd: 301, // ?????????????? ?????????????????? ??????????????????
    townResIncome: 302, // ?????????????? ????????????
    townTrainEnd: 303, // ?????????????????? ????????????????????
    townBattleEnter: 304, // ???????????? ??????
    accMsgNew: 400, // ?????????? ??????????????????
    accRepNew: 401, // ?????????? ??????????
};


EventSnd.storageEnable = function(val){
    return val === undefined ? ls.getAudioEventOn(1) : ls.setAudioEventOn(val);
};

EventSnd.storageVolume = function(val){
    return val === undefined ? ls.getAudioEventVolume(Snd.volume.def) : ls.setAudioEventVolume(val);
};

EventSnd.getBuildTrack = function(build){
    var tracks = EventSnd.buildTrackList[build.id];

    if( !tracks || !tracks.length )
        return false;

    return tracks[utils.random(tracks.length)]; // ???????????????? ???????????????? ???? ???????????????????? ???????????? ?????? ??????????????
};


EventSnd.prototype.init = function(){
    EventSnd.superclass.init.apply(this, arguments);
    
    if( this.getVolume() )
        this.bindEvents();
};

    EventSnd.prototype.initNotif = function(){
        EventSnd.superclass.initNotif.apply(this, arguments);
        
        Notif.addListener(Notif.ids.sndPlayEvent, this.notifHandler, function(trackOrEventId, notif, opt){
            if( !this.getVolume() )
                return;
            
            opt = opt||{};
            
            trackOrEventId = trackOrEventId instanceof Track ? trackOrEventId : EventSnd.trackList[trackOrEventId];
            
            if( trackOrEventId instanceof Function )
                trackOrEventId = trackOrEventId(opt.data);
            else if( utils.isArray(trackOrEventId) )
                trackOrEventId = trackOrEventId[utils.random(trackOrEventId.length)]; // ???????? ????????????, ???????????????? ????????????????
            
            var __dId = this.play(trackOrEventId);
            
            if( opt.callback )
                opt.callback.call(opt.context, __dId);
        }, this);
        Notif.addListener(Notif.ids.sndStopEvent, this.notifHandler, this.stop, this);
    };
    
    EventSnd.prototype.bindEvents = function(){
        if( this.eventsBinded )
            return;
        
        // ???????????????????????????? ??????????????
        $(document)
            .on('mouseenter.eventSound', '.button1, .buttonBuildSlot, .mmenu-btn, .slotbld-switchBtn', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysButtonEnter);
            })
            .on('mouseleave.eventSound', '.button1, .buttonBuildSlot, .mmenu-btn, .slotbld-switchBtn', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysButtonLeave);
            })
            .on('click.eventSound', '.button1, .buttonBuildSlot, .mmenu-btn, .slotbld-switchBtn', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysButtonClick);
            })
            .on('mouseenter.eventSound', '.button2.-type-cancel', function(){
                //Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysButtonCloseEnter);
            })
            .on('click.eventSound', '.button2.-type-cancel', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysButtonCloseClick);
            })
            .on('mouseenter.eventSound', '.link', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysTextLinkEnter);
            })
            .on('click.eventSound', '.link', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysTextLinkClick);
            })
            .on('click.eventSound', 'input:checkbox', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysCheckboxClick);
            })
            .on('click.eventSound', 'input:radio', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysRadioClick);
            })
            .on('click.eventSound', 'select, .mmenu-towns', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysSelectClick);
            })
            .on('mouseenter.eventSound', '.mmenu-towns li', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysSelectOptionEnter);
            })
            .on('change.eventSound', 'select', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysSelectOptionChange);
            })
            .on('mouseenter.eventSound', '.helpIcon', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysQuestionEnter);
            })
            .on('mouseenter.eventSound', '.mmenu-luck', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysLuckEnter);
            })
            .on('click.eventSound', '.mmenu-luck', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysLuckClick);
            })
            .on('mouseleave.eventSound', '.mmenu-luck', function(){
                Notif.sendNotif(Notif.ids.sndPlayEvent, EventSnd.events.sysLuckLeave);
            });
            
        this.eventsBinded = true;
    };
    
    EventSnd.prototype.unbindEvents = function(){
        if( !this.eventsBinded )
            return;
        
        $(document).off('.eventSound');
        
        this.eventsBinded = false;
    };


EventSnd.prototype.onVolumeOn = function(){
    this.bindEvents();
    
    EventSnd.superclass.onVolumeOn.apply(this, arguments);
};

EventSnd.prototype.onVolumeOff = function(){
    this.unbindEvents();
    
    EventSnd.superclass.onVolumeOff.apply(this, arguments);
};





// ?????????????????????? ???? ?????????????? ????????????????????

Howl.prototype.constructor = Howl; // ?????????? ?????????????????????????????? ??????????????????, ?? ????????????????????, ????????????-???? ???? ???????????????????????????????? ??????????????????????

function SndNode(){
    SndNode.superclass.constructor.apply(this, arguments);
}

utils.extend(SndNode, Howl);


SndNode.prototype.init = function(o){
    this._snd_ = o._snd_;
    this._sndTrack_ = o._sndTrack_;
    
    return SndNode.superclass.init.apply(this, arguments);
};


SndNode.prototype.getId = function(){
    return this.getSndTrack().getId();
};

SndNode.prototype.getSndTrack = function(){
    return this._sndTrack_;
};

SndNode.prototype.getSnd = function(){
    return this._snd_;
};

SndNode.prototype.updVolume = function(){
    this.volume(this.getSnd().getVolume() * this.getSndTrack().getFactor());
    
    return this;
};



module.exports = {Snd, MusicSnd, AmbientSnd, NoiseSnd, EventSnd, SndNode};



//#region offlineImports
var { debug } = require('@/app/core/debug');
var { wofh } = require('@/app/core/stateMgr');
var { ls } = require('@/app/core/lsMgr');
var { Notif } = require('@/app/core/notif');
var { sndMgr } = require('@/app/core/sndMgr');

var { Track } = require('@/app/class/c.track');
//#endregion offlineImports