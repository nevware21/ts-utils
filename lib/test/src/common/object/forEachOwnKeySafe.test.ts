/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { forEachOwnKey, forEachOwnKeySafe } from "../../../../src/object/forEachOwnKey";
import { hasSymbol } from "../../../../src/symbol/symbol";
import { arrForEach } from "../../../../src/array/forEach";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { UNDEF_VALUE } from "../../../../src/internal/constants";

describe("object forEachOwnKeySafe tests", () => {
    describe("forEachOwnKey", () => {
        it("should iterate own enumerable symbol keys", () => {
            if (!hasSymbol()) {
                return;
            }

            const sym = Symbol("key");
            const source: any = { a: 1 };
            source[sym] = 2;

            const visited: PropertyKey[] = [];
            forEachOwnKey(source, (key) => {
                visited.push(key);
            });

            assert.include(visited, "a");
            assert.include(visited, sym);
        });

        it("should not filter unsafe string keys", () => {
            const source: any = Object.create(null);
            source["safe"] = 1;
            source["constructor"] = 2;
            source["prototype"] = 3;

            const visited: string[] = [];
            forEachOwnKey(source, (key) => {
                if (typeof key === "string") {
                    visited.push(key);
                }
            });

            assert.include(visited, "safe");
            assert.include(visited, "constructor");
            assert.include(visited, "prototype");
        });

        it("should continue iterating when a string key getter throws", () => {
            const obj: any = { a: 1 };
            Object.defineProperty(obj, "b", {
                get: function() {
                    throw new Error("getter failed");
                },
                enumerable: true,
                configurable: true
            });
            obj.c = 3;

            const visited: { [key: string]: any } = {};
            assert.doesNotThrow(() => {
                forEachOwnKey(obj, (key, value) => {
                    visited[key as string] = value;
                });
            }, "Should not throw when a getter throws");

            assert.deepEqual(Object.keys(visited).sort(), ["a", "b", "c"], "Should visit all keys including the throwing getter");
            assert.isUndefined(visited["b"], "Should pass undefined for the throwing getter");
            assert.equal(visited["c"], 3, "Should pass the value for c");
        });

        it("should continue iterating when a symbol key getter throws", () => {
            if (!hasSymbol()) {
                return;
            }

            const badSym = Symbol("bad");
            const goodSym = Symbol("good");
            const obj: any = { a: 1 };
            Object.defineProperty(obj, badSym, {
                get: function() {
                    throw new Error("getter failed");
                },
                enumerable: true,
                configurable: true
            });
            obj[goodSym] = 2;

            const keys: PropertyKey[] = [];
            const values: any[] = [];
            assert.doesNotThrow(() => {
                forEachOwnKey(obj, (key, value) => {
                    keys.push(key);
                    values.push(value);
                });
            }, "Should not throw when a symbol getter throws");

            assert.deepEqual(keys, ["a", badSym, goodSym], "Should visit all keys including the throwing symbol getter");
            assert.deepEqual(values, [1, undefined, 2], "Should pass undefined for the throwing symbol getter");
        });

        it("should use the provided thisArg for both string and symbol keys", () => {
            const obj: any = { a: 1 };
            if (hasSymbol()) {
                obj[Symbol("sym")] = 2;
            }

            const ctx = { n: "ctx" };
            const thisValues: any[] = [];
            forEachOwnKey(obj, function(this: any) {
                thisValues.push(this);
            }, ctx);

            assert.equal(thisValues.length, hasSymbol() ? 2 : 1, "Should visit every key");
            arrForEach(thisValues, (value) => {
                assert.strictEqual(value, ctx, "Should use the provided thisArg for every key");
            });
        });

        it("should use the object as this for null / undefined thisArg and falsy values as-is", () => {
            const obj: any = { a: 1 };
            if (hasSymbol()) {
                obj[Symbol("sym")] = 2;
            }

            const expectedCalls = hasSymbol() ? 2 : 1;
            arrForEach([UNDEF_VALUE, null], (nullValue) => {
                const seen: any[] = [];
                forEachOwnKey(obj, function(this: any) {
                    seen.push(this);
                }, nullValue);
                assert.equal(seen.length, expectedCalls, "Should visit every key");
                arrForEach(seen, (value) => {
                    assert.strictEqual(value, obj, dumpObj(nullValue) + " thisArg should use the object as this");
                });
            });

            arrForEach([0, "", false], (falsyValue) => {
                const seen: any[] = [];
                forEachOwnKey(obj, function(this: any) {
                    seen.push(this);
                }, falsyValue);
                assert.equal(seen.length, expectedCalls, "Should visit every key");
                arrForEach(seen, (value) => {
                    assert.strictEqual(value, falsyValue, "thisArg of " + dumpObj(falsyValue) + " should be used as-is");
                });
            });
        });
    });

    describe("forEachOwnKeySafe", () => {
        it("should iterate own enumerable keys for plain objects", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const visited: PropertyKey[] = [];

            forEachOwnKeySafe(obj, (key) => {
                visited.push(key);
            });

            assert.deepEqual(visited.sort(), ["a", "b", "c"], "Should visit all own enumerable keys");
        });

        it("should block special object poisoning keys", () => {
            const source: any = Object.create(null);
            source["safe"] = 1;
            source["__proto__"] = 2;
            source["constructor"] = 3;
            source["prototype"] = 4;

            const visited: PropertyKey[] = [];

            forEachOwnKeySafe(source, (key) => {
                visited.push(key);
            });

            assert.deepEqual(visited, ["safe"], "Should only visit safe keys");
        });

        it("should work with arrays while still blocking dangerous keys", () => {
            const value: any[] = [10, 20];
            (value as any)["extra"] = 30;
            (value as any)["constructor"] = 40;

            const visited: PropertyKey[] = [];
            const copied: any = {};

            forEachOwnKeySafe(value, (key, itemValue) => {
                visited.push(key);
                copied[key] = itemValue;
            });

            assert.includeMembers(visited, ["0", "1", "extra"], "Should include safe enumerable array keys");
            assert.notInclude(visited, "constructor", "Should block dangerous key from arrays");
            assert.equal(copied["0"], 10, "Should copy index values");
            assert.equal(copied["1"], 20, "Should copy index values");
            assert.equal(copied["extra"], 30, "Should copy custom enumerable array keys");
        });

        it("should support break behavior when callback returns -1", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const visited: PropertyKey[] = [];

            forEachOwnKeySafe(obj, (key) => {
                visited.push(key);
                if (key === "b") {
                    return -1;
                }
            });

            assert.isTrue(visited.length <= 2, "Should stop iteration after -1");
            assert.notInclude(visited, "c", "Should not continue after stop request");
        });

        it("should use provided thisArg", () => {
            const obj = { a: 1 };
            const thisArg = { n: "ctx" };
            let actualThis: any;

            forEachOwnKeySafe(obj, function(this: any) {
                actualThis = this;
            }, thisArg);

            assert.equal(actualThis, thisArg, "Should bind the callback to provided thisArg");
        });

        it("should use the object as this for null / undefined thisArg and falsy values as-is", () => {
            const obj: any = { a: 1 };
            if (hasSymbol()) {
                obj[Symbol("sym")] = 2;
            }

            const expectedCalls = hasSymbol() ? 2 : 1;
            arrForEach([UNDEF_VALUE, null], (nullValue) => {
                const seen: any[] = [];
                forEachOwnKeySafe(obj, function(this: any) {
                    seen.push(this);
                }, nullValue);
                assert.equal(seen.length, expectedCalls, "Should visit every key");
                arrForEach(seen, (value) => {
                    assert.strictEqual(value, obj, dumpObj(nullValue) + " thisArg should use the object as this");
                });
            });

            arrForEach([0, "", false], (falsyValue) => {
                const seen: any[] = [];
                forEachOwnKeySafe(obj, function(this: any) {
                    seen.push(this);
                }, falsyValue);
                assert.equal(seen.length, expectedCalls, "Should visit every key");
                arrForEach(seen, (value) => {
                    assert.strictEqual(value, falsyValue, "thisArg of " + dumpObj(falsyValue) + " should be used as-is");
                });
            });
        });

        it("should handle null and undefined values", () => {
            let callCount = 0;

            forEachOwnKeySafe(null, () => {
                callCount++;
            });

            forEachOwnKeySafe(undefined, () => {
                callCount++;
            });

            assert.equal(callCount, 0, "Should not call callback for null or undefined");
        });

        it("should continue iterating when a property getter throws", () => {
            const obj: any = { a: 1 };
            Object.defineProperty(obj, "b", {
                get: function() {
                    throw new Error("getter failed");
                },
                enumerable: true,
                configurable: true
            });
            obj.c = 3;

            const visited: { [key: string]: any } = {};
            assert.doesNotThrow(() => {
                forEachOwnKeySafe(obj, (key, value) => {
                    visited[key as string] = value;
                });
            }, "Should not throw when a getter throws");

            assert.deepEqual(Object.keys(visited).sort(), ["a", "b", "c"], "Should visit all keys including the throwing getter");
            assert.isUndefined(visited["b"], "Should pass undefined for the throwing getter");
        });
    });
});
