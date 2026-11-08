/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _unwrapFunction, _unwrapFunctionNoInstWithPoly, _unwrapFunctionWithPoly, _unwrapInstFunction } from "../../../../src/internal/unwrapFunction";
import { strIncludes } from "../../../../src/string/includes";
import { dumpObj } from "../../../../src/helpers/diagnostics";

function _expectThrow(cb: () => void, includes: string): Error {
    try {
        cb();
        assert.ok(false, "Expected an exception to be thrown with " + includes);
    } catch (e) {
        assert.ok(strIncludes(e.message, includes), "Expected an exception to be thrown - " + dumpObj(e));
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
        }, "not defined for"));

        assert.equal(testObj1Called, false, "The testObj1 test function was not called");
    });

    it("no this with wrapped function and no target", () => {
        let wrappedFn = _unwrapFunction("test", null);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }, "not defined for"));
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
        }, "not defined for"));
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
        }, "not defined for"));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }, "not defined for"));

        wrappedFn = _unwrapFunction("test", {} as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }, "not defined for"));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }, "not defined for"));
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
        }, "not defined for"));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }, "not defined for"));

        wrappedFn = _unwrapFunctionWithPoly("test", {} as any, null as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }, "not defined for"));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }, "not defined for"));
    });

    it("error message includes the number of arguments passed", () => {
        let wrappedFn = _unwrapFunctionWithPoly("test", null as any, null as any);

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }, "\"test\" not defined for [object Null]: null with 1 args"));

        assert.ok(_expectThrow(() => {
            (wrappedFn as any)({}, 1, "two");
        }, " with 3 args"));
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

        // Only the class / prototype function is used
        let noInstFn = _unwrapFunctionNoInstWithPoly("test" as any, { test: test } as any, null as any);
        assert.equal((noInstFn as any)({ x: 10, test: () => "instance" }, 1), 12);
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
        }, "\"test\" not defined for"));
    });

    it("test no matching function name for the object", () => {
        let wrappedFn = _unwrapInstFunction("test");

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }, "\"test\" not defined for [object Null]"));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }, "\"test\" not defined for [object Object]: {}"));

        wrappedFn = _unwrapInstFunction("test");

        assert.ok(_expectThrow(() => {
            wrappedFn(null);
        }, "\"test\" not defined for [object Null]"));

        assert.ok(_expectThrow(() => {
            wrappedFn({});
        }, "\"test\" not defined for [object Object]: {}"));
    });
});
