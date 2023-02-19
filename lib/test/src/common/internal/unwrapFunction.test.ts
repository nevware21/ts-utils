/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { _unwrapFunction } from "../../../../src/internal/unwrapFunction";

describe("unwrapFunction", () => {
    it("wrapped function with polyfill fallback only", () => {
        let testFnCalled = 0;
        let testFnArgs: IArguments;

        function testFn() {
            testFnArgs = arguments;
            testFnCalled++;
        }

        let wrappedFn = _unwrapFunction("test", null, testFn);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(testFnCalled, 1, "The fallback testFn has was called");
    });

    it("wrapped function with mis-matching target and polyfill fallback", () => {
        let testFnCalled = 0;
        let testFnArgs: IArguments;

        function polyTestFn() {
            testFnArgs = arguments;
            testFnCalled++;
        }

        let wrappedFn = _unwrapFunction("test",
            {
                myFunc: function() {
                    testFnArgs = arguments;
                    testFnCalled++;
                }
            } as any, polyTestFn);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(testFnCalled, 1, "The fallback testFn has was called");
    });

    it("wrapped function with matching target container and polyFn", () => {
        let testFnCalled = 0;
        let testFnArgs: IArguments;

        function polyTestFn() {
            assert.fail("Should not get called");
        }

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
                testFnArgs = arguments;
                testFnCalled++;
            }
        }, polyTestFn);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(testFnCalled, 1, "The fallback testFn has was called");
    });

    it("wrapped function with matching target container and no polyFn", () => {
        let testFnCalled = 0;
        let testFnArgs: IArguments;

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
                testFnArgs = arguments;
                testFnCalled++;
            }
        });
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(testFnCalled, 1, "The fallback testFn has was called");
    })
});
