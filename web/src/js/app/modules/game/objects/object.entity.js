//#region runtimeImports
const { GameObject } = require('@/app/modules/game/objects/object');
//#endregion runtimeImports



class Entity extends GameObject{
	constructor(){
		super(...arguments);
	}

	init(){
		super.init(...arguments);

		this.lookDir = this.lookDir||new Vector2D(1, 0);
	}
}



class Unit extends Entity{
	constructor(){
		super(...arguments);
	}

	init(){
		super.init(...arguments);

		this.moveDir = this.moveDir||new Vector2D(0, 0);
		this.lookAngle = 0;
		
		this.speed = 5;
		
		this.r = 21;
	}
	
	draw(scene){
		this.beforeDraw(scene);
		
		scene.getContext().lineWidth = 2;
		scene.getContext().fillStyle = 'white';
		scene.getContext().strokeStyle = 'green';
		
		scene.getContext().translate(this.pos.x, this.pos.y);
		
		scene.getContext().rotate(this.lookAngle);
		
		scene.getContext().beginPath();
		
		scene.getContext().arc(0, 0, this.r, 0, 2 * Math.PI, false);
		
		scene.getContext().fill();
		
		scene.getContext().setLineDash([5]);
		
		scene.getContext().moveTo(this.r, 0);
		scene.getContext().lineTo(this.r-15, 0);
		
		scene.getContext().stroke();
		
		this.afterDraw(scene);
	}
	
	inView(scene){
		return  !(this.pos.x + this.r < this.game.camera.x - scene.center.x || 
				this.pos.x - this.r > this.game.camera.x + scene.center.x ||
				this.pos.y + this.r < this.game.camera.y - scene.center.y || 
				this.pos.x - this.r > this.game.camera.y + scene.center.y);
	}
}



class Enemy extends Unit{
	constructor(){
		super(...arguments);
	}

	init(){
		super.init(...arguments);
		
		this.health = 50;
		
		this.dA = 0.05;
		
		this.dirA = 1;
		
		this.speed = 2;
		
		this.angleInterval = utils.random(7);
		
		this.res = this.game.resList.enemy;
	}
	
	process(scene){
		if( this.health < 0 ){
			this.free();
			
			return;
		}
		
		this.beforeProcess(scene);
		
		if( this.angleInterval < 0 ){
			this.angleInterval = utils.random(7);
			
			this.dirA *= -1;
		}
		
		this.angleInterval -= this.dA;
		
		this.lookAngle += this.dA * this.dirA;
		
		this.lookDir.x = Math.cos(this.lookAngle);
		this.lookDir.y = Math.sin(this.lookAngle);
		
		this.pos.addVector(this.lookDir.getMultScalar(this.speed));
		
		if( this.hitAlpha > 0 )
			this.hitAlpha -= 0.1;
		else
			this.hitAlpha = 0;
			
		this.afterProcess(scene);
	}
	
	draw(scene){
		if( !this.res.loaded )
			return;
		
		scene.getContext().translate(this.pos.x, this.pos.y);
		
		scene.getContext().rotate(this.lookAngle);
		
		scene.getContext().drawImage(
			this.res.img, 
			0, 
			0, 
			this.res.sWidth, 
			this.res.sHeight, 
			-this.r, 
			-this.r, 
			this.res.sWidth, 
			this.res.sHeight
		);
		
		if( this.hitAlpha > 0 ){
			scene.getContext().globalAlpha = this.hitAlpha;
			
			scene.getContext().drawImage(
				this.res.img, 
				this.res.sWidth, 
				0, 
				this.res.sWidth, 
				this.res.sHeight, 
				-this.r, 
				-this.r, 
				this.res.sWidth, 
				this.res.sHeight
			);
		
			scene.getContext().globalAlpha = 1;
		}
		
		scene.getContext().rotate(-this.lookAngle);
		
		scene.getContext().translate(-this.pos.x, -this.pos.y);
	}
	
	collide(gameObject){
		this.hitAlpha = 1;
		
		this.health -= gameObject.getPower();
	}
}



module.exports = {Entity, Unit, Enemy}



//#region offlineImports
const { utils } = require('@/app/core/utils');

const { Vector2D } = require('@/app/modules/math/vector2D');
//#endregion offlineImports