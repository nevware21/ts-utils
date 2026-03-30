/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isAsyncIterable, isIterable, isIterator } from "../../../../src/iterator/iterator";

describe("ESNext iterator tests", () => {
    async function* _asyncGenerator() {
        yield 1;
    }

    function* _generator() {
        yield 1;
    }

    describe("isAsyncIterable", () => {
        it("should identify async iterable values", () => {
            let asyncGenerator = _asyncGenerator();
            let customAsyncIterable = {
                [Symbol.asyncIterator]: function() {
                    return asyncGenerator;
                }
            };

            assert.equal(isAsyncIterable(asyncGenerator), true, "Should identify async generator instances");
            assert.equal(isAsyncIterable(customAsyncIterable), true, "Should identify objects with Symbol.asyncIterator");
        });

        it("should reject non async iterable values", () => {
            assert.equal(isAsyncIterable(null), false, "Should handle null");
            assert.equal(isAsyncIterable(undefined), false, "Should handle undefined");
            assert.equal(isAsyncIterable("value"), false, "Should reject strings");
            assert.equal(isAsyncIterable([]), false, "Should reject arrays");
            assert.equal(isAsyncIterable(_generator()), false, "Should reject sync generators");
            assert.equal(isAsyncIterable({ [Symbol.asyncIterator]: 1 } as any), false, "Should require function async iterator");
        });

        it("should remain distinct from sync iterator checks", () => {
            let asyncGenerator = _asyncGenerator();

            assert.equal(isIterable(asyncGenerator), false, "Async generators are not sync iterable");
            assert.equal(isIterator(asyncGenerator), true, "Async generators are iterators");
        });
    });
});
