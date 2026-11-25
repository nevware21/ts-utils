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
import { iterUnion } from "../../../../src/iterator/iterUnion";
import { getGlobal } from "../../../../src/helpers/environment";

describe("iterUnion", () => {
    it("returns unique values from all iterables", () => {
        let union = iterUnion([1, 2, 3], createArrayIterator([3, 4, 5]), createRangeIterator(5, 6));
        assert.deepEqual(union, [1, 2, 3, 4, 5, 6]);
    });

    it("treats NaN as a duplicate value", () => {
        let union = iterUnion([NaN], [NaN]);
        assert.equal(union.length, 1);
        assert.equal(union[0] !== union[0], true);
    });

    it("returns an empty array when called with no iterables", () => {
        assert.deepEqual((iterUnion as any)(), []);
    });

    it("returns the unique values when called with one iterable", () => {
        assert.deepEqual(iterUnion([1, 1, 2]), [1, 2]);
        assert.deepEqual(iterUnion(createArrayIterator([3, 3, 4])), [3, 4]);
        assert.deepEqual(iterUnion([]), []);
        assert.deepEqual(iterUnion(null as any), []);
    });

    it("treats -0 and +0 as the same value, keeping the first", () => {
        let union = iterUnion([-0, 1], createArrayIterator([0, 2]));
        assert.deepEqual(union, [-0, 1, 2]);
        assert.equal(1 / union[0], -Infinity, "The first value (-0) is kept");

        union = iterUnion([0], [-0]);
        assert.deepEqual(union, [0]);
        assert.equal(1 / union[0], Infinity, "The first value (+0) is kept");
    });

    it("should find each value with the runtime's Set, rather than by searching the result", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const searched: any[] = [];
        let result: number[];

        // A Set which records the values it is searched for. It finds NaN and treats -0 and +0 as the same value, so
        // once it has been checked (by searching for NaN and -0) it is used directly
        theGlobal.Set = function () {
            const values = new orgSet();

            return {
                has: (value: any) => {
                    searched.push(value);
                    return values.has(value);
                },
                add: (value: any) => {
                    values.add(value);
                }
            };
        };

        try {
            result = iterUnion([4, 5], [5, 6]);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(result, [4, 5, 6]);
        assert.deepEqual(searched, [NaN, -0, 4, 5, 5, 6], "The check of NaN and -0, then each value");
    });
});
