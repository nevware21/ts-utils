/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objPropertyIsEnumerable } from "../../../../src/object/property_is_enumerable";
import { ObjClass } from "../../../../src/internal/constants";

describe("object property_is_enumerable tests", () => {
    describe("objPropertyIsEnumerable", () => {
        it("should identify enumerable properties", () => {
            const obj = { prop1: "value1" };
            assert.isTrue(objPropertyIsEnumerable(obj, "prop1"), "Regular property should be enumerable");
        });

        it("should identify non-enumerable properties", () => {
            const obj = {};
            Object.defineProperty(obj, "nonEnumProp", {
                value: "test",
                enumerable: false
            });
            assert.isFalse(objPropertyIsEnumerable(obj, "nonEnumProp"), "Non-enumerable property should return false");
        });

        it("should handle inherited properties", () => {
            const parent = { parentProp: "value" };
            const child = Object.create(parent);
            
            assert.isFalse(objPropertyIsEnumerable(child, "parentProp"), "Inherited properties should return false");
            
            // Add a property to the child with the same name
            child["parentProp"] = "child value";
            assert.isTrue(objPropertyIsEnumerable(child, "parentProp"), "Own property should return true even if it shadows an inherited one");
        });

        it("should handle non-existent properties", () => {
            const obj = { prop1: "value1" };
            assert.isFalse(objPropertyIsEnumerable(obj, "nonExistentProp"), "Non-existent properties should return false");
        });

        it("should work with arrays", () => {
            const arr = [1, 2, 3];
            
            // Array indices are enumerable
            assert.isTrue(objPropertyIsEnumerable(arr, 0), "Array indices should be enumerable");
            
            // Array length is not enumerable
            assert.isFalse(objPropertyIsEnumerable(arr, "length"), "Array length should not be enumerable");
            
            // Custom properties on arrays
            (arr as any)["customProp"] = "value";
            assert.isTrue(objPropertyIsEnumerable(arr, "customProp"), "Custom properties on arrays should be enumerable");
        });

        it("should handle symbols as property keys", () => {
            // Skip this test if symbols are not supported
            if (typeof Symbol !== "function") {
                return;
            }
            
            const sym = Symbol("testSymbol");
            const obj: any = {};
            obj[sym] = "symbol value";
            
            assert.isTrue(objPropertyIsEnumerable(obj, sym), "Symbol properties should be enumerable by default");
            
            // Create a non-enumerable symbol property
            const nonEnumSym = Symbol("nonEnumSymbol");
            Object.defineProperty(obj, nonEnumSym, {
                value: "non-enumerable symbol",
                enumerable: false
            });
            
            assert.isFalse(objPropertyIsEnumerable(obj, nonEnumSym), "Non-enumerable symbol properties should return false");
        });

        // This test explicitly tests the fallback _objPropertyIsEnum implementation
        it("should use fallback implementation when Object.getOwnPropertyDescriptor is not available", () => {
            // Save the original function
            const originalGetOwnPropDesc = ObjClass.getOwnPropertyDescriptor;
            
            try {
                // Mock by temporarily removing getOwnPropertyDescriptor
                // This will force the function to use the fallback loop implementation
                ObjClass.getOwnPropertyDescriptor = undefined as any;
                
                const obj = { testProp: "value" };
                
                // Enumerable property should still return true using the fallback
                assert.isTrue(objPropertyIsEnumerable(obj, "testProp"), "Enumerable property should return true with fallback implementation");
                
                // Non-existent property should return false
                assert.isFalse(objPropertyIsEnumerable(obj, "nonExistent"), "Non-existent property should return false with fallback implementation");
                
                // Create an object with inherited property
                const parent = { parentProp: "value" };
                const child = Object.create(parent);
                
                // Inherited property should return false with fallback
                assert.isFalse(objPropertyIsEnumerable(child, "parentProp"), "Inherited property should return false with fallback implementation");
            } finally {
                // Restore the original function
                ObjClass.getOwnPropertyDescriptor = originalGetOwnPropDesc;
            }
        });

        it("should handle primitive values without throwing", () => {
            // These should either work or return false, but not throw
            assert.isFalse(objPropertyIsEnumerable(null as any, "prop"), "null should not throw");
            assert.isFalse(objPropertyIsEnumerable(undefined as any, "prop"), "undefined should not throw");
            assert.isFalse(objPropertyIsEnumerable(42, "toString"), "number primitive should check its wrapper object");
            assert.isFalse(objPropertyIsEnumerable("string", "length"), "string primitive should check its wrapper object");
            assert.isFalse(objPropertyIsEnumerable(true, "valueOf"), "boolean primitive should check its wrapper object");
            assert.isFalse(objPropertyIsEnumerable(Symbol("test"), "hello"), "symbol primitive should check its wrapper object");
            assert.isFalse(objPropertyIsEnumerable(BigInt(42), "toString"), "BigInt primitive should check its wrapper object");
            assert.isFalse(objPropertyIsEnumerable(new Date(), "getTime"), "Date object should check its wrapper object");
            assert.isFalse(objPropertyIsEnumerable(Symbol("test"), "description"), "Symbol object should check its wrapper object");
        });

        it("should call instance propertyIsEnumerable if it exists", () => {
            // This should not throw and should return false
            const obj = { };
            assert.isFalse(objPropertyIsEnumerable(obj, "test"), "Should return false when propertyIsEnumerable by default");
            
            let called = false;
            let propName: any;
            obj["propertyIsEnumerable"] = (name: string) => {
                called = true;
                propName = name;
                return true;
            }
            assert.isTrue(objPropertyIsEnumerable(obj, "test"), "Should return the value of propertyIsEnumerable function on the object");
            assert.isTrue(called, "Should have called the propertyIsEnumerable function on the object");
            assert.equal(propName, "test", "Should have passed the property name to the propertyIsEnumerable function");
        });

        it("should handle accessing non-objects which have propertyIsEnumerable", () => {
            function helloDarkness() {
                return "hello darkness";
            }

            assert.isFalse(objPropertyIsEnumerable(helloDarkness, "test"), "Should not throw when propertyIsEnumerable is a function on a non-object");

            let called = false;
            let propName: any;
            helloDarkness["propertyIsEnumerable"] = (name: string) => {
                called = true;
                propName = name;
                return true;
            }

            assert.isTrue(objPropertyIsEnumerable(helloDarkness, "test"), "Should not throw when propertyIsEnumerable is a function on a non-object");
            assert.isTrue(called, "Should have called the propertyIsEnumerable function on the object");
            assert.equal(propName, "test", "Should have passed the property name to the propertyIsEnumerable function");
            helloDarkness.propertyIsEnumerable = () => true;

            assert.isFalse(objPropertyIsEnumerable(42, "hello"), "Should not throw when propertyIsEnumerable is a function on a non-object");
            assert.isFalse(objPropertyIsEnumerable("hello", "darkness"), "Should not throw when propertyIsEnumerable is a function on a non-object");
            assert.isFalse(objPropertyIsEnumerable(true, "darkness"), "Should not throw when propertyIsEnumerable is a function on a non-object");
            assert.isFalse(objPropertyIsEnumerable(false, "darkness"), "Should not throw when propertyIsEnumerable is a function on a non-object");
            assert.isFalse(objPropertyIsEnumerable(Symbol("test"), "darkness"), "Should not throw when propertyIsEnumerable is a function on a non-object");
        });

        it("should handle numeric property keys", () => {
            const obj = { 42: "answer" };
            assert.isTrue(objPropertyIsEnumerable(obj, 42), "Numeric keys should work properly");
            assert.isFalse(objPropertyIsEnumerable(obj, 43), "Non-existent numeric keys should return false");
        });

        it("should handle properties that throw errors when accessed", () => {
            const obj = {};
            Object.defineProperty(obj, "errorProp", {
                get: function() {
                    throw new Error("This property throws an error when accessed");
                },
                enumerable: true,
                configurable: true
            });

            // Should not throw despite the getter throwing
            assert.doesNotThrow(() => {
                objPropertyIsEnumerable(obj, "errorProp");
            }, "Should not throw when checking enumerable property that throws on access");
        });

        it("should explicitly test the 'in' operator part of the fallback implementation", () => {
            const originalGetOwnPropDesc = ObjClass.getOwnPropertyDescriptor;
            try {
                // Mock by temporarily removing getOwnPropertyDescriptor
                // This will force the function to use the fallback loop implementation
                ObjClass.getOwnPropertyDescriptor = undefined as any;

                // Create an object with a property that exists in the prototype chain
                // but is not enumerable
                const proto = {};
                Object.defineProperty(proto, "nonEnumInherited", {
                    value: "hidden",
                    enumerable: false
                });

                Object.defineProperty(proto, "hello", {
                    value: "darkness",
                    enumerable: true
                });

                const obj = Object.create(proto);
                obj["propertyIsEnumerable"] = null;
                
                // The property exists in the prototype ('in' operator will return true)
                // but it's not enumerable and won't show up in for...in
                assert.isFalse(objPropertyIsEnumerable(obj, "nonEnumInherited"),
                    "Non-enumerable inherited property should return false with fallback");

                assert.isTrue(objPropertyIsEnumerable(obj, "hello"),
                    "Enumerable inherited property should return true with fallback");
            } finally {
                // Restore the original function
                ObjClass.getOwnPropertyDescriptor = originalGetOwnPropDesc;
            }
        });
    });
});
