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
    });
});
