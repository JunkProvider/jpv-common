/// <reference path="../assertion/Assert.ts" />

namespace jpvCommon.geometry {
	import Assert = assertion.Assert;
	
	export class Size implements comparison.Comparable {
		static min(sizeA: Size, sizeB: Size) {
			return new Size(Math.min(sizeA._width, sizeB._width), Math.min(sizeA._height, sizeB._height));	
		}
		
		static max(sizeA: Size, sizeB: Size) {
			return new Size(Math.max(sizeA._width, sizeB._width), Math.max(sizeA._height, sizeB._height));	
		}
		
		static ZERO = new Size(0, 0);
		static INFINITE = new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		
		private _width: number;
		private _height: number;
		
		get width() { return this._width; }
		get height() { return this._height; }
		
		constructor(width: number, height: number) {
			Assert.isNumber(width);
			Assert.isNumber(height);
			Assert.isPositiveOrZero(width);
			Assert.isPositiveOrZero(height);
			this._width = width;
			this._height = height;
		}
		
		isZero() {
			return this._width == 0 || this._height == 0;	
		}
		
		isInfinite() {
			return !this.isZero() && (!isFinite(this._width) || !isFinite(this.height));
		}
		
		isPositive() {
			return this._width >= 0 && this._height >= 0;	
		}
		
		equals(size: Size) {
			return size != null && size instanceof Size && size._width == this._width && size._height == this._height;	
		}
	}
}
