/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrPartition } from "../../../../src/array/partition";

describe("arrPartition", () => {
    it("should split array based on predicate", () => {
        const [evens, odds] = arrPartition([1, 2, 3, 4, 5], x => x % 2 === 0);
        assert.deepEqual(evens, [2, 4]);
        assert.deepEqual(odds, [1, 3, 5]);
    });

    it("should handle string length predicate", () => {
        const [long, short] = arrPartition(["a", "bb", "ccc"], x => x.length > 1);
        assert.deepEqual(long, ["bb", "ccc"]);
        assert.deepEqual(short, ["a"]);
    });

    it("should handle all matching predicate", () => {
        const [match, noMatch] = arrPartition([2, 4, 6], x => x % 2 === 0);
        assert.deepEqual(match, [2, 4, 6]);
        assert.deepEqual(noMatch, []);
    });

    it("should handle no matching predicate", () => {
        const [match, noMatch] = arrPartition([1, 3, 5], x => x % 2 === 0);
        assert.deepEqual(match, []);
        assert.deepEqual(noMatch, [1, 3, 5]);
    });

    it("should handle empty array", () => {
        const [match, noMatch] = arrPartition([], x => x > 0);
        assert.deepEqual(match, []);
        assert.deepEqual(noMatch, []);
    });

    it("should handle null and undefined", () => {
        const [m1, n1] = arrPartition<any, any>(null, x => x > 0);
        assert.deepEqual(m1, []);
        assert.deepEqual(n1, []);

        const [m2, n2] = arrPartition<any, any>(undefined, x => x > 0);
        assert.deepEqual(m2, []);
        assert.deepEqual(n2, []);
    });

    it("should work with array-like objects", () => {
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: 3, 3: 4 };
        const [evens, odds] = arrPartition(arrayLike, x => x % 2 === 0);
        assert.deepEqual(evens, [2, 4]);
        assert.deepEqual(odds, [1, 3]);
    });

    it("should support thisArg", () => {
        const threshold = { value: 3 };
        const [match, noMatch] = arrPartition([1, 2, 3, 4, 5], function(x) {
            return x > this.value;
        }, threshold);
        assert.deepEqual(match, [4, 5]);
        assert.deepEqual(noMatch, [1, 2, 3]);
    });
});
