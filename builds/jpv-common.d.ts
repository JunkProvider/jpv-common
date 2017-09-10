declare namespace jpvCommon.collection {
    interface IndexedObject<Value> {
        [index: string]: Value;
    }
}
declare namespace jpvCommon.geometry {
    class Angle implements comparison.Comparable {
        static ZERO: Angle;
        private value;
        constructor(value: number);
        add(value: number): Angle;
        sub(value: number): Angle;
        mul(value: number): Angle;
        div(value: number): Angle;
        deltaTo(angle: Angle): number;
        equals(angle: Angle): boolean;
        valueOf(): number;
        toNumber(): number;
        toString(): string;
    }
}
declare namespace jpvCommon.geometry {
    class Vector implements comparison.Comparable {
        static ZERO: Vector;
        static fromAngle(angle: Angle, length?: number): Vector;
        x: number;
        y: number;
        constructor(x: number, y?: number);
        isZero(): boolean;
        isFinite(): boolean;
        add(vector: Vector): Vector;
        sub(vector: Vector): Vector;
        mul(vector: Vector): Vector;
        mulScal(value: number): Vector;
        div(vector: Vector): Vector;
        divScal(value: number): Vector;
        dot(vector: Vector): number;
        cross(vector: Vector): number;
        rotate(angle: number): Vector;
        length(): number;
        sqrLength(): number;
        normalize(): Vector;
        equals(vector: Vector): boolean;
        toAngle(): Angle;
        valueOf(): number;
        toString(): string;
    }
}
declare namespace jpvCommon.eventing {
    interface EventHandler<Sender, EventData> {
        (sender: Sender, data: EventData): void;
    }
    class Event<EventData> {
        private listeners;
        private disposed;
        dispose(): void;
        add(context: Object, handler: EventHandler<any, EventData>): void;
        trigger(sender: Object, data: EventData): void;
        remove(context: Object, handler: EventHandler<any, EventData>): boolean;
    }
}
declare namespace jpvCommon.timing {
    class Timeout {
        expiredEvent: eventing.Event<void>;
        duration: number;
        private id;
        constructor(duration: number);
        start(): void;
        stop(): void;
        protected onExpired(): void;
    }
}
declare namespace jpvCommon.collection {
    class List<Value> implements Enumerable<Value> {
        static fromArray<Value>(values: Value[]): void;
        static fromObject<Value>(values: IndexedObject<Value>): List<Value>;
        private values;
        count(): number;
        contains(value: Value): boolean;
        get(index: number): Value;
        add(value: Value): void;
        set(index: number, value: Value): void;
        remove(index: number): boolean;
        clear(): void;
        toArray(): Value[];
        forEach(callback: (value: Value, key: number) => void): void;
    }
}
declare namespace jpvCommon.collection {
    class Map<Value> implements Enumerable<Value> {
        static fromArray<Value>(values: Value[], getKey?: (value: Value) => string | number): Map<Value>;
        static fromObject<Value>(values: IndexedObject<Value>): Map<Value>;
        private values;
        keys: string[];
        count(): number;
        contains(key: string | number): boolean;
        tryGet(key: string | number): Value;
        get(key: string | number): Value;
        add(key: string | number, value: Value): void;
        set(key: string | number, value: Value): void;
        remove(key: string | number): boolean;
        clear(): void;
        clone(): Map<Value>;
        toArray(): Value[];
        toObject(): IndexedObject<Value>;
        forEach(callback: (value: Value, key: string | number) => void): void;
    }
}
declare namespace jpvCommon.comparison {
    interface CompareFunction<Type> {
        (a: Type, b: Type): boolean;
    }
}
declare namespace jpvCommon.collection {
    class Extensions {
        static sum<Value>(enumerable: Enumerable<Value>, callback?: (value: Value) => number): number;
    }
}
declare namespace jpvCommon.assertion {
    class Assert {
        static enabled: boolean;
        static isLessThanOrEqual(val: number, cmpVal: number, userText?: string): void;
        static isGreaterThanOrEqual(val: number, cmpVal: number, userText?: string): void;
        static isLessThan(val: number, cmpVal: number, userText?: string): void;
        static isGreaterThan(val: number, cmpVal: number, userText?: string): void;
        static isNegativeOrZero(val: number, userText?: string): void;
        static isPositiveOrZero(val: number, userText?: string): void;
        static isNegative(val: number, userText?: string): void;
        static isPositive(val: number, userText?: string): void;
        static isFinite(val: number, userText?: string): void;
        static isNumber(val: any, userText?: string): void;
        static comparableEquals(val: comparison.Comparable, cmpVal: any, userText?: string): void;
        static equals(val: any, cmpVal: any, userText?: string): void;
        static isNotNull(val: any, userText?: string): void;
        static isNull(val: any, userText?: string): void;
        static isTrue(val: any, userText?: string): void;
        static isFalse(val: any, userText?: string): void;
        private static failed(userText, text, ...replacements);
    }
}
declare namespace jpvCommon.comparison {
    function compareByOperatorStrict(a: any, b: any): boolean;
}
declare namespace jpvCommon.geometry {
    interface Orbit {
        majorAxis: number;
        eccentricity: number;
    }
    /**
     * energy = velocity² / 2 - gravityFactor / distance
     * energy = - gravityFactor / 2 * semiMajorAxis
     *
     * http://jgiesen.de/kepler/kepler.html
     */
    class CommonOrbit implements Orbit {
        /**
         * https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
         */
        static create(position: Vector, velocity: Vector, gravity: number): CommonOrbit;
        static calculateEccentricityVector(p: Vector, v: Vector, g: number): Vector;
        /**
         * Half the distance from the apoapsis to the periapsis.
         */
        semiMajorAxis: number;
        /**
         * Number from 0 to 1 (excluding 0 and 1 because then its a circular orbit or a line, not a common orbit).
         */
        eccentricity: number;
        /**
         * Angle between vernal equinox (Vector(0, 1)) and ascending node.
         */
        periapsisArgument: Angle;
        majorAxis: number;
        semiMinorAxis: number;
        minorAxis: number;
        fociDistance: number;
        secondFocus: Vector;
        apoapsis: Vector;
        periapsis: Vector;
        constructor(semiMajorAxis: number, eccentricity: number, periapsisArgument: Angle);
        eccentricAnomalyToPositionVector(anomaly: Angle): Vector;
        positionVectorToEccentricAnomaly(position: Vector): Angle;
        eccentricAnomalyToVelocityFactor(anomaly: Angle): number;
        velocityAtAnom(anomaly: Angle, gravity: number): number;
        private calculateSecondFocus();
    }
}
declare namespace jpvCommon.comparison {
    function compareByOperator(a: any, b: any): boolean;
}
declare namespace jpvCommon.geometry {
    class Size implements comparison.Comparable {
        static min(sizeA: Size, sizeB: Size): Size;
        static max(sizeA: Size, sizeB: Size): Size;
        static ZERO: Size;
        static INFINITE: Size;
        private _width;
        private _height;
        width: number;
        height: number;
        constructor(width: number, height: number);
        isZero(): boolean;
        isInfinite(): boolean;
        isPositive(): boolean;
        equals(size: Size): boolean;
    }
}
declare namespace jpvCommon.geometry {
    class Rectangle implements comparison.Comparable {
        static fromXYWidthAndHeight(x: number, y: number, width: number, height: number): Rectangle;
        static fromPointAndSize(point: Vector, size: Size): Rectangle;
        private _x;
        private _y;
        private _width;
        private _height;
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        position: Vector;
        size: Size;
        constructor(x: number, y: number, width: number, height: number);
        equals(rect: Rectangle): boolean;
    }
}
declare namespace jpvCommon.geometry {
    class Range implements comparison.Comparable {
        static ZERO_TO_ZERO: Range;
        static ZERO_TO_ONE: Range;
        private _min;
        private _max;
        min: number;
        max: number;
        length: number;
        constructor(min: number, max: number);
        contains(value: number): boolean;
        equals(range: Range): boolean;
    }
}
declare namespace jpvCommon.collection {
    class ValueWithIndex<Value> {
        value: Value;
        index: number;
        constructor(value: Value, index: number);
    }
    class ListManipulationInfo<Value> {
        items: ValueWithIndex<Value>[];
        constructor(items: ValueWithIndex<Value>[]);
    }
    class ObservableList<Value> implements Enumerable<Value> {
        static fromArray<Value>(values: Value[]): void;
        static fromObject<Value>(values: IndexedObject<Value>): List<Value>;
        addedEvent: eventing.Event<ListManipulationInfo<Value>>;
        removedEvent: eventing.Event<ListManipulationInfo<Value>>;
        private values;
        count(): number;
        contains(value: Value): boolean;
        get(index: number): Value;
        add(value: Value): void;
        set(index: number, value: Value): void;
        remove(index: number): boolean;
        clear(): void;
        toArray(): Value[];
        forEach(callback: (value: Value, key: number) => void): void;
    }
}
declare namespace jpvCommon.timing {
    class Interval {
        tickEvent: eventing.Event<void>;
        duration: number;
        private id;
        constructor(duration: number);
        start(): void;
        stop(): void;
        protected onTick(): void;
    }
}
declare namespace jpvCommon.comparison {
    interface Comparable {
        equals(b: Object): boolean;
    }
}
declare namespace jpvCommon.geometry {
    class Orbit2 {
        semiMajorAxis: number;
        eccentricity: number;
        argumentOfPeriapsis: Angle;
        majorAxis: number;
        semiMinorAxis: number;
        minorAxis: number;
        apoapsis: Vector;
        periapsis: Vector;
        constructor(semiMajorAxis: number, eccentricity: number, argumentOfPeriapsis: Angle);
    }
}
declare namespace jpvCommon.test.orbit {
    class OrbitTest {
        static G: number;
        static AU: number;
        static MINUTE: number;
        static HOUR: number;
        static DAY: number;
        static SUN_MASS: number;
        static SUN_STANDARD_GRAVITY: number;
        static EARTH_SEMI_MAJOR_AXIS: number;
        static EARTH_MAJOR_AXIS: number;
        static EARTH_APOAPSIS: number;
        static EARTH_PERIAPSIS: number;
        static EARTH_ECCENTRICITY: number;
        static EARTH_PERIOD: number;
        static EARTH_MIN_VELOCITY: number;
        static EARTH_MAX_VELOCITY: number;
        testEarthOrbit(): void;
    }
}
declare namespace jpvCommon.comparison {
    function compareByEqualsMethod<Type extends Comparable>(a: Type, b: Type): boolean;
}
declare namespace jpvCommon.collection {
    interface Enumerable<Value> {
        count(): number;
        forEach(callback: (value: Value) => void): void;
    }
}
