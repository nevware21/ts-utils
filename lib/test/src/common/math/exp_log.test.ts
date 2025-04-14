/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathAbs } from "../../../../src/math/abs";
import { mathExp, mathLog } from "../../../../src/math/exp_log";

describe("math exp and log functions", () => {
    // Define this as constant since we don't have a direct alias for Math.E
    const E_VALUE = 2.718281828459045;
    
    it("mathExp", () => {
        assert.equal(mathExp(0), 1, "Checking exp(0)");
        
        // Instead of approximately, check if the absolute difference is within a small epsilon
        const epsilon = 0.000000000000001;
        assert.isTrue(mathAbs(mathExp(1) - E_VALUE) < epsilon, "Checking exp(1)");
        assert.isTrue(mathAbs(mathExp(2) - 7.3890560989306495) < epsilon, "Checking exp(2)");
        
        assert.equal(mathExp(-Infinity), 0, "Checking exp(-Infinity)");
        assert.equal(mathExp(Infinity), Infinity, "Checking exp(Infinity)");
        
        // Special cases - check for NaN by using its self-inequality property
        assert.notEqual(mathExp(NaN), mathExp(NaN), "Checking exp(NaN) is NaN");
    });    it("mathLog", () => {
        assert.equal(mathLog(1), 0, "Checking log(1)");
        
        // Instead of approximately, check if the absolute difference is within a small epsilon
        const epsilon = 0.0000000000000001;
        assert.isTrue(mathAbs(mathLog(E_VALUE) - 1) < epsilon, "Checking log(e)");
        assert.isTrue(mathAbs(mathLog(10) - 2.302585092994046) < epsilon, "Checking log(10)");
        
        assert.equal(mathLog(0), -Infinity, "Checking log(0)");
        assert.equal(mathLog(Infinity), Infinity, "Checking log(Infinity)");
        
        // Special cases - check for NaN by using its self-inequality property
        assert.notEqual(mathLog(-1), mathLog(-1), "Checking log(-1) is NaN");
        assert.notEqual(mathLog(NaN), mathLog(NaN), "Checking log(NaN) is NaN");
    });
});
