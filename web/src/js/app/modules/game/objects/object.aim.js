//#region runtimeImports
const { GameObject } = require('@/app/modules/game/objects/object');
//#endregion runtimeImports



class Aim extends GameObject {
	constructor() {
		super(...arguments);
	}

	init() {
		this.pos.x = 10;
		this.pos.y = 10;
		this.r = 10;
	}

	process(scene) {
		this.pos.x = scene.mouse.x - (-this.game.person.pos.x + scene.center.x);
		this.pos.y = scene.mouse.y - (-this.game.person.pos.y + scene.center.y);
	}

	draw(scene) {
		this.beforeDraw(scene);

		scene.getContext().strokeStyle = 'blue';
		scene.getContext().fillStyle = 'blue';

		scene.getContext().fillRect(this.pos.x, this.pos.y, 1, 1);

		scene.getContext().beginPath();

		scene.getContext().arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI, false);

		scene.getContext().moveTo(this.pos.x + this.r - 4, this.pos.y);
		scene.getContext().lineTo(this.pos.x + this.r + 4, this.pos.y);

		scene.getContext().moveTo(this.pos.x - this.r - 4, this.pos.y);
		scene.getContext().lineTo(this.pos.x - this.r + 4, this.pos.y);

		scene.getContext().moveTo(this.pos.x, this.pos.y + this.r - 4);
		scene.getContext().lineTo(this.pos.x, this.pos.y + this.r + 4);

		scene.getContext().moveTo(this.pos.x, this.pos.y - this.r - 4);
		scene.getContext().lineTo(this.pos.x, this.pos.y - this.r + 4);

		scene.getContext().stroke();

		this.afterDraw(scene);
	}
}



module.exports = { Aim };