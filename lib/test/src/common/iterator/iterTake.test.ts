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

    it("closes the wrapped iterator after the consumer has received the last value", () => {
        const log: string[] = [];
        let value = 0;
        const source: Iterator<number> = {
            next: () => ({ done: false, value: ++value }),
            return: (result?: any) => {
                log.push("closed");
                return { done: true, value: result };
            }
        };

        const iter = iterTake(source, 2);
        log.push("got" + iter.next().value);
        log.push("got" + iter.next().value);

        assert.deepEqual(log, ["got1", "got2"], "The source is still open when the last value is received");

        assert.equal(iter.next().done, true, "The iteration is complete");
        assert.deepEqual(log, ["got1", "got2", "closed"], "The source is closed by the following next()");
        assert.equal(iter.next().done, true, "The iteration stays complete");
        assert.deepEqual(log, ["got1", "got2", "closed"], "The source is only closed once");
    });
});
