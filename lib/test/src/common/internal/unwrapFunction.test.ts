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

    it("no this with wrapped function with polyfill fallback only", () => {
        let testFnCalled = 0;
        let testFnArgs: IArguments;

        function testFn() {
            testFnArgs = arguments;
            testFnCalled++;
        }

        let wrappedFn = _unwrapFunction("test", null, testFn);

        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(null);
        assert.equal(testFnCalled, 1, "The fallback testFn has was called");
    });

    it("wrapped function with mis-matching target and polyfill fallback", () => {
        let polyFnCalled = 0;
        let targetFnCalled = 0;
        let testFnArgs: IArguments;
        let targetFnArgs: IArguments;

        function polyTestFn() {
            testFnArgs = arguments;
            polyFnCalled++;
        }

        let wrappedFn = _unwrapFunction("test",
            {
                myFunc: function() {
                    targetFnArgs = arguments;
                    targetFnCalled++;
                }
            } as any, polyTestFn);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(polyFnCalled, 0, "The polyfill fallback testFn has not been called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(polyFnCalled, 0, "The polyfill fallback testFn has not been called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(polyFnCalled, 0, "The fallback testFn has not been called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(polyFnCalled, 1, "The fallback testFn has was called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");
    });

    it("wrapped function with matching target container and polyFn", () => {
        let targetFnCalled = 0;
        let targetFnArgs: IArguments;

        function polyTestFn() {
            assert.fail("Should not get called");
        }

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
                targetFnArgs = arguments;
                targetFnCalled++;
            }
        }, polyTestFn);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(targetFnCalled, 1, "The fallback testFn has was called");
    });

    it("wrapped function with matching target container and no polyFn", () => {
        let targetFnCalled = 0;
        let targetFnArgs: IArguments;

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
                targetFnArgs = arguments;
                targetFnCalled++;
            }
        });
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(targetFnCalled, 1, "The fallback testFn has was called");
    });

    it("no test object with wrapped function with matching target container and no polyFn", () => {
        let targetFnCalled = 0;
        let targetFnArgs: IArguments;

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
                targetFnArgs = arguments;
                targetFnCalled++;
            }
        });

        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(null);
        assert.equal(targetFnCalled, 1, "The fallback testFn has was called");
    });
});
