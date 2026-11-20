/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyArrFrom } from "../../../../src/polyfills/array";

// The array-like conversion cases (#644) are adapted from the tests contributed in PR #645
describe("polyArrFrom array-like conversion", () => {
    it("converts the length like Array.from", () => {
        const lengths: any[] = [3, 2.8, "2", true, false, 0, -1, -2.5, NaN, "bad", null, undefined];
        const expected: any[] = [
            ["a", "b", "c"],    // 3
            ["a", "b"],         // 2.8
            ["a", "b"],         // "2"
            ["a"],              // true
            [],                 // false
            [],                 // 0
            [],                 // -1
            [],                 // -2.5
            [],                 // NaN
            [],                 // "bad"
            [],                 // null
            []                  // undefined
        ];

        for (let idx = 0; idx < lengths.length; idx++) {
            const value = { length: lengths[idx], 0: "a", 1: "b", 2: "c" };
            assert.deepEqual(polyArrFrom(value), expected[idx], "Length " + String(lengths[idx]));
            if (Array.from) {
                assert.deepEqual(polyArrFrom(value), Array.from(value), "Like Array.from for the length " + String(lengths[idx]));
            }
        }
    });

    it("reads the length of an array-like once", () => {
        let lengthReads = 0;
        const value: any = { 0: "a", 1: "b" };
        Object.defineProperty(value, "length", {
            get: () => {
                lengthReads++;
                return 2;
            }
        });

        assert.deepEqual(polyArrFrom(value), ["a", "b"]);
        assert.equal(lengthReads, 1, "The length was only read once");
    });

    it("reads an inherited index of an array-like", () => {
        const value = Object.create({ 1: "inherited" });
        value.length = 3;
        value[0] = "own";

        const result = polyArrFrom(value);
        assert.deepEqual(result, ["own", "inherited", undefined]);
        assert.deepEqual(Object.keys(result), ["0", "1", "2"], "Every index is an own property of the result");
    });

    it("uses the initial length of an array-like and reads each index as it is visited", () => {
        function _changeWhenFirst(copy: (value: any, mapFn: (item: any, index: number) => any) => any[]) {
            const value: any = { length: 3, 0: "a", 1: "b", 2: "c" };

            return copy(value, (item, index) => {
                if (index === 0) {
                    value.length = 1;
                    delete value[1];
                    value[2] = "changed";
                }

                return item;
            });
        }

        assert.deepEqual(_changeWhenFirst(polyArrFrom), ["a", undefined, "changed"]);
        if (Array.from) {
            assert.deepEqual(_changeWhenFirst(polyArrFrom), _changeWhenFirst(Array.from), "Like Array.from");
        }
    });
});

describe("polyArrFrom of an array which the mapFn changes", () => {
    // Like the native array iterator, an array's length is read for each index
    function _fromWith(copy: (value: any, mapFn: (item: any, index: number) => any) => any[], change: (theArray: any[], index: number) => void) {
        const theArray: any[] = [1, 2, 3, 4];

        return copy(theArray, (item, index) => {
            change(theArray, index);
            return item;
        });
    }

    it("stops at the new length when the mapFn removes values", () => {
        const pop = (theArray: any[]) => {
            theArray.pop();
        };
        const shift = (theArray: any[], index: number) => {
            index === 0 && theArray.shift();
        };
        const truncate = (theArray: any[]) => {
            theArray.length = 0;
        };

        assert.deepEqual(_fromWith(polyArrFrom, pop), [1, 2], "pop()");
        assert.deepEqual(_fromWith(polyArrFrom, shift), [1, 3, 4], "shift()");
        assert.deepEqual(_fromWith(polyArrFrom, truncate), [1], "length = 0");

        if (Array.from) {
            assert.deepEqual(_fromWith(polyArrFrom, pop), _fromWith(Array.from, pop), "pop() like Array.from");
            assert.deepEqual(_fromWith(polyArrFrom, shift), _fromWith(Array.from, shift), "shift() like Array.from");
            assert.deepEqual(_fromWith(polyArrFrom, truncate), _fromWith(Array.from, truncate), "length = 0 like Array.from");
        }
    });

    it("reads a value which the mapFn adds", () => {
        const pushOnce = (theArray: any[], index: number) => {
            index === 0 && theArray.push("new");
        };

        assert.deepEqual(_fromWith(polyArrFrom, pushOnce), [1, 2, 3, 4, "new"]);
        if (Array.from) {
            assert.deepEqual(_fromWith(polyArrFrom, pushOnce), _fromWith(Array.from, pushOnce), "Like Array.from");
        }
    });
});
