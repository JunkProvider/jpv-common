namespace jpvCommon.comparison {
	
	export interface CompareFunction<Type> {
		(a: Type, b: Type): boolean;
	}
}
