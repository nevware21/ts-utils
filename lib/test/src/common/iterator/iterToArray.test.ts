/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createArrayIterator } from "../../../../src/iterator/array";
import { createRangeIterator } from "../../../../src/iterator/range";
import { iterToArray } from "../../../../src/iterator/iterToArray";

describe("iterToArray", () => {
    it("supports iterables and iterators", () => {
        let fromIterable = iterToArray(createRangeIterator(1, 3));
        assert.deepEqual(fromIterable, [1, 2, 3]);

        let fromIterator = iterToArray(createArrayIterator([10, 20, 30]), (value, idx) => value + idx);
        assert.deepEqual(fromIterator, [10, 21, 32]);
    });

    it("supports array-like values", () => {
        let arrayLike: ArrayLike<number> = {
            0: 10,
            1: 20,
            2: 30,
            length: 3
        };

        let values = iterToArray(arrayLike, (value, idx) => value + idx);
        assert.deepEqual(values, [10, 21, 32]);
    });
});

describe("iterToArray with an array-like which isn't iterable", () => {
    it("converts the length like the native functions", () => {
        assert.deepEqual(iterToArray({ length: 2.5, 0: "a", 1: "b", 2: "c" } as any), ["a", "b"], "A fractional length is truncated");
        assert.deepEqual(iterToArray({ length: -1, 0: "a" } as any), [], "A negative length is 0");
        assert.deepEqual(iterToArray({ length: NaN, 0: "a" } as any), [], "A NaN length is 0");

        const nativeFrom = (Array as any).from;
        if (nativeFrom) {
            assert.deepEqual(iterToArray({ length: 2.5, 0: "a", 1: "b", 2: "c" } as any), nativeFrom({ length: 2.5, 0: "a", 1: "b", 2: "c" }));
        }
    });

    it("throws a RangeError for a length which is longer than an array can be, rather than never ending", () => {
        assert.throws(() => iterToArray({ length: Infinity } as any), RangeError);
        assert.throws(() => iterToArray({ length: Math.pow(2, 32) } as any), RangeError);
    });

    it("reads the values by index when it has a next which is not a function (as in v0.16.0)", () => {
        assert.deepEqual(iterToArray({ length: 2, 0: "a", 1: "b", next: 5 } as any), ["a", "b"], "A number");
        assert.deepEqual(iterToArray({ length: 2, 0: "a", 1: "b", next: "x" } as any), ["a", "b"], "A string");
        assert.deepEqual(iterToArray({ length: 2, 0: "a", 1: "b", next: {} } as any), ["a", "b"], "An object");
        assert.deepEqual(iterToArray({ length: 2, 0: "a", 1: "b", next: 5 } as any, (value: any, idx) => value + idx), ["a0", "b1"], "With a callbackfn");
    });
});
