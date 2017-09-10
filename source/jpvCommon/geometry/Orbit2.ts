/// <reference path="Angle.ts" />
/// <reference path="Vector.ts" />

namespace jpvCommon.geometry {

	export class Orbit2 {
		// standardGravity: number;
		semiMajorAxis: number;
		eccentricity: number;
		argumentOfPeriapsis: Angle;
		
		majorAxis: number;
		semiMinorAxis: number;
		minorAxis: number;
		apoapsis: Vector;
		periapsis: Vector;
		
		constructor(/*standardGravity: number, */semiMajorAxis: number, eccentricity: number, argumentOfPeriapsis: Angle) {
			// this.standardGravity = standardGravity;
			this.semiMajorAxis = semiMajorAxis;
			this.eccentricity = eccentricity;
			this.argumentOfPeriapsis = argumentOfPeriapsis;	
			
			this.majorAxis = semiMajorAxis * 2;
			this.semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));
			this.minorAxis = this.semiMinorAxis * 2;
		}
	}
}
