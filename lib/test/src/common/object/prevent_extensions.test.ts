/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objPreventExtensions, objIsExtensible } from "../../../../src/object/prevent_extensions";

describe("object prevent_extensions tests", () => {
    describe("objPreventExtensions", () => {
        it("Should prevent extensions on an object", () => {
            const obj = { prop: 1 };
            
            objPreventExtensions(obj);
            
            // Test that modifying existing properties works
            obj.prop = 2;
            assert.equal(obj.prop, 2, "Modifying existing properties should work");
            
            // Test that `objIsExtensible` returns false for the object
            assert.isFalse(objIsExtensible(obj), "Object should not be extensible after objPreventExtensions");
        });
        
        it("Should handle non-object arguments", () => {
            // Simply verify that calling with these values doesn't throw
            // and returns the expected value for an alias of Object.preventExtensions
            const numResult = objPreventExtensions(1);
            const strResult = objPreventExtensions("string");
            const boolResult = objPreventExtensions(true);
            
            // Just make sure these calls don't throw and return something
            assert.equal(numResult, 1);
            assert.equal(strResult, "string");
            assert.equal(boolResult, true);
            
            // Test null and undefined - these might throw but we don't mandate it
            try {
                objPreventExtensions(null);
                // If we get here, it didn't throw
                assert.isTrue(true, "objPreventExtensions(null) did not throw");
            } catch (e) {
                // If it throws, it should be a TypeError
                assert.instanceOf(e, TypeError);
            }
            
            try {
                objPreventExtensions(undefined);
                // If we get here, it didn't throw
                assert.isTrue(true, "objPreventExtensions(undefined) did not throw");
            } catch (e) {
                // If it throws, it should be a TypeError
                assert.instanceOf(e, TypeError);
            }
        });
        
        it("Should return the object passed to it", () => {
            const obj = { a: 1 };
            const result = objPreventExtensions(obj);
            
            assert.strictEqual(result, obj, "objPreventExtensions should return the object passed to it");
        });
    });
    
    describe("objIsExtensible", () => {
        it("Should return true for normal objects", () => {
            const obj = { a: 1 };
            assert.isTrue(objIsExtensible(obj), "New objects should be extensible");
            
            const emptyObj = {};
            assert.isTrue(objIsExtensible(emptyObj), "Empty objects should be extensible");
            
            const arr = [1, 2, 3];
            assert.isTrue(objIsExtensible(arr), "Arrays should be extensible");
            
            const fn = function() {
                return 42;
            };
            assert.isTrue(objIsExtensible(fn), "Functions should be extensible");
        });
        
        it("Should return false for non-extensible objects", () => {
            const obj = objPreventExtensions({ a: 1 });
            assert.isFalse(objIsExtensible(obj), "Object after objPreventExtensions should not be extensible");
        });
        
        it("Should return false for primitive values", () => {
            assert.isFalse(objIsExtensible(null), "null should not be extensible");
            assert.isFalse(objIsExtensible(undefined), "undefined should not be extensible");
            assert.isFalse(objIsExtensible(1), "Numbers should not be extensible");
            assert.isFalse(objIsExtensible("string"), "Strings should not be extensible");
            assert.isFalse(objIsExtensible(true), "Booleans should not be extensible");
            assert.isFalse(objIsExtensible(Symbol("sym")), "Symbols should not be extensible");
        });
    });
});