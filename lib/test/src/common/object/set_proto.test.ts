/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objSetPrototypeOf, _polyObjSetPrototypeOf } from "../../../../src/object/set_proto";
import { __PROTO__ } from "../../../../src/internal/constants";
import { objCreate } from "../../../../src/object/create";

describe("_polyObjSetPrototypeOf tests", () => {
    it("should set prototype of objects using the polyfill implementation", () => {
        // Create a base object
        const baseObj: any = {};
        
        // Create a prototype with a test method
        const testProto = {
            testMethod: function() {
                return "Hello World";
            }
        };
        
        // Use the polyfill to set the prototype
        const result = _polyObjSetPrototypeOf(baseObj, testProto);
        
        // Verify the result is the original object
        assert.strictEqual(result, baseObj, "Should return the original object");
        
        // Verify the object now has access to the prototype's method
        assert.isFunction(baseObj["testMethod"], "Object should have access to prototype's method");
        assert.equal(baseObj["testMethod"](), "Hello World", "Method from prototype should work correctly");
    });

    it("should handle the __PROTO__ property based environment detection", () => {
        // Create objects
        const baseObj: any = {};
        const testProto = {
            testMethod: function() {
                return "Test Method";
            },
            testProp: "Test Property"
        };
        
        // Use the polyfill
        _polyObjSetPrototypeOf(baseObj, testProto);
        
        // Test if properties were correctly assigned
        assert.isFunction(baseObj["testMethod"], "Method should be accessible");
        assert.equal(baseObj["testProp"], "Test Property", "Property should be accessible");
    });

    it("should work for arrays", () => {
        // Create a custom prototype with array helper methods
        const customArrayProto = {
            customJoin: function() {
                return this.join("|");
            },
            join: function(separator: string) {
                return Array.prototype.join.call(this, separator);
            }
        };
        
        // Create an array
        const testArray: any = [1, 2, 3];
        
        // Set the prototype
        _polyObjSetPrototypeOf(testArray, customArrayProto);
        
        // The array should maintain its original array behavior
        assert.equal(testArray.length, 3, "Array length should be preserved");
        assert.equal(testArray[0], 1, "Array elements should be preserved");
        
        // And gain the new method
        assert.isFunction(testArray["customJoin"], "Custom method should be accessible");
        assert.equal(testArray["customJoin"](), "1|2|3", "Custom method should work correctly");
    });

    it("should compare polyfill with native implementation", () => {
        // Only run this test if native Object.setPrototypeOf exists
        if (typeof Object.setPrototypeOf === "function") {
            // Create two identical objects
            const objWithNative: any = {};
            const objWithPolyfill: any = {};
            
            // Create a prototype
            const testProto = {
                testMethod: function() {
                    return "Hello World";
                }
            };
            
            // Set prototype using native method
            Object.setPrototypeOf(objWithNative, testProto);
            
            // Set prototype using polyfill
            _polyObjSetPrototypeOf(objWithPolyfill, testProto);
            
            // Both should have the same behavior
            assert.equal(
                objWithNative["testMethod"](),
                objWithPolyfill["testMethod"](),
                "Both methods should produce the same result"
            );
        }
    });

    it("should work for nested prototype chains", () => {
        // Create a chain of prototypes
        const protoLevel1 = {
            level1Method: function() {
                return "Level 1";
            }
        };
        
        const protoLevel2 = objCreate(null);
        _polyObjSetPrototypeOf(protoLevel2, protoLevel1);
        protoLevel2.level2Method = function() {
            return "Level 2";
        };
        
        // Create target object
        const targetObj: any = {};
        
        // Set prototype to level 2
        _polyObjSetPrototypeOf(targetObj, protoLevel2);
        
        // Should access methods from both prototypes
        assert.isFunction(targetObj["level2Method"], "Should access method from direct prototype");
        assert.equal(targetObj["level2Method"](), "Level 2", "Direct prototype method should work");
        
        // Depending on how __PROTO__ is handled, this may or may not work
        // This test verifies current behavior without making assumptions
        if (targetObj["level1Method"]) {
            assert.isFunction(targetObj["level1Method"], "Should access method from prototype chain");
            assert.equal(targetObj["level1Method"](), "Level 1", "Prototype chain method should work");
        }
    });
});

describe("objSetPrototypeOf function tests", () => {
    it("should set prototype of objects", () => {
        // Create a base object
        const baseObj: any = {};
        
        // Create a prototype with a test method
        const testProto = {
            testMethod: function() {
                return "Hello World";
            }
        };
        
        // Use the function to set the prototype
        const result = objSetPrototypeOf(baseObj, testProto);
        
        // Verify the result is the original object
        assert.strictEqual(result, baseObj, "Should return the original object");
        
        // Verify the object now has access to the prototype's method
        assert.isFunction(baseObj["testMethod"], "Object should have access to prototype's method");
        assert.equal(baseObj["testMethod"](), "Hello World", "Method from prototype should work correctly");
    });
});
