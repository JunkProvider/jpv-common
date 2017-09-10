namespace jpvCommon.collection {

	export class Map<Value> implements Enumerable<Value> {
		static fromArray<Value>(values: Value[], getKey: (value: Value) => string|number = (value) => String(value)) {
			const map = new Map<Value>();
			for (const value of values) {
				map.add(getKey(value), value);
			}
			return map;
		}

		static fromObject<Value>(values: IndexedObject<Value>) {
			const map = new Map<Value>();
			for (const key in values) {
				map.add(key, values[key]);
			}
			return map;
		}

		private values: IndexedObject<Value> = {};

		get keys() {
			const keys: string[] = [];
			for (const key in this.values) {
				keys.push(key);
			}
			return keys;
		}

		count() {
			let count = 0;
			for (const key in this.values) {
				count++;
			}
			return count;
		}

		contains(key: string|number) {
			if (key == null) {
				throw new Error("Can not check if map contains key. Key can not be null or undefined.");
			}
			return this.values[String(key)] !== undefined;
		}

		tryGet(key: string|number) {
			if (this.contains(key)) {
				return this.values[key];
			}
			return null;
		}

		get(key: string|number) {
			if (key == null) {
				throw new Error("Can not get value. Key can not be null or undefined.");
			}
			if (this.values[String(key)] === undefined) {
				throw new Error("Can not get value. No value for key '" + key + "'.");
			}
			return this.values[String(key)];
		}

		add(key: string|number, value: Value) {
			if (key == null) {
				throw new Error("Can not add value. Key can not be null or undefined.");
			}
			if (value === undefined) {
				throw new Error("Can not add value. Value can not be undefined.");
			}
			if (this.values[String(key)] !== undefined) {
				throw new Error("Can not add value. A value for key '" + key + "' already exists.");
			}
			this.values[String(key)] = value;
		}

		set(key: string|number, value: Value) {
			if (key == null) {
				throw new Error("Can not set value. Key can not be null or undefined.");
			}
			if (value === undefined) {
				throw new Error("Can not set value. Value can not be undefined.");
			}
			this.values[String(key)] = value;
		}

		remove(key: string|number) {
			if (this.values[String(key)] != undefined) {
				delete this.values[String(key)];
				return true;
			}
			return false;
		}

		clear() {
			this.values = {};
		}

		clone() {
			return Map.fromObject(this.values);
		}

		toArray() {
			const values: Value[] = [];
			for (const key in this.values) {
				values.push(this.values[key]);
			}
			return values;
		}

		toObject() {
			const values: IndexedObject<Value> = {};
			for (const key in this.values) {
				values[key] = this.values[key];
			}
			return values;
		}

		forEach(callback: (value: Value, key: string|number) => void) {
			for (const key in this.values) {
				callback(this.values[key], key);
			}
		}
	}
}
