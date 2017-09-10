namespace jpvCommon.collection {

	export class Extensions {
		static sum<Value>(enumerable: Enumerable<Value>, callback: (value: Value) => number = (value) => Number(value)) {
			let sum = 0;
			enumerable.forEach((value) => {
				sum += callback(value);
			});
			return sum;
		}
	}
}
