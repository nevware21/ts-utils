/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterMap } from "../../../../src/iterator/iterMap";
import { iterToArray } from "../../../../src/iterator/iterToArray";

describe("iterMap", () => {
    it("maps values lazily", () => {
        let values = iterToArray(iterMap([1, 2, 3], (value) => value * 10));
        assert.deepEqual(values, [10, 20, 30]);
    });

    it("does not call source.next after completion", () => {
        let callCount = 0;
        let source: Iterator<number> = {
            next: () => {
                callCount++;
                if (callCount === 1) {
                    return { done: false, value: 1 };
                }

                if (callCount === 2) {
                    return { done: true, value: undefined as any };
                }

                throw new Error("next called after completion");
            }
        };

        let mapped = iterMap(source, (value) => value * 2);
        assert.deepEqual(mapped.next(), { done: false, value: 2 });
        assert.equal(mapped.next().done, true);
        assert.equal(mapped.next().done, true);
        assert.equal(callCount, 2);
    });
});
