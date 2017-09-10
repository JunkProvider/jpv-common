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
