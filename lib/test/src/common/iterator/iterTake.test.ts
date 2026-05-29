/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterTake } from "../../../../src/iterator/iterTake";
import { iterToArray } from "../../../../src/iterator/iterToArray";

describe("iterTake", () => {
    it("returns at most the requested number of values", () => {
        let values = iterToArray(iterTake([10, 20, 30, 40, 50], 3));
        assert.deepEqual(values, [10, 20, 30]);
    });

    it("normalizes fractional counts to an integer limit", () => {
        assert.deepEqual(iterToArray(iterTake([1, 2], 0.5)), []);
        assert.deepEqual(iterToArray(iterTake([1, 2, 3, 4], 2.5)), [1, 2]);
    });

    it("closes the wrapped iterator when the count limit is reached", () => {
        let nextCount = 0;
        let returnCount = 0;
        let source: Iterator<number> = {
            next: () => {
                nextCount++;
                return {
                    done: false,
                    value: nextCount
                };
            },
            return: (value?: any) => {
                returnCount++;
                return {
                    done: true,
                    value: value as number
                };
            }
        };

        let values = iterToArray(iterTake(source, 2));
        assert.deepEqual(values, [1, 2]);
        assert.equal(nextCount, 2, "source.next() should only be called for yielded values");
        assert.equal(returnCount, 1, "source.return() should be called once when limit is reached");
    });
});
