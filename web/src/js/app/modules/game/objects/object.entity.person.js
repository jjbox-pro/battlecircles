//#region runtimeImports
const { Unit } = require('@/app/modules/game/objects/object.entity');
//#endregion runtimeImports



class Person extends Unit{
	constructor(){
		super(...arguments);
	}

	init(){
		super.init(...arguments);

		this.lookDir = this.lookDir||new Vector2D(1, 0);
		this.moveDir = this.moveDir||new Vector2D(0, 0);
		this.lookAngle = 0;
		
		this.pos.x = 250;
		this.pos.y = 250;
		this.speed = 5;
		
		this.r = 30;

		this.weapons = [];

		this.setAmmo(0);
	}
	
	initNotifListeners() {
		super.initNotifListeners(...arguments);

		Notif.addListener(Notif.get('nf_onAppRendered'), this.notifHandler, () => {
			this.setAmmo(this.ammo);
		});
	}

	process(scene){
		this.beforeProcess(scene);
		
		this.lookDir = this.game.aim.pos.getDiffVector(this.pos);
		this.lookDir.doNormalize();
		
		this.lookAngle = Math.acos(this.lookDir.x);
		
		if( this.lookDir.y < 0 )
			this.lookAngle *= -1;
		
		this.moveDir.x = 0;
		this.moveDir.y = 0;
		
		if( this.game.appl.keys.ShiftLeft ){
			this.speed = 10;

			this.game.resList.moving.snd.playbackRate = 1.5;
		}
		else{
			this.speed = 5;

			this.game.resList.moving.snd.playbackRate = 1;
		}
			

		if( this.game.appl.keys.KeyW )
			this.moveDir.y = -1;
		else if( this.game.appl.keys.KeyS )
			this.moveDir.y = 1;
			
		if( this.game.appl.keys.KeyD )
			this.moveDir.x = 1;
		else if( this.game.appl.keys.KeyA )
			this.moveDir.x = -1;

		if( this.weapons.length ){
			if( this.game.appl.keys.KeyR )
				this.tryReload = true;
			else if( this.tryReload && !this.game.appl.keys.KeyR ){
				this.tryReload = false;

				const waponsAmmo = [];

				for(let weapon in this.weapons){
					waponsAmmo.push(this.weapons[weapon].addAmmo(this.parent))
				}
			}
		}
		
		if( this.moveDir.x || this.moveDir.y ){
			if( !this.moving ){
				this.moving = true;

				this.game.resList.moving.snd.play();
			}
		}
		else if(this.moving) {
			this.moving = false;

			this.game.resList.moving.snd.pause();
			this.game.resList.moving.snd.currentTime = 0;
		}

		this.pos.addVector(this.moveDir.doNormalize().getMultScalar(this.speed));
		
		this.afterProcess(scene);
	}
	
	draw(scene){
		this.beforeDraw(scene);
		
		scene.getContext().lineWidth = 2;
		scene.getContext().fillStyle = 'white';
		scene.getContext().strokeStyle = 'red';
		
		scene.getContext().translate(this.pos.x, this.pos.y);
		
		scene.getContext().rotate(this.lookAngle);
		
		scene.getContext().beginPath();
		
		scene.getContext().arc(0, 0, this.r, 0, 2 * Math.PI, false);
		
		scene.getContext().fill();
		
		scene.getContext().moveTo(this.r, 0);
		scene.getContext().lineTo(this.r-20, 0);
		
		scene.getContext().stroke();
		
		this.afterDraw(scene);
	}
	
	inView(){
		return true;
	}
	
	
	collide(gameObject){
		var childCount = utils.sizeOf(this.childList);
		
		if( childCount > 1 )
			return;
		else if( childCount ){
			gameObject.side = -1;
		}
		
		gameObject.index = this.weapons.length;

		this.weapons.push(gameObject);

		this.game.resList.reload.snd.play();
	
		gameObject.ignoreCollisions = true; 
		
		this.addChild(gameObject);
	}
	
	getCollideTop(){
		return this.pos.y - this.r;
	}
	
	getCollideBottom(){
		return this.pos.y + this.r;
	}
	
	getCollideLeft(){
		return this.pos.x - this.r;
	}
	
	getCollideRight(){
		return this.pos.x + this.r;
	}

	addAmmo(count){
		this.setAmmo(this.ammo + count);

		return this;
	}

	takeAmmo(takeCount){
		let count;
		
		if( this.ammo> takeCount )
			count = takeCount % this.ammo;
		else
			count = this.ammo;

		this.setAmmo(this.ammo - count);

		return count;
	}

	setAmmo(count){
		this.ammo = Math.max(0, count);

		Notif.sendNotif(Notif.ids.nf_ammo, {
			type: 'person',
			count: this.ammo
		});

		return this;
	}
}



module.exports = {Person}



//#region offlineImports
const { utils } = require('@/app/core/utils');

const { Vector2D } = require('@/app/modules/math/vector2D');
const { Notif } = require('@/app/core/notif');
//#endregion offlineImports