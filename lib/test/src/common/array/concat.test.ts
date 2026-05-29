/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrConcat } from "../../../../src/array/concat";
import { createArrayIterator } from "../../../../src/iterator/array";

describe("arrConcat helper", () => {
    it("arrConcat returns a new concatenated array", () => {
        let target = [1];
        let result = arrConcat(target, [2, 3]);

        assert.notStrictEqual(result, target, "arrConcat should return a new array instance");
        assert.deepEqual(result, [1, 2, 3]);
        assert.deepEqual(target, [1], "arrConcat should not modify target");
    });

    it("arrConcat does not modify source arrays", () => {
        let left = [1, 2];
        let right = [3, 4];
        let result = arrConcat(left, right);

        assert.deepEqual(result, [1, 2, 3, 4]);
        assert.deepEqual(left, [1, 2], "left array should not be modified");
        assert.deepEqual(right, [3, 4], "right array should not be modified");
    });

    it("arrConcat keeps non-array values as a single element", () => {
        let target = [1];
        let iter = createArrayIterator([2, 3]);
        let result = arrConcat<any>(target, iter as any);

        assert.deepEqual(result, [1, iter], "concat should keep non-array values as a single element");
        assert.deepEqual(target, [1], "target should not be modified");
    });
});
