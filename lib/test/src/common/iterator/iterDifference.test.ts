/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterDifference } from "../../../../src/iterator/iterDifference";

describe("iterDifference", () => {
    it("returns values absent from all exclude iterables", () => {
        let difference = iterDifference([1, 2, 3, 4, 5], createArrayIterator([2, 5]), [9, 4]);
        assert.deepEqual(difference, [1, 3]);
    });

    it("treats NaN as excluded when present", () => {
        let difference = iterDifference([NaN], [NaN]);
        assert.deepEqual(difference, []);
    });

    it("returns an empty array when called with no iterables", () => {
        assert.deepEqual((iterDifference as any)(), []);
    });

    it("returns every value (including duplicates) of the source when there are no exclude iterables", () => {
        assert.deepEqual(iterDifference([1, 1, 2]), [1, 1, 2]);
        assert.deepEqual(iterDifference(createArrayIterator([3, 3, 4])), [3, 3, 4]);
        assert.deepEqual(iterDifference([]), []);
        assert.deepEqual(iterDifference(null as any), []);
    });
});
