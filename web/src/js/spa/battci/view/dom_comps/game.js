//#region runtimeImports
var { DOMComp } = require('@/app/view/comp/dom_comp');
//#endregion runtimeImports



class DOMComp_Game extends DOMComp {
	constructor() {
		super();
	}

	init(){
		super.init();

		this.initLoop();

		this.scene = (new Scene()).init();
		
		this.game = new Game(this, this.scene);
	}

	calcName() {
		return 'game';
	}

	modifyCont($cont){
		$cont.append(this.scene.getCanvas().addClass('game__canvas'));
	}

	cacheCont($cont){
		this.$game__canvas = $cont.find('game__canvas');
	}

	bindEvents(){
		this.keys = {};

		document.addEventListener('keydown', (event) => {
			this.keys[event.code] = true;
		});
		document.addEventListener('keyup', (event) => {
			this.keys[event.code] = false;
		});

		this.scene.canvasTag.addEventListener('pointermove', (event) => {
			this.scene.mouse.x = event.offsetX;
			this.scene.mouse.y = event.offsetY;
		});


		this.scene.canvasTag.addEventListener('pointerdown', (event) => {
			this.scene.mouse.down = true;
		});
		this.scene.canvasTag.addEventListener('pointerup', (event) => {
			this.scene.mouse.down = false;
		});
	}

	afterShow(firstShow){
		if( !firstShow )
			return;

		this.game.init();

		this.startLoop();

		this.$game__canvas.focus();
	}

	process() {
		this.game.process();
	}

	render() {
		if (this.stopRender)
			return;

		this.game.render();
	}

	initLoop() {
		this.processInterval = 17;
		this.processIntervalRev = 1 / this.processInterval;
	}

	startLoop() {
		this.process();

		this.render();

		this.timeFrame = this.timeOld = timeMgr.getNowLocMS();

		this.frames = 0;

		this.loop();
	}

	loop = (() => {
		let timeNow, timeDelta,	processCount, saveTime;

		return function(){
			timeNow = timeMgr.getNowLocMS();
			timeDelta = timeNow - this.timeOld;
			processCount = (timeDelta * this.processIntervalRev) | 0;
			saveTime = false;

			if (processCount > 5)
				processCount = 5;

			//while( --processCount > 0 ){
				this.process();

				saveTime = true;
			//}

			if (saveTime)
				this.timeOld = timeNow - (timeDelta % this.processInterval);

			this.render();

			if (timeNow - this.timeFrame > timeMgr.StMS) {
				this.timeFrame = timeNow;

				Notif.sendNotif(Notif.ids.nf_fps, this.frames);

				this.frames = 0;
			}
			else
				this.frames++;

			requestAnimationFrame(() => this.loop());
		};
	})()
}



module.exports = { DOMComp_Game };



//#region offlineImports
const { Notif } = require('@/app/core/notif');
const { timeMgr } = require('@/app/core/timeMgr');

const { Scene } = require('@/app/modules/scene');
const { Game } = require('@/app/modules/game/game');
//#endregion offlineImports