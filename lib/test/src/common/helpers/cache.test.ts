/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { createCachedValue, createDeferredCachedValue } from "../../../../src/helpers/cache";

describe("cache helpers", () => {
    describe("createCachedValue", () => {
        it("validate value", () => {
            let cachedValue = createCachedValue("hello darkness");
            assert.equal(cachedValue.v, "hello darkness");
        });

        it("validate readonly", () => {
            let cachedValue = createCachedValue("hello darkness");
            assert.throws(() => {
                (cachedValue as any).v = "my old friend";
            });
        });

        it("validate json", () => {
            let cachedValue = createCachedValue("hello darkness");
            assert.equal(JSON.stringify(cachedValue), "\"hello darkness\"");

            let cachedValue2 = createCachedValue({ hello: "darkness" });
            assert.equal(JSON.stringify(cachedValue2), "{\"hello\":\"darkness\"}");
        });

        it("validate numeric value", () => {
            let cachedValue = createCachedValue(42);
            assert.equal(cachedValue.v, 42);
        });

        it("validate object value", () => {
            let cachedValue = createCachedValue({ hello: "darkness" });
            assert.deepEqual(cachedValue.v, { hello: "darkness" });
        });

        it("validate array value", () => {
            let cachedValue = createCachedValue([1, 2, 3]);
            assert.deepEqual(cachedValue.v, [1, 2, 3]);
        });

        it("validate boolean value", () => {
            let cachedValue = createCachedValue(true);
            assert.equal(cachedValue.v, true);
        });

        it("validate null value", () => {
            let cachedValue = createCachedValue(null);
            assert.equal(cachedValue.v, null);
        });

        it("validate undefined value", () => {
            let cachedValue = createCachedValue(undefined);
            assert.equal(cachedValue.v, undefined);
        });

        it("validate date value", () => {
            let cachedValue = createCachedValue(new Date());
            assert.equal(cachedValue.v instanceof Date, true);
        });

        it("validate function value", () => {
            let cachedValue = createCachedValue(() => { });
            assert.equal(typeof cachedValue.v, "function");
        });

        it("validate symbol value", () => {
            let cachedValue = createCachedValue(Symbol("hello darkness"));
            assert.equal(typeof cachedValue.v, "symbol");
        });

        it("validate bigint value", () => {
            let cachedValue = createCachedValue(BigInt(42));
            assert.equal(typeof cachedValue.v, "bigint");
        });
    });

    describe("createDeferredCacheValue", () => {
        it("validate value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => "hello darkness");
            assert.equal(deferredCacheValue.v, "hello darkness");
        });

        it("validate readonly", () => {
            let deferredCacheValue = createDeferredCachedValue(() => "hello darkness");
            assert.throws(() => {
                (deferredCacheValue as any).v = "my old frield";
            });
        });

        it("validate json", () => {
            let deferredCacheValue = createDeferredCachedValue(() => "hello darkness");
            assert.equal(JSON.stringify(deferredCacheValue), "\"hello darkness\"");
        });

        it("validate numeric value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => 42);
            assert.equal(deferredCacheValue.v, 42);
        });

        it("validate object value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => ({ hello: "darkness" }));
            assert.deepEqual(deferredCacheValue.v, { hello: "darkness" });
        });

        it("validate object json", () => {
            let deferredCacheValue = createDeferredCachedValue(() => ({ hello: "darkness" }));
            assert.equal(JSON.stringify(deferredCacheValue), "{\"hello\":\"darkness\"}");
        });

        it("validate array value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => [1, 2, 3]);
            assert.deepEqual(deferredCacheValue.v, [1, 2, 3]);
        });

        it("validate array json", () => {
            let deferredCacheValue = createDeferredCachedValue(() => [1, 2, 3]);
            assert.equal(JSON.stringify(deferredCacheValue), "[1,2,3]");
        });

        it("validate boolean value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => true);
            assert.equal(deferredCacheValue.v, true);
        });

        it("validate null value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => null);
            assert.equal(deferredCacheValue.v, null);
        });

        it("validate undefined value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => undefined);
            assert.equal(deferredCacheValue.v, undefined);
        });

        it("validate date value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => new Date());
            assert.equal(deferredCacheValue.v instanceof Date, true);
        });

        it("validate function value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => () => { });
            assert.equal(typeof deferredCacheValue.v, "function");
        });

        it("validate symbol value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => Symbol("hello darkness"));
            assert.equal(typeof deferredCacheValue.v, "symbol");
        });

        it("validate bigint value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => BigInt(42));
            assert.equal(typeof deferredCacheValue.v, "bigint");
        });

        it("validate callback is not called until accessed", () => {
            let called = 0;
            let deferredCacheValue = createDeferredCachedValue(() => {
                called++;
                return "hello darkness";
            });

            assert.equal(called, 0);
            assert.equal(deferredCacheValue.v, "hello darkness");
            assert.equal(called, 1);
            assert.equal(deferredCacheValue.v, "hello darkness");
            assert.equal(called, 1);
        });

        it("validate callback is not called until accessed - with error", () => {
            let called = 0;
            let deferredCacheValue = createDeferredCachedValue(() => {
                called++;
                throw new Error("hello darkness");
            });

            assert.equal(called, 0);
            assert.throws(() => deferredCacheValue.v);
            assert.equal(called, 1);
            assert.throws(() => deferredCacheValue.v);
            assert.equal(called, 2);
        });
    });
});