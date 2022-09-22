/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isDate, isError, isObject, isString, isUndefined } from "../../../../src/helpers/base";
import { objForEachKey } from "../../../../src/object/for_each_key";
import { objHasOwnProperty } from "../../../../src/object/has_own_prop";
import { IObjDeepCopyHandlerDetails, objCopyProps, objDeepCopy } from "../../../../src/object/copy";
import { objDeepFreeze, objFreeze, objKeys } from "../../../../src/object/object";
import { objDefineAccessors, objDefineGet } from "../../../../src/object/define";
import { FUNCTION } from "../../../../src/internal/constants";
import { objSetPrototypeOf } from "../../../../src/object/set_proto";
import { objCreate, polyObjCreate } from "../../../../src/object/create";
import { objHasOwn, polyObjHasOwn } from "../../../../src/object/has_own";
import { isPlainObject } from "../../../../src/object/is_plain_object";
import { getWindow } from "../../../../src/helpers/environment";

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

            let c: any = objCopyProps({}, a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
        });

        it("recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            let c: any = objCopyProps({}, a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(!isDate(c.b.d), "The copied date is no longer a real 'Date' instance");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
        });

        it("handler returning false with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            function copyHandler() {
                return false;
            }
    
            let c: any = objCopyProps({}, a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c !== c.b.a, "The root object won't be the same for the target reference as are are copying properties to our target");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(!isDate(c.b.d), "The copied date is no longer a real 'Date' instance");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
        });

        it("handler processing dates with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
                    // Clone the Date object
                    details.value = new Date(details.value.getTime());
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
        });

        it("handler returning the original date with recursive and class properties", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
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

            let c: any = objDeepCopy(a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
        });

        it("recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            let c: any = objDeepCopy(a);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(!isDate(c.b.d), "The copied date is no longer a real 'Date' instance");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.ok(!isError(c.b.e), "The copied error is no longer a real 'Error' instance");
            assert.ok(isObject(c.b.e), "The copied error is now an object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
        });

        it("handler returning false with recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            function copyHandler() {
                return false;
            }

            let c: any = objDeepCopy(a, copyHandler);

            assert.notEqual(a, c, "check a and c are not the same");
            assert.ok(c === c.b.a, "The root object won't be the same for the target reference");
            assert.ok(c.b === c.b.a.b, "Check that the 2 'b' references are the same object");
            assert.ok(c.b.a === c.b.a.b.a, "Check that the 2 'a' references are the same object");
            assert.ok(c.b.d === c.b.a.b.d, "Check that the 2 'd' references are the same object");
            assert.ok(!isDate(c.b.d), "The copied date is no longer a real 'Date' instance");
            assert.ok(isObject(c.b.d), "The copied date is now an object");
            assert.ok(!isError(c.b.e), "The copied error is no longer a real 'Error' instance");
            assert.ok(isObject(c.b.e), "The copied error is now an object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
        });

        it("handler processing Date with recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
                    // Clone the Date object
                    details.value = new Date(details.value.getTime());
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
            assert.ok(!isError(c.b.e), "The copied error is no longer a real 'Error' instance");
            assert.ok(isObject(c.b.e), "The copied error is now an object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
        });

        it("handler returning the original Date with recursive and class properties deep Copy", () => {
            let a: any = { a: 1 };
            let b: any = { b: 2, d: new Date(), e: new TestClass("Hello Darkness") };
            a.b = b;        // { a: 1, b: { b: 2} }
            b.a = a;        // { a: 1, b: { b: 2, a: { a: 1, { b: 2, a: ... }}}}

            function copyHandler(details: IObjDeepCopyHandlerDetails) {
                _checkDetails(details, a);
                if (details.value && isDate(details.value)) {
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
            assert.ok(!isError(c.b.e), "The copied error is no longer a real 'Error' instance");
            assert.ok(isObject(c.b.e), "The copied error is now an object");
            assert.equal(42, c.b.e.value, "Expect that the local property was copied");
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

        assert.equal(typeof details.value, typeof theValue, "Check that the value types are the same")
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
