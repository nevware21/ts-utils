/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isDate, isError, isObject } from "../../../../src/helpers/base";
import { arrayDeepCopyHandler, IObjDeepCopyHandlerDetails, objCopyProps, objDeepCopy, plainObjDeepCopyHandler } from "../../../../src/object/copy";
import { arrForEach } from "../../../../src/array/forEach";
import { isPlainObject } from "../../../../src/object/is_plain_object";

describe("object copy helpers", () => {
    describe("objCopyProps", () => {
        it("null / undefined", () => {
            assert.equal(undefined, objCopyProps(undefined, undefined), "undefined");
            assert.equal(null, objCopyProps(null, null), "null");
            assert.equal(undefined, objCopyProps(undefined, null), "undefined with null");
            assert.equal(null, objCopyProps(null, undefined), "null with undefined");
            assert.equal("{}", JSON.stringify(objCopyProps({}, null)), "");
            assert.equal("{}", JSON.stringify(objCopyProps({}, undefined)), "");
        });
    
        it("simple objects", () => {
            _checkCopy("{}", objCopyProps({}, {}));
            _checkCopy("{\"a\":1,\"b\":2}", objCopyProps({ a: 1}, { b: 2}));
        });

        it("duplication properties", () => {
            _checkCopy("{\"a\":2,\"b\":2}", objCopyProps({ a: 1}, { a:2, b: 2}));
        });

        it("recursive properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2 };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            let c: any = objCopyProps({}, a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });

        it("recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            let c: any = objCopyProps({}, a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is no longer a real 'Date' instance");
            assert.ok(a.b.d !== c.b.d, "The Date was copied correctly");
            assert.ok(a.b.d.getTime() === c.b.d.getTime(), "The Date was copied correctly and has the same value");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });

        it("handler returning false with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            function copyHandler() {
                return false;
            }
    
            let c: any = objCopyProps({}, a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is no longer a real 'Date' instance");
            assert.ok(a.b.d !== c.b.d, "The Date was copied correctly");
            assert.ok(a.b.d.getTime() === c.b.d.getTime(), "The Date was copied correctly and has the same value");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });

        it("handler always processing dates with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
                    // Clone the Date object
                    details.result = new Date(details.value.getTime());
                    return true;
                }

                if (!details.isPrim && details.type !== "function") {
                    if (arrayDeepCopyHandler(details) || plainObjDeepCopyHandler(details)) {
                        // handled
                        return true;
                    }
                }

                // Just keep the existing reference
                return true;
            }
    
            let c: any = objCopyProps({}, a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
            assert.ok(c.b.d !== a.b.d, "And the copied date is not the same as the original");
            assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });

        it("handler processing dates with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
                    // Clone the Date object
                    details.result = new Date(details.value.getTime());
                    return true;
                }

                return false;
            }
    
            let c: any = objCopyProps({}, a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
            assert.notEqual(c.b.d, a.b.d, "And the copied date is not the same as the original");
            assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");

            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });

        it("handler returning the original date with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.result && isDate(details.value)) {
                    return true;
                }

                return false;
            }
    
            let c: any = objCopyProps({}, a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
            assert.equal(c.b.d, a.b.d, "And the copied date is the original date");
            assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");

            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });
    });

    describe("objDeepCopy", () => {
        it("null / undefined", () => {
            assert.equal(undefined, objDeepCopy(undefined), "undefined");
            assert.equal(null, objDeepCopy(null), "null");
        });
    
        it("simple objects", () => {
            _checkCopy("{}", objDeepCopy({}));
            _checkCopy("{\"a\":1,\"b\":2}", objDeepCopy({ a: 1, b: 2}));
        });

        it("recursive deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2 };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            let c: any = objDeepCopy(a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
        });

        it("recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness"), o: { "my": "old friend" } };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            let c: any = objDeepCopy(a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still a real 'Date' instance");
            assert.notEqual(a.b.d, c.b.d, "The copied date is not the same as the original date");
            assert.equal(a.b.d.getTime(), c.b.d.getTime(), "The copied date has the same value as the original date");
            assert.ok(c.b.e === a.b.e, "Should still be the same instance");
            assert.ok(isError(c.b.e), "The copied error is still the original 'Error' instance");
            assert.ok(!isPlainObject(c.b.e), "The copied error is not a plain object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
            assert.ok(isPlainObject(c.b.o), "The copied is now an object");
            assert.ok(c.b.o !== a.b.o, "The copied object should not be the same instance");
            assert.deepEqual(c.b.o, a.b.o, "Objects should be the same");
        });

        it("handler returning false with recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness"), o: { "my": "old friend" } };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            function copyHandler() {
                return false;
            }

            let c: any = objDeepCopy(a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still a real 'Date' instance");
            assert.notEqual(a.b.d, c.b.d, "The copied date is not the same as the original date");
            assert.equal(a.b.d.getTime(), c.b.d.getTime(), "The copied date has the same value as the original date");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.ok(c.b.e === a.b.e, "Should still be the same instance");
            assert.ok(isError(c.b.e), "The copied error is still the original 'Error' instance");
            assert.ok(!isPlainObject(c.b.e), "The copied error is not a plain object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
            assert.ok(isPlainObject(c.b.o), "The copied is now an object");
            assert.ok(c.b.o !== a.b.o, "The copied object should not be the same instance");
            assert.deepEqual(c.b.o, a.b.o, "Objects should be the same");
        });

        it("handler processing Date with recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness"), o: { "my": "old friend" } };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
                    // Clone the Date object
                    details.result = new Date(details.value.getTime());
                    return true;
                }

                return false;
            }
            
            let c: any = objDeepCopy(a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
            assert.notEqual(c.b.d, a.b.d, "And the copied date is not the same as the original");
            assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.ok(c.b.e === a.b.e, "Should still be the same instance");
            assert.ok(isError(c.b.e), "The copied error is still the original 'Error' instance");
            assert.ok(!isPlainObject(c.b.e), "The copied error is not a plain object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
            assert.ok(isPlainObject(c.b.o), "The copied is now an object");
            assert.ok(c.b.o !== a.b.o, "The copied object should not be the same instance");
            assert.deepEqual(c.b.o, a.b.o, "Objects should be the same");
        });

        it("handler returning the original Date with recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness"), o: { "my": "old friend" } };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}
            a.b.f = function testFunc() {};
            a.b.arr = [];
            a.b.arr.length = 3;
            a.b.arr[1] = 42;
            a.b.arr["Hello"] = "Darkness";

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.result && isDate(details.value)) {
                    return true;
                }

                return false;
            }
            
            let c: any = objDeepCopy(a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(isDate(c.b.d), "The copied date is still real 'Date' instance");
            assert.equal(c.b.d, a.b.d, "And the copied date is the original date");
            assert.equal(c.b.d.getTime(), a.b.d.getTime(), "But the dates are the same");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.ok(c.b.e === a.b.e, "Should still be the same instance");
            assert.ok(isError(c.b.e), "The copied error is still the original 'Error' instance");
            assert.ok(!isPlainObject(c.b.e), "The copied error is not a plain object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
            assert.equal(c.b.f, a.b.f, "Functions should be the same");
            assert.ok(isPlainObject(c.b.o), "The copied is now an object");
            assert.ok(c.b.o !== a.b.o, "The copied object should not be the same instance");
            assert.deepEqual(c.b.o, a.b.o, "Objects should be the same");
            
            // Check incomplete array and with non-indexed property
            assert.notEqual(a.b.arr, c.b.arr, "The array objects should not be the same");
            assert.equal(a.b.arr.length, c.b.arr.length, "Check the copied length");
            arrForEach(a.b.arr, (value, idx) => {
                assert.equal(c.b.arr[idx], value, "Checking [" + idx + "] value");
            });

            assert.equal(a.b.arr["Hello"], c.b.arr["Hello"], "Checking that the non-indexed value was copied");
        });
    });

    function _checkCopy(expected: string, target: any) {
        assert.equal(expected, JSON.stringify(target), dumpObj(target));
    }

    function _checkDetails(details: IObjDeepCopyHandlerDetails, origin: any) {
        assert.equal(origin, details.origin, "Ensure that the original source is always reported");

        // Follow the path to find the current value
        let theValue = origin;
        for (let lp = 0; lp < details.path.length; lp++) {
            theValue = theValue[details.path[lp]];
        }

        assert.equal(typeof details.value, typeof theValue, "Check that the value types are the same -> " + dumpObj(details.path));
        assert.equal(details.value, theValue, "Check that the actual values are the same");
    }

    class TestClass extends Error {
        public value: number;

        public constructor(message: string) {
            super(message);
            this.value = 42;
        }
    }

});
