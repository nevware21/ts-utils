/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathAbs } from "../../../../src/math/abs";
import { mathSin, mathCos, mathTan } from "../../../../src/math/trig";

describe("math trigonometric functions", () => {
    const PI = Math.PI;
    const epsilon = 0.000000000000001;
    
    it("mathSin", () => {
        assert.equal(mathSin(0), 0, "Checking sin(0)");
        assert.isTrue(mathAbs(mathSin(PI / 6) - 0.5) < epsilon, "Checking sin(π/6)");
        assert.isTrue(mathAbs(mathSin(PI / 4) - 0.7071067811865475) < epsilon, "Checking sin(π/4)");
        assert.isTrue(mathAbs(mathSin(PI / 3) - 0.8660254037844386) < epsilon, "Checking sin(π/3)");
        assert.isTrue(mathAbs(mathSin(PI / 2) - 1) < epsilon, "Checking sin(π/2)");
        assert.isTrue(mathAbs(mathSin(PI) - 0) < epsilon, "Checking sin(π)");
        assert.isTrue(mathAbs(mathSin(3 * PI / 2) - (-1)) < epsilon, "Checking sin(3π/2)");
        assert.isTrue(mathAbs(mathSin(2 * PI) - 0) < epsilon, "Checking sin(2π)");
        
        // Special cases
        assert.notEqual(mathSin(NaN), mathSin(NaN), "Checking sin(NaN) is NaN");
        assert.equal(mathSin(0), 0, "Checking sin(0)");
    });
    it("mathCos", () => {
        assert.equal(mathCos(0), 1, "Checking cos(0)");
        assert.isTrue(mathAbs(mathCos(PI / 6) - 0.8660254037844387) < epsilon, "Checking cos(π/6)");
        assert.isTrue(mathAbs(mathCos(PI / 4) - 0.7071067811865476) < epsilon, "Checking cos(π/4)");
        assert.isTrue(mathAbs(mathCos(PI / 3) - 0.5) < epsilon, "Checking cos(π/3)");
        assert.isTrue(mathAbs(mathCos(PI / 2) - 0) < epsilon, "Checking cos(π/2)");
        assert.isTrue(mathAbs(mathCos(PI) - (-1)) < epsilon, "Checking cos(π)");
        assert.isTrue(mathAbs(mathCos(3 * PI / 2) - 0) < epsilon, "Checking cos(3π/2)");
        assert.isTrue(mathAbs(mathCos(2 * PI) - 1) < epsilon, "Checking cos(2π)");
        
        // Special cases
        assert.notEqual(mathCos(NaN), mathCos(NaN), "Checking cos(NaN) is NaN");
    });
    
    it("mathTan", () => {
        assert.equal(mathTan(0), 0, "Checking tan(0)");
        assert.isTrue(mathAbs(mathTan(PI / 6) - 0.5773502691896257) < epsilon, "Checking tan(π/6)");
        assert.isTrue(mathAbs(mathTan(PI / 4) - 1) < epsilon, "Checking tan(π/4)");
        assert.isTrue(mathAbs(mathTan(PI / 3) - 1.7320508075688767) < epsilon, "Checking tan(π/3)");
        // tan(π/2) is undefined (Infinity), but JavaScript returns a very large number
        assert.isTrue(mathAbs(mathTan(PI) - 0) < epsilon, "Checking tan(π)");
        // tan(3π/2) is undefined (Infinity), but JavaScript returns a very large number
        assert.isTrue(mathAbs(mathTan(2 * PI) - 0) < epsilon, "Checking tan(2π)");
        
        // Special cases
        assert.notEqual(mathTan(NaN), mathTan(NaN), "Checking tan(NaN) is NaN");
    });
});
