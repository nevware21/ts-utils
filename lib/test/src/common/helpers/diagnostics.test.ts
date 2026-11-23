/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { polyArrFrom } from "../../../../src/polyfills/array";
import { mathToInt } from "../../../../src/math/to_int";
import { polyObjCreate } from "../../../../src/object/create";
import { polyObjFromEntries } from "../../../../src/polyfills/object/objFromEntries";
import { polySymbolKeyFor } from "../../../../src/polyfills/symbol";

describe("diagnostic helpers", () => {
    describe("dumpObj", () => {
        it("validate type null or undefined", () => {
            assert.equal(dumpObj(undefined), "[object Undefined]: undefined");
            assert.equal(dumpObj(undefined, true), "[object Undefined]: undefined");
            assert.equal(dumpObj(undefined, 2), "[object Undefined]: undefined");
            assert.equal(dumpObj(null), "[object Null]: null");
            assert.equal(dumpObj(null, true), "[object Null]: null");
            assert.equal(dumpObj(null, 2), "[object Null]: null");
            assert.equal(dumpObj(null, 2), "[object Null]: null");
        });

        it("validate type numbers", () => {
            assert.equal(dumpObj(0), "[object Number]: 0");
            assert.equal(dumpObj(1, true), "[object Number]: 1");
            assert.equal(dumpObj(2, 2), "[object Number]: 2");
        });

        it("validate object", () => {
            let value = {
                hello: "darkness"
            };

            assert.equal(dumpObj(value), "[object Object]: {hello: \"darkness\"}");
            assert.equal(dumpObj(value, true), "[object Object]: {\n    hello: \"darkness\"\n}");
            assert.equal(dumpObj(value, 2), "[object Object]: {\n  hello: \"darkness\"\n}");
        });

        it("Validate circular dump - which throws", () => {
            var ug: any = {};
            ug.ug = {};
            ug.ug.ug = ug;

            assert.ok(dumpObj(ug).indexOf("[object Object]: ") === 0);
            assert.ok(dumpObj(ug, 2).indexOf("[object Object]: ") === 0);
            assert.ok(dumpObj(ug, true).indexOf("[object Object]: ") === 0);
        });

        it("validate array", () => {
            let value = [1, 2, 3];

            assert.equal(dumpObj(value), "[object Array]: [1,2,3]");
            assert.equal(dumpObj(value, true), "[object Array]: [\n    1,\n    2,\n    3\n]");
            assert.equal(dumpObj(value, 2), "[object Array]: [\n  1,\n  2,\n  3\n]");
        });

        it("validate string", () => {
            let value = "Hello Darkness";
            let result = JSON.stringify(value);

            assert.equal(dumpObj(value), "[object String]: " + result);
            assert.equal(dumpObj(value, true), "[object String]: " + result);
            assert.equal(dumpObj(value, 2), "[object String]: " + result);
        });

        it("validate boolean", () => {
            let value = true;

            assert.equal(dumpObj(value), "[object Boolean]: true");
            assert.equal(dumpObj(value, true), "[object Boolean]: true");
            assert.equal(dumpObj(value, 2), "[object Boolean]: true");
        });

        it("validate date", () => {
            let value = new Date();
            let result = JSON.stringify(value);

            assert.equal(dumpObj(value), "[object Date]: " + result);
            assert.equal(dumpObj(value, true), "[object Date]: " + result);
            assert.equal(dumpObj(value, 2), "[object Date]: " + result);
        });

        it("validate function", () => {
            let value = () => { };
            let result = String(value);

            assert.equal(dumpObj(value), "[object Function]: " + result);
            assert.equal(dumpObj(value, true), "[object Function]: " + result);
            assert.equal(dumpObj(value, 2), "[object Function]: " + result);
        });

        it("validate symbol", () => {
            let value = Symbol("hello darkness");

            assert.equal(dumpObj(value), "[object Symbol]: Symbol(hello darkness)");
            assert.equal(dumpObj(value, true), "[object Symbol]: Symbol(hello darkness)");
            assert.equal(dumpObj(value, 2), "[object Symbol]: Symbol(hello darkness)");
        });

        it("validate bigint", () => {
            let value = BigInt(42);

            assert.ok(dumpObj(value).startsWith("[object BigInt]: "), dumpObj(value));
            assert.ok(dumpObj(value, true).startsWith("[object BigInt]: "), dumpObj(value, true));
            assert.ok(dumpObj(value, 2).startsWith("[object BigInt]: "), dumpObj(value, 2));
        });

        it("validate error", () => {
            let value = new Error("Hello Darkness");

            let dumpValue = dumpObj(value);
            assert.equal(dumpValue.indexOf("[object Error]: {stack: \"Error: Hello Darkness") === 0, true, dumpObj(value));
            assert.equal(dumpValue.indexOf("message: \"Hello Darkness\"") > 0, true, dumpObj(value));
            assert.equal(dumpValue.indexOf("name: \"Error\"") > 0, true, dumpObj(value));

            dumpValue = dumpObj(value, true);
            assert.equal(dumpValue.indexOf("[object Error]: {\n    stack: \"Error: Hello Darkness") === 0, true, dumpObj(value, true));
            assert.equal(dumpValue.indexOf("message: \"Hello Darkness\"") > 0, true, dumpObj(value, true));
            assert.equal(dumpValue.indexOf("name: \"Error\"") > 0, true, dumpObj(value, true));

            dumpValue = dumpObj(value, 2);
            assert.equal(dumpValue.indexOf("[object Error]: {\n  stack: \"Error: Hello Darkness") === 0, true, dumpObj(value, 2));
            assert.equal(dumpValue.indexOf("message: \"Hello Darkness\"") > 0, true, dumpObj(value, 2));
            assert.equal(dumpValue.indexOf("name: \"Error\"") > 0, true, dumpObj(value, 2));
        });

        it("validate error - with circular reference", () => {
            let value = new Error("Hello Darkness");
            (value as any).stack = value;

            let stackValue = String(value.stack);

            assert.equal(dumpObj(value), "[object Error]: {stack: \"" + stackValue + "\",message: \"Hello Darkness\",name: \"Error\"}");
            assert.equal(dumpObj(value, true), "[object Error]: {\n    stack: \"" + stackValue + "\",\n    message: \"Hello Darkness\",\n    name: \"Error\"\n}");
            assert.equal(dumpObj(value, 2), "[object Error]: {\n  stack: \"" + stackValue + "\",\n  message: \"Hello Darkness\",\n  name: \"Error\"\n}");
        });

        it("validate error - with circular reference - with circular reference", () => {
            let value = new Error("Hello Darkness");
            (value as any).stack = value;
            (value as any).circular = { value };

            let stackValue = String(value.stack);

            assert.equal(dumpObj(value), "[object Error]: {stack: \"" + stackValue + "\",message: \"Hello Darkness\",name: \"Error\"}");
            assert.equal(dumpObj(value, true), "[object Error]: {\n    stack: \"" + stackValue + "\",\n    message: \"Hello Darkness\",\n    name: \"Error\"\n}");
            assert.equal(dumpObj(value, 2), "[object Error]: {\n  stack: \"" + stackValue + "\",\n  message: \"Hello Darkness\",\n  name: \"Error\"\n}");
        });

        it("validate object - with circular reference - with circular reference", () => {
            let value: any = { name: "Hello Darkness" };
            (value as any).stack = value;
            (value as any).circular = { value };

            assert.ok(dumpObj(value).startsWith("[object Object]: "), dumpObj(value));
            assert.ok(dumpObj(value).indexOf("Converting circular structure to JSON") != -1, dumpObj(value));
            assert.ok(dumpObj(value, true).startsWith("[object Object]: "), dumpObj(value, true));
            assert.ok(dumpObj(value, true).indexOf("Converting circular structure to JSON") != -1, dumpObj(value));
            assert.ok(dumpObj(value, 2).startsWith("[object Object]: "), dumpObj(value, 2));
            assert.ok(dumpObj(value, 2).indexOf("Converting circular structure to JSON") != -1, dumpObj(value));
        });
    });
});

describe("dumpObj maxLength", () => {
    const value = { a: 1, b: "Hello", c: { d: 2, e: "Darkness" } };

    it("doesn't limit the length when it is omitted, zero, negative or not shorter than the dump", () => {
        const full = dumpObj(value);

        assert.equal(dumpObj(value, false, undefined), full);
        assert.equal(dumpObj(value, false, 0), full);
        assert.equal(dumpObj(value, false, -1), full);
        assert.equal(dumpObj(value, false, NaN), full);
        assert.equal(dumpObj(value, false, full.length), full, "A dump which is the maximum length is not changed");
        assert.equal(dumpObj(value, false, full.length + 10), full);
    });

    it("truncates the dump to the length, ending with \"...\" (which is included in the length)", () => {
        const full = dumpObj(value);

        assert.equal(dumpObj(value, false, 20), "[object Object]: ...");
        assert.equal(dumpObj(value, false, full.length - 1), full.substring(0, full.length - 4) + "...");
        assert.equal(dumpObj(value, false, 20).length, 20);

        // A length which is too short for any of the dump is only the "...", and a length less than 3 is rounded up to 3
        assert.equal(dumpObj(value, false, 3), "...");
        assert.equal(dumpObj(value, false, 2), "...");
        assert.equal(dumpObj(value, false, 1), "...");
        assert.equal(dumpObj(value, false, 0.5), "...");
    });

    it("truncates a formatted dump", () => {
        const formatted = dumpObj(value, true);
        const result = dumpObj(value, true, 30);

        assert.equal(result.length, 30);
        assert.equal(result, formatted.substring(0, 27) + "...");
    });

    it("limits the dump of a value in an error message to 1024 characters", () => {
        let message: string;
        try {
            polyArrFrom([1], { value: new Array(5001).join("x") } as any);
        } catch (e) {
            message = e.message;
        }

        assert.include(message, "is not a function");
        assert.equal(message.length, 1024 + " is not a function".length, "The message should be limited");
        assert.equal(message.substring(1021, 1024), "...");
    });
});

describe("dumpObj values which throw", () => {
    it("doesn't recurse forever for a value which throws itself", () => {
        const value = {
            toJSON(): any {
                throw this;
            }
        };

        const result = dumpObj(value);
        assert.equal(result.substring(0, 17), "[object Object]: ");
        assert.equal(dumpObj(value, 0, 1024), result);

        // The error (the value itself) is only dumped once
        assert.equal(result, "[object Object]:  - [object Object]:  - ");
    });

    it("doesn't throw for an error with a throwing getter", () => {
        const error = new Error("test error");
        Object.defineProperty(error, "stack", {
            get: () => {
                throw new Error("stack getter error");
            }
        });

        const result = dumpObj(error);
        assert.include(result, "stack getter error");
    });

    it("an error message for a value which throws itself is a TypeError, like the native function", () => {
        const mapFn: any = {
            toJSON(): any {
                throw this;
            }
        };

        assert.throws(() => polyArrFrom([], mapFn), TypeError);
        assert.throws(() => (Array as any).from([], mapFn), TypeError);
    });

    it("only uses a number maxLength, so the array passed to a callback (eg. by map) doesn't limit it", () => {
        // TypeScript rejects arr.map(dumpObj) as the array isn't a number, but JavaScript code may still use it
        assert.deepEqual([5].map(dumpObj as any), [dumpObj(5)]);
        assert.equal(dumpObj({ a: 1 }, false, "5" as any), dumpObj({ a: 1 }));
    });

    it("rounds a fractional maxLength down, and a positive maxLength less than 3 up to 3", () => {
        assert.equal(dumpObj({ a: 1 }, false, 5.5), "[o...");
        assert.equal(dumpObj({ a: 1 }, false, 2.5), "...");
        assert.equal(dumpObj({ a: 1 }, false, 0.5), "...");
    });

    it("doesn't throw when the type of the value can't be read (eg. its Symbol.toStringTag getter throws)", function() {
        if (typeof Symbol !== "function" || !Symbol.toStringTag) {
            this.skip();
            return;
        }

        const value: any = {};
        Object.defineProperty(value, Symbol.toStringTag, {
            get: () => {
                throw new Error("tag error");
            }
        });

        assert.include(dumpObj(value), "tag error");
    });

    it("doesn't split a surrogate pair when it truncates", () => {
        const pair = String.fromCharCode(0xD83D, 0xDE00);
        const value = pair + pair + pair + pair;
        const full = dumpObj(value);

        for (let len = 18; len < full.length; len++) {
            const result = dumpObj(value, 0, len);
            assert.isAtMost(result.length, len);
            assert.equal(result.substring(result.length - 3), "...");

            const last = result.charCodeAt(result.length - 4);
            assert.isFalse(last >= 0xD800 && last <= 0xDBFF, "A high surrogate should not be the last character for a length of " + len);
        }
    });
});

describe("error messages limit the dump of a value", () => {
    const big = new Array(5001).join("x");

    function _getError(fn: () => void): any {
        try {
            fn();
        } catch (e) {
            return e;
        }
    }

    it("limits the dump of the value to 1024 characters", () => {
        const cases: any[] = [
            ["mathToInt", () => mathToInt({ valueOf: () => Infinity, v: big }, true), RangeError],
            ["polyObjCreate", () => polyObjCreate(big), TypeError],
            ["polyObjFromEntries entry", () => polyObjFromEntries([big] as any), TypeError],
            ["polyObjFromEntries iterable", () => polyObjFromEntries({ v: big } as any), TypeError],
            ["polyArrFrom", () => polyArrFrom([1], { v: big } as any), TypeError]
        ];

        for (let lp = 0; lp < cases.length; lp++) {
            const error = _getError(cases[lp][1]);
            const message: string = error ? error.message : "";
            assert.instanceOf(error, cases[lp][2], cases[lp][0] + " should throw");
            assert.isAtMost(message.length, 1100, cases[lp][0] + " message should be limited, was " + message.length);
            assert.include(message, "...", cases[lp][0] + " message should be truncated");
        }

        // Like the native functions, the polyfills which check a value's type don't read (or convert) the value for the
        // error, so the message only includes its type
        const typeCases: any[] = [
            ["polySymbolKeyFor", () => polySymbolKeyFor(big as any), "string is not a symbol"]
        ];

        for (let lp = 0; lp < typeCases.length; lp++) {
            const error = _getError(typeCases[lp][1]);
            assert.instanceOf(error, TypeError, typeCases[lp][0] + " should throw");
            assert.equal(error.message, typeCases[lp][2], typeCases[lp][0] + " message only includes the type");
        }
    });
});
