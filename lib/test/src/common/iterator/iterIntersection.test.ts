/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterIntersection } from "../../../../src/iterator/iterIntersection";

describe("iterIntersection", () => {
    it("returns values present in all iterables", () => {
        let intersection = iterIntersection([1, 2, 3, 4], createArrayIterator([2, 4, 6]), [0, 2, 4]);
        assert.deepEqual(intersection, [2, 4]);
    });

    it("treats NaN as present across inputs", () => {
        let intersection = iterIntersection([NaN], [NaN]);
        assert.equal(intersection.length, 1);
        assert.equal(intersection[0] !== intersection[0], true);
    });

    it("deduplicates repeated NaN values from the first iterable", () => {
        let intersection = iterIntersection([NaN, NaN, NaN], [NaN]);
        assert.equal(intersection.length, 1);
        assert.equal(intersection[0] !== intersection[0], true);
    });
});
