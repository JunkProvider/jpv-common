namespace jpvCommon.assertion {
	
	export class Assert {
		static enabled: boolean = true;
		
		static isLessThanOrEqual(val: number, cmpVal: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val > cmpVal)) {
				this.failed(userText, "Failed asserting that [0] is less than or equal [1].", cmpVal);
			}
		}
		
		static isGreaterThanOrEqual(val: number, cmpVal: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val < cmpVal)) {
				this.failed(userText, "Failed asserting that [0] is greater than or equal [1].", cmpVal);
			}
		}
		
		static isLessThan(val: number, cmpVal: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val >= cmpVal)) {
				this.failed(userText, "Failed asserting that [0] is less than [1].", cmpVal);
			}
		}
		
		static isGreaterThan(val: number, cmpVal: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val <= cmpVal)) {
				this.failed(userText, "Failed asserting that [0] is greater than [1].", cmpVal);
			}
		}
		
		static isNegativeOrZero(val: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || val > 0)) {
				this.failed(userText, "Failed asserting that [0] is negative or zero.", val);
			}
		}
		
		static isPositiveOrZero(val: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || val < 0)) {
				this.failed(userText, "Failed asserting that [0] is positive or zero.", val);
			}
		}
		
		static isNegative(val: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || val >= 0)) {
				this.failed(userText, "Failed asserting that [0] is negative.", val);
			}
		}
		
		static isPositive(val: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || val <= 0)) {
				this.failed(userText, "Failed asserting that [0] is positive.", val);
			}
		}
		
		static isFinite(val: number, userText?: string) {
			if (Assert.enabled && (val == null || isNaN(val) || !isFinite(val))) {
				this.failed(userText, "Failed asserting that [0] is finite.", val);
			}
		}
		
		static isNumber(val: any, userText?: string) {
			if (Assert.enabled && (typeof val != "number" || isNaN(val))) {
				this.failed(userText, "Failed asserting that [0] is a number.", val);
			}
		}
		
		static comparableEquals(val: comparison.Comparable, cmpVal: any, userText?: string) {
			if (Assert.enabled && (val != null ? !val.equals(cmpVal) : cmpVal != null)) {
				this.failed(userText, "Failed asserting that [0] is equals [1].", val, cmpVal);
			}
		}
		
		static equals(val: any, cmpVal: any, userText?: string) {
			if (Assert.enabled && val != cmpVal) {
				this.failed(userText, "Failed asserting that [0] is equals [1].", val, cmpVal);
			}
		}
		
		static isNotNull(val: any, userText?: string) {
			if (Assert.enabled && val == null) {
				this.failed(userText, "Failed asserting that [0] is not null.", val);
			}
		}
		
		static isNull(val: any, userText?: string) {
			if (Assert.enabled && val != null) {
				this.failed(userText, "Failed asserting that [0] is null.", val);
			}
		}
		
		static isTrue(val: any, userText?: string) {
			if (Assert.enabled && val != true) {
				this.failed(userText, "Failed asserting that [0] is true.", val);
			}
		}
		
		static isFalse(val: any, userText?: string) {
			if (Assert.enabled && val != false) {
				this.failed(userText, "Failed asserting that [0] is false.", val);
			}
		}
		
		private static failed(userText: string, text: string, ...replacements: any[]) {
			console.log(replacements);
			if (userText) {
				throw new Error(userText);
			} else {
				for (let i = 0; i < replacements.length; i++) {
					text = text.replace("[" + i + "]", String(replacements[i]));
				}
				throw new Error(text);
			}
		}
	}
}
