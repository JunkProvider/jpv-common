namespace jpvCommon.collection {

	export class ValueWithIndex<Value> {
		constructor(
			public value: Value,
			public index: number
		) {}
	}
	
	export class ListManipulationInfo<Value> {
		constructor(
			public items: ValueWithIndex<Value>[]
		) {}	
	}
	
	export class ObservableList<Value> implements Enumerable<Value> {
		static fromArray<Value>(values: Value[]) {
			const list = new ObservableList();
			list.values = values.slice();
		}
		
		static fromObject<Value>(values: IndexedObject<Value>) {
			const list = new List<Value>();
			for (const key in values) {
				list.add(values[key]);
			}
			return list;
		}
		
		addedEvent = new eventing.Event<ListManipulationInfo<Value>>();
		removedEvent = new eventing.Event<ListManipulationInfo<Value>>();
		
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
			const index = this.values.push(value) - 1;
			this.addedEvent.trigger(this, new ListManipulationInfo([ new ValueWithIndex(value, index) ]));
		}
		
		set(index: number, value: Value) {
			if (index < 0 || index >= this.values.length) {
				throw new Error("Can not get value. Undefined index " + index + ".");	
			}
			
			const prevValue = this.values[index];

			this.values[index] = value;
			
			this.removedEvent.trigger(this, new ListManipulationInfo([ new ValueWithIndex(this.values[index], index) ]));
			this.addedEvent.trigger(this, new ListManipulationInfo([ new ValueWithIndex(value, index) ]));
		}
		
		remove(index: number) {
			if (index >= 0 && index < this.values.length) {
				const value = this.values.splice(index, 1)[0];
				this.removedEvent.trigger(this, new ListManipulationInfo([ new ValueWithIndex(value, index) ]));
				return true;
			}
			return false;	
		}
		
		clear() {
			const items: ValueWithIndex<Value>[] = [];
			for (let i = 0; i < this.values.length; i++) {
				items.push(new ValueWithIndex(this.values[i], i));
			}
			
			this.values.length = 0;
			
			this.removedEvent.trigger(this, new ListManipulationInfo(items));
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
