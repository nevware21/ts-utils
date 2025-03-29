/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objFreeze, objSeal, objDeepFreeze } from "../../../../src/object/object";
import { objIsFrozen, objIsSealed } from "../../../../src/object/object_state";
import { objIsExtensible } from "../../../../src/object/prevent_extensions";
import { polyObjIsFrozen } from "../../../../src/polyfills/object/objIsFrozen";
import { polyObjIsSealed } from "../../../../src/polyfills/object/objIsSealed";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { objDefine } from "../../../../src/object/define";

describe("object freeze and seal tests", () => {
    describe("objIsFrozen functionality", () => {
        it("should correctly identify frozen objects", () => {
            const obj = { a: 1, b: 2 };
            assert.isFalse(objIsFrozen(obj), "Regular object should not be frozen");

            // Freeze the object
            const frozenObj = objFreeze(obj);
            assert.strictEqual(frozenObj, obj, "objFreeze should return the same object");
            assert.isTrue(objIsFrozen(frozenObj), "Frozen object should be identified as frozen");

            // Nested object
            const nestedObj = { outer: { inner: 42 } };
            const frozenNestedObj = objFreeze(nestedObj);
            assert.isTrue(objIsFrozen(frozenNestedObj), "Frozen nested object should be identified as frozen");
            assert.isFalse(objIsFrozen(frozenNestedObj.outer), "Inner object should not be automatically frozen");
        });

        it("should consider primitives as frozen", () => {
            assert.isTrue(objIsFrozen(null), "null should be considered frozen");
            assert.isTrue(objIsFrozen(undefined), "undefined should be considered frozen");
            assert.isTrue(objIsFrozen(42), "Numbers should be considered frozen");
            assert.isTrue(objIsFrozen("test"), "Strings should be considered frozen");
            assert.isTrue(objIsFrozen(true), "Booleans should be considered frozen");
            assert.isTrue(objIsFrozen(Symbol("test")), "Symbols should be considered frozen");
        });

        it("should handle arrays correctly", () => {
            const arr = [1, 2, 3];
            assert.isFalse(objIsFrozen(arr), "Regular array should not be frozen");
            
            const frozenArr = objFreeze(arr);
            assert.isTrue(objIsFrozen(frozenArr), "Frozen array should be identified as frozen");
        });

        it("should handle functions correctly", () => {
            const fn = function() {
                return 42;
            };
            assert.isFalse(objIsFrozen(fn), "Regular function should not be frozen");
            
            const frozenFn = objFreeze(fn);
            assert.isTrue(objIsFrozen(frozenFn), "Frozen function should be identified as frozen");
        });

        it("polyObjIsFrozen should match native Object.isFrozen behavior", function() {
            // Skip if native method isn't available
            if (typeof Object.isFrozen !== "function") {
                this.skip();
                return;
            }
            
            // Test with regular object
            const obj = { a: 1 };
            assert.equal(polyObjIsFrozen(obj), Object.isFrozen(obj),
                "polyObjIsFrozen should match Object.isFrozen for regular object");
            
            // Test with array
            const arr = [1, 2, 3];
            assert.equal(polyObjIsFrozen(arr), Object.isFrozen(arr),
                "polyObjIsFrozen should match Object.isFrozen for array");
                
            // Test with primitives
            assert.equal(polyObjIsFrozen(null), Object.isFrozen(null),
                "polyObjIsFrozen should match Object.isFrozen for null");
            assert.equal(polyObjIsFrozen(undefined), Object.isFrozen(undefined),
                "polyObjIsFrozen should match Object.isFrozen for undefined");
            assert.equal(polyObjIsFrozen(42), Object.isFrozen(42),
                "polyObjIsFrozen should match Object.isFrozen for number");
            assert.equal(polyObjIsFrozen("test"), Object.isFrozen("test"),
                "polyObjIsFrozen should match Object.isFrozen for string");
            assert.equal(polyObjIsFrozen(true), Object.isFrozen(true),
                "polyObjIsFrozen should match Object.isFrozen for boolean");
        });
    });

    describe("objIsSealed functionality", () => {
        it("should correctly identify sealed objects", () => {
            const obj = { a: 1, b: 2 };
            assert.isFalse(objIsSealed(obj), "Regular object should not be sealed");

            // Seal the object
            const sealedObj = objSeal(obj);
            assert.strictEqual(sealedObj, obj, "objSeal should return the same object");
            assert.isTrue(objIsSealed(sealedObj), "Sealed object should be identified as sealed");

            // Nested object
            const nestedObj = { outer: { inner: 42 } };
            const sealedNestedObj = objSeal(nestedObj);
            assert.isTrue(objIsSealed(sealedNestedObj), "Sealed nested object should be identified as sealed");
            assert.isFalse(objIsSealed(sealedNestedObj.outer), "Inner object should not be automatically sealed");
        });

        it("should consider primitives as sealed", () => {
            assert.isTrue(objIsSealed(null), "null should be considered sealed");
            assert.isTrue(objIsSealed(undefined), "undefined should be considered sealed");
            assert.isTrue(objIsSealed(42), "Numbers should be considered sealed");
            assert.isTrue(objIsSealed("test"), "Strings should be considered sealed");
            assert.isTrue(objIsSealed(true), "Booleans should be considered sealed");
            assert.isTrue(objIsSealed(Symbol("test")), "Symbols should be considered sealed");
        });

        it("should handle arrays correctly", () => {
            const arr = [1, 2, 3];
            assert.isFalse(objIsSealed(arr), "Regular array should not be sealed");
            
            const sealedArr = objSeal(arr);
            assert.isTrue(objIsSealed(sealedArr), "Sealed array should be identified as sealed");
        });

        it("should handle functions correctly", () => {
            const fn = function() {
                return 42;
            };
            assert.isFalse(objIsSealed(fn), "Regular function should not be sealed");
            
            const sealedFn = objSeal(fn);
            assert.isTrue(objIsSealed(sealedFn), "Sealed function should be identified as sealed");
        });

        it("should recognize frozen objects as sealed", () => {
            const obj = { a: 1, b: 2 };
            const frozenObj = objFreeze(obj);
            
            assert.isTrue(objIsSealed(frozenObj), "Frozen objects should also be considered sealed");
        });

        it("polyObjIsSealed should match native Object.isSealed behavior", function() {
            // Skip if native method isn't available
            if (typeof Object.isSealed !== "function") {
                this.skip();
                return;
            }
            
            // Test with regular object
            const obj = { a: 1 };
            assert.equal(polyObjIsSealed(obj), Object.isSealed(obj),
                "polyObjIsSealed should match Object.isSealed for regular object");
            
            // Test with array
            const arr = [1, 2, 3];
            assert.equal(polyObjIsSealed(arr), Object.isSealed(arr),
                "polyObjIsSealed should match Object.isSealed for array");
            
            // Test with primitives
            assert.equal(polyObjIsSealed(null), Object.isSealed(null),
                "polyObjIsSealed should match Object.isSealed for null");
            assert.equal(polyObjIsSealed(undefined), Object.isSealed(undefined),
                "polyObjIsSealed should match Object.isSealed for undefined");
            assert.equal(polyObjIsSealed(42), Object.isSealed(42),
                "polyObjIsSealed should match Object.isSealed for number");
            assert.equal(polyObjIsSealed("test"), Object.isSealed("test"),
                "polyObjIsSealed should match Object.isSealed for string");
            assert.equal(polyObjIsSealed(true), Object.isSealed(true),
                "polyObjIsSealed should match Object.isSealed for boolean");
        });
    });

    describe("relationship between frozen, sealed, and extensible", () => {
        it("frozen objects should be sealed and non-extensible", () => {
            const obj = { a: 1, b: 2 };
            const frozenObj = objFreeze(obj);
            
            assert.isTrue(objIsFrozen(frozenObj), "Object should be frozen");
            assert.isTrue(objIsSealed(frozenObj), "Frozen object should be sealed");
            assert.isFalse(objIsExtensible(frozenObj), "Frozen object should not be extensible");
        });

        it("sealed objects should be non-extensible but not necessarily frozen", () => {
            const obj = { a: 1, b: 2 };
            const sealedObj = objSeal(obj);
            
            assert.isTrue(objIsSealed(sealedObj), "Object should be sealed");
            assert.isFalse(objIsExtensible(sealedObj), "Sealed object should not be extensible");
            
            // A sealed object is not necessarily frozen because properties might still be writable
            // We can determine this by checking if we can modify a property
            try {
                sealedObj.a = 100;
                // If we can modify the property, the object is not frozen
                assert.equal(sealedObj.a, 100, "Property should be modifiable in a sealed object");
                assert.isFalse(objIsFrozen(sealedObj), "Sealed object with writable properties should not be frozen");
            } catch (e) {
                // If we can't modify the property, the environment has made the sealed object frozen too
                assert.isTrue(objIsFrozen(sealedObj), "In this environment, sealed objects are also frozen");
            }
        });
    });

    describe("polyfill and native implementations compatibility", () => {
        it("should have polyObjIsFrozen match objIsFrozen behavior", () => {
            let nonConfigurableObj: any = { a: 1 };
            objDefine(nonConfigurableObj, "b", { v: 1, c: false, w: false });

            const testValues = [
                { a: 1 },
                nonConfigurableObj,
                [1, 2, 3],
                function() {
                    return 42;
                },
                null,
                undefined,
                42,
                "test",
                true,
                Symbol("test")
            ];
            
            for (const value of testValues) {
                assert.equal(
                    polyObjIsFrozen(value),
                    objIsFrozen(value),
                    `polyObjIsFrozen and objIsFrozen should match for ${dumpObj(value)}`
                );
            }
        });
        
        it("should have polyObjIsSealed match objIsSealed behavior", () => {
            let nonConfigurableObj: any = { a: 1 };
            objDefine(nonConfigurableObj, "b", { v: 1, c: false, w: false });

            const testValues = [
                { a: 1 },
                nonConfigurableObj,
                [1, 2, 3],
                function() {
                    return 42;
                },
                null,
                undefined,
                42,
                "test",
                true,
                Symbol("test")
            ];
            
            for (const value of testValues) {
                assert.equal(
                    polyObjIsSealed(value),
                    objIsSealed(value),
                    `polyObjIsSealed and objIsSealed should match for ${dumpObj(value)}`
                );
            }
        });
    });

    describe("objDeepFreeze functionality", () => {
        it("should freeze an object and all its nested properties", () => {
            const nestedObj = {
                a: 1,
                b: {
                    c: 2,
                    d: {
                        e: 3
                    }
                }
            };
            
            const deepFrozenObj = objDeepFreeze(nestedObj);
            
            // The original object should be returned
            assert.strictEqual(deepFrozenObj, nestedObj, "objDeepFreeze should return the same object");
            
            // The top level object should be frozen
            assert.isTrue(objIsFrozen(deepFrozenObj), "Top level object should be frozen");
            
            // The nested objects should also be frozen
            assert.isTrue(objIsFrozen(deepFrozenObj.b), "First level nested object should be frozen");
            assert.isTrue(objIsFrozen(deepFrozenObj.b.d), "Second level nested object should be frozen");
            
            // Attempt to modify a nested property should fail in strict mode
            // We'll try in a try-catch to handle both strict and non-strict mode
            let modificationFailed = false;
            try {
                deepFrozenObj.b.c = 100;
                // In non-strict mode, the assignment silently fails
                assert.notEqual(deepFrozenObj.b.c, 100, "Nested property should not be modifiable");
            } catch (e) {
                // In strict mode, this throws a TypeError
                modificationFailed = true;
            }
            
            // Either the assignment failed silently or it threw an error
            assert.isTrue(deepFrozenObj.b.c === 2 || modificationFailed,
                "Nested property should remain unchanged or modification should throw");
        });
        
        it("should properly handle objects containing arrays", () => {
            const objWithArrays = {
                a: [1, 2, 3],
                b: {
                    c: [4, 5, { d: 6 }]
                }
            };
            
            const frozenObjWithArrays = objDeepFreeze(objWithArrays);
            
            // Arrays should be frozen
            assert.isTrue(objIsFrozen(frozenObjWithArrays.a), "Top level array should be frozen");
            assert.isTrue(objIsFrozen(frozenObjWithArrays.b.c), "Nested array should be frozen");
            
            // Objects inside arrays should also be frozen
            assert.isTrue(objIsFrozen(frozenObjWithArrays.b.c[2]), "Object inside nested array should be frozen");
            
            // Attempt to modify array contents should fail
            let modificationFailed = false;
            try {
                frozenObjWithArrays.a[0] = 100;
                // In non-strict mode, the assignment silently fails
                assert.notEqual(frozenObjWithArrays.a[0], 100, "Array element should not be modifiable");
            } catch (e) {
                // In strict mode, this throws a TypeError
                modificationFailed = true;
            }
            
            assert.isTrue(frozenObjWithArrays.a[0] === 1 || modificationFailed,
                "Array element should remain unchanged or modification should throw");
        });
        
        it("should handle objects with circular references", () => {
            // Create an object with a circular reference
            const obj: any = { a: 1 };
            obj.self = obj;
            obj.nested = { parent: obj };
            
            // Should not cause a stack overflow
            const frozenObj = objDeepFreeze(obj);
            
            assert.isTrue(objIsFrozen(frozenObj), "Top level object should be frozen");
            assert.isTrue(objIsFrozen(frozenObj.nested), "Nested object should be frozen");
            
            // The circular reference should still be preserved
            assert.strictEqual(frozenObj.self, frozenObj, "Circular reference should be preserved");
            assert.strictEqual(frozenObj.nested.parent, frozenObj, "Nested circular reference should be preserved");
        });
        
        it("should properly handle primitives", () => {
            // Primitives should be returned as-is
            const primitives = [
                42,
                "string",
                true,
                null,
                undefined,
                Symbol("test")
            ];
            
            for (const primitive of primitives) {
                const result = objDeepFreeze(primitive);
                assert.strictEqual(result, primitive, `objDeepFreeze should return primitive ${String(primitive)} unchanged`);
                assert.isTrue(objIsFrozen(result), `Primitive ${String(primitive)} should be considered frozen`);
            }
        });
        
        it("should properly handle functions", () => {
            const fn = function() {
                return 42;
            };
            fn.prop = { nested: { value: "test" } };
            
            const frozenFn = objDeepFreeze(fn);
            
            assert.strictEqual(frozenFn, fn, "objDeepFreeze should return the same function");
            assert.isTrue(objIsFrozen(frozenFn), "Function should be frozen");
            assert.isTrue(objIsFrozen(frozenFn.prop), "Function property should be frozen");
            assert.isTrue(objIsFrozen(frozenFn.prop.nested), "Nested function property should be frozen");
        });
        
        it("should handle empty objects and arrays", () => {
            const emptyObj: any = {};
            const emptyArr: any[] = [];
            
            const frozenEmptyObj = objDeepFreeze(emptyObj);
            const frozenEmptyArr = objDeepFreeze(emptyArr);
            
            assert.isTrue(objIsFrozen(frozenEmptyObj), "Empty object should be frozen");
            assert.isTrue(objIsFrozen(frozenEmptyArr), "Empty array should be frozen");
            
            // Try to add new properties
            let modificationFailed = false;
            try {
                frozenEmptyObj.newProp = "test";
                // In non-strict mode, the assignment silently fails
                assert.notOwnProperty(frozenEmptyObj, "newProp", "Should not be able to add properties to frozen empty object");
            } catch (e) {
                // In strict mode, this throws a TypeError
                modificationFailed = true;
            }
            
            assert.isTrue(!("newProp" in frozenEmptyObj) || modificationFailed,
                "Empty object should remain empty or modification should throw");
                
            // Try to add new elements to array
            modificationFailed = false;
            try {
                frozenEmptyArr.push(1);
                // In non-strict mode, the push silently fails
                assert.equal(frozenEmptyArr.length, 0, "Should not be able to add elements to frozen empty array");
            } catch (e) {
                // In strict mode, this throws a TypeError
                modificationFailed = true;
            }
            
            assert.isTrue(frozenEmptyArr.length === 0 || modificationFailed,
                "Empty array should remain empty or modification should throw");
        });
        
        it("should work even when Object.freeze is not available", function() {
            // Save original
            const originalFreeze = Object.freeze;
            
            try {
                // Mock the absence of Object.freeze
                Object.freeze = undefined as any;
                
                const obj = { a: 1, b: { c: 2 } };
                const result = objDeepFreeze(obj);
                
                // It should return the original object even when freeze is not available
                assert.strictEqual(result, obj, "objDeepFreeze should return the original object even when Object.freeze is not available");
                
                // We can't test if it's frozen because Object.freeze is missing
                // But at least the function should not throw and return the object
            } finally {
                // Restore original
                Object.freeze = originalFreeze;
            }
        });
    });
});
