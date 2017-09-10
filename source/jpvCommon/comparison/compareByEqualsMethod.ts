namespace jpvCommon.comparison {
	
	export function compareByEqualsMethod<Type extends Comparable>(a: Type, b: Type) {
		return a != null ? a.equals(b) : b == null;
	}
}
