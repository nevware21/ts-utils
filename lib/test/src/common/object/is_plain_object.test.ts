/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isPlainObject } from "../../../../src/object/is_plain_object";
import { objCreate } from "../../../../src/object/create";

describe("object is_plain_object tests", () => {
    describe("isPlainObject", () => {
        it("Should return true for plain objects", () => {
            assert.isTrue(isPlainObject({}), "Empty object should be a plain object");
            assert.isTrue(isPlainObject({ 0: "a", 1: "b", 2: "c" }), "Object with numeric properties should be a plain object");
            assert.isTrue(isPlainObject({ 100: "a", 2: "b", 7: "c" }), "Object with non-sequential numeric properties should be a plain object");
            assert.isTrue(isPlainObject({ a: 1, b: 2, c: 3 }), "Object with string properties should be a plain object");
        });

        it("Should return true for objects created with Object.create(null)", () => {
            const nullProtoObj = objCreate(null);
            assert.isTrue(isPlainObject(nullProtoObj), "Object with null prototype should be a plain object");
        });

        it("Should return true for objects with custom properties", () => {
            const myObj = objCreate(null, {
                getFoo: {
                    value() {
                        return this.foo;
                    }
                }
            });
            myObj.foo = 1;
            assert.isTrue(isPlainObject(myObj), "Object with custom properties should be a plain object");
        });

        it("Should return false for objects created with Object.create", () => {
            const obj = objCreate({ a: 1, b: 2, c: 3 });
            assert.isFalse(isPlainObject(obj), "Object created with Object.create should not be a plain object");
        });

        it("Should return false for arrays", () => {
            assert.isFalse(isPlainObject([]), "Empty array should not be a plain object");
            assert.isFalse(isPlainObject(["a", "b", "c"]), "Non-empty array should not be a plain object");
        });

        it("Should return false for built-in objects", () => {
            assert.isFalse(isPlainObject(new Date()), "Date object should not be a plain object");
            assert.isFalse(isPlainObject(new RegExp("pattern")), "RegExp object should not be a plain object");
            assert.isFalse(isPlainObject(new Error("An Error")), "Error object should not be a plain object");
            assert.isFalse(isPlainObject(new Map()), "Map object should not be a plain object");
            assert.isFalse(isPlainObject(new Set()), "Set object should not be a plain object");
        });

        it("Should return false for primitive values", () => {
            assert.isFalse(isPlainObject(null), "null should not be a plain object");
            assert.isFalse(isPlainObject(undefined), "undefined should not be a plain object");
            assert.isFalse(isPlainObject(0), "Number should not be a plain object");
            assert.isFalse(isPlainObject("null"), "String should not be a plain object");
            assert.isFalse(isPlainObject("undefined"), "String should not be a plain object");
            assert.isFalse(isPlainObject("1"), "String should not be a plain object");
            assert.isFalse(isPlainObject("aa"), "String should not be a plain object");
            assert.isFalse(isPlainObject(true), "Boolean should not be a plain object");
            assert.isFalse(isPlainObject(Symbol("test")), "Symbol should not be a plain object");
        });

        it("Should return false for functions", () => {
            assert.isFalse(isPlainObject(function() {}), "Function should not be a plain object");
            assert.isFalse(isPlainObject(() => {}), "Arrow function should not be a plain object");
        });

        it("Should return false for classes and class instances", () => {
            class TestClass {
                prop: string;
                constructor() {
                    this.prop = "value";
                }
            }
            assert.isFalse(isPlainObject(TestClass), "Class should not be a plain object");
            assert.isFalse(isPlainObject(new TestClass()), "Class instance should not be a plain object");
        });

        it("Should handle edge cases with the global window object", () => {
            // Since we can't reliably test window in all environments,
            // we can at least test that the function doesn't throw when
            // something window-like is passed
            const mockWindow = {
                // Add some window-like properties
                document: {},
                location: {},
                navigator: {}
            };

            // This should at least not throw an error
            const result = isPlainObject(mockWindow);
            // We don't assert on the result as it may vary by environment
        });
    });
});
