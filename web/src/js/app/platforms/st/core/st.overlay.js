function SteamOverlay(){
    this.overlay = document.createElement('span');

    this.overlay.id = 'steam-overlay';
}


SteamOverlay.prototype.addOverlay = function(){
    if( !document.getElementById(this.overlay.id) )
        document.body.appendChild(this.overlay);
},

SteamOverlay.prototype.removeOverlay = function(){
    if( document.getElementById(this.overlay.id) )
        document.body.removeChild(this.overlay);
}


var steamOverlay = new SteamOverlay();



module.exports = {steamOverlay};