/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isConstructor, isNativeFn } from "../../../../src/funcs/isNative";
import { getGlobal } from "../../../../src/helpers/environment";

// Returns the result of the source, or undefined when the runtime doesn't support its syntax (eg. a class on IE)
function _create(source: string): any {
    try {
        return new Function("return " + source)();
    } catch (e) {
        return undefined;
    }
}

describe("isNativeFn", () => {
    it("identifies a native function, and its name when one is provided", () => {
        assert.isTrue(isNativeFn(Array), "Array");
        assert.isTrue(isNativeFn(Array, "Array"), "Array with its name");
        assert.isTrue(isNativeFn(Object, "Object"), "Object");
        assert.isTrue(isNativeFn(Math.max, "max"), "Math.max");
        assert.isTrue(isNativeFn(Array.prototype.push, "push"), "Array.prototype.push");
        assert.isFalse(isNativeFn(Math.max, "min"), "A different name");
        assert.isFalse(isNativeFn(Array, "Arr"), "Only the whole name matches");
        assert.isFalse(isNativeFn(Array, "rray"), "Only the whole name matches");
    });

    it("doesn't identify a function written in JavaScript, even one named like a native function", () => {
        const namedArray = _create("function Array() {}");
        const fakeSource: any = function() {
            // Empty
        };
        fakeSource.toString = () => "function Array() { [native code] }";

        assert.isFalse(isNativeFn(function() {
            // Empty
        }), "A function");
        assert.isFalse(isNativeFn(namedArray), "A function named Array");
        assert.isFalse(isNativeFn(namedArray, "Array"), "A function named Array, with the name");
        assert.isFalse(isNativeFn(fakeSource, "Array"), "A function whose own toString() returns a native source text");

        const arrow = _create("() => {}");
        if (arrow) {
            assert.isFalse(isNativeFn(arrow), "An arrow function");
        }
    });

    it("returns false for a value which isn't a function", () => {
        const values: any[] = [null, undefined, 0, "", "function Array() { [native code] }", {}, [], { toString: () => "function Array() { [native code] }" }];
        values.forEach((value) => {
            assert.isFalse(isNativeFn(value), String(value));
        });
    });

    it("identifies a bound function, a getter and a callable Proxy as native functions", function() {
        assert.isTrue(isNativeFn(Array.bind(null)), "A bound function");
        assert.isFalse(isNativeFn(function() {
            // Empty
        }.bind(null), "Array"), "A bound function isn't named like the function it is bound to");

        const sizeDesc = typeof Map === "function" ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : undefined;
        if (sizeDesc && sizeDesc.get) {
            assert.isTrue(isNativeFn(sizeDesc.get), "A native getter");
        }

        if (typeof Proxy === "function") {
            assert.isTrue(isNativeFn(new Proxy(function() {
                // Empty
            }, {})), "A callable Proxy");
        }
    });

    it("checks a source text with a long run of whitespace in a linear time (no catastrophic backtracking)", () => {
        const spaces = new Array(5001).join(" ");
        const sources = [
            "function" + spaces + "x() {}",
            "function x" + spaces + "() {}",
            "function /*" + new Array(5001).join(" a") + " */ x() {}"
        ];

        sources.forEach((source, idx) => {
            const theFn = _create(source);
            const start = new Date().getTime();
            const result = isNativeFn(theFn);
            const elapsed = new Date().getTime() - start;

            assert.isFalse(result, "Source " + idx);
            assert.isBelow(elapsed, 500, "Source " + idx + " took " + elapsed + "ms");
        });
    });
});

describe("isConstructor", () => {
    it("identifies a constructor", () => {
        assert.isTrue(isConstructor(Array), "Array");
        assert.isTrue(isConstructor(Object), "Object");
        assert.isTrue(isConstructor(Date), "Date");
        assert.isTrue(isConstructor(function() {
            // Empty
        }), "A function");

        const theClass = _create("class Foo {}");
        if (theClass) {
            assert.isTrue(isConstructor(theClass), "A class");
        }

        if (typeof Proxy === "function") {
            // Only identified where there is a Proxy (on ES5 a bound function has no prototype)
            assert.isTrue(isConstructor(Array.bind(null)), "A bound constructor");
            assert.isTrue(isConstructor(new Proxy(Array, {})), "A Proxy of a constructor");
        }
    });

    it("doesn't identify a function which isn't a constructor", () => {
        assert.isFalse(isConstructor(Math.max), "Math.max");
        assert.isFalse(isConstructor(Array.prototype.push), "Array.prototype.push");

        const others: { [name: string]: string } = {
            "An arrow function": "() => {}",
            "A method": "({ method() {} }).method",
            "A generator": "function* () {}",
            "An async function": "async function () {}",
            "A bound arrow function": "(() => {}).bind(null)"
        };

        Object.keys(others).forEach((name) => {
            const value = _create(others[name]);
            if (value) {
                assert.isFalse(isConstructor(value), name);
            }
        });
    });

    it("returns false for a value which isn't a function", () => {
        const values: any[] = [null, undefined, 0, "Array", {}, []];
        values.forEach((value) => {
            assert.isFalse(isConstructor(value), String(value));
        });
    });

    it("doesn't call the value or use its Proxy traps", function() {
        if (typeof Proxy !== "function") {
            this.skip();
            return;
        }

        const calls: string[] = [];
        const target = function() {
            calls.push("called");
        };
        const proxy = new Proxy(target, {
            get: (theTarget: any, key: PropertyKey) => {
                calls.push("get " + String(key));
                return theTarget[key];
            },
            construct: () => {
                calls.push("construct");
                return {};
            },
            apply: () => {
                calls.push("apply");
            }
        });

        assert.isTrue(isConstructor(target));
        assert.isTrue(isConstructor(proxy));
        assert.deepEqual(calls, [], "The value wasn't called, and no trap was used");
    });

    it("identifies a constructor on a runtime without Proxy (eg. ES5), using instanceof", () => {
        const theGlobal: any = getGlobal();
        const orgProxy = theGlobal.Proxy;
        const syntax: { [name: string]: string } = {
            arrow: "() => {}",
            method: "({ method() {} }).method",
            generator: "function* () {}",
            async: "async function () {}",
            theClass: "class Foo {}"
        };
        const created: { [name: string]: any } = {};
        Object.keys(syntax).forEach((name) => {
            created[name] = _create(syntax[name]);
        });

        let results: any = {};
        try {
            theGlobal.Proxy = undefined;
            results.fn = isConstructor(function() {
                // Empty
            });
            results.array = isConstructor(Array);
            results.object = isConstructor(Object);
            results.max = isConstructor(Math.max);
            results.push = isConstructor(Array.prototype.push);
            results.boundCtor = isConstructor(Array.bind(null));
            results.boundMax = isConstructor(Math.max.bind(null));
            Object.keys(created).forEach((name) => {
                results[name] = created[name] ? isConstructor(created[name]) : undefined;
            });
        } finally {
            theGlobal.Proxy = orgProxy;
        }

        assert.isTrue(results.fn, "A function");
        assert.isTrue(results.array, "Array");
        assert.isTrue(results.object, "Object");
        assert.isFalse(results.max, "Math.max");
        assert.isFalse(results.push, "Array.prototype.push");
        assert.isTrue(results.boundCtor, "A bound constructor");
        assert.isFalse(results.boundMax, "A bound function which isn't a constructor");

        // Only checked where the runtime supports the syntax
        const expected: { [name: string]: boolean } = { arrow: false, method: false, generator: false, async: false, theClass: true };
        Object.keys(expected).forEach((name) => {
            if (created[name]) {
                assert.equal(results[name], expected[name], name);
            }
        });
    });
});
