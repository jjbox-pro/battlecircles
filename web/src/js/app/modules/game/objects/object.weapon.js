//#region runtimeImports
const { GameObject } = require('@/app/modules/game/objects/object');
//#endregion runtimeImports



class Weapon extends GameObject{
	constructor(){
		super(...arguments);
	}

	init(scene){
		this.width = 103;
		this.height = 48;	
		
		this.parent = false;
		
		this.angle = utils.random(628) * 0.01;
		
		this.side = 1;
		this.parentOffset = new Vector2D(14, 0);
		
		this.lookDir = this.lookDir||new Vector2D(1, 0);
		this.lookAngle = 0;
		
		this.power = 15;

		this.res = this.game.resList.gun;
	}
	
	process(scene, processParent){
		if( this.parent ){
			if( !processParent )
				return;
			
			this.processParent(scene);
		}
		else
			this.processRotation(scene);
	}
	
	processRotation(scene){
		this.angle += 0.1;
	}
	
	processParent(scene){
		var sin = Math.sin(this.parent.lookAngle),
			cos = Math.cos(this.parent.lookAngle);
		
		if( this.parentOffset.x != 14 ){
			if( this.parentOffset.x < 14 )
				this.parentOffset.x += 1;
			else
				this.parentOffset.x = 14;
		}
		
		this.pos.x = this.parent.pos.x + this.parentOffset.x*cos - (this.side*(this.parent.r + this.parentOffset.y))*sin;
		this.pos.y = this.parent.pos.y + (this.side*(this.parent.r + this.parentOffset.y))*cos + this.parentOffset.x*sin;
		
		if( this.game.appl.keys.Digit1 )
			this.lookAsParent = true;
		else if( this.game.appl.keys.Digit2 )
			this.lookAsParent = false;
		
		
		if( this.lookAsParent ){
			this.lookDir = this.parent.lookDir.clone();
			
			this.lookAngle = this.parent.lookAngle;
			
			this.aimDist = 1000;
		}
		else{
			var aimPos = this.game.aim.pos.getDiffVector(this.parent.pos);
			
			if( aimPos.getLength() < this.parent.r + 60 )
				aimPos = this.parent.lookDir.getMultScalar(this.parent.r + 60).addVector(this.parent.pos);
			else
				aimPos = aimPos.addVector(this.parent.pos);
			
			this.lookDir = aimPos.diffVector(this.pos);
			
			this.aimDist = this.lookDir.getLength();
			
			this.lookDir.doNormalize();
			
			this.lookAngle = Math.acos(this.lookDir.x);
	
			if( this.lookDir.y < 0 )
				this.lookAngle *= -1;
		}
		
		if( scene.mouse.down ){
			if( !this.shooting ){
				this.shooting = true;
				
				this.shoot();
			}
		}
		else if ( this.shooting ){
			clearTimeout(this.shootingTimeout);
			
			this.shooting = false;
		}
		
		
	//	if( scene.mouse.down )
	//		this.readyToShoot = true;
	//	else if( this.readyToShoot ){
	//		this.game.addGameObject(Bullet, {
	//			pos: this.lookDir.getMultScalar(this.width*0.5).addVector(this.pos), // Стартовая позиция пули (от начала ружья)
	//			moveDir: this.lookDir.clone(), // Направление полета
	//			range: (aimDist-this.width*0.5)||0
	//		});
	//		
	//		this.readyToShoot = false;
	//	}
	}
	
	draw(scene){
		this.beforeDraw(scene);
		
		scene.getContext().translate(this.pos.x, this.pos.y);
		
		if( this.parent )
			this.drawParent(scene);
		else
			this.drawRotation(scene);
		
		scene.getContext().scale(1, this.side);
		
		scene.getContext().drawImage(
			this.res.img, 
			0, 
			0, 
			this.res.sWidth, 
			this.res.sHeight, 
			-this.width*0.5, 
			-this.height*0.5, 
			this.width, 
			this.height
		);
		
		this.afterDraw(scene);
	}
	
	drawRotation(scene){
		scene.getContext().rotate(this.angle);
	}
	
	drawParent(scene){
		scene.getContext().rotate(this.lookAngle);
	}
	
	shoot(){
		this.parentOffset.x = 2 + utils.random(5);
		
		if( utils.random(11) < 3 )
			this.parent.pos.addVector(this.parent.lookDir.getMultScalar(-2));
		
		this.game.addGameObject(Bullet, {
			pos: this.lookDir.getMultScalar(this.width*0.5).addVector(this.pos), // Стартовая позиция пули (от начала ружья)
			moveDir: this.lookDir.clone(), // Направление полета
			range: (this.aimDist-this.width*0.5)||0,
			listCollisions: this.game.getObjectListByCls(Enemy),
			weaponPower: this.power
		});
		
		this.shootingTimeout = setTimeout(this.shoot.bind(this), 100 + utils.random(200));
	}
	
	getCollideTop(){
		return this.pos.y;
	}
	
	getCollideBottom(){
		return this.pos.y;
	}
	
	getCollideLeft(){
		return this.pos.x;
	}
	
	getCollideRight(){
		return this.pos.x;
	}
}



class Ammo extends GameObject{
	constructor(){
		super(...arguments);
	}
}



class Bullet extends Ammo{
	constructor(){
		super(...arguments);
	}

	init(scene){
		this.speed = 40;
		
		this.power = 10;

		this.rangeDef = 300;
		
		if( this.range && this.range < this.rangeDef ){
			//
		}
		else
			this.range = this.rangeDef + utils.random(50);
		
		this.moveDir = this.moveDir||new Vector2D(1, 0);
		
		this.moveDirSpeed = this.moveDir.getMultScalar(this.speed);
		
		this.tailWidth = 1 + utils.random(6);
		
		var res = this.game.resList.shot,
			snd = res.snd;

		if( !snd.paused ){
			res.queue = res.queue||[];
			
			snd = false;
			
			for(snd in res.queue){
				if( res.queue[snd].paused ){
					snd = res.queue[snd];
					
					break;
				}
			}
			
			if( !(snd instanceof Audio) ){
				snd = new Audio(res.src);
				
				res.queue.push(snd);
			}
		}
		
		snd.play();
	}
	
	process(scene){
		if( this.end ){
			this.free();
			
			return;
		}
		
		this.beforeProcess();
		
		this.pos.addVector(this.moveDirSpeed);
		
		if( this.tailWidth < 30 )
			this.tailWidth += 1 + utils.random(6);
		
		this.range -= this.speed;
		
		if( this.range < 0 ){
			this.pos.addVector(this.moveDirSpeed.doNormalize().doMultScalar(this.range));
			
			this.checkCollisions();
			
			this.end = true;
		}
	}
	
	draw(scene){
		this.beforeDraw(scene);
		
		scene.getContext().beginPath();
		
		var tail = this.moveDir.getMultScalar(-this.tailWidth).addVector(this.pos);
		
		scene.getContext().moveTo(this.pos.x, this.pos.y);
		scene.getContext().lineTo(tail.x, tail.y);
		
		scene.getContext().stroke();
		
		this.afterDraw(scene);
	}
	
	free(){
		this.game.delGameObject(this);
	}
	
	isNoCollide(gameObject){
		return this.pos.getDiffVector(gameObject.pos).getLength() > gameObject.r;
	}
	
	collide(gameObject){
		this.free();
		
		gameObject.collide(this);
	}

	getPower(){
		return this.power + (this.weaponPower||0);
	}
}



module.exports = {Weapon, Ammo, Bullet};



//#region offlineImports
const { utils } = require('@/app/core/utils');

const { Vector2D } = require('@/app/modules/math/vector2D');

const { Enemy } = require('@/app/modules/game/objects/object.entity');
//#endregion offlineImports