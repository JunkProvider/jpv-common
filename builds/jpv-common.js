var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        var Angle = (function () {
            function Angle(value) {
                while (value < 0) {
                    value += 2 * Math.PI;
                }
                value = value % (2 * Math.PI);
                this.value = value;
            }
            Angle.prototype.add = function (value) {
                return new Angle(this.value + value);
            };
            Angle.prototype.sub = function (value) {
                return new Angle(this.value - value);
            };
            Angle.prototype.mul = function (value) {
                return new Angle(this.value * value);
            };
            Angle.prototype.div = function (value) {
                return new Angle(this.value / value);
            };
            Angle.prototype.deltaTo = function (angle) {
                var delta = angle.value - this.value;
                if (Math.abs(delta) > Math.PI) {
                    return delta > 0 ? delta - 2 * Math.PI : delta + 2 * Math.PI;
                }
                else {
                    return delta;
                }
            };
            Angle.prototype.equals = function (angle) {
                return angle != null && angle instanceof Angle && angle.value == this.value;
            };
            Angle.prototype.valueOf = function () {
                return this.toNumber();
            };
            Angle.prototype.toNumber = function () {
                return this.value;
            };
            Angle.prototype.toString = function () {
                return this.value.toString();
            };
            Angle.ZERO = new Angle(0);
            return Angle;
        }());
        geometry.Angle = Angle;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="Angle.ts" />
var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        var Vector = (function () {
            function Vector(x, y) {
                if (y === void 0) { y = null; }
                this.x = x;
                this.y = y != null ? y : x;
            }
            Vector.fromAngle = function (angle, length) {
                if (length === void 0) { length = 1; }
                return new Vector(Math.cos(angle.valueOf()), Math.sin(angle.valueOf())).mul(new Vector(length));
            };
            Vector.prototype.isZero = function () {
                return this.x == 0 && this.y == 0;
            };
            Vector.prototype.isFinite = function () {
                return isFinite(this.x) && isFinite(this.y);
            };
            Vector.prototype.add = function (vector) {
                return new Vector(this.x + vector.x, this.y + vector.y);
            };
            Vector.prototype.sub = function (vector) {
                return new Vector(this.x - vector.x, this.y - vector.y);
            };
            Vector.prototype.mul = function (vector) {
                return new Vector(this.x * vector.x, this.y * vector.y);
            };
            Vector.prototype.mulScal = function (value) {
                return new Vector(this.x * value, this.y * value);
            };
            Vector.prototype.div = function (vector) {
                return new Vector(this.x / vector.x, this.y / vector.y);
            };
            Vector.prototype.divScal = function (value) {
                return new Vector(this.x / value, this.y / value);
            };
            Vector.prototype.dot = function (vector) {
                return this.x * vector.x + this.y * vector.y;
            };
            Vector.prototype.cross = function (vector) {
                return this.x * vector.y - this.y * vector.x;
            };
            Vector.prototype.rotate = function (angle) {
                var cs = Math.cos(angle);
                var sn = Math.sin(angle);
                return new Vector(this.x * cs - this.y * sn, this.x * sn + this.y * cs);
            };
            Vector.prototype.length = function () {
                return Math.sqrt(this.sqrLength());
            };
            Vector.prototype.sqrLength = function () {
                return this.x * this.x + this.y * this.y;
            };
            Vector.prototype.normalize = function () {
                var length = this.length();
                return new Vector(this.x / length, this.y / length);
            };
            Vector.prototype.equals = function (vector) {
                return vector != null && vector instanceof Vector && vector.x == this.x && vector.y == this.y;
            };
            Vector.prototype.toAngle = function () {
                return new geometry.Angle(Math.atan2(this.y, this.x));
            };
            Vector.prototype.valueOf = function () {
                return this.length();
            };
            Vector.prototype.toString = function () {
                return this.x + "|" + this.y;
            };
            Vector.ZERO = new Vector(0, 0);
            return Vector;
        }());
        geometry.Vector = Vector;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var eventing;
    (function (eventing) {
        var EventListener = (function () {
            function EventListener(context, handler) {
                this.context = context;
                this.handler = handler;
            }
            return EventListener;
        }());
        var Event = (function () {
            function Event() {
                this.listeners = [];
                this.disposed = false;
            }
            Event.prototype.dispose = function () {
                this.listeners.length = 0;
                this.disposed = true;
            };
            Event.prototype.add = function (context, handler) {
                if (this.disposed) {
                    throw new Error("Trying to access a disposed object.");
                }
                this.listeners.push(new EventListener(context, handler));
            };
            Event.prototype.trigger = function (sender, data) {
                if (this.disposed) {
                    throw new Error("Trying to access a disposed object.");
                }
                var listeners = this.listeners;
                for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                    var listener = _a[_i];
                    listener.handler.call(listener.context, sender, data);
                }
            };
            Event.prototype.remove = function (context, handler) {
                var listeners = this.listeners;
                for (var i = 0; i < listeners.length; i++) {
                    if (listeners[i].context == context && listeners[i].handler == handler) {
                        this.listeners.slice(i, 1);
                        return true;
                    }
                }
                return false;
            };
            return Event;
        }());
        eventing.Event = Event;
    })(eventing = jpvCommon.eventing || (jpvCommon.eventing = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="../eventing/Event.ts" />
var jpvCommon;
(function (jpvCommon) {
    var timing;
    (function (timing) {
        var Timeout = (function () {
            function Timeout(duration) {
                this.expiredEvent = new jpvCommon.eventing.Event();
                this.id = null;
                this.duration = duration;
            }
            Timeout.prototype.start = function () {
                var _this = this;
                this.stop();
                this.id = window.setTimeout(function () { return _this.onExpired(); }, this.duration);
            };
            Timeout.prototype.stop = function () {
                if (this.id != null) {
                    window.clearTimeout(this.id);
                }
            };
            Timeout.prototype.onExpired = function () {
                this.expiredEvent.trigger(this, null);
            };
            return Timeout;
        }());
        timing.Timeout = Timeout;
    })(timing = jpvCommon.timing || (jpvCommon.timing = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var collection;
    (function (collection) {
        var List = (function () {
            function List() {
                this.values = [];
            }
            List.fromArray = function (values) {
                var list = new List();
                list.values = values.slice();
            };
            List.fromObject = function (values) {
                var list = new List();
                for (var key in values) {
                    list.add(values[key]);
                }
                return list;
            };
            List.prototype.count = function () {
                return this.values.length;
            };
            List.prototype.contains = function (value) {
                return this.values.indexOf(value) != -1;
            };
            List.prototype.get = function (index) {
                if (index < 0 || index >= this.values.length) {
                    throw new Error("Can not get value. Undefined index " + index + ".");
                }
                return this.values[index];
            };
            List.prototype.add = function (value) {
                this.values.push(value);
            };
            List.prototype.set = function (index, value) {
                if (index < 0 || index >= this.values.length) {
                    throw new Error("Can not get value. Undefined index " + index + ".");
                }
                this.values[index] = value;
            };
            List.prototype.remove = function (index) {
                if (index >= 0 && index < this.values.length) {
                    this.values.splice(index, 1);
                    return true;
                }
                return false;
            };
            List.prototype.clear = function () {
                this.values.length = 0;
            };
            List.prototype.toArray = function () {
                return this.values.slice();
            };
            List.prototype.forEach = function (callback) {
                for (var i = 0; i < this.values.length; i++) {
                    callback(this.values[i], i);
                }
            };
            return List;
        }());
        collection.List = List;
    })(collection = jpvCommon.collection || (jpvCommon.collection = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var collection;
    (function (collection) {
        var Map = (function () {
            function Map() {
                this.values = {};
            }
            Map.fromArray = function (values, getKey) {
                if (getKey === void 0) { getKey = function (value) { return String(value); }; }
                var map = new Map();
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var value = values_1[_i];
                    map.add(getKey(value), value);
                }
                return map;
            };
            Map.fromObject = function (values) {
                var map = new Map();
                for (var key in values) {
                    map.add(key, values[key]);
                }
                return map;
            };
            Object.defineProperty(Map.prototype, "keys", {
                get: function () {
                    var keys = [];
                    for (var key in this.values) {
                        keys.push(key);
                    }
                    return keys;
                },
                enumerable: true,
                configurable: true
            });
            Map.prototype.count = function () {
                var count = 0;
                for (var key in this.values) {
                    count++;
                }
                return count;
            };
            Map.prototype.contains = function (key) {
                if (key == null) {
                    throw new Error("Can not check if map contains key. Key can not be null or undefined.");
                }
                return this.values[String(key)] !== undefined;
            };
            Map.prototype.tryGet = function (key) {
                if (this.contains(key)) {
                    return this.values[key];
                }
                return null;
            };
            Map.prototype.get = function (key) {
                if (key == null) {
                    throw new Error("Can not get value. Key can not be null or undefined.");
                }
                if (this.values[String(key)] === undefined) {
                    throw new Error("Can not get value. No value for key '" + key + "'.");
                }
                return this.values[String(key)];
            };
            Map.prototype.add = function (key, value) {
                if (key == null) {
                    throw new Error("Can not add value. Key can not be null or undefined.");
                }
                if (value === undefined) {
                    throw new Error("Can not add value. Value can not be undefined.");
                }
                if (this.values[String(key)] !== undefined) {
                    throw new Error("Can not add value. A value for key '" + key + "' already exists.");
                }
                this.values[String(key)] = value;
            };
            Map.prototype.set = function (key, value) {
                if (key == null) {
                    throw new Error("Can not set value. Key can not be null or undefined.");
                }
                if (value === undefined) {
                    throw new Error("Can not set value. Value can not be undefined.");
                }
                this.values[String(key)] = value;
            };
            Map.prototype.remove = function (key) {
                if (this.values[String(key)] != undefined) {
                    delete this.values[String(key)];
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this.values = {};
            };
            Map.prototype.clone = function () {
                return Map.fromObject(this.values);
            };
            Map.prototype.toArray = function () {
                var values = [];
                for (var key in this.values) {
                    values.push(this.values[key]);
                }
                return values;
            };
            Map.prototype.toObject = function () {
                var values = {};
                for (var key in this.values) {
                    values[key] = this.values[key];
                }
                return values;
            };
            Map.prototype.forEach = function (callback) {
                for (var key in this.values) {
                    callback(this.values[key], key);
                }
            };
            return Map;
        }());
        collection.Map = Map;
    })(collection = jpvCommon.collection || (jpvCommon.collection = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var collection;
    (function (collection) {
        var Extensions = (function () {
            function Extensions() {
            }
            Extensions.sum = function (enumerable, callback) {
                if (callback === void 0) { callback = function (value) { return Number(value); }; }
                var sum = 0;
                enumerable.forEach(function (value) {
                    sum += callback(value);
                });
                return sum;
            };
            return Extensions;
        }());
        collection.Extensions = Extensions;
    })(collection = jpvCommon.collection || (jpvCommon.collection = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var assertion;
    (function (assertion) {
        var Assert = (function () {
            function Assert() {
            }
            Assert.isLessThanOrEqual = function (val, cmpVal, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val > cmpVal)) {
                    this.failed(userText, "Failed asserting that [0] is less than or equal [1].", cmpVal);
                }
            };
            Assert.isGreaterThanOrEqual = function (val, cmpVal, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val < cmpVal)) {
                    this.failed(userText, "Failed asserting that [0] is greater than or equal [1].", cmpVal);
                }
            };
            Assert.isLessThan = function (val, cmpVal, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val >= cmpVal)) {
                    this.failed(userText, "Failed asserting that [0] is less than [1].", cmpVal);
                }
            };
            Assert.isGreaterThan = function (val, cmpVal, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || cmpVal == null || isNaN(cmpVal) || val <= cmpVal)) {
                    this.failed(userText, "Failed asserting that [0] is greater than [1].", cmpVal);
                }
            };
            Assert.isNegativeOrZero = function (val, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || val > 0)) {
                    this.failed(userText, "Failed asserting that [0] is negative or zero.", val);
                }
            };
            Assert.isPositiveOrZero = function (val, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || val < 0)) {
                    this.failed(userText, "Failed asserting that [0] is positive or zero.", val);
                }
            };
            Assert.isNegative = function (val, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || val >= 0)) {
                    this.failed(userText, "Failed asserting that [0] is negative.", val);
                }
            };
            Assert.isPositive = function (val, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || val <= 0)) {
                    this.failed(userText, "Failed asserting that [0] is positive.", val);
                }
            };
            Assert.isFinite = function (val, userText) {
                if (Assert.enabled && (val == null || isNaN(val) || !isFinite(val))) {
                    this.failed(userText, "Failed asserting that [0] is finite.", val);
                }
            };
            Assert.isNumber = function (val, userText) {
                if (Assert.enabled && (typeof val != "number" || isNaN(val))) {
                    this.failed(userText, "Failed asserting that [0] is a number.", val);
                }
            };
            Assert.comparableEquals = function (val, cmpVal, userText) {
                if (Assert.enabled && (val != null ? !val.equals(cmpVal) : cmpVal != null)) {
                    this.failed(userText, "Failed asserting that [0] is equals [1].", val, cmpVal);
                }
            };
            Assert.equals = function (val, cmpVal, userText) {
                if (Assert.enabled && val != cmpVal) {
                    this.failed(userText, "Failed asserting that [0] is equals [1].", val, cmpVal);
                }
            };
            Assert.isNotNull = function (val, userText) {
                if (Assert.enabled && val == null) {
                    this.failed(userText, "Failed asserting that [0] is not null.", val);
                }
            };
            Assert.isNull = function (val, userText) {
                if (Assert.enabled && val != null) {
                    this.failed(userText, "Failed asserting that [0] is null.", val);
                }
            };
            Assert.isTrue = function (val, userText) {
                if (Assert.enabled && val != true) {
                    this.failed(userText, "Failed asserting that [0] is true.", val);
                }
            };
            Assert.isFalse = function (val, userText) {
                if (Assert.enabled && val != false) {
                    this.failed(userText, "Failed asserting that [0] is false.", val);
                }
            };
            Assert.failed = function (userText, text) {
                var replacements = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    replacements[_i - 2] = arguments[_i];
                }
                console.log(replacements);
                if (userText) {
                    throw new Error(userText);
                }
                else {
                    for (var i = 0; i < replacements.length; i++) {
                        text = text.replace("[" + i + "]", String(replacements[i]));
                    }
                    throw new Error(text);
                }
            };
            Assert.enabled = true;
            return Assert;
        }());
        assertion.Assert = Assert;
    })(assertion = jpvCommon.assertion || (jpvCommon.assertion = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var comparison;
    (function (comparison) {
        function compareByOperatorStrict(a, b) {
            return a === b;
        }
        comparison.compareByOperatorStrict = compareByOperatorStrict;
    })(comparison = jpvCommon.comparison || (jpvCommon.comparison = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="Angle.ts" />
/// <reference path="Vector.ts" />
var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        /**
         * energy = velocity² / 2 - gravityFactor / distance
         * energy = - gravityFactor / 2 * semiMajorAxis
         *
         * http://jgiesen.de/kepler/kepler.html
         */
        var CommonOrbit = (function () {
            // get speedAtPeriapsis() { return this. }
            function CommonOrbit(semiMajorAxis, eccentricity, periapsisArgument) {
                this.semiMajorAxis = semiMajorAxis;
                this.eccentricity = eccentricity;
                this.periapsisArgument = periapsisArgument;
            }
            /**
             * https://space.stackexchange.com/questions/1904/how-to-programmatically-calculate-orbital-elements-using-position-velocity-vecto
             */
            CommonOrbit.create = function (position, velocity, gravity) {
                var energy = velocity.sqrLength() / 2 - gravity / position.length();
                var semiMajorAxis = gravity / -energy / 2;
                var eccentricityVector = this.calculateEccentricityVector(position, velocity, gravity);
                var eccentricity = eccentricityVector.length();
                var anomaly = Math.acos(eccentricityVector.dot(position) / (eccentricity * position.length()));
                var periapsisArgument = new geometry.Angle(position.toAngle().toNumber() - anomaly);
                return new CommonOrbit(semiMajorAxis, eccentricity, periapsisArgument);
            };
            CommonOrbit.calculateEccentricityVector = function (p, v, g) {
                // (r * (mag(v)^2 - mu / mag(r)) - v * dot(r,v)) / mu
                var e = p.mulScal(v.sqrLength() - g / p.length())
                    .sub(v.mulScal(p.dot(v)))
                    .divScal(g);
                return e;
            };
            Object.defineProperty(CommonOrbit.prototype, "majorAxis", {
                get: function () { return 2 * this.semiMajorAxis; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommonOrbit.prototype, "semiMinorAxis", {
                get: function () { return this.semiMajorAxis * Math.sqrt(1 - Math.pow(this.eccentricity, 2)); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommonOrbit.prototype, "minorAxis", {
                get: function () { return 2 * this.semiMinorAxis; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommonOrbit.prototype, "fociDistance", {
                get: function () { return this.majorAxis * this.eccentricity; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommonOrbit.prototype, "secondFocus", {
                get: function () { return this.calculateSecondFocus(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommonOrbit.prototype, "apoapsis", {
                get: function () { return this.eccentricAnomalyToPositionVector(new geometry.Angle(Math.PI)); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommonOrbit.prototype, "periapsis", {
                get: function () { return this.eccentricAnomalyToPositionVector(new geometry.Angle(0)); },
                enumerable: true,
                configurable: true
            });
            /*eccentricAnomalyToTrueAnomaly(anomaly: Angle) {
                return new Angle((Math.cos(anomaly.toNumber()) - this.eccentricity) / (1 - this.eccentricity * Math.cos(anomaly.toNumber())));
            }*/
            CommonOrbit.prototype.eccentricAnomalyToPositionVector = function (anomaly) {
                return new geometry.Vector(this.semiMajorAxis * (Math.cos(anomaly.toNumber()) - this.eccentricity), this.semiMajorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity) * Math.sin(anomaly.toNumber())).rotate(this.periapsisArgument.toNumber());
            };
            CommonOrbit.prototype.positionVectorToEccentricAnomaly = function (position) {
                var center = new geometry.Vector(-this.fociDistance / 2, 0);
                position = position.rotate(-this.periapsisArgument.toNumber());
                position = position.sub(center);
                position = position.div(new geometry.Vector(1, 1 - this.eccentricity));
                return position.toAngle().mul(-1);
            };
            /*eccentricAnomalyToRadius(anomaly: Angle) {
                return this.trueAnomalyToRadius(this.eccentricAnomalyToTrueAnomaly(anomaly));
            }*/
            CommonOrbit.prototype.eccentricAnomalyToVelocityFactor = function (anomaly) {
                var position = this.eccentricAnomalyToPositionVector(anomaly);
                var distance = position.length();
                return Math.sqrt(2 / distance - 1 / this.semiMajorAxis);
            };
            CommonOrbit.prototype.velocityAtAnom = function (anomaly, gravity) {
                var position = this.eccentricAnomalyToPositionVector(anomaly);
                var area = Math.PI * this.semiMajorAxis * this.semiMinorAxis;
                var period = 2 * Math.PI * Math.sqrt(Math.pow(this.semiMajorAxis, 3) / gravity);
                var velocity = (2 * area) / (period * position.sqrLength());
                return velocity;
            };
            /*trueAnomalyToRadius(anomaly: Angle) {
                return this.semiMajorAxis * ((1 - this.eccentricity * this.eccentricity) / (1 + this.eccentricity * Math.cos(anomaly.toNumber())));
            }*/
            CommonOrbit.prototype.calculateSecondFocus = function () {
                var direction = geometry.Vector.fromAngle(this.periapsisArgument);
                var distance = this.fociDistance;
                return direction.mul(new geometry.Vector(-distance));
            };
            return CommonOrbit;
        }());
        geometry.CommonOrbit = CommonOrbit;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var comparison;
    (function (comparison) {
        function compareByOperator(a, b) {
            return a == b;
        }
        comparison.compareByOperator = compareByOperator;
    })(comparison = jpvCommon.comparison || (jpvCommon.comparison = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="../assertion/Assert.ts" />
var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        var Assert = jpvCommon.assertion.Assert;
        var Size = (function () {
            function Size(width, height) {
                Assert.isNumber(width);
                Assert.isNumber(height);
                Assert.isPositiveOrZero(width);
                Assert.isPositiveOrZero(height);
                this._width = width;
                this._height = height;
            }
            Size.min = function (sizeA, sizeB) {
                return new Size(Math.min(sizeA._width, sizeB._width), Math.min(sizeA._height, sizeB._height));
            };
            Size.max = function (sizeA, sizeB) {
                return new Size(Math.max(sizeA._width, sizeB._width), Math.max(sizeA._height, sizeB._height));
            };
            Object.defineProperty(Size.prototype, "width", {
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "height", {
                get: function () { return this._height; },
                enumerable: true,
                configurable: true
            });
            Size.prototype.isZero = function () {
                return this._width == 0 || this._height == 0;
            };
            Size.prototype.isInfinite = function () {
                return !this.isZero() && (!isFinite(this._width) || !isFinite(this.height));
            };
            Size.prototype.isPositive = function () {
                return this._width >= 0 && this._height >= 0;
            };
            Size.prototype.equals = function (size) {
                return size != null && size instanceof Size && size._width == this._width && size._height == this._height;
            };
            Size.ZERO = new Size(0, 0);
            Size.INFINITE = new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            return Size;
        }());
        geometry.Size = Size;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="Vector.ts" />
/// <reference path="Size.ts" />
var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                this._x = x;
                this._y = y;
                this._width = width;
                this._height = height;
            }
            Rectangle.fromXYWidthAndHeight = function (x, y, width, height) {
                return new Rectangle(x, y, width, height);
            };
            Rectangle.fromPointAndSize = function (point, size) {
                return new Rectangle(point.x, point.y, size.width, size.height);
            };
            Object.defineProperty(Rectangle.prototype, "x", {
                get: function () { return this._x; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "y", {
                get: function () { return this._y; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "width", {
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "height", {
                get: function () { return this._height; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "left", {
                get: function () { return this._x; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "right", {
                get: function () { return this._x + this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "top", {
                get: function () { return this._y; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "bottom", {
                get: function () { return this._y + this._height; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "position", {
                get: function () { return new geometry.Vector(this._x, this._y); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "size", {
                get: function () { return new geometry.Size(this._width, this._height); },
                enumerable: true,
                configurable: true
            });
            Rectangle.prototype.equals = function (rect) {
                return rect != null && rect instanceof Rectangle && rect._x == this._x && rect._y == this._y && rect._width == this._width && rect._height == this._height;
            };
            return Rectangle;
        }());
        geometry.Rectangle = Rectangle;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        var Range = (function () {
            function Range(min, max) {
                this._min = min;
                this._max = max;
            }
            Object.defineProperty(Range.prototype, "min", {
                get: function () { return this._min; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "max", {
                get: function () { return this._max; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "length", {
                get: function () { return this._max - this._min; },
                enumerable: true,
                configurable: true
            });
            Range.prototype.contains = function (value) {
                return value <= this._max && value >= this._min;
            };
            Range.prototype.equals = function (range) {
                return range != null && range instanceof Range && range._min == this._min && range._max == this._max;
            };
            Range.ZERO_TO_ZERO = new Range(0, 0);
            Range.ZERO_TO_ONE = new Range(0, 1);
            return Range;
        }());
        geometry.Range = Range;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var collection;
    (function (collection) {
        var ValueWithIndex = (function () {
            function ValueWithIndex(value, index) {
                this.value = value;
                this.index = index;
            }
            return ValueWithIndex;
        }());
        collection.ValueWithIndex = ValueWithIndex;
        var ListManipulationInfo = (function () {
            function ListManipulationInfo(items) {
                this.items = items;
            }
            return ListManipulationInfo;
        }());
        collection.ListManipulationInfo = ListManipulationInfo;
        var ObservableList = (function () {
            function ObservableList() {
                this.addedEvent = new jpvCommon.eventing.Event();
                this.removedEvent = new jpvCommon.eventing.Event();
                this.values = [];
            }
            ObservableList.fromArray = function (values) {
                var list = new ObservableList();
                list.values = values.slice();
            };
            ObservableList.fromObject = function (values) {
                var list = new collection.List();
                for (var key in values) {
                    list.add(values[key]);
                }
                return list;
            };
            ObservableList.prototype.count = function () {
                return this.values.length;
            };
            ObservableList.prototype.contains = function (value) {
                return this.values.indexOf(value) != -1;
            };
            ObservableList.prototype.get = function (index) {
                if (index < 0 || index >= this.values.length) {
                    throw new Error("Can not get value. Undefined index " + index + ".");
                }
                return this.values[index];
            };
            ObservableList.prototype.add = function (value) {
                var index = this.values.push(value) - 1;
                this.addedEvent.trigger(this, new ListManipulationInfo([new ValueWithIndex(value, index)]));
            };
            ObservableList.prototype.set = function (index, value) {
                if (index < 0 || index >= this.values.length) {
                    throw new Error("Can not get value. Undefined index " + index + ".");
                }
                var prevValue = this.values[index];
                this.values[index] = value;
                this.removedEvent.trigger(this, new ListManipulationInfo([new ValueWithIndex(this.values[index], index)]));
                this.addedEvent.trigger(this, new ListManipulationInfo([new ValueWithIndex(value, index)]));
            };
            ObservableList.prototype.remove = function (index) {
                if (index >= 0 && index < this.values.length) {
                    var value = this.values.splice(index, 1)[0];
                    this.removedEvent.trigger(this, new ListManipulationInfo([new ValueWithIndex(value, index)]));
                    return true;
                }
                return false;
            };
            ObservableList.prototype.clear = function () {
                var items = [];
                for (var i = 0; i < this.values.length; i++) {
                    items.push(new ValueWithIndex(this.values[i], i));
                }
                this.values.length = 0;
                this.removedEvent.trigger(this, new ListManipulationInfo(items));
            };
            ObservableList.prototype.toArray = function () {
                return this.values.slice();
            };
            ObservableList.prototype.forEach = function (callback) {
                for (var i = 0; i < this.values.length; i++) {
                    callback(this.values[i], i);
                }
            };
            return ObservableList;
        }());
        collection.ObservableList = ObservableList;
    })(collection = jpvCommon.collection || (jpvCommon.collection = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="../eventing/Event.ts" />
var jpvCommon;
(function (jpvCommon) {
    var timing;
    (function (timing) {
        var Interval = (function () {
            function Interval(duration) {
                this.tickEvent = new jpvCommon.eventing.Event();
                this.id = null;
                this.duration = duration;
            }
            Interval.prototype.start = function () {
                var _this = this;
                this.stop();
                this.id = window.setInterval(function () { return _this.onTick(); }, this.duration);
            };
            Interval.prototype.stop = function () {
                if (this.id != null) {
                    window.clearInterval(this.id);
                }
            };
            Interval.prototype.onTick = function () {
                this.tickEvent.trigger(this, null);
            };
            return Interval;
        }());
        timing.Interval = Interval;
    })(timing = jpvCommon.timing || (jpvCommon.timing = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="Angle.ts" />
/// <reference path="Vector.ts" />
var jpvCommon;
(function (jpvCommon) {
    var geometry;
    (function (geometry) {
        var Orbit2 = (function () {
            function Orbit2(/*standardGravity: number, */ semiMajorAxis, eccentricity, argumentOfPeriapsis) {
                // this.standardGravity = standardGravity;
                this.semiMajorAxis = semiMajorAxis;
                this.eccentricity = eccentricity;
                this.argumentOfPeriapsis = argumentOfPeriapsis;
                this.majorAxis = semiMajorAxis * 2;
                this.semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));
                this.minorAxis = this.semiMinorAxis * 2;
            }
            return Orbit2;
        }());
        geometry.Orbit2 = Orbit2;
    })(geometry = jpvCommon.geometry || (jpvCommon.geometry = {}));
})(jpvCommon || (jpvCommon = {}));
/// <reference path="../../geometry/Angle.ts" />
/// <reference path="../../geometry/Vector.ts" />
/// <reference path="../../geometry/Orbit2.ts" />
var jpvCommon;
(function (jpvCommon) {
    var test;
    (function (test) {
        var orbit;
        (function (orbit_1) {
            var Angle = jpvCommon.geometry.Angle;
            var Orbit = jpvCommon.geometry.Orbit2;
            var Assert = jpvCommon.assertion.Assert;
            var OrbitTest = (function () {
                function OrbitTest() {
                }
                OrbitTest.prototype.testEarthOrbit = function () {
                    var orbit = new Orbit(OrbitTest.EARTH_SEMI_MAJOR_AXIS, OrbitTest.EARTH_ECCENTRICITY, Angle.ZERO);
                    Assert.equals(orbit.semiMajorAxis, OrbitTest.EARTH_SEMI_MAJOR_AXIS);
                    Assert.equals(orbit.majorAxis, OrbitTest.EARTH_MAJOR_AXIS);
                    // Assert.equals(orbit.semiMinorAxis, OrbitTest.EARTHS);
                    // Assert.equals(orbit.majorAxis, OrbitTest.EARTH_MAJOR_AXIS);
                    var apoapsis = orbit.apoapsis.length();
                    Assert.equals(apoapsis, OrbitTest.EARTH_APOAPSIS);
                    var periapsis = orbit.periapsis.length();
                    Assert.equals(periapsis, OrbitTest.EARTH_PERIAPSIS);
                };
                OrbitTest.G = 6.67408e-11;
                OrbitTest.AU = 149.6e12;
                OrbitTest.MINUTE = 60;
                OrbitTest.HOUR = 60 * OrbitTest.MINUTE;
                OrbitTest.DAY = 24 * OrbitTest.HOUR;
                OrbitTest.SUN_MASS = 1.9884e30;
                OrbitTest.SUN_STANDARD_GRAVITY = 1.32712440041e10;
                OrbitTest.EARTH_SEMI_MAJOR_AXIS = OrbitTest.AU;
                OrbitTest.EARTH_MAJOR_AXIS = 2 * OrbitTest.AU;
                OrbitTest.EARTH_APOAPSIS = 1.017 * OrbitTest.AU;
                OrbitTest.EARTH_PERIAPSIS = 0.983 * OrbitTest.AU;
                OrbitTest.EARTH_ECCENTRICITY = 0.0167;
                OrbitTest.EARTH_PERIOD = 365.256 * OrbitTest.DAY;
                OrbitTest.EARTH_MIN_VELOCITY = 29.29e3;
                OrbitTest.EARTH_MAX_VELOCITY = 30.3e3;
                return OrbitTest;
            }());
            orbit_1.OrbitTest = OrbitTest;
        })(orbit = test.orbit || (test.orbit = {}));
    })(test = jpvCommon.test || (jpvCommon.test = {}));
})(jpvCommon || (jpvCommon = {}));
var jpvCommon;
(function (jpvCommon) {
    var comparison;
    (function (comparison) {
        function compareByEqualsMethod(a, b) {
            return a != null ? a.equals(b) : b == null;
        }
        comparison.compareByEqualsMethod = compareByEqualsMethod;
    })(comparison = jpvCommon.comparison || (jpvCommon.comparison = {}));
})(jpvCommon || (jpvCommon = {}));
