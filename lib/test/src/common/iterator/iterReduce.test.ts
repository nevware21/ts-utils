/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterReduce } from "../../../../src/iterator/iterReduce";

describe("iterReduce", () => {
    it("supports with and without initial value", () => {
        let total = iterReduce([1, 2, 3, 4], (previous, current) => (previous as number) + current, 0);
        assert.equal(total, 10);

        let maxValue = iterReduce(createArrayIterator([4, 9, 2]), (previous, current) => {
            return (previous as number) > current ? (previous as number) : current;
        });
        assert.equal(maxValue, 9);

        assert.throws(() => iterReduce([], (previous, current) => (previous as number) + current), TypeError);
    });
});
