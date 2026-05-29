/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterFilter } from "../../../../src/iterator/iterFilter";
import { iterToArray } from "../../../../src/iterator/iterToArray";

describe("iterFilter", () => {
    it("filters values lazily", () => {
        let values = iterToArray(iterFilter([1, 2, 3, 4, 5], (value) => value % 2 === 0));
        assert.deepEqual(values, [2, 4]);
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

        let filtered = iterFilter(source, () => true);
        assert.deepEqual(filtered.next(), { done: false, value: 1 });
        assert.equal(filtered.next().done, true);
        assert.equal(filtered.next().done, true);
        assert.equal(callCount, 2);
    });
});
