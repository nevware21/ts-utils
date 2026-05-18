/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objForEachKey } from "../../../../src/object/for_each_key";

describe("object for_each_key tests", () => {
    describe("objForEachKey", () => {
        it("should iterate over all own enumerable keys of an object", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const visitedKeys: string[] = [];
            const values: number[] = [];

            objForEachKey(obj, (key, value) => {
                visitedKeys.push(key);
                values.push(value as number);
            });

            assert.deepEqual(visitedKeys.sort(), ["a", "b", "c"], "Should visit all keys");
            assert.deepEqual(values.sort(), [1, 2, 3], "Should pass the correct values");
        });

        it("should use the provided thisArg", () => {
            const obj = { a: 1, b: 2 };
            const thisObj = { test: "context" };
            let actualThis: any;

            objForEachKey(obj, function(this: any) {
                actualThis = this;
            }, thisObj);

            assert.strictEqual(actualThis, thisObj, "Should use the provided thisArg");
        });

        it("should use the object as this when thisArg is omitted, undefined, or null", () => {
            const obj = { a: 1 };
            let capturedThis: any;

            // omitted thisArg → falls back to the object
            objForEachKey(obj, function(this: any) {
                capturedThis = this;
            });
            assert.strictEqual(capturedThis, obj, "omitting thisArg should use the object as this");

            // explicit undefined → same as omitted
            objForEachKey(obj, function(this: any) {
                capturedThis = this;
            }, undefined);
            assert.strictEqual(capturedThis, obj, "explicit undefined thisArg should use the object as this");

            // null → same as undefined, falls back to object
            objForEachKey(obj, function(this: any) {
                capturedThis = this;
            }, null);
            assert.strictEqual(capturedThis, obj, "null thisArg should use the object as this");
        });

        it("should use falsy-but-not-null/undefined thisArg values as-is", () => {
            const obj = { a: 1 };
            let capturedThis: any;

            objForEachKey(obj, function(this: any) {
                capturedThis = this;
            }, 0);
            assert.strictEqual(capturedThis, 0, "thisArg of 0 should be used as-is");

            objForEachKey(obj, function(this: any) {
                capturedThis = this;
            }, "");
            assert.strictEqual(capturedThis, "", "thisArg of empty string should be used as-is");

            objForEachKey(obj, function(this: any) {
                capturedThis = this;
            }, false);
            assert.strictEqual(capturedThis, false, "thisArg of false should be used as-is");
        });

        it("should break iteration when callback returns -1", () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            const visitedKeys: string[] = [];

            objForEachKey(obj, (key) => {
                visitedKeys.push(key);
                if (key === "b") {
                    return -1;
                }
            });

            // We can't guarantee the order of object properties in all JS implementations,
            // so we need to account for different scenarios
            assert.isTrue(
                visitedKeys.length <= 2,
                "Should stop iteration when callback returns -1"
            );
            assert.isFalse(
                visitedKeys.includes("c") || visitedKeys.includes("d"),
                "Should not visit keys after returning -1"
            );
        });

        it("should only iterate over own properties", () => {
            const parent = { parentProp: "value" };
            const child = Object.create(parent);
            child.childProp = "child value";
            
            const visitedKeys: string[] = [];
            
            objForEachKey(child, (key) => {
                visitedKeys.push(key);
            });

            assert.deepEqual(visitedKeys, ["childProp"], "Should only visit own properties");
        });

        it("should skip non-enumerable properties", () => {
            const obj = { enumProp: "value" };
            Object.defineProperty(obj, "nonEnumProp", {
                value: "hidden",
                enumerable: false
            });
            
            const visitedKeys: string[] = [];
            
            objForEachKey(obj, (key) => {
                visitedKeys.push(key);
            });

            assert.deepEqual(visitedKeys, ["enumProp"], "Should only visit enumerable properties");
        });

        it("should handle null or undefined objects", () => {
            let callCount = 0;
            
            objForEachKey(null, () => {
                callCount++;
            });
            
            objForEachKey(undefined, () => {
                callCount++;
            });

            assert.equal(callCount, 0, "Should not call callback for null or undefined objects");
        });

        it("should handle non-object values", () => {
            let callCount = 0;
            
            objForEachKey(42 as any, () => {
                callCount++;
            });
            
            objForEachKey("string" as any, () => {
                callCount++;
            });

            assert.equal(callCount, 0, "Should not call callback for non-object values");
        });

        it("should work with complex objects", () => {
            const complexObj = {
                num: 42,
                str: "hello",
                bool: true,
                arr: [1, 2, 3],
                nested: { a: 1, b: 2 },
                func: function() {
                    return "test";
                }
            };
            
            const keys: string[] = [];
            
            objForEachKey(complexObj, (key) => {
                keys.push(key);
            });

            assert.equal(keys.length, 6, "Should iterate over all keys in a complex object");
            assert.includeMembers(keys, ["num", "str", "bool", "arr", "nested", "func"],
                "Should include all expected keys");
        });

        it("should work with empty objects", () => {
            const emptyObj = {};
            let callCount = 0;
            
            objForEachKey(emptyObj, () => {
                callCount++;
            });

            assert.equal(callCount, 0, "Should not call callback for empty objects");
        });
    });
});
