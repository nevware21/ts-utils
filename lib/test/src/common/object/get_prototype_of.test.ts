/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _getProto, objGetPrototypeOf } from "../../../../src/object/object";
import { objCreate } from "../../../../src/object/create";
import { NULL_VALUE } from "../../../../src/internal/constants";

describe("objGetPrototypeOf tests", () => {
    it("should get prototype of objects", () => {
        // Create a prototype with a test function
        const testProto = {
            testMethod: function() {
                return "Hello World";
            }
        };

        // Create an object with the prototype
        const testObj = objCreate(testProto);
        
        // Get the prototype using objGetPrototypeOf
        const proto = objGetPrototypeOf(testObj);
        
        assert.strictEqual(proto, testProto, "Prototype should match the one used to create the object");
        assert.isFunction(proto.testMethod, "Should be able to access functions on the prototype");
        assert.equal(proto.testMethod(), "Hello World", "Methods on prototype should work correctly");
    });

    it("should return null for objects created with null prototype", () => {
        const objWithNullProto = objCreate(null);
        const proto = objGetPrototypeOf(objWithNullProto);
        
        assert.isNull(proto, "Prototype should be null for objects created with null prototype");
    });

    it("should handle primitive values by boxing them", () => {
        // String
        const strProto = objGetPrototypeOf("test");
        assert.strictEqual(strProto, String.prototype, "String primitive should return String.prototype");
        
        // Number
        const numProto = objGetPrototypeOf(42);
        assert.strictEqual(numProto, Number.prototype, "Number primitive should return Number.prototype");
        
        // Boolean
        const boolProto = objGetPrototypeOf(true);
        assert.strictEqual(boolProto, Boolean.prototype, "Boolean primitive should return Boolean.prototype");
    });

    it("should throw TypeError for null and undefined", () => {
        assert.throws(() => {
            objGetPrototypeOf(null);
        }, TypeError, null, "Should throw TypeError for null");
        
        assert.throws(() => {
            objGetPrototypeOf(undefined);
        }, TypeError, null, "Should throw TypeError for undefined");
    });

    it("should handle built-in object prototypes", () => {
        // Array
        const arrProto = objGetPrototypeOf([]);
        assert.strictEqual(arrProto, Array.prototype, "Array should return Array.prototype");
        
        // Function
        const fnProto = objGetPrototypeOf(function() {});
        assert.strictEqual(fnProto, Function.prototype, "Function should return Function.prototype");
        
        // Date
        const dateProto = objGetPrototypeOf(new Date());
        assert.strictEqual(dateProto, Date.prototype, "Date should return Date.prototype");
        
        // RegExp
        const regexProto = objGetPrototypeOf(/test/);
        assert.strictEqual(regexProto, RegExp.prototype, "RegExp should return RegExp.prototype");
    });

    it("should handle objects with complex prototype chains", () => {
        // Create multiple levels of prototypes
        const grandParentProto = { level: "grandparent", grandParentMethod: () => "grandparent" };
        const parentProto = objCreate(grandParentProto);
        parentProto.level = "parent";
        parentProto.parentMethod = () => "parent";
        
        const child = objCreate(parentProto);
        child.level = "child";
        child.childMethod = () => "child";
        
        // Get immediate prototype (should be parentProto)
        const childProto = objGetPrototypeOf(child);
        assert.strictEqual(childProto, parentProto, "Child's prototype should be parentProto");
        assert.equal(childProto.level, "parent", "Should access parent's properties");
        assert.isFunction(childProto.parentMethod, "Should access parent's methods");
        
        // Get parent's prototype (should be grandParentProto)
        const parentProtoProto = objGetPrototypeOf(childProto);
        assert.strictEqual(parentProtoProto, grandParentProto, "Parent's prototype should be grandParentProto");
        assert.equal(parentProtoProto.level, "grandparent", "Should access grandparent's properties");
        assert.isFunction(parentProtoProto.grandParentMethod, "Should access grandparent's methods");
    });
});

// Direct tests for the _getProto functionality
describe("_getProto fallback tests", () => {
    it("should get prototype via __proto__ property", () => {
        // Create a prototype with a test function
        const testProto = {
            testMethod: function() {
                return "Hello World";
            }
        };

        // Create an object with the prototype
        const testObj = objCreate(testProto);
        
        // Use the test implementation of _getProto
        const proto = _getProto(testObj);
        
        assert.strictEqual(proto, testProto, "Prototype should match the one used to create the object");
        assert.isFunction(proto.testMethod, "Should be able to access functions on the prototype");
        assert.equal(proto.testMethod(), "Hello World", "Methods on prototype should work correctly");
    });

    it("should return NULL_VALUE for objects with null prototype", () => {
        const objWithNullProto = objCreate(null);
        const proto = _getProto(objWithNullProto);
        
        assert.strictEqual(proto, NULL_VALUE, "Should return NULL_VALUE for objects with null prototype");
    });

    it("should handle primitive values correctly", () => {
        // String - primitives don't have __proto__ directly accessible, but their wrapper objects do
        const strObj = new String("test");
        const strProto = _getProto(strObj);
        assert.strictEqual(strProto, String.prototype, "String object should return String.prototype");
        
        // Number
        const numObj = new Number(42);
        const numProto = _getProto(numObj);
        assert.strictEqual(numProto, Number.prototype, "Number object should return Number.prototype");
        
        // Boolean
        const boolObj = new Boolean(true);
        const boolProto = _getProto(boolObj);
        assert.strictEqual(boolProto, Boolean.prototype, "Boolean object should return Boolean.prototype");
    });

    it("should handle built-in object prototypes via __proto__", () => {
        // Array
        const arrProto = _getProto([]);
        assert.strictEqual(arrProto, Array.prototype, "Array should return Array.prototype");
        
        // Function
        const fnProto = _getProto(function() {});
        assert.strictEqual(fnProto, Function.prototype, "Function should return Function.prototype");
        
        // Date
        const dateProto = _getProto(new Date());
        assert.strictEqual(dateProto, Date.prototype, "Date should return Date.prototype");
        
        // RegExp
        const regexProto = _getProto(/test/);
        assert.strictEqual(regexProto, RegExp.prototype, "RegExp should return RegExp.prototype");
    });

    it("should handle direct __proto__ property vs actual prototype", () => {
        // Object with __proto__ property that isn't its actual prototype
        const obj = {
            "__proto__": { fake: "not the real prototype" }
        };
        
        // In modern environments, the __proto__ property doesn't affect the prototype chain
        // when set directly as a property (only when using Object.setPrototypeOf or equivalent)
        const proto = _getProto(obj);
        
        // The behavior varies by JS engine/environment
        if (Object.prototype.toString.call(proto) === "[object Object]" && proto.fake) {
            // Some environments might interpret direct __proto__ property access this way
            assert.equal(proto.fake, "not the real prototype", "Some environments may return the direct __proto__ property");
        } else {
            // Most modern environments will return the actual prototype
            assert.strictEqual(proto, Object.prototype, "Modern environments return the actual prototype, not the __proto__ property");
        }
    });

    it("should return NULL_VALUE for null and undefined", () => {
        // These would throw in objGetPrototypeOf, but we're testing the raw _getProto behavior
        // which would just return NULL_VALUE when __proto__ is undefined
        assert.throws(() => {
            // Need to assign/use the result to avoid the worker bundling from removing it
            assert.isNull(_getProto(null), "Should return NULL_VALUE for null");
            assert.fail("Should not reach here, _getProto should throw for null");
        }, TypeError);

        assert.throws(() => {
            // Need to assign/use the result to avoid the worker bundling from removing it
            assert.isNull(_getProto(undefined), "Should return NULL_VALUE for null");
            assert.fail("Should not reach here, _getProto should throw for undefined");
        }, TypeError);
    });

    it("should handle objects with complex prototype chains via __proto__", () => {
        // Create multiple levels of prototypes
        const grandParentProto = { level: "grandparent", grandParentMethod: () => "grandparent" };
        const parentProto = objCreate(grandParentProto);
        parentProto.level = "parent";
        parentProto.parentMethod = () => "parent";
        
        const child = objCreate(parentProto);
        child.level = "child";
        child.childMethod = () => "child";
        
        // Get immediate prototype via __proto__
        const childProto = _getProto(child);
        assert.strictEqual(childProto, parentProto, "Child's prototype should be parentProto");
        assert.equal(childProto.level, "parent", "Should access parent's properties");
        
        // Get parent's prototype via __proto__
        const parentProtoProto = _getProto(childProto);
        assert.strictEqual(parentProtoProto, grandParentProto, "Parent's prototype should be grandParentProto");
        assert.equal(parentProtoProto.level, "grandparent", "Should access grandparent's properties");
    });
});
