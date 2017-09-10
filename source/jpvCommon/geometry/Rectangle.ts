/// <reference path="Vector.ts" />
/// <reference path="Size.ts" />

namespace jpvCommon.geometry {

	export class Rectangle implements comparison.Comparable {
		static fromXYWidthAndHeight(x: number, y: number, width: number, height: number) {
			return new Rectangle(x, y, width, height);
		}

		static fromPointAndSize(point: Vector, size: Size) {
			return new Rectangle(point.x, point.y, size.width, size.height);
		}

		private _x: number;
		private _y: number;
		private _width: number;
		private _height: number;

		get x() { return this._x; }
		get y() { return this._y; }
		get width() { return this._width; }
		get height() { return this._height; }

		get left() { return this._x; }
		get right() { return this._x + this._width; }
		get top() { return this._y; }
		get bottom() { return this._y + this._height; }

		get position() { return new Vector(this._x, this._y); }
		get size() { return new Size(this._width, this._height); }

		constructor(x: number, y: number, width: number, height: number) {
			this._x = x;
			this._y = y;
			this._width = width;
			this._height = height;
		}

		equals(rect: Rectangle) {
			return rect != null && rect instanceof Rectangle && rect._x == this._x && rect._y == this._y && rect._width == this._width && rect._height == this._height;
		}
	}
}
