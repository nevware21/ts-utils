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
