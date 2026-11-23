/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { mathToInt } from "../../../../src/math/to_int";

describe("mathToInt", () => {
    it("converts a value like ToIntegerOrInfinity, so -0 (or a value between -1 and 0) is 0", () => {
        const isPositiveZero = (value: number) => value === 0 && 1 / value === Infinity;

        assert.isTrue(isPositiveZero(mathToInt(-0)), "-0 is 0");
        assert.isTrue(isPositiveZero(mathToInt(-0.5)), "-0.5 is 0");
        assert.isTrue(isPositiveZero(mathToInt("-0.2")), "\"-0.2\" is 0");
        assert.isTrue(isPositiveZero(mathToInt(NaN)), "NaN is 0");
        assert.isTrue(isPositiveZero(mathToInt({
            valueOf: () => -0.2
        })), "An object whose valueOf() returns -0.2 is 0");

        // Like the native functions which use ToIntegerOrInfinity, eg. the index of Array.prototype.at()
        const nativeAt = (Array.prototype as any).at;
        if (nativeAt) {
            assert.equal(nativeAt.call([1, 2], -0.5), 1, "Array.prototype.at(-0.5) uses index 0");
        }

        assert.equal(mathToInt(1.5), 1);
        assert.equal(mathToInt(-1.5), -1);
        assert.equal(mathToInt(Infinity), Infinity);
        assert.equal(mathToInt(-Infinity), -Infinity);
    });

    it("converts the value once", () => {
        let calls = 0;
        const value = {
            valueOf: () => {
                calls++;
                return 2.5;
            }
        };

        assert.equal(mathToInt(value), 2);
        assert.equal(calls, 1);
    });
});
