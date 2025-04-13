/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objDefineGet, objDefineAccessors, objDefine, objDefineProps, ObjDefinePropDescriptor } from "../../../../src/object/define";
import { objGetOwnPropertyDescriptor } from "../../../../src/object/get_own_property_desc";
import { objKeys } from "../../../../src/object/object";
import { getLazy, getWritableLazy } from "../../../../src/helpers/lazy";
import { isFunction } from "../../../../src/helpers/base";
import { safe } from "../../../../src/helpers/safe";

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
