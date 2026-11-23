/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objDefineGet, objDefineAccessors, objDefine, objDefineProps, ObjDefinePropDescriptor, _pushOwnValue } from "../../../../src/object/define";
import { objGetOwnPropertyDescriptor } from "../../../../src/object/get_own_property";
import { objKeys } from "../../../../src/object/object";
import { getLazy, getWritableLazy } from "../../../../src/helpers/lazy";
import { isFunction } from "../../../../src/helpers/base";
import { safe } from "../../../../src/helpers/safe";
import { polyObjFromEntries } from "../../../../src/polyfills/object/objFromEntries";
import { polyArrFrom } from "../../../../src/polyfills/array";

describe("object define tests", () => {
    describe("objDefineGet tests", () => {
        it("should define a property with a value", () => {
            const obj: any = {};
            objDefineGet(obj, "testProp", 42);
            
            assert.equal(obj["testProp"], 42);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isTrue(descriptor?.configurable);
            assert.isTrue(descriptor.enumerable);
            assert.equal(descriptor.value, 42);
            assert.isUndefined(descriptor.get);
            assert.isUndefined(descriptor.set);
        });

        it("should define a getter function", () => {
            const obj: any = {};
            let value = 42;
            objDefineGet(obj, "testProp", () => value);
            
            assert.equal(obj["testProp"], 42);
            value = 100;
            assert.equal(obj["testProp"], 100);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isTrue(descriptor?.configurable);
            assert.isTrue(descriptor.enumerable);
            assert.isFunction(descriptor.get);
            assert.isUndefined(descriptor.set);
        });

        it("should respect configurable and enumerable flags", () => {
            const obj = {};
            objDefineGet(obj, "testProp", 42, false, false);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFalse(descriptor?.configurable);
            assert.isFalse(descriptor.enumerable);
            assert.equal(descriptor.value, 42);
        });

        it("should handle function values correctly", () => {
            const obj: any = {};
            const fn = function() {
                return "Hello darkness my old friend";
            };
            
            // When passing a function as value, it should be treated as a value,
            // not as a getter, because we specifically use the isFunction check
            objDefineGet(obj, "fnAsProp", fn);
            
            assert.isFalse(isFunction(obj["fnAsProp"]));
            assert.equal(obj["fnAsProp"], "Hello darkness my old friend");
            
            // When wrapped in another function, it becomes a getter
            objDefineGet(obj, "fnAsGetter", () => fn);
            
            assert.strictEqual(obj["fnAsGetter"], fn);
        });
    });

    describe("objDefineAccessors tests", () => {
        it("should define getter and setter", () => {
            const obj: any = {};
            let value = 42;
            
            objDefineAccessors(obj, "testProp",
                () => value,
                (v) => {
                    value = v;
                }
            );
            
            assert.equal(obj["testProp"], 42);
            obj["testProp"] = 100;
            assert.equal(value, 100);
            assert.equal(obj["testProp"], 100);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isTrue(descriptor?.configurable);
            assert.isTrue(descriptor.enumerable);
            assert.isFunction(descriptor.get);
            assert.isFunction(descriptor.set);
        });

        it("should define getter only", () => {
            const obj: any = {};
            let value = 42;
            
            objDefineAccessors(obj, "testProp", () => value, null);
            
            assert.equal(obj["testProp"], 42);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFunction(descriptor?.get);
            assert.isUndefined(descriptor?.set);
        });

        it("should define setter only", () => {
            const obj: any = {};
            let value = 42;
            
            objDefineAccessors(obj, "testProp", null, (v) => {
                value = v;
            });
            
            obj["testProp"] = 100;
            assert.equal(value, 100);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isUndefined(descriptor?.get);
            assert.isFunction(descriptor?.set);
        });

        it("should respect configurable and enumerable flags", () => {
            const obj = {};
            let value = 42;
            
            objDefineAccessors(obj, "testProp",
                () => value,
                (v) => {
                    value = v;
                },
                false,  // configurable
                false   // enumerable
            );
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFalse(descriptor?.configurable);
            assert.isFalse(descriptor.enumerable);
        });
    });

    describe("objDefine tests", () => {
        it("should define a data property with value", () => {
            const obj: any = {};
            
            objDefine(obj, "testProp", {
                v: 42
            });
            
            assert.equal(obj["testProp"], 42);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isTrue(descriptor?.configurable);
            assert.isTrue(descriptor.enumerable);
            assert.equal(descriptor.value, 42);
            assert.isUndefined(descriptor.get);
        });

        it("should define a writable data property", () => {
            const obj: any = {};
            
            objDefine(obj, "testProp", {
                v: 42,
                w: true
            });
            
            assert.equal(obj["testProp"], 42);
            obj["testProp"] = 100;
            assert.equal(obj["testProp"], 100);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isTrue(descriptor?.writable);
        });

        it("should define a non-enumerable property", () => {
            const obj: any = {};
            
            objDefine(obj, "testProp", {
                v: 42,
                e: false
            });
            
            assert.equal(obj["testProp"], 42);
            assert.deepEqual(objKeys(obj), []);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFalse(descriptor?.enumerable);
        });

        it("should define a non-configurable property", () => {
            const obj: any = {};
            
            objDefine(obj, "testProp", {
                v: 42,
                c: false
            });
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFalse(descriptor?.configurable);
            
            // Attempt to reconfigure should fail
            let didThrow = false;
            try {
                objDefine(obj, "testProp", {
                    v: 100
                });
            } catch (e) {
                didThrow = true;
            }
            
            assert.isTrue(didThrow, "Modifying a non-configurable property should throw");
            assert.equal(obj["testProp"], 42);
        });

        it("should define accessor properties", () => {
            const obj: any = {};
            let value = 42;
            
            objDefine(obj, "testProp", {
                g: () => value,
                s: (v) => {
                    value = v;
                }
            });
            
            assert.equal(obj["testProp"], 42);
            obj["testProp"] = 100;
            assert.equal(obj["testProp"], 100);
            assert.equal(value, 100);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFunction(descriptor?.get);
            assert.isFunction(descriptor?.set);
        });

        it("should handle lazy values", () => {
            const obj: any = {};
            let initCount = 0;
            
            const lazy = getLazy(() => {
                initCount++;
                return 42;
            });
            
            objDefine(obj, "testProp", {
                l: lazy
            });
            
            // Value should not be initialized yet
            assert.equal(initCount, 0);
            
            // Access should initialize it
            assert.equal(obj["testProp"], 42);
            assert.equal(initCount, 1);
            
            // Second access shouldn't re-initialize
            assert.equal(obj["testProp"], 42);
            assert.equal(initCount, 1);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFunction(descriptor?.get);
        });
        
        it("should handle lazy values with setters", () => {
            const obj: any = {};
            let value = 42;
            
            const lazy = getWritableLazy(() => value);
            
            objDefine(obj, "testProp", {
                l: lazy
            });
            
            assert.equal(obj["testProp"], 42);
            
            // Test if we can set the value
            obj["testProp"] = 100;
            assert.equal(obj["testProp"], 100);
            assert.equal(lazy.v, 100);
        });
    });

    describe("objDefineProps tests", () => {
        it("should define multiple data properties", () => {
            const obj: any = {};
            
            objDefineProps(obj, {
                "prop1": { v: 10 },
                "prop2": { v: 20 },
                "prop3": { v: 30 }
            });
            
            assert.equal(obj["prop1"], 10);
            assert.equal(obj["prop2"], 20);
            assert.equal(obj["prop3"], 30);
        });
        
        it("should define data and accessor properties together", () => {
            const obj: any = {};
            let value = 42;
            
            objDefineProps(obj, {
                "dataProp": {
                    v: 10,
                    w: true
                },
                "accessorProp": {
                    g: () => value,
                    s: (v) => {
                        value = v;
                    }
                }
            });
            
            // Test data property
            assert.equal(obj["dataProp"], 10);
            obj["dataProp"] = 20;
            assert.equal(obj["dataProp"], 20);
            
            // Test accessor property
            assert.equal(obj["accessorProp"], 42);
            obj["accessorProp"] = 100;
            assert.equal(obj["accessorProp"], 100);
            assert.equal(value, 100);
        });
        
        it("should set property attributes correctly", () => {
            const obj: any = {};
            
            objDefineProps(obj, {
                "normalProp": { v: 10 , w: true },
                "nonEnumProp": { v: 20, e: false },
                "nonConfProp": { v: 30, c: false },
                "nonWritableProp": { v: 40, w: false }
            });
            
            // Check enumerability
            assert.deepEqual(objKeys(obj).sort(), ["nonConfProp", "nonWritableProp", "normalProp"]);
            
            // Check configurability
            let didThrow = false;
            try {
                objDefine(obj, "nonConfProp", { v: 100 });
            } catch (e) {
                didThrow = true;
            }
            assert.isTrue(didThrow);
            
            // Check writability
            obj["normalProp"] = 100;
            assert.equal(obj["normalProp"], 100);
            
            safe(() => obj["nonWritableProp"] = 200);
            assert.equal(obj["nonWritableProp"], 40, "Non-writable property should not change");
        });
        
        it("should handle symbol properties", () => {
            // Skip if symbols aren't supported
            if (typeof Symbol !== "function") {
                return;
            }
            
            const obj: any = {};
            const symbolKey = Symbol("test");
            
            objDefineProps(obj, {
                [symbolKey]: { v: 42 }
            });
            
            assert.equal(obj[symbolKey], 42);
        });
        
        it("should handle lazy values in multiple properties", () => {
            const obj: any = {};
            let init1Count = 0;
            let init2Count = 0;
            const lazy1 = getLazy(() => {
                init1Count++;
                return "In restless dreams I walked alone";
            });
            
            const lazy2 = getLazy(() => {
                init2Count++;
                return "Narrow streets of cobblestone";
            });
            
            objDefineProps(obj, {
                "lazyProp1": { l: lazy1 },
                "lazyProp2": { l: lazy2 }
            });
            
            // Values should not be initialized yet
            assert.equal(init1Count, 0);
            assert.equal(init2Count, 0);
            // Access first property
            assert.equal(obj["lazyProp1"], "In restless dreams I walked alone");
            assert.equal(init1Count, 1);
            assert.equal(init2Count, 0);
            
            // Access second property
            assert.equal(obj["lazyProp2"], "Narrow streets of cobblestone");
            assert.equal(init1Count, 1);
            assert.equal(init2Count, 1);
        });
    });

    describe("edge cases and error handling", () => {
        it("should handle redefining properties when allowed", () => {
            const obj: any = {};
            
            objDefine(obj, "testProp", { v: 42 });
            assert.equal(obj["testProp"], 42);
            
            // Redefine with new value
            objDefine(obj, "testProp", { v: 100 });
            assert.equal(obj["testProp"], 100);
        });
        
        it("should handle undefined values correctly", () => {
            const obj: any = {};
            
            objDefine(obj, "testProp", { v: undefined });
            
            assert.isTrue("testProp" in obj);
            assert.isUndefined(obj["testProp"]);
        });
        
        it("should convert between property descriptor formats correctly", () => {
            const obj: any = {};
            
            // This tests the _createProp internal function
            const propDesc: ObjDefinePropDescriptor = {
                e: false,
                c: false,
                v: 42,
                w: true
            };
            
            objDefine(obj, "testProp", propDesc);
            
            const descriptor = objGetOwnPropertyDescriptor(obj, "testProp");
            assert.isFalse(descriptor?.enumerable);
            assert.isFalse(descriptor.configurable);
            assert.equal(descriptor.value, 42);
            assert.isTrue(descriptor.writable);
        });
    });
});

describe("objDefine with a polluted Object.prototype", () => {
    // Adds the properties to Object.prototype (like prototype pollution) while calling the function, and always removes them
    // again before any assert is used
    function _withPollution(props: { [key: string]: any }, fn: () => void) {
        const objProto: any = Object.prototype;
        const keys = objKeys(props);
        const previous: any = {};
        for (let lp = 0; lp < keys.length; lp++) {
            previous[keys[lp]] = Object.getOwnPropertyDescriptor(objProto, keys[lp]);
        }

        try {
            for (let lp = 0; lp < keys.length; lp++) {
                objProto[keys[lp]] = props[keys[lp]];
            }

            fn();
        } finally {
            for (let lp = 0; lp < keys.length; lp++) {
                if (previous[keys[lp]]) {
                    Object.defineProperty(objProto, keys[lp], previous[keys[lp]]);
                } else {
                    delete objProto[keys[lp]];
                }
            }
        }
    }

    it("defines the value rather than an inherited value, get, writable or lazy value", () => {
        const results: any = {};
        _withPollution({ value: "polluted" }, () => {
            const target: any = {};
            objDefine(target, "a", { v: undefined });
            results.a = Object.getOwnPropertyDescriptor(target, "a");
        });

        _withPollution({ get: () => "polluted" }, () => {
            const target: any = {};
            results.b = safe(() => {
                objDefine(target, "b", { v: 1 });
                return Object.getOwnPropertyDescriptor(target, "b");
            });
        });

        _withPollution({ writable: true }, () => {
            const target: any = {};
            objDefine(target, "c", { v: 1 });
            results.c = Object.getOwnPropertyDescriptor(target, "c");
        });

        _withPollution({ l: { v: "polluted" } }, () => {
            const target: any = {};
            results.d = safe(() => {
                objDefine(target, "d", { v: 1 });
                return Object.getOwnPropertyDescriptor(target, "d");
            });
        });

        assert.deepEqual(results.a, { value: undefined, writable: false, enumerable: true, configurable: true }, "An inherited value is not used");
        assert.isUndefined(results.b.e, "An inherited get should not make the descriptor invalid");
        assert.deepEqual(results.b.v, { value: 1, writable: false, enumerable: true, configurable: true });
        assert.deepEqual(results.c, { value: 1, writable: false, enumerable: true, configurable: true }, "An inherited writable is not used");
        assert.isUndefined(results.d.e, "An inherited lazy value should not make the descriptor invalid");
        assert.deepEqual(results.d.v, { value: 1, writable: false, enumerable: true, configurable: true });
        assert.isUndefined(({} as any).value, "Object.prototype is restored");
    });

    it("only uses the descriptor keys it knows, so an unexpected or polluted key doesn't change the property", () => {
        const results: any = {};

        // A key which isn't a descriptor key, but which Object.prototype maps to one (eg. by prototype pollution)
        _withPollution({ x: "get" }, () => {
            const target: any = {};
            results.a = safe(() => {
                objDefine(target, "a", { v: 1, x: () => "polluted" } as any);
                return Object.getOwnPropertyDescriptor(target, "a");
            });
        });

        assert.isUndefined(results.a.e, "A polluted key should not make the descriptor invalid");
        assert.deepEqual(results.a.v, { value: 1, writable: false, enumerable: true, configurable: true });

        // Own "__proto__" and "constructor" keys (eg. from JSON.parse) are not descriptor keys
        const target: any = {};
        objDefine(target, "b", JSON.parse("{ \"v\": 1, \"__proto__\": { \"get\": 1 }, \"constructor\": 2 }"));
        assert.deepEqual(Object.getOwnPropertyDescriptor(target, "b"), { value: 1, writable: false, enumerable: true, configurable: true });
    });

    it("a lazy value only has a setter when its \"v\" has an own setter, rather than an inherited set", () => {
        const results: any = {};
        const lazyValue = { v: 12 };
        _withPollution({ set: () => {
            // A polluted setter
        } }, () => {
            const target: any = {};
            objDefine(target, "a", { l: lazyValue as any });
            results.desc = Object.getOwnPropertyDescriptor(target, "a");
        });

        assert.isUndefined(results.desc.set, "The property should not have a setter");
        assert.equal(lazyValue.v, 12);
    });

    it("the polyfills which define values don't use an inherited value", () => {
        const results: any = {};
        _withPollution({ value: "polluted", 0: "inherited index" }, () => {
            results.fromEntries = polyObjFromEntries([["a", undefined]]);
            results.arrFrom = polyArrFrom([undefined]);
        });

        assert.isUndefined(results.fromEntries.a, "polyObjFromEntries");
        assert.isTrue(Object.prototype.hasOwnProperty.call(results.arrFrom, 0), "polyArrFrom defines an own value");
        assert.isUndefined(results.arrFrom[0], "polyArrFrom");
    });
});

describe("objDefine descriptor handling", () => {
    it("throws a TypeError for a null or undefined descriptor, like Object.defineProperty", () => {
        assert.throws(() => objDefine({} as any, "a", undefined as any), TypeError);
        assert.throws(() => objDefine({} as any, "a", null as any), TypeError);
        assert.throws(() => objDefineProps({}, { a: null as any }), TypeError);
        assert.throws(() => Object.defineProperty({}, "a", undefined as any), TypeError);
    });

    it("a getter (g) or setter (s) takes precedence over a lazy value (l)", () => {
        const target: any = {};
        objDefine(target, "a", { l: getLazy(() => "lazy"), g: () => "getter" } as any);
        objDefine(target, "b", { g: () => "getter", l: getLazy(() => "lazy") } as any);
        assert.equal(target.a, "getter");
        assert.equal(target.b, "getter");

        const sets: any[] = [];
        objDefine(target, "c", { l: getWritableLazy(() => "lazy"), s: (value: any) => sets.push(value) } as any);
        target.c = 5;
        assert.deepEqual(sets, [5], "The setter should be used");
        assert.equal(target.c, "lazy", "The lazy value is still the getter");
    });

    it("only uses the descriptor's own properties, an inherited lazy value (l) is ignored", () => {
        const target: any = {};
        objDefine(target, "a", Object.create({ l: getLazy(() => 42) }));
        objDefine(target, "b", { l: getLazy(() => 42) });
        assert.isUndefined(target.a, "An inherited lazy value should not be used");
        assert.equal(target.b, 42);
    });

    it("objDefineProps defines a \"__proto__\" key (eg. from JSON.parse) like Object.defineProperties", () => {
        const target: any = {};
        objDefineProps(target, JSON.parse("{ \"__proto__\": { \"v\": 1 } }"));
        const native: any = {};
        Object.defineProperties(native, JSON.parse("{ \"__proto__\": { \"value\": 1, \"enumerable\": true, \"configurable\": true } }"));

        assert.deepEqual(Object.getOwnPropertyDescriptor(target, "__proto__"), Object.getOwnPropertyDescriptor(native, "__proto__"));
        assert.strictEqual(Object.getPrototypeOf(target), Object.prototype, "The prototype should not be changed");
    });
});

describe("_pushOwnValue", () => {
    it("adds the value as the last index", () => {
        const values: any[] = ["a"];
        _pushOwnValue(values, "b");

        assert.deepEqual(values, ["a", "b"]);
        assert.deepEqual(Object.getOwnPropertyDescriptor(values, "1"), { value: "b", writable: true, enumerable: true, configurable: true });
    });

    it("adds an own data property when Array.prototype has a setter or read-only value for the index", () => {
        const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
        let setterCalls = 0;
        const kinds: { [name: string]: PropertyDescriptor } = {
            setter: {
                set: () => {
                    setterCalls++;
                },
                configurable: true
            },
            "read-only": {
                value: "RO",
                writable: false,
                configurable: true
            }
        };
        const results: { [name: string]: any[] } = {};

        Object.keys(kinds).forEach((kind) => {
            try {
                Object.defineProperty(Array.prototype, "0", kinds[kind]);
                results[kind] = [];
                _pushOwnValue(results[kind], kind);
            } finally {
                // Restore Array.prototype before any assert is used
                if (previous) {
                    Object.defineProperty(Array.prototype, "0", previous);
                } else {
                    delete (Array.prototype as any)[0];
                }
            }
        });

        assert.equal(setterCalls, 0, "The Array.prototype setter was not called");
        Object.keys(kinds).forEach((kind) => {
            assert.deepEqual(Object.getOwnPropertyDescriptor(results[kind], "0"), { value: kind, writable: true, enumerable: true, configurable: true }, kind);
            assert.equal(results[kind].length, 1, kind);
        });
    });

    it("adds an own data property when Object.prototype has a get or set property (which isn't used by the descriptor)", () => {
        const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
        const values: any[] = [];
        let error: any;
        try {
            // Array.prototype first, as its descriptor would also use Object.prototype.get / set
            Object.defineProperty(Array.prototype, "0", {
                value: "RO",
                writable: false,
                configurable: true
            });
            (Object.prototype as any).get = function () {
                return "get";
            };
            (Object.prototype as any).set = function () {
                // Ignored
            };

            _pushOwnValue(values, "a");
        } catch (e) {
            error = e;
        } finally {
            // Restore Object.prototype first, before the Array.prototype descriptor is used
            delete (Object.prototype as any).get;
            delete (Object.prototype as any).set;
            if (previous) {
                Object.defineProperty(Array.prototype, "0", previous);
            } else {
                delete (Array.prototype as any)[0];
            }
        }

        assert.equal(error, undefined, "No exception was thrown");
        assert.deepEqual(Object.getOwnPropertyDescriptor(values, "0"), { value: "a", writable: true, enumerable: true, configurable: true });
    });

    it("checks the prototype of Array.prototype for every value, so a Proxy which a callback adds after the first value isn't used", function() {
        if (typeof Proxy !== "function") {
            this.skip();
            return;
        }

        const orgProto = Object.getPrototypeOf(Array.prototype);
        let traps = "";
        const proxy = new Proxy(orgProto, {
            has: (target, key) => {
                // A string rather than an array (whose push would call this Proxy's set trap)
                typeof key === "string" && /^[0-9]+$/.test(key) && (traps += " has(" + key + ")");
                return Reflect.has(target, key);
            },
            set: (target, key, value, receiver) => {
                typeof key === "string" && /^[0-9]+$/.test(key) && (traps += " set(" + key + ")");
                return Reflect.set(target, key, value, receiver);
            }
        });

        const values: any[] = [];
        try {
            _pushOwnValue(values, "a");

            // Like a mapFn (or a getter) which changes the prototype of Array.prototype between the values
            Object.setPrototypeOf(Array.prototype, proxy);
            _pushOwnValue(values, "b");
            _pushOwnValue(values, "c");
        } finally {
            // Restored before any assert is used
            Object.setPrototypeOf(Array.prototype, orgProto);
        }

        assert.equal(traps, "", "The Proxy's traps were not called");
        assert.deepEqual(values, ["a", "b", "c"]);
        assert.deepEqual(Object.getOwnPropertyDescriptor(values, "2"), { value: "c", writable: true, enumerable: true, configurable: true });
    });
});

