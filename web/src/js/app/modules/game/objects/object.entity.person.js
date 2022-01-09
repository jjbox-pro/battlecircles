//#region runtimeImports
const { Unit } = require('@/app/modules/game/objects/object.entity');
//#endregion runtimeImports



class Person extends Unit{
	constructor(){
		super(...arguments);
	}

	init(){
		this.lookDir = this.lookDir||new Vector2D(1, 0);
		this.moveDir = this.moveDir||new Vector2D(0, 0);
		this.lookAngle = 0;
		
		this.pos.x = 250;
		this.pos.y = 250;
		this.speed = 5;
		
		this.r = 30;
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
		
		if( this.game.appl.keys.KeyW )
			this.moveDir.y = -1;
		else if( this.game.appl.keys.KeyS )
			this.moveDir.y = 1;
			
		if( this.game.appl.keys.KeyD )
			this.moveDir.x = 1;
		else if( this.game.appl.keys.KeyA )
			this.moveDir.x = -1;
		
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
			
			this.ignoreCollisions = true;
		}
		
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
}



module.exports = {Person}



//#region offlineImports
const { utils } = require('@/app/core/utils');

const { Vector2D } = require('@/app/modules/math/vector2D');
//#endregion offlineImports