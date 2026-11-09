/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isAsyncIterable, isIterable, isIterator } from "../../../../src/iterator/iterator";
import { IAsyncIterable } from "../../../../src/iterator/types";

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

        it("should narrow a value so it can be used as a native AsyncIterable", async () => {
            async function _sum(value: any): Promise<number> {
                let total = 0;
                if (isAsyncIterable<number>(value)) {
                    for await (const item of value) {
                        total += item;
                    }
                }

                return total;
            }

            function _toNative(value: unknown): AsyncIterable<number> | null {
                return isAsyncIterable<number>(value) ? value : null;
            }

            assert.equal(await _sum(_asyncGenerator()), 1, "Should iterate the narrowed value");
            assert.equal(await _sum("value"), 0, "Should not iterate values that are not async iterable");
            assert.ok(_toNative(_asyncGenerator()), "Should return the async iterable");
            assert.equal(_toNative(1), null, "Should not return other values");
        });

        it("should accept native AsyncIterable values and retain their type", async () => {
            const native: AsyncIterable<number> = _asyncGenerator();
            const mixed = native as AsyncIterable<number> | string;
            const compatible: IAsyncIterable<number> = native;
            const backToNative: AsyncIterable<number> = compatible;

            let total = 0;
            if (isAsyncIterable(native)) {
                for await (const item of native) {
                    const value: number = item;
                    total += value;
                }
            }

            assert.equal(total, 1, "A native AsyncIterable is identified and keeps its type");
            assert.equal(isAsyncIterable(mixed) ? "async" : mixed.charAt(0), "async", "A union is narrowed to the native type");
            assert.equal(isAsyncIterable(backToNative), true, "The compatible type can be assigned back to the native type");
        });

        it("should remain distinct from sync iterator checks", () => {
            let asyncGenerator = _asyncGenerator();

            assert.equal(isIterable(asyncGenerator), false, "Async generators are not sync iterable");
            assert.equal(isIterator(asyncGenerator), true, "Async generators are iterators");
        });
    });
});
