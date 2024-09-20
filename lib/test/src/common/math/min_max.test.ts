/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathMax, mathMin } from "../../../../src/math/min_max";

describe("math helpers", () => {
    it("math min", () => {
        assert.equal(mathMin(10, 20), 10, "Checking 10, 20");
        assert.equal(mathMin(-10, -20), -20, "Checking -10, -20");
        assert.equal(mathMin(-10, 20), -10, "Checking -10, 20");
        assert.equal(mathMin(0, 1, 2, 3, 4, 5, 6, 7, -8, 9, 10, 11, 12), -8, "Checking 0, 1, 2, 3, 4, 5, 6, 7, -8, 9, 10, 11, 12");
        assert.equal(mathMin(99, 98, -1, 80, 70, 50, 20, 12), -1, "Checking 99, 98, -1, 80, 70, 50, 20, 12");
    });

    it("math max", () => {
        assert.equal(mathMax(10, 20), 20, "Checking 10, 20");
        assert.equal(mathMax(-10, -20), -10, "Checking -10, -20");
        assert.equal(mathMax(-10, 20), 20, "Checking -10, 20");
        assert.equal(mathMax(0, 1, 2, 3, 4, 5, 6, 7, -8, 9, 10, 11, 12), 12, "Checking 0, 1, 2, 3, 4, 5, 6, 7, -8, 9, 10, 11, 12");
        assert.equal(mathMax(99, 98, -1, 80, 70, 50, 20, 12), 99, "Checking 99, 98, -1, 80, 70, 50, 20, 12");
    });
});