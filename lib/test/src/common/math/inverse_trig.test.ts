/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathAbs } from "../../../../src/math/abs";
import { mathAsin, mathAcos, mathAtan, mathAtan2 } from "../../../../src/math/inverse_trig";

describe("math inverse trigonometric functions", () => {
    const PI = Math.PI;
    const epsilon = 0.000000000000001;
    
    it("mathAsin", () => {
        assert.equal(mathAsin(0), 0, "Checking asin(0)");
        assert.isTrue(mathAbs(mathAsin(0.5) - PI / 6) < epsilon, "Checking asin(0.5)");
        assert.isTrue(mathAbs(mathAsin(0.7071067811865475) - PI / 4) < epsilon, "Checking asin(√2/2)");
        assert.isTrue(mathAbs(mathAsin(0.8660254037844386) - PI / 3) < epsilon, "Checking asin(√3/2)");
        assert.isTrue(mathAbs(mathAsin(1) - PI / 2) < epsilon, "Checking asin(1)");
        assert.isTrue(mathAbs(mathAsin(-1) - (-PI / 2)) < epsilon, "Checking asin(-1)");
        
        // Out of domain values
        assert.notEqual(mathAsin(1.1), mathAsin(1.1), "Checking asin(1.1) is NaN");
        assert.notEqual(mathAsin(-1.1), mathAsin(-1.1), "Checking asin(-1.1) is NaN");
        
        // Special cases
        assert.notEqual(mathAsin(NaN), mathAsin(NaN), "Checking asin(NaN) is NaN");
    });
    it("mathAcos", () => {
        assert.isTrue(mathAbs(mathAcos(0) - PI / 2) < epsilon, "Checking acos(0)");
        assert.isTrue(mathAbs(mathAcos(0.5) - PI / 3) < epsilon, "Checking acos(0.5)");
        assert.isTrue(mathAbs(mathAcos(0.7071067811865476) - PI / 4) < epsilon, "Checking acos(√2/2)");
        assert.isTrue(mathAbs(mathAcos(0.8660254037844387) - PI / 6) < epsilon, "Checking acos(√3/2)");
        assert.isTrue(mathAbs(mathAcos(1) - 0) < epsilon, "Checking acos(1)");
        assert.isTrue(mathAbs(mathAcos(-1) - PI) < epsilon, "Checking acos(-1)");
        
        // Out of domain values
        assert.notEqual(mathAcos(1.1), mathAcos(1.1), "Checking acos(1.1) is NaN");
        assert.notEqual(mathAcos(-1.1), mathAcos(-1.1), "Checking acos(-1.1) is NaN");
        
        // Special cases
        assert.notEqual(mathAcos(NaN), mathAcos(NaN), "Checking acos(NaN) is NaN");
    });
    it("mathAtan", () => {
        assert.equal(mathAtan(0), 0, "Checking atan(0)");
        assert.isTrue(mathAbs(mathAtan(1) - PI / 4) < epsilon, "Checking atan(1)");
        assert.isTrue(mathAbs(mathAtan(Infinity) - PI / 2) < epsilon, "Checking atan(Infinity)");
        assert.isTrue(mathAbs(mathAtan(-Infinity) - (-PI / 2)) < epsilon, "Checking atan(-Infinity)");
        
        // Special cases
        assert.notEqual(mathAtan(NaN), mathAtan(NaN), "Checking atan(NaN) is NaN");
    });
    
    it("mathAtan2", () => {
        // First quadrant (x > 0, y > 0)
        assert.isTrue(mathAbs(mathAtan2(1, 1) - PI / 4) < epsilon, "Checking atan2(1, 1)");
        
        // Second quadrant (x < 0, y > 0)
        assert.isTrue(mathAbs(mathAtan2(1, -1) - 3 * PI / 4) < epsilon, "Checking atan2(1, -1)");
        
        // Third quadrant (x < 0, y < 0)
        assert.isTrue(mathAbs(mathAtan2(-1, -1) - (-3 * PI / 4)) < epsilon, "Checking atan2(-1, -1)");
        
        // Fourth quadrant (x > 0, y < 0)
        assert.isTrue(mathAbs(mathAtan2(-1, 1) - (-PI / 4)) < epsilon, "Checking atan2(-1, 1)");
        
        // Special cases
        assert.equal(mathAtan2(0, 0), 0, "Checking atan2(0, 0)");
        assert.equal(mathAtan2(0, 1), 0, "Checking atan2(0, 1)");
        assert.equal(mathAtan2(1, 0), PI / 2, "Checking atan2(1, 0)");
        assert.equal(mathAtan2(0, -1), PI, "Checking atan2(0, -1)");
        assert.equal(mathAtan2(-1, 0), -PI / 2, "Checking atan2(-1, 0)");
        
        assert.notEqual(mathAtan2(NaN, 1), mathAtan2(NaN, 1), "Checking atan2(NaN, 1) is NaN");
        assert.notEqual(mathAtan2(1, NaN), mathAtan2(1, NaN), "Checking atan2(1, NaN) is NaN");
    });
});
