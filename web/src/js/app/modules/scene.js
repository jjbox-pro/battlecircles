class Scene {
    constructor(width, height) {
        this.width = width || globalThis.innerWidth;
        this.height = height || globalThis.innerHeight;
    }

    init() {
        this.$canvas = $('<canvas>');

        this.$canvas.addClass('canvas');

        this.canvasTag = this.$canvas.get(0);
        this.canvasCtx = this.canvasTag.getContext('2d');

        this.mouse = { x: 0, y: 0 };

        this.resize();

        return this;
    }

    resize() {
        this.canvasTag.width = this.width;
        this.canvasTag.height = this.height;

        this.center = new Vector2D(this.width * 0.5, this.height * 0.5);
    }

    clean(canvasCtx) {
        canvasCtx = canvasCtx || this.canvasCtx;

        canvasCtx.clearRect(0, 0, this.width, this.height);
    }

    getContext() {
        return this.canvasCtx;
    }

    getCanvas(){
        return this.$canvas;
    }
}



module.exports = { Scene }



//#region offlineImports
const { Vector2D } = require('@/app/modules/math/vector2D');
//#endregion offlineImports

