namespace jpvCommon.geometry {

	export class Angle implements comparison.Comparable {
		static ZERO = new Angle(0);

		private /*readonly*/ value: number;

		constructor(value: number) {
			while (value < 0) {
				value += 2 * Math.PI;
			}
			value = value % (2 * Math.PI);
			this.value = value;
		}

		add(value: number) {
			return new Angle(this.value + value);
		}

		sub(value: number) {
			return new Angle(this.value - value);
		}

		mul(value: number) {
			return new Angle(this.value * value);
		}

		div(value: number) {
			return new Angle(this.value / value);
		}

		deltaTo(angle: Angle) {
			const delta = angle.value - this.value;
			if (Math.abs(delta) > Math.PI) {
				return delta > 0 ? delta - 2 * Math.PI : delta + 2 * Math.PI;
			} else {
				return delta;
			}
		}

		equals(angle: Angle) {
			return angle != null && angle instanceof Angle && angle.value == this.value;
		}

		valueOf() {
			return this.toNumber();
		}

		toNumber() {
			return this.value;
		}

		toString() {
			return this.value.toString();
		}
	}
}
