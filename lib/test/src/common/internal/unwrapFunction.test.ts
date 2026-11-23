/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _unwrapFunction, _unwrapFunctionWithPoly, _unwrapInstFunction } from "../../../../src/internal/unwrapFunction";
import { dumpObj } from "../../../../src/helpers/diagnostics";

// When there is neither a function nor a polyfill the runtime throws its own TypeError (for calling apply on
// undefined / null), so only the type of the error is checked as its message depends on the runtime
function _expectThrow(cb: () => void): Error {
    try {
        cb();
        assert.ok(false, "Expected a TypeError to be thrown");
    } catch (e) {
        assert.ok(e instanceof TypeError, "Expected a TypeError to be thrown - " + dumpObj(e));
        return e;
    }
}

describe("unwrapFunction", () => {
    it("wrapped function with no target", () => {
        let wrappedFn = _unwrapFunction("test", null);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
    });

    it("no this with wrapped function and no target", () => {
        let wrappedFn = _unwrapFunction("test", null);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));
    });

    it("wrapped function with mis-matching target", () => {
        let targetFnCalled = 0;

        let wrappedFn = _unwrapFunction("test",
            {
                myFunc: function() {
                    targetFnCalled++;
                }
            } as any);
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");
        assert.ok(_expectThrow(() => {
            wrappedFn(testObj1);
        }));
        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
        assert.equal(targetFnCalled, 0, "The target testFn has not been called");
    });

    it("wrapped function with matching target container", () => {
        let targetFnCalled = 0;

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
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

    it("no test object with wrapped function with matching target container", () => {
        let targetFnCalled = 0;

        let wrappedFn = _unwrapFunction("test", {
            test: function() {
                targetFnCalled++;
            }
        });

        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(null);
        assert.equal(targetFnCalled, 1, "The fallback testFn has was called");
    });

    it("test no patching function name for the object or target", () => {
        let wrappedFn = _unwrapFunction("test", null as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }));

        wrappedFn = _unwrapFunction("test", {} as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }));
    });
});

describe("_unwrapFunctionWithPoly", () => {
    it("wrapped function with polyfill fallback only", () => {
        let testFnCalled = 0;

        function testFn() {
            testFnCalled++;
        }

        let wrappedFn = _unwrapFunctionWithPoly("test", null, testFn);
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

        function testFn() {
            testFnCalled++;
        }

        let wrappedFn = _unwrapFunctionWithPoly("test", null, testFn);

        assert.equal(testFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(null);
        assert.equal(testFnCalled, 1, "The fallback testFn has was called");
    });

    it("wrapped function with mis-matching target and polyfill fallback", () => {
        let polyFnCalled = 0;
        let targetFnCalled = 0;

        function polyTestFn() {
            polyFnCalled++;
        }

        let wrappedFn = _unwrapFunctionWithPoly("test",
            {
                myFunc: function() {
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

        function polyTestFn() {
            assert.fail("Should not get called");
        }

        let wrappedFn = _unwrapFunctionWithPoly("test", {
            test: function() {
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

        let wrappedFn = _unwrapFunctionWithPoly("test", {
            test: function() {
                targetFnCalled++;
            }
        }, null as any);
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

        let wrappedFn = _unwrapFunctionWithPoly("test", {
            test: function() {
                targetFnCalled++;
            }
        }, null as any);

        assert.equal(targetFnCalled, 0, "The fallback testFn has not been called");
        wrappedFn(null);
        assert.equal(targetFnCalled, 1, "The fallback testFn has was called");
    });

    it("test no patching function name for the object or target with no polyfill", () => {
        let wrappedFn = _unwrapFunctionWithPoly("test", null as any, null as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }));

        wrappedFn = _unwrapFunctionWithPoly("test", {} as any, null as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }));
    });

    it("the wrapped functions have no named parameters", () => {
        // In non-strict code (eg. a bundle without "use strict") a named parameter maps the arguments object to it,
        // which makes passing the arguments to apply() several times slower, so the value is read from the arguments
        assert.equal(_unwrapFunction("test", {} as any).length, 0, "_unwrapFunction");
        assert.equal(_unwrapFunctionWithPoly("test" as any, {} as any, null as any).length, 0, "_unwrapFunctionWithPoly");
        assert.equal(_unwrapInstFunction("test").length, 0, "_unwrapInstFunction");

        // The value is still the first argument and the remaining arguments are passed to the function
        let wrappedFn = _unwrapFunctionWithPoly("test" as any, null as any, null as any);
        let value = {
            x: 1,
            test: function(this: any, a: number, b: number) {
                return this.x + a + b + arguments.length;
            }
        };
        assert.equal((wrappedFn as any)(value, 2, 3), 8);
    });

    it("throws a TypeError whatever the number of arguments passed", () => {
        let wrappedFn = _unwrapFunctionWithPoly("test", null as any, null as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            (wrappedFn as any)({}, 1, "two");
        }));
    });

    it("does not depend on the function's own call or apply properties", () => {
        function test(this: any, value: number) {
            return this.x + value + arguments.length;
        }

        (test as any).call = null;
        let wrappedFn = _unwrapFunctionWithPoly("test" as any, null as any, null as any);
        assert.equal((wrappedFn as any)({ x: 20, test: test }, 1), 22);

        (test as any).call = () => "wrong";
        (test as any).apply = () => "wrong";
        assert.equal((wrappedFn as any)({ x: 20, test: test }, 1), 22);

        // Using the class / prototype fallback
        let fallbackFn = _unwrapFunctionWithPoly("test" as any, { test: test } as any, null as any);
        assert.equal((fallbackFn as any)({ x: 10 }, 1), 12);
    });
});

describe("unwrapInstFunction", () => {
    it("wrapped function", () => {
        let wrappedFn = _unwrapInstFunction("test");
        let testObj1Called = false;
        let testObj1: any = {
            test: function() {
                testObj1Called = true;
            }
        }

        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        wrappedFn(testObj1);
        assert.equal(testObj1Called, true, "The testObj1 test function was called");

        testObj1 = {
            test2: function() {
                testObj1Called = true;
            }
        }

        testObj1Called = false;
        assert.equal(testObj1Called, false, "The testObj1 test function has not been called");
        assert.ok(_expectThrow(() => {
            wrappedFn(testObj1);
        }));
    });

    it("test no matching function name for the object", () => {
        let wrappedFn = _unwrapInstFunction("test");

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }));

        wrappedFn = _unwrapInstFunction("test");

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }));
    });
});
