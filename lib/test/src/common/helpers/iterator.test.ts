import { assert } from "chai";
import {
    isIterator, isIterable
} from "../../../../src/helpers/iterator";
import { dumpObj } from "../../../../src/helpers/diagnostics";

describe("iterator helpers", () => {
    describe("isIterator", () => {
        it("Validate values", () => {
            assert.equal(isIterator(null), false, "Checking null");
            assert.equal(isIterator(undefined), false, "Checking undefined");
            assert.equal(isIterator("null"), false, "Checking 'null'");
            assert.equal(isIterator("undefined"), false, "Checking 'undefined'");
            assert.equal(isIterator("0"), false, "Checking '0'");
            assert.equal(isIterator("1"), false, "Checking '1'");
            assert.equal(isIterator("aa"), false, "Checking 'aa'");
            assert.equal(isIterator(new Date()), false, "Checking Date");
            assert.equal(isIterator(0), false, "Checking 0");
            assert.equal(isIterator(1), false, "Checking 1");
            assert.equal(isIterator(""), false, "Checking ''");
            assert.equal(isIterator(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isIterator([]), false, "Checking []");
            assert.equal(isIterator(new Array(1)), false, "Checking new Array(1)");
            assert.equal(isIterator(true), false, "Checking true");
            assert.equal(isIterator(false), false, "Checking false");
            assert.equal(isIterator("true"), false, "Checking 'true'");
            assert.equal(isIterator("false"), false, "Checking 'false'");
            // Test Boolean objects
            assert.equal(isIterator(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isIterator(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isIterator(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isIterator(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isIterator(new Boolean("0")), false, "Checking new Boolean('0')");
            assert.equal(isIterator(new Boolean(0)), false, "Checking new Boolean(0)");
            assert.equal(isIterator(new Boolean("1")), false, "Checking new Boolean('1')");
            assert.equal(isIterator(new Boolean(1)), false, "Checking new Boolean(1)");

            // test Boolean values
            assert.equal(isIterator(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isIterator(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isIterator(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isIterator(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isIterator(Boolean("0")), false, "Checking Boolean('0')");
            assert.equal(isIterator(Boolean(0)), false, "Checking Boolean(0)");
            assert.equal(isIterator(Boolean("1")), false, "Checking Boolean('1')");
            assert.equal(isIterator(Boolean(1)), false, "Checking Boolean(1)");

            assert.equal(isIterator(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isIterator(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isIterator(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isIterator(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isIterator(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isIterator(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isIterator(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isIterator(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isIterator(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isIterator(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isIterator(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isIterator(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isIterator(_simpleIterator()), true, "Checking _simpleIterator");
            assert.equal(isIterator(_simpleIterable()), false, "Checking _simpleIterable");
        });
    });

    describe("isIterable", () => {
        it("Validate values", () => {
            assert.equal(isIterable(null), false, "Checking null");
            assert.equal(isIterable(undefined), false, "Checking undefined");
            assert.equal(isIterable("null"), true, "Checking 'null'");
            assert.equal(isIterable("undefined"), true, "Checking 'undefined'");
            assert.equal(isIterable("0"), true, "Checking '0'");
            assert.equal(isIterable("1"), true, "Checking '1'");
            assert.equal(isIterable("aa"), true, "Checking 'aa'");
            assert.equal(isIterable(new Date()), false, "Checking Date");
            assert.equal(isIterable(0), false, "Checking 0");
            assert.equal(isIterable(1), false, "Checking 1");
            assert.equal(isIterable(""), true, "Checking ''");
            assert.equal(isIterable(_dummyFunction), false, "Checking _dummyFunction");
            assert.equal(isIterable([]), true, "Checking []");
            assert.equal(isIterable(new Array(1)), true, "Checking new Array(1)");
            assert.equal(isIterable(true), false, "Checking true");
            assert.equal(isIterable(false), false, "Checking false");
            assert.equal(isIterable("true"), true, "Checking 'true'");
            assert.equal(isIterable("false"), true, "Checking 'false'");
            // Test Boolean objects
            assert.equal(isIterable(new Boolean(true)), false, "Checking new Boolean(true)");
            assert.equal(isIterable(new Boolean(false)), false, "Checking new Boolean(false)");
            assert.equal(isIterable(new Boolean("true")), false, "Checking new Boolean('true')");
            assert.equal(isIterable(new Boolean("false")), false, "Checking new Boolean('false')");
            assert.equal(isIterable(new Boolean("0")), false, "Checking new Boolean('0')");
            assert.equal(isIterable(new Boolean(0)), false, "Checking new Boolean(0)");
            assert.equal(isIterable(new Boolean("1")), false, "Checking new Boolean('1')");
            assert.equal(isIterable(new Boolean(1)), false, "Checking new Boolean(1)");

            // test Boolean values
            assert.equal(isIterable(Boolean(true)), false, "Checking Boolean(true)");
            assert.equal(isIterable(Boolean(false)), false, "Checking Boolean(false)");
            assert.equal(isIterable(Boolean("true")), false, "Checking Boolean('true')");
            assert.equal(isIterable(Boolean("false")), false, "Checking Boolean('false')");
            assert.equal(isIterable(Boolean("0")), false, "Checking Boolean('0')");
            assert.equal(isIterable(Boolean(0)), false, "Checking Boolean(0)");
            assert.equal(isIterable(Boolean("1")), false, "Checking Boolean('1')");
            assert.equal(isIterable(Boolean(1)), false, "Checking Boolean(1)");

            assert.equal(isIterable(/[a-z]/g), false, "Checking '/[a-z]/g'");
            assert.equal(isIterable(new RegExp("")), false, "Checking new RegExp('')");
            assert.equal(isIterable(new ArrayBuffer(0)), false, "Checking new ArrayBuffer([])");
            assert.equal(isIterable(new Error("Test Error")), false, "Checking new Error('')");
            assert.equal(isIterable(new TypeError("Test TypeError")), false, "Checking new TypeError('')");
            assert.equal(isIterable(new TestError("Test TestError")), false, "Checking new TestError('')");
            assert.equal(isIterable(_dummyError()), false, "Checking dummy error (object that looks like an error)");
            assert.equal(isIterable(Promise.reject()), false, "Checking Promise.reject");
            assert.equal(isIterable(Promise.resolve()), false, "Checking Promise.reject");
            assert.equal(isIterable(new Promise(() => {})), false, "Checking new Promise(() => {})");
            assert.equal(isIterable(_simplePromise()), false, "Checking _simplePromise");
            assert.equal(isIterable(_simplePromiseLike()), false, "Checking _simplePromiseLike");
            assert.equal(isIterable(_simpleIterator()), false, "Checking _simpleIterator");
            assert.equal(isIterable(_simpleIterable()), true, "Checking _simpleIterable");
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

    function _simpleIterator(): Iterator<any> {
        return {
            next: function() {
                return {
                    value: null,
                    done: true
                };
            }
        };
    }

    function _simpleIterable(): Iterable<any> {
        return {
            [Symbol.iterator]: _simpleIterator
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

