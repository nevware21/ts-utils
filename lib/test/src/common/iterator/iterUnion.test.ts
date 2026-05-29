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
});
