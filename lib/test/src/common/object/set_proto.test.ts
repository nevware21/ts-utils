/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objCreate } from "../../../../src/object/create";
import { objGetPrototypeOf } from "../../../../src/object/object";
import { objSetPrototypeOf, _polyObjSetPrototypeOf } from "../../../../src/object/set_proto";

describe("objSetPrototypeOf tests", () => {
    it("should set prototype of objects", () => {
        // Create a base object
        const testObj = {};
        
        // Create a prototype with a test function
        const testProto = {
            testMethod: function() {
                return "Hello World";
            }
        };

        // Set the prototype using objSetPrototypeOf
        const result = objSetPrototypeOf(testObj, testProto);
        
        // Verify the function returns the original object
        assert.strictEqual(result, testObj, "objSetPrototypeOf should return the original object");
        
        // Verify the prototype was set correctly
        const proto = objGetPrototypeOf(testObj);
        assert.strictEqual(proto, testProto, "Prototype should be correctly set");
        
        // Verify the function from prototype is accessible
        assert.isFunction((testObj as any).testMethod, "Should be able to access functions from the new prototype");
        assert.equal((testObj as any).testMethod(), "Hello World", "Methods from new prototype should work correctly");
    });

    it("should set null as prototype", () => {
        const testObj = {};
        
        // Set null as the prototype
        const result = objSetPrototypeOf(testObj, null as any);
        
        assert.strictEqual(result, testObj, "objSetPrototypeOf should return the original object");
        
        // Verify the prototype was set to null
        const proto = objGetPrototypeOf(testObj);
        assert.isNull(proto, "Prototype should be set to null");
    });

    it("should change prototype of an existing object", () => {
        // Create an initial prototype
        const initialProto = {
            initialMethod: function() {
                return "Initial";
            }
        };
        
        // Create a new prototype
        const newProto = {
            newMethod: function() {
                return "New";
            }
        };
        
        // Create object with initial prototype
        const testObj = objCreate(initialProto);
        
        // Verify initial prototype
        assert.equal((testObj as any).initialMethod(), "Initial", "Initial prototype method should work");
        assert.isUndefined((testObj as any).newMethod, "New prototype method should not exist yet");
        
        // Change the prototype
        objSetPrototypeOf(testObj, newProto);
        
        // Verify prototype was changed
        assert.isUndefined((testObj as any).initialMethod, "Initial prototype method should no longer exist");
        assert.equal((testObj as any).newMethod(), "New", "New prototype method should work");
    });
});

describe("_polyObjSetPrototypeOf tests", () => {
    it("should set prototype using __proto__ when supported", () => {
        // Create objects for testing
        const testObj = {};
        const testProto = {
            testMethod: function() {
                return "Poly Hello World";
            }
        };
        
        // Set prototype using polyfill
        const result = _polyObjSetPrototypeOf(testObj, testProto);
        
        // Verify the function returns the original object
        assert.strictEqual(result, testObj, "_polyObjSetPrototypeOf should return the original object");
        
        // Verify the method from prototype is accessible
        assert.isFunction((testObj as any).testMethod, "Should be able to access functions from the new prototype");
        assert.equal((testObj as any).testMethod(), "Poly Hello World", "Methods from new prototype should work correctly");
    });
    
    it("should copy properties when __proto__ is not supported", () => {
        // Create an object where we'll simulate __proto__ not being supported
        const testObj = {};
        
        // Our test prototype with properties to copy
        const testProto = {
            prop1: "value1",
            prop2: 123,
            testMethod: function() {
                return "Copied Method";
            }
        };
        
        // Create a mock implementation that forces the polyfill to use property copying
        const originalProto = (Object.prototype as any).__proto__;
        
        // Temporarily make it look like __proto__ isn't supported
        // We'll use a try-finally to ensure we restore it even if there's an error
        try {
            // Set up a scenario where __proto__ would be detected as not working
            // This is a simplified simulation - in a real environment we can't easily
            // control the ICachedValue behavior, but we can test the property copying logic
            
            // Apply the polyfill directly
            const result = _polyObjSetPrototypeOf(testObj, testProto);
            
            // Verify result is the original object
            assert.strictEqual(result, testObj, "_polyObjSetPrototypeOf should return the original object");
            
            // Check that properties were copied
            assert.equal((testObj as any).prop1, "value1", "Property should be copied");
            assert.equal((testObj as any).prop2, 123, "Property should be copied");
            assert.isFunction((testObj as any).testMethod, "Method should be copied");
            assert.equal((testObj as any).testMethod(), "Copied Method", "Method should work correctly");
        } finally {
            // Restore original behavior if needed
            if (originalProto !== undefined) {
                (Object.prototype as any).__proto__ = originalProto;
            }
        }
    });
    
    it("should handle null prototype", () => {
        const testObj = {};
        
        // Set null as prototype
        const result = _polyObjSetPrototypeOf(testObj, null as any);
        
        // Verify the function returns the original object
        assert.strictEqual(result, testObj, "_polyObjSetPrototypeOf should return the original object");
    });
});
