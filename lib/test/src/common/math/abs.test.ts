/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathAbs } from "../../../../src/math/abs";

describe("math abs", () => {
    it("mathAbs", () => {
        assert.equal(mathAbs(5), 5, "Checking positive number");
        assert.equal(mathAbs(-5), 5, "Checking negative number");
        assert.equal(mathAbs(0), 0, "Checking zero");
        assert.equal(mathAbs(-0), 0, "Checking negative zero");
        assert.equal(mathAbs(3.14), 3.14, "Checking positive decimal");
        assert.equal(mathAbs(-3.14), 3.14, "Checking negative decimal");
        assert.equal(mathAbs(Number.MAX_VALUE), Number.MAX_VALUE, "Checking MAX_VALUE");
        assert.equal(mathAbs(-Number.MAX_VALUE), Number.MAX_VALUE, "Checking negative MAX_VALUE");
        
        // Special cases
        assert.isTrue(isNaN(mathAbs(NaN)), "Checking NaN");
        assert.equal(mathAbs(Infinity), Infinity, "Checking Infinity");
        assert.equal(mathAbs(-Infinity), Infinity, "Checking negative Infinity");
    });
});
