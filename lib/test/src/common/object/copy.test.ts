/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objCopyProps, objDeepCopy } from "../../../../src/object/copy";
import { isDate } from "../../../../src/helpers/base";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { objExtend } from "../../../../src/helpers/extend";
import { getGlobal } from "../../../../src/helpers/environment";

/**
 * Helper function to check if an array contains a deep equal item
 * @param haystack - The array to search in
 * @param needle - The item to search for
 * @returns True if the item is found, false otherwise
 */
function _deepIncludesArray(haystack: any[], needle: any[]): boolean {
    for (let i = 0; i < haystack.length; i++) {
        const item = haystack[i];
        if (item.length === needle.length) {
            let allEqual = true;
            for (let j = 0; j < item.length; j++) {
                if (item[j] !== needle[j]) {
                    allEqual = false;
                    break;
                }
            }
            if (allEqual) {
                return true;
            }
        }
    }
    return false;
}

describe("object copy functions", () => {
    describe("objCopyProps", () => {
        it("should copy basic properties", () => {
            let source = { a: 1, b: "hello", c: true };
            let target = {};
            
            let result = objCopyProps(target, source);
            
            assert.deepEqual(result, source);
            assert.equal(result, target, "Should return the target object");
        });

        it("should handle null or undefined source", () => {
            let target = { existing: true };
            
            let result1 = objCopyProps(target, null);
            assert.deepEqual(result1, target);
            
            let result2 = objCopyProps(target, undefined);
            assert.deepEqual(result2, target);
        });

        it("should handle nested objects", () => {
            let source = {
                a: 1,
                b: {
                    c: 2,
                    d: {
                        e: 3
                    }
                }
            };
            let target = {};
            
            let result = objCopyProps(target, source);
            
            assert.deepEqual(result, source);
            assert.notEqual(result.b, source.b, "Nested objects should be copied by value, not reference");
            assert.notEqual(result.b.d, source.b.d, "Deep nested objects should be copied by value");
        });

        it("should handle arrays", () => {
            let source = { arr: [1, 2, { nested: "value" }] };
            let target = {};
            
            let result = objCopyProps(target, source);
            
            assert.deepEqual(result, source);
            assert.notEqual(result.arr, source.arr, "Arrays should be copied by value");
            assert.notEqual(result.arr[2], source.arr[2], "Objects in arrays should be copied by value");
        });

        it("should handle date objects", () => {
            const testDate = new Date();
            let source = { date: testDate };
            let target = {};
            
            let result = objCopyProps(target, source);
            
            assert.notEqual(result.date, testDate, "Date objects should be copied by value");
            assert.isTrue(isDate(result.date), "Copied value should still be a Date");
            assert.equal(result.date.getTime(), testDate.getTime(), "Date values should be the same");
        });

        it("should handle recursive objects", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2 };
            a.b = b;
            b.a = a;
            
            let target = {};
            let result: any = objCopyProps(target, a);
            
            assert.equal(result.a, 1);
            assert.equal(result.b.b, 2);
            assert.deepStrictEqual(result.b.a, result, "Recursive references should be maintained");
        });

        it("should use custom handlers when provided", () => {
            let source = {
                a: 1,
                b: new Date(),
                c: [1, 2, 3]
            };
            
            let customHandlerCalls = 0;
            
            function customHandler(details: any): boolean {
                customHandlerCalls++;
                if (isDate(details.value)) {
                    // Convert date to timestamp
                    details.result = details.value.getTime();
                    return true;
                }
                return false;
            }
            
            let target = {};
            let result: any = objCopyProps(target, source, customHandler);
            
            assert.isTrue(customHandlerCalls > 0, "Custom handler should have been called");
            assert.equal(result.a, 1);
            assert.isNumber(result.b, "Date should have been converted to number");
            assert.equal(result.b, source.b.getTime(), "Date should be converted to timestamp");
            assert.isArray(result.c, "Array should still be an array");
        });
    });

    describe("objDeepCopy", () => {
        it("should create a deep copy of an object", () => {
            let source = {
                a: 1,
                b: {
                    c: 2,
                    d: {
                        e: 3
                    }
                },
                f: [1, 2, { g: 4 }]
            };
            
            let result = objDeepCopy(source);
            
            assert.deepEqual(result, source);
            assert.notEqual(result, source);
            assert.notEqual(result.b, source.b);
            assert.notEqual(result.b.d, source.b.d);
            assert.notEqual(result.f, source.f);
            assert.notEqual(result.f[2], source.f[2]);
        });

        it("should handle primitive values", () => {
            assert.equal(objDeepCopy(1), 1);
            assert.equal(objDeepCopy("hello"), "hello");
            assert.equal(objDeepCopy(true), true);
            assert.equal(objDeepCopy(null), null);
            assert.equal(objDeepCopy(undefined), undefined);
        });

        it("should handle recursive objects", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2 };
            a.b = b;
            b.a = a;
            
            let result: any = objDeepCopy(a);
            
            assert.equal(result.a, 1);
            assert.equal(result.b.b, 2);
            assert.strictEqual(result.b.a, result, "Should maintain recursive references");
        });
        
        it("should copy functions", () => {
            function testFn(x: number) {
                return x * 2;
            }
            let source = { fn: testFn };
            
            let result: any = objDeepCopy(source);
            
            assert.isFunction(result.fn);
            assert.equal(result.fn, testFn, "Function should be copied");
            assert.equal(result.fn(5), 10, "Function behavior should be preserved");
        });

        it("should use custom handlers", () => {
            let source = {
                a: 1,
                b: new Date(),
                c: [1, 2, 3]
            };
            
            function customHandler(details: any): boolean {
                if (isDate(details.value)) {
                    details.result = "Date: " + details.value.toISOString();
                    return true;
                }
                return false;
            }
            
            let result: any = objDeepCopy(source, customHandler);
            
            assert.equal(result.a, 1);
            assert.isString(result.b, "Date should be converted to string");
            assert.isTrue(result.b.startsWith("Date: "), "Date format should be as specified");
            assert.isArray(result.c, "Array should still be an array");
        });

        it("should copy path information to handler details", () => {
            let source = {
                a: {
                    b: {
                        c: "test"
                    }
                }
            };
            
            let paths: Array<Array<string | number | symbol>> = [];
            
            function pathTrackingHandler(details: any): boolean {
                paths.push(details.path);
                return false; // Let the default handlers do the work
            }
            let cpy = objDeepCopy(source, pathTrackingHandler);
            
            assert.notStrictEqual(cpy, source, "Should be a different object");
            assert.isTrue(paths.length > 0, "Handler should have been called - " + dumpObj(paths));
            assert.isTrue(_deepIncludesArray(paths, ["a"]), "Path should include ['a'] - " + dumpObj(paths));
            assert.isTrue(_deepIncludesArray(paths, ["a", "b"]), "Path should include ['a', 'b'] - " + dumpObj(paths));
            assert.isTrue(_deepIncludesArray(paths, ["a", "b", "c"]), "Path should include ['a', 'b', 'c'] - " + dumpObj(paths));
        });
    });    describe("Copy handlers via objDeepCopy", () => {
        it("should copy arrays", () => {
            let source = [1, 2, 3];
            let result = objDeepCopy(source);
            
            assert.isArray(result, "Result should be an array");
            assert.deepEqual(result, source, "Array elements should be copied");
            assert.notEqual(result, source, "Should be a new array instance");
            
            // Test with nested arrays
            let nestedSource = [1, [2, 3], 4];
            let nestedResult = objDeepCopy(nestedSource);
            
            assert.isArray(nestedResult, "Result should be an array");
            assert.deepEqual(nestedResult, nestedSource, "Nested array elements should be copied");
            assert.notEqual(nestedResult, nestedSource, "Should be a new array instance");
            assert.notEqual(nestedResult[1], nestedSource[1], "Nested array should be a new instance");
        });
        
        it("should copy plain objects", () => {
            let source = { a: 1, b: 2 };
            let result = objDeepCopy(source);
            
            assert.isObject(result, "Result should be an object");
            assert.deepEqual(result, source, "Object properties should be copied");
            assert.notEqual(result, source, "Should be a new object instance");
            
            // Test with nested objects
            let nestedSource = { a: 1, b: { c: 2, d: 3 } };
            let nestedResult = objDeepCopy(nestedSource);
            
            assert.isObject(nestedResult, "Result should be an object");
            assert.deepEqual(nestedResult, nestedSource, "Nested object properties should be copied");
            assert.notEqual(nestedResult, nestedSource, "Should be a new object instance");
            assert.notEqual(nestedResult.b, nestedSource.b, "Nested object should be a new instance");
        });
        
        it("should copy dates", () => {
            const testDate = new Date();
            let source = testDate;
            let result = objDeepCopy(source);
            
            assert.isTrue(isDate(result), "Result should be a Date");
            assert.notEqual(result, source, "Should be a new Date object");
            assert.equal(result.getTime(), source.getTime(), "Date values should be the same");
            
            // Test date within an object
            let dateObj = { created: testDate, updated: new Date(testDate.getTime() + 1000) };
            let dateObjResult = objDeepCopy(dateObj);
            
            assert.isTrue(isDate(dateObjResult.created), "Created should be a Date");
            assert.isTrue(isDate(dateObjResult.updated), "Updated should be a Date");
            assert.notEqual(dateObjResult.created, dateObj.created, "Created should be a new Date object");
            assert.notEqual(dateObjResult.updated, dateObj.updated, "Updated should be a new Date object");
            assert.equal(dateObjResult.created.getTime(), dateObj.created.getTime(), "Created date value should be the same");
            assert.equal(dateObjResult.updated.getTime(), dateObj.updated.getTime(), "Updated date value should be the same");
        });
        
        it("should copy functions", () => {
            function testFn(x: number) {
                return x * 2;
            }
            let source = { fn: testFn };
            let result = objDeepCopy(source);
            
            assert.isFunction(result.fn, "Result should be a function");
            // Since we're testing via objDeepCopy, the function will likely be a reference to the original
            // This is the default behavior for most deep copy implementations including the one in this library
            assert.equal(result.fn(5), 10, "Function behavior should be preserved");
        });
    });

    describe("Default handler behavior", () => {
        it("should handle custom object types not covered by standard handlers, by copying the reference", () => {
            // Create a custom object that doesn't match any of the specific handlers
            function TestClass(this: any, name: string) {
                this.name = name;
                this.value = 42;
                this.getMessage = function() {
                    return "Hello " + this.name;
                };
            }
            
            const customObj = new (TestClass as any)("World");
            const result = objDeepCopy(customObj);
            
            // The default handler should create a plain object copy
            assert.equal(result, customObj, "Should be the same object");
            assert.isObject(result, "Should be an object");
            assert.equal(result.name, "World", "Should copy primitive properties");
            assert.equal(result.value, 42, "Should copy primitive properties");
            assert.isFunction(result.getMessage, "Should copy function properties");
            assert.equal(result.getMessage(), "Hello World", "Functions should work");
        });

        it("should handle null or undefined values", () => {
            const result1 = objDeepCopy(null);
            const result2 = objDeepCopy(undefined);
            
            assert.isNull(result1, "Should handle null values");
            assert.isUndefined(result2, "Should handle undefined values");
        });

        it("should handle objects with custom or null prototypes", () => {
            // Create an object with null prototype
            const nullProtoObj = Object.create(null);
            nullProtoObj.a = 1;
            nullProtoObj.b = "test";
            
            const result = objDeepCopy(nullProtoObj);
            
            assert.notEqual(result, nullProtoObj, "Should be a different object");
            assert.equal(result.a, 1, "Should copy primitive properties");
            assert.equal(result.b, "test", "Should copy primitive properties");
        });

        it("should handle mixed complex objects with various types", () => {
            // Create a complex object with various types that would trigger different handlers
            const complexObj: any = {
                string: "hello",
                number: 42,
                bool: true,
                date: new Date(),
                array: [1, 2, 3],
                nested: {
                    a: 1,
                    b: "test"
                },
                func: function(x: number) {
                    return x * 2;
                },
                // Custom type
                custom: function CustomType(this: any) {
                    this.value = "custom";
                }
            };
            
            // Add a custom object instance
            complexObj.customInstance = new (complexObj.custom)();
            
            const result: any = objDeepCopy(complexObj);
            
            assert.notEqual(result, complexObj, "Should be a different object");
            assert.equal(result.string, "hello", "Should copy string");
            assert.equal(result.number, 42, "Should copy number");
            assert.equal(result.bool, true, "Should copy boolean");
            
            // Date should be copied via dateDeepCopyHandler
            assert.notEqual(result.date, complexObj.date, "Date should be a new instance");
            assert.isTrue(isDate(result.date), "Date should still be a Date");
            assert.equal(result.date.getTime(), complexObj.date.getTime(), "Date should have the same time");
            
            // Array should be copied via arrayDeepCopyHandler
            assert.notEqual(result.array, complexObj.array, "Array should be a new instance");
            assert.isArray(result.array, "Array should still be an array");
            assert.deepEqual(result.array, complexObj.array, "Array should have the same elements");
            
            // Nested object should be copied via plainObjDeepCopyHandler
            assert.notEqual(result.nested, complexObj.nested, "Nested object should be a new instance");
            assert.equal(result.nested.a, 1, "Nested object should have the same properties");
            assert.equal(result.nested.b, "test", "Nested object should have the same properties");
            
            // Function should be copied via functionDeepCopyHandler
            assert.isFunction(result.func, "Should copy functions");
            assert.equal(result.func(5), 10, "Function should have the same behavior");
            
            // Custom function should be copied directly
            assert.isFunction(result.custom, "Should copy custom constructor function");
            
            // Custom instance should be copied via the default handler
            // (since none of the specific handlers would handle it)
            assert.isObject(result.customInstance, "Custom instance should be copied as an object");
            assert.equal(result.customInstance.value, "custom", "Custom instance should have the same properties");
        });
    });
});

describe("objCopyProps and objDeepCopy behaviors", () => {
    const POLLUTED = "tsUtilsPollutedTestValue";

    afterEach(() => {
        delete (Object.prototype as any)[POLLUTED];
    });

    it("should not change a built-in prototype target", () => {
        const source: any = {};
        source[POLLUTED] = 1;

        assert.equal(objCopyProps(Object.prototype, source), Object.prototype, "The target is returned");
        assert.equal(({} as any)[POLLUTED], undefined, "objCopyProps did not change Object.prototype");

        objExtend(Object.prototype, source);
        assert.equal(({} as any)[POLLUTED], undefined, "objExtend did not change Object.prototype");
    });

    it("should still copy to the prototype of a class", () => {
        function TestClass() { }
        objCopyProps(TestClass.prototype, { value: 21 });

        assert.equal(new (TestClass as any)().value, 21);
    });

    it("should only copy own enumerable properties", () => {
        const source = Object.create({ inherited: 1 });
        source.own = 2;

        assert.deepEqual(objCopyProps({}, source), { own: 2 });
        assert.deepEqual(objExtend({}, source), { own: 2 });
    });

    it("should not copy properties named constructor or prototype", () => {
        assert.deepEqual(objDeepCopy<any>({ constructor: "Acme", prototype: 1, a: 2 }), { a: 2 });
    });

    it("should copy primitive values without a handler", () => {
        const source = { a: 1, b: "two", c: true, d: null as any, e: undefined as any };
        const result = objDeepCopy(source);

        assert.deepEqual(result, source);
        assert.ok(result !== source, "A new object is returned");
        assert.equal(objDeepCopy(21), 21);
        assert.equal(objDeepCopy(null), null);
    });

    it("should still call a handler for primitive values", () => {
        const result = objDeepCopy({ a: 1, b: 2 }, (details) => {
            if (details.isPrim && details.value === 1) {
                details.result = 42;
                return true;
            }

            return false;
        });

        assert.deepEqual(result, { a: 42, b: 2 });
    });

    function _paths(source: any) {
        const paths: string[] = [];
        objDeepCopy(source, (details) => {
            paths.push(JSON.stringify(details.path));
            return false;
        });

        return paths;
    }

    it("should include an empty string key in the path", () => {
        const source: any = { y: { z: 2 } };
        source[""] = { x: 1 };

        const paths = _paths(source);
        assert.ok(paths.indexOf("[\"\"]") !== -1, "The empty key is in the path: " + paths.join(" "));
        assert.ok(paths.indexOf("[\"\",\"x\"]") !== -1, "A child of the empty key is in the path: " + paths.join(" "));
    });

    it("should include a key of 0 passed to the handlers copy function", () => {
        const paths: string[] = [];
        objDeepCopy({ a: 1 }, (details) => {
            paths.push(JSON.stringify(details.path));
            if (details.path.length === 0) {
                details.result = details.copy(details.value.a, 0);
                return true;
            }

            return false;
        });

        assert.ok(paths.indexOf("[0]") !== -1, "The key is in the path: " + paths.join(" "));
    });

    function _checkReferences() {
        const shared = { value: 1 };
        const source: any = { first: shared, second: shared };
        source.self = source;

        const result = objDeepCopy(source);

        return {
            selfIsResult: result.self === result,
            sameCopy: result.first === result.second,
            notSource: result.first !== shared,
            value: result.first.value
        };
    }

    const expectedReferences = { selfIsResult: true, sameCopy: true, notSource: true, value: 1 };

    it("should retain recursive and shared references", () => {
        assert.deepEqual(_checkReferences(), expectedReferences);
    });

    it("should retain recursive and shared references without a native Map", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        let result: any;

        theGlobal.Map = undefined;
        try {
            result = _checkReferences();
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(result, expectedReferences);
    });

    it("should copy a large array of objects", () => {
        const source: any[] = [];
        for (let lp = 0; lp < 5000; lp++) {
            source.push({ id: lp });
        }

        const result = objDeepCopy(source);

        assert.equal(result.length, 5000);
        assert.equal(result[4999].id, 4999);
        assert.ok(result[0] !== source[0], "The entries are copied");
    });
});
