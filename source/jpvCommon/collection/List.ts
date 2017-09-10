namespace jpvCommon.collection {

	export class List<Value> implements Enumerable<Value> {
		static fromArray<Value>(values: Value[]) {
			const list = new List();
			list.values = values.slice();
		}
		
		static fromObject<Value>(values: IndexedObject<Value>) {
			const list = new List<Value>();
			for (const key in values) {
				list.add(values[key]);
			}
			return list;
		}
		
		private values: Value[] = [];
		
		count() {
			return this.values.length;	
		}
		
		contains(value: Value) {
			return this.values.indexOf(value) != -1;
		}
		
		get(index: number) {
			if (index < 0 || index >= this.values.length) {
				throw new Error("Can not get value. Undefined index " + index + ".");	
			}
			return this.values[index];
		}
		
		add(value: Value) {
			this.values.push(value);
		}
		
		set(index: number, value: Value) {
			if (index < 0 || index >= this.values.length) {
				throw new Error("Can not get value. Undefined index " + index + ".");	
			}
			this.values[index] = value;
		}
		
		remove(index: number) {
			if (index >= 0 && index < this.values.length) {
				this.values.splice(index, 1);
				return true;
			}
			return false;	
		}
		
		clear() {
			this.values.length = 0;	
		}
		
		toArray() {
			return this.values.slice();	
		}

		forEach(callback: (value: Value, key: number) => void) {
			for (let i = 0; i < this.values.length; i++) {
				callback(this.values[i], i);
			} 	
		}
	}
}
