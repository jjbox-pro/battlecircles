// Математический двухмерный вектор
class Vector2D {
	constructor(x, y) {
		if (typeof (x) === 'object') {
			this.x = x.x;
			this.y = x.y;
		}
		else {
			this.x = x;
			this.y = y;
		}
	}

	clone() {
		return new Vector2D(this.x, this.y);
	}

	getLength() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	getPerp() {
		return new Vector2D(this.y, -this.x);
	}

	getNormalized() {
		return this.clone().doNormalize();
	}

	doNormalize() {
		var length = this.getLength();

		if (length) {
			this.x /= length;
			this.y /= length;
		}

		return this;
	}

	doMultScalar(scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	getMultScalar(scalar) {
		return this.clone().doMultScalar(scalar);
	}

	toInt() {
		this.x = utils.toInt(this.x);
		this.y = utils.toInt(this.y);

		return this;
	}


	mult(vector) {
		this.x *= vector.x;
		this.y *= vector.y;

		return this;
	}

	addVector(vector) {
		this.x += vector.x;
		this.y += vector.y;

		return this;
	}

	diffVector(vector) {
		this.x -= vector.x;
		this.y -= vector.y;

		return this;
	}

	getAddVector(vector) {
		return this.clone().addVector(vector);
	}

	getDiffVector(vector) {
		return this.clone().diffVector(vector);
	}

	// Переместить по направлению вектора
	moveInDir(dist) {
		return this.doNormalize().doMultScalar(dist);
	}

	// Переместить вдоль прямой по заданному направлению
	moveAlongLineInDir(from, dist) {
		return this.getDiffVector(from).moveInDir(dist).addVector(this);
	}
}



module.exports = { Vector2D }



//#region offlineImports
const { utils } = require('@/app/core/utils');
//#endregion offlineImports