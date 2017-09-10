/// <reference path="Angle.ts" />
/// <reference path="Vector.ts" />

namespace jpvCommon.geometry {

	export interface Orbit {
		majorAxis: number;
		eccentricity: number;
	}
	
	/**
	 * energy = velocity² / 2 - gravityFactor / distance
	 * energy = - gravityFactor / 2 * semiMajorAxis
	 * 
	 * http://jgiesen.de/kepler/kepler.html
	 */
	export class CommonOrbit implements Orbit {
		
		/**
		 * https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
		 */
		static create(position: Vector, velocity: Vector, gravity: number) {
			const energy = velocity.sqrLength() / 2 - gravity / position.length();
			const semiMajorAxis = gravity / -energy / 2;
						
			const eccentricityVector = this.calculateEccentricityVector(position, velocity, gravity)
			const eccentricity = eccentricityVector.length();

			const anomaly = Math.acos(eccentricityVector.dot(position) / (eccentricity * position.length()));
			
			const periapsisArgument = new Angle(position.toAngle().toNumber() -	 anomaly);
		
			return new CommonOrbit(semiMajorAxis, eccentricity, periapsisArgument);
		}
		
		static calculateEccentricityVector(p: Vector, v: Vector, g: number) {
			// (r * (mag(v)^2 - mu / mag(r)) - v * dot(r,v)) / mu
			const e = p.mulScal(v.sqrLength() - g / p.length())
				.sub(v.mulScal(p.dot(v)))
				.divScal(g);
			return e;
		}
		
		/**
		 * Half the distance from the apoapsis to the periapsis.
		 */
		/*readonly*/ semiMajorAxis: number;
		
		/**
		 * Number from 0 to 1 (excluding 0 and 1 because then its a circular orbit or a line, not a common orbit).
		 */
		/*readonly*/ eccentricity: number;

		/**
		 * Angle between vernal equinox (Vector(0, 1)) and ascending node.
		 */
		/*readonly*/ periapsisArgument: Angle;

		get majorAxis() { return 2 * this.semiMajorAxis; }
		get semiMinorAxis() { return this.semiMajorAxis * Math.sqrt(1 - Math.pow(this.eccentricity, 2)); }
		get minorAxis() { return 2 * this.semiMinorAxis; }
		get fociDistance() { return this.majorAxis * this.eccentricity; }
		get secondFocus() { return this.calculateSecondFocus(); }
		get apoapsis() { return this.eccentricAnomalyToPositionVector(new Angle(Math.PI)); }
		get periapsis() { return this.eccentricAnomalyToPositionVector(new Angle(0)); }
		// get speedAtPeriapsis() { return this. }
		
		constructor(semiMajorAxis: number, eccentricity: number, periapsisArgument: Angle) {
			this.semiMajorAxis = semiMajorAxis;
			this.eccentricity = eccentricity;
			this.periapsisArgument = periapsisArgument;	
		}
		
		/*eccentricAnomalyToTrueAnomaly(anomaly: Angle) {
			return new Angle((Math.cos(anomaly.toNumber()) - this.eccentricity) / (1 - this.eccentricity * Math.cos(anomaly.toNumber())));
		}*/
		
		eccentricAnomalyToPositionVector(anomaly: Angle) {		
			return new Vector(
				this.semiMajorAxis * (Math.cos(anomaly.toNumber()) - this.eccentricity),
				this.semiMajorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity) * Math.sin(anomaly.toNumber())
			).rotate(this.periapsisArgument.toNumber());
		}
		
		positionVectorToEccentricAnomaly(position: Vector) {		
			const center = new Vector(-this.fociDistance / 2, 0);
			position = position.rotate(-this.periapsisArgument.toNumber());
			position = position.sub(center);
			position = position.div(new Vector(1, 1 - this.eccentricity));
			return position.toAngle().mul(-1);
		}
		
		/*eccentricAnomalyToRadius(anomaly: Angle) {
			return this.trueAnomalyToRadius(this.eccentricAnomalyToTrueAnomaly(anomaly));
		}*/
		
		eccentricAnomalyToVelocityFactor(anomaly: Angle) {
			const position = this.eccentricAnomalyToPositionVector(anomaly);
			const distance = position.length();
			return Math.sqrt(2 / distance - 1 / this.semiMajorAxis);
		}
		
		velocityAtAnom(anomaly: Angle, gravity: number) {
			const position = this.eccentricAnomalyToPositionVector(anomaly);
			const area = Math.PI * this.semiMajorAxis * this.semiMinorAxis;
			const period = 2 * Math.PI * Math.sqrt(Math.pow(this.semiMajorAxis, 3) / gravity);
			const velocity = (2 * area) / (period * position.sqrLength());
			return velocity;
		}
		
		/*trueAnomalyToRadius(anomaly: Angle) {
			return this.semiMajorAxis * ((1 - this.eccentricity * this.eccentricity) / (1 + this.eccentricity * Math.cos(anomaly.toNumber())));
		}*/
		
		private calculateSecondFocus() {
			const direction = Vector.fromAngle(this.periapsisArgument);
			const distance = this.fociDistance;
			return direction.mul(new Vector(-distance));
		}
	}
}
