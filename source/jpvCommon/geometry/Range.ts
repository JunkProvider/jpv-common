namespace jpvCommon.geometry {
	
	export class Range implements comparison.Comparable {
		static ZERO_TO_ZERO = new Range(0, 0);
		static ZERO_TO_ONE = new Range(0, 1);
		
		private _min: number;
		private _max: number;
		
		get min() { return this._min; }
		get max() { return this._max; }
		get length() { return this._max - this._min; }
		
		constructor(min: number, max: number) {
			this._min = min;
			this._max = max;
		}
		
		contains(value: number) {
			return value <= this._max && value >= this._min;	
		}
		
		equals(range: Range) {
			return range != null && range instanceof Range && range._min == this._min	&& range._max == this._max;
		}
	}
}
