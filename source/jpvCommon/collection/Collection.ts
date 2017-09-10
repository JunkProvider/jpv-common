namespace jpvCommon.collection {

	export interface Enumerable<Value> {
		count(): number;
		forEach(callback: (value: Value) => void): void;
	}
}
