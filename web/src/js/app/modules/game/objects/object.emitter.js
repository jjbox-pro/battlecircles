Emitter = function(data){
	Emitter.superclass.constructor.apply(this, arguments);
};

utils.inherit(Emitter, GameObject);

Emitter.prototype.init = function(){
	 this.pos.x = 10;
	 this.pos.y = 10;
	 this.r = 10;
};

Emitter.prototype.process = function(scene){
	this.pos.x = scene.mouse.x;
	this.pos.y = scene.mouse.y;
};

Emitter.prototype.draw = function(scene){
	this.beforeDraw(scene);
	
	scene.getContext().strokeStyle = 'blue';
	scene.getContext().fillStyle = 'blue';
	
	scene.getContext().fillRect(this.pos.x, this.pos.y, 1, 1);
	
	scene.getContext().beginPath();
	
	scene.getContext().arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI, false);
	
	scene.getContext().moveTo(this.pos.x+this.r-4, this.pos.y);
	scene.getContext().lineTo(this.pos.x+this.r+4, this.pos.y);
	
	scene.getContext().moveTo(this.pos.x-this.r-4, this.pos.y);
	scene.getContext().lineTo(this.pos.x-this.r+4, this.pos.y);
	
	scene.getContext().moveTo(this.pos.x, this.pos.y+this.r-4);
	scene.getContext().lineTo(this.pos.x, this.pos.y+this.r+4);
	
	scene.getContext().moveTo(this.pos.x, this.pos.y-this.r-4);
	scene.getContext().lineTo(this.pos.x, this.pos.y-this.r+4);
	
	scene.getContext().stroke();
	
	this.afterDraw(scene);
};