import { assert } from "chai";
import { hasValue } from "../../../../src/helpers/value";


describe("value helpers", () => {

    describe("hasValue", () => {
        it("Validate values", () => {
            assert.equal(hasValue(null), false, "Checking null");
            assert.equal(hasValue(undefined), false, "Checking undefined");
            assert.equal(hasValue("null"), true, "Checking 'null'");
            assert.equal(hasValue("undefined"), false, "Checking 'undefined'");
            assert.equal(hasValue("0"), true, "Checking '0'");
            assert.equal(hasValue("1"), true, "Checking '1'");
            assert.equal(hasValue("aa"), true, "Checking 'aa'");
            assert.equal(hasValue(new Date()), true, "Checking Date");
            assert.equal(hasValue(0), true, "Checking 0");
            assert.equal(hasValue(1), true, "Checking 1");
            assert.equal(hasValue(""), false, "Checking ''");
            assert.equal(hasValue(_dummyFunction), true, "Checking _dummyFunction");
            assert.equal(hasValue([]), false, "Checking []");
            assert.equal(hasValue(["A"]), true, "Checking ['A']");
            assert.equal(hasValue([0]), true, "Checking [0]");
            assert.equal(hasValue([false]), true, "Checking [false]");
            assert.equal(hasValue(new Array(1)), true, "Checking new Array(1)");
            assert.equal(hasValue(true), true, "Checking true");
            assert.equal(hasValue(false), true, "Checking false");
            assert.equal(hasValue("true"), true, "Checking 'true'");
            assert.equal(hasValue("false"), true, "Checking 'false'");

            assert.equal(hasValue(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(hasValue((/[a-z]/g).exec("hello")), true, "Checking '(/[a-z]/g').exec('hello')");
            assert.equal(hasValue(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(hasValue(new ArrayBuffer(0)), false, "Checking new ArrayBuffer(0)");
            assert.equal(hasValue(new ArrayBuffer(1)), true, "Checking new ArrayBuffer(1)");
            assert.equal(hasValue(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(hasValue(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(hasValue(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(hasValue(_dummyError()), true, "Checking dummy error (object that looks like an error)");
            assert.equal(hasValue(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(hasValue(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(hasValue(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(hasValue(_simplePromise()), true, "Checking _simplePromise");
            assert.equal(hasValue(_simplePromiseLike()), true, "Checking _simplePromiseLike");

            // Test Boolean objects
            assert.equal(hasValue(new Boolean(true)), true, "Checking new Boolean(true)");
            assert.equal(hasValue(new Boolean(false)), true, "Checking new Boolean(false)");
            assert.equal(hasValue(new Boolean("true")), true, "Checking new Boolean('true')");
            assert.equal(hasValue(new Boolean("false")), true, "Checking new Boolean('false')");
            assert.equal(hasValue(new Boolean("0")), true, "Checking new Boolean('0')");
            assert.equal(hasValue(new Boolean(0)), true, "Checking new Boolean(0)");
            assert.equal(hasValue(new Boolean("1")), true, "Checking new Boolean('1')");
            assert.equal(hasValue(new Boolean(1)), true, "Checking new Boolean(1)");
            
            // test Boolean values
            assert.equal(hasValue(Boolean(true)), true, "Checking Boolean(true)");
            assert.equal(hasValue(Boolean(false)), true, "Checking Boolean(false)");
            assert.equal(hasValue(Boolean("true")), true, "Checking Boolean('true')");
            assert.equal(hasValue(Boolean("false")), true, "Checking Boolean('false')");
            assert.equal(hasValue(Boolean("0")), true, "Checking Boolean('0')");
            assert.equal(hasValue(Boolean(0)), true, "Checking Boolean(0)");
            assert.equal(hasValue(Boolean("1")), true, "Checking Boolean('1')");
            assert.equal(hasValue(Boolean(1)), true, "Checking Boolean(1)");

            assert.equal(hasValue({ length: 0 }), false, "Checking object with length property of 0");
            assert.equal(hasValue({ length: 1 }), true, "Checking object with length property of 1");
            assert.equal(hasValue({ length: () => 0 }), false, "Checking object with length function of 0");
            assert.equal(hasValue({ length: () => 1 }), true, "Checking object with length function of 1");

            assert.equal(hasValue({ byteLength: 0 }), false, "Checking object with byteLength property of 0");
            assert.equal(hasValue({ byteLength: 1 }), true, "Checking object with byteLength property of 1");
            assert.equal(hasValue({ byteLength: () => 0 }), false, "Checking object with byteLength function of 0");
            assert.equal(hasValue({ byteLength: () => 1 }), true, "Checking object with byteLength function of 1");

            assert.equal(hasValue({ size: 0 }), false, "Checking object with size property of 0");
            assert.equal(hasValue({ size: 1 }), true, "Checking object with size property of 1");
            assert.equal(hasValue({ size: () => 0 }), false, "Checking object with size function of 0");
            assert.equal(hasValue({ size: () => 1 }), true, "Checking object with size function of 1");

            assert.equal(hasValue({ count: 0 }), false, "Checking object with count property of 0");
            assert.equal(hasValue({ count: 1 }), true, "Checking object with count property of 1");
            assert.equal(hasValue({ count: undefined as any }), false, "Checking object with count property of undefined");
            assert.equal(hasValue({ count: null as any }), false, "Checking object with count property of null");
            assert.equal(hasValue({ count: () => 0 }), false, "Checking object with count function of 0");
            assert.equal(hasValue({ count: () => 1 }), true, "Checking object with count function of 1");
            assert.equal(hasValue({ count: () => undefined as any }), false, "Checking object with count function of undefined");
            assert.equal(hasValue({ count: () => null as any }), false, "Checking object with count function of undefined");

            assert.equal(hasValue({ valueOf: () => 0 }), true, "Checking object with valueOf function of 0");
            assert.equal(hasValue({ valueOf: () => 1 }), true, "Checking object with valueOf function of 1");
            assert.equal(hasValue({ valueOf: () => undefined as any}), false, "Checking object with valueOf function of undefined");
            assert.equal(hasValue({ valueOf: () => null as any }), false, "Checking object with valueOf function of null");

            assert.equal(hasValue({
                valueOf: () => {
                    return {
                        valueOf: () => 0
                    }
                }
            }), true, "Checking object with two levels valueOf function of 0");
            assert.equal(hasValue({
                valueOf: () => {
                    return {
                        valueOf: () => 1
                    }
                }
            }), true, "Checking object with two levels valueOf function of 1");
            assert.equal(hasValue({
                valueOf: () => {
                    return {
                        valueOf: () => undefined as any
                    }
                }
            }), false, "Checking object with two levels valueOf function of undefined");
            assert.equal(hasValue({
                valueOf: () => {
                    return {
                        valueOf: () => null as any
                    }
                }
            }), false, "Checking object with two levels valueOf function of undefined");
        });
    });

    function _dummyFunction() {

    }

    function _dummyError(): Error {
        return {
            name: "Dummy Error",
            message: "Dummy Message"
        };
    }

    function _simplePromise(): any {
        return {
            then: _dummyFunction,
            catch: _dummyFunction
        };
    }

    function _simplePromiseLike(): any {
        return {
            then: _dummyFunction
        };
    }

    class TestError extends Error {
        public constructor(message: string) {
            super(message);
        }
    }

});
