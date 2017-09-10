/// <reference path="../../geometry/Angle.ts" />
/// <reference path="../../geometry/Vector.ts" />
/// <reference path="../../geometry/Orbit2.ts" />

namespace jpvCommon.test.orbit {
	import Angle = geometry.Angle;
	import Vector = geometry.Vector;
	import Orbit = geometry.Orbit2;
	import Assert = assertion.Assert;
	
	export class OrbitTest {
		static G = 6.67408e-11;
		static AU = 149.6e12;
		static MINUTE = 60;
		static HOUR = 60 * OrbitTest.MINUTE;
		static DAY = 24 * OrbitTest.HOUR;
		
		static SUN_MASS = 1.9884e30;
		static SUN_STANDARD_GRAVITY = 1.32712440041e10;
		
		static EARTH_SEMI_MAJOR_AXIS = OrbitTest.AU;
		static EARTH_MAJOR_AXIS = 2 * OrbitTest.AU;
		static EARTH_APOAPSIS = 1.017 * OrbitTest.AU;
		static EARTH_PERIAPSIS = 0.983 * OrbitTest.AU;
		static EARTH_ECCENTRICITY = 0.0167;
		static EARTH_PERIOD = 365.256 * OrbitTest.DAY;
		static EARTH_MIN_VELOCITY = 29.29e3;
		static EARTH_MAX_VELOCITY = 30.3e3;
		
		testEarthOrbit() {
			const orbit = new Orbit(OrbitTest.EARTH_SEMI_MAJOR_AXIS, OrbitTest.EARTH_ECCENTRICITY, Angle.ZERO);
			
			Assert.equals(orbit.semiMajorAxis, OrbitTest.EARTH_SEMI_MAJOR_AXIS);
			Assert.equals(orbit.majorAxis, OrbitTest.EARTH_MAJOR_AXIS);
			// Assert.equals(orbit.semiMinorAxis, OrbitTest.EARTHS);
			// Assert.equals(orbit.majorAxis, OrbitTest.EARTH_MAJOR_AXIS);
			
			const apoapsis = orbit.apoapsis.length();
			Assert.equals(apoapsis, OrbitTest.EARTH_APOAPSIS);
			
			const periapsis = orbit.periapsis.length();
			Assert.equals(periapsis, OrbitTest.EARTH_PERIAPSIS);
		} 
	}
}