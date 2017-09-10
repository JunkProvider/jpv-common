/// <reference path="Angle.ts" />

namespace jpvCommon.geometry {

	export class Vector implements comparison.Comparable {
		static ZERO = new Vector(0, 0);

		static fromAngle(angle: Angle, length = 1) {
			return new Vector(Math.cos(angle.valueOf()), Math.sin(angle.valueOf())).mul(new Vector(length));
		}

		/*readonly*/ x: number;
		/*readonly*/ y: number;

		constructor(x: number, y: number = null) {
			this.x = x;
			this.y = y != null ? y : x;
		}

		isZero() {
			return this.x == 0 && this.y == 0;
		}

		isFinite() {
			return isFinite(this.x) && isFinite(this.y);
		}

		add(vector: Vector) {
			return new Vector(this.x + vector.x, this.y + vector.y);
		}

		sub(vector: Vector) {
			return new Vector(this.x - vector.x, this.y - vector.y);
		}

		mul(vector: Vector) {
			return new Vector(this.x * vector.x, this.y * vector.y);
		}
		
		mulScal(value: number) {
			return new Vector(this.x * value, this.y * value);
		}

		div(vector: Vector) {
			return new Vector(this.x / vector.x, this.y / vector.y);
		}
		
		divScal(value: number) {
			return new Vector(this.x / value, this.y / value);
		}
		
		dot(vector: Vector) {
			return this.x * vector.x + this.y * vector.y;
		}
		
		cross(vector: Vector) {
			return this.x * vector.y - this.y * vector.x;
		}
		
		rotate(angle: number) {
			const cs = Math.cos(angle);
			const sn = Math.sin(angle);
			return new Vector(this.x * cs - this.y * sn, this.x * sn + this.y * cs);	
		}

		length() {
			return Math.sqrt(this.sqrLength());
		}

		sqrLength() {
			return this.x * this.x + this.y * this.y;
		}

		normalize() {
			const length = this.length();
			return new Vector(this.x / length, this.y / length);
		}

		equals(vector: Vector) {
			return vector != null && vector instanceof Vector && vector.x == this.x && vector.y == this.y;
		}

		toAngle() {
			return new Angle(Math.atan2(this.y, this.x));
		}

		valueOf() {
			return this.length();
		}

		toString() {
			return this.x + "|" + this.y;
		}
	}
}
