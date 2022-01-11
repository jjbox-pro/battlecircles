class GameObject {
	static state = {
		hidden: 0,
		shown: 1
	};

	constructor(data) {
		Object.assign(this, {
			pos: new Vector2D(0, 0),
			state: GameObject.state.hidden,
			width: 10,
			height: 10,
			childList: {},
			listCollisions: [],
			zIndex: 0
		}, data);

		this.init();
	}

	init() { 
		this.initNotifListeners();
	}

	initNotifListeners() {
		this.notifHandler = Notif.getHandler();
	}

	getName(){
		return this.constructor.name;
	}

	beforeProcess(scene) {
		this.checkCollisions();
	}

	process(scene) {
		this.beforeProcess(scene);

		this.afterProcess(scene);
	}

	afterProcess(scene) {
		for (var child in this.childList)
			this.childList[child].process(scene, true);
	}

	beforeDraw(scene) {
		scene.getContext().save();
	}

	draw(scene) { }

	afterDraw(scene) {
		scene.getContext().restore();
	}

	free() {
		this.game.delGameObject(this);
	}

	addChild(gameObject) {
		gameObject.parent = this;

		this.childList[gameObject.getHandle()] = gameObject;
	}

	setHandle(handle) {
		this.handle = handle;
	}

	getHandle(handle) {
		return this.handle;
	}

	inView(scene) {
		return true;
	}

	setListCollisions(list) {
		list = list || [];

		this.listCollisions = this.listCollisions.concat(list);
	}

	checkCollisions() {
		if (this.ignoreCollisions) return;

		for (var collision in this.listCollisions) {
			this.checkCollision(this.listCollisions[collision]);
		}
	}

	checkCollision(gameObject) {
		if (gameObject.ignoreCollisions) return;

		if (this.isNoCollide(gameObject))
			return;

		this.collide(gameObject);
	}

	isNoCollide(gameObject) {
		return this.getCollideRight() < gameObject.getCollideLeft() ||
			this.getCollideLeft() > gameObject.getCollideRight() ||
			this.getCollideBottom() < gameObject.getCollideTop() ||
			this.getCollideTop() > gameObject.getCollideBottom()
	}

	getCollideTop() {
		return this.pos.y - this.height * 0.5;
	}

	getCollideBottom() {
		return this.pos.y + this.height * 0.5;
	}

	getCollideLeft() {
		return this.pos.x - this.width * 0.5;
	}

	getCollideRight() {
		return this.pos.x + this.width * 0.5;
	}

	collide(gameObject) { }
}



class GameObjectMgr {
	constructor(game) {
		this.game = game;

		this.handle = 0;
	}

	create(Class, data) {
		Class = Class || GameObject;
		data = data || {};

		data.game = this.game;

		var gameObject = new Class(data);

		gameObject.setHandle(++this.handle);

		return gameObject;
	}
}



class GoView extends GameObject {
	constructor() {
		super(...arguments);
	}

	init() {
		super.init(...arguments);

		this.canvasMaskTag = document.createElement('canvas');
		this.canvasMaskCtx = this.canvasMaskTag.getContext('2d');

		this.resize();

		this.res = this.game.resList.view;

		this.dGrad = 0;
		this.dGradDir = 0.1;
	}

	initNotifListeners() {
		super.initNotifListeners(...arguments);

		Notif.addListener(Notif.get('nf_onSceneResize'), this.notifHandler, this.resize, this);
	}

	resize() {
		this.canvasMaskTag.width = this.game.scene.width;
		this.canvasMaskTag.height = this.game.scene.height;
	}

	process(scene) {
		this.pos = this.game.person.pos;
		this.lookAngle = this.game.person.lookAngle;
	}

	draw(scene) {
		this.canvasMaskCtx.resetTransform();

		this.canvasMaskCtx.clearRect(0, 0, scene.width, scene.height);

		this.canvasMaskCtx.globalCompositeOperation = 'source-over';

		this.canvasMaskCtx.fillStyle = 'black';

		this.canvasMaskCtx.fillRect(0, 0, scene.width, scene.height);

		this.canvasMaskCtx.translate(this.game.camera.pos.x + this.pos.x, this.game.camera.pos.y + this.pos.y);

		this.canvasMaskCtx.rotate(this.lookAngle);

		if (this.dGrad < 0 || this.dGrad > 10) {
			if (this.dGrad < 0)
				this.dGrad = 0;
			else
				this.dGrad = 10;

			this.dGradDir *= -1;
		}

		this.dGrad += this.dGradDir;

		var gradient = this.canvasMaskCtx.createRadialGradient(1000, 0, 1100 + this.dGrad, 1000, 0, 1000);

		gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		gradient.addColorStop(0.8, 'rgba(0, 0, 0, 1)');

		this.canvasMaskCtx.fillStyle = gradient;

		this.canvasMaskCtx.globalCompositeOperation = 'destination-out';

		this.canvasMaskCtx.beginPath();

		this.canvasMaskCtx.arc(1000, 0, 1100 + this.dGrad, 0, 2 * Math.PI, false);

		this.canvasMaskCtx.fill();

		this.canvasMaskCtx.closePath();


		this.beforeDraw(scene);

		scene.getContext().resetTransform();

		scene.getContext().drawImage(this.canvasMaskTag, 0, 0);

		this.afterDraw(scene);
	}
}



class Background extends GameObject {
	constructor() {
		super(...arguments);
	}

	init() { }

	process() { }

	draw(scene) {
		scene.getCanvas().css('background-position', this.game.camera.pos.x + 'px ' + this.game.camera.pos.y + 'px');
	}
}






module.exports = { GameObject, GameObjectMgr, GoView, Background }



//#region offlineImports
const { Notif } = require('@/app/core/notif');

const { Vector2D } = require('@/app/modules/math/vector2D');
//#endregion offlineImports