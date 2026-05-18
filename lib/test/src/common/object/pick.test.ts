/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objPick, objOmit, objPickBy, objOmitBy } from "../../../../src/object/pick";
import { hasSymbol } from "../../../../src/symbol/symbol";

describe("object pick utilities", () => {

    // ─── objPick ────────────────────────────────────────────────────────────────

    describe("objPick", () => {
        it("should pick specified keys", () => {
            const obj = { a: 1, b: "hello", c: true };
            assert.deepEqual(objPick(obj, ["a", "c"] as const), { a: 1, c: true });
        });

        it("should pick a single key", () => {
            const obj = { x: 10, y: 20 };
            assert.deepEqual(objPick(obj, ["x"] as const), { x: 10 });
        });

        it("should return empty object for empty keys array", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objPick(obj, []), {});
        });

        it("should silently skip keys not present on source", () => {
            const obj = { a: 1 };
            const result = objPick(obj, ["a", "missing" as any]);
            assert.deepEqual(result, { a: 1 });
            assert.isFalse("missing" in result);
        });

        it("should return empty object when source is null", () => {
            assert.deepEqual(objPick(null as any, ["a"]) as any, {});
        });

        it("should return empty object when source is undefined", () => {
            assert.deepEqual(objPick(undefined as any, ["a"]) as any, {});
        });

        it("should handle null values in the object", () => {
            const obj: { a: null; b: number } = { a: null, b: 2 };
            assert.deepEqual(objPick(obj, ["a"]), { a: null } as Pick<typeof obj, "a">);
        });

        it("should handle undefined values in the object", () => {
            const obj: { a: undefined; b: number } = { a: undefined, b: 2 };
            const result = objPick(obj, ["a"]);
            assert.isTrue("a" in result);
            assert.isUndefined(result.a);
        });

        it("should not include inherited properties", () => {
            const proto = { inherited: 42 };
            const obj = Object.create(proto);
            obj.own = 1;
            const result = objPick(obj, ["own", "inherited"]);
            assert.isTrue("own" in result);
            assert.isFalse("inherited" in result);
        });

        it("should preserve all picked values", () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            const result = objPick(obj, ["a", "b", "c", "d"]);
            assert.deepEqual(result, obj);
        });

        it("should not pick non-enumerable own properties", () => {
            const obj: any = {};
            Object.defineProperty(obj, "hidden", {
                value: 1,
                enumerable: false
            });
            obj.visible = 2;

            const result = objPick(obj, ["hidden", "visible"]);
            assert.equal((result as any).visible, 2);
            assert.isFalse("hidden" in result);
        });
    });

    // ─── objOmit ────────────────────────────────────────────────────────────────

    describe("objOmit", () => {
        it("should omit specified keys", () => {
            const obj = { a: 1, b: "hello", c: true };
            assert.deepEqual(objOmit(obj, ["b"]), { a: 1, c: true });
        });

        it("should omit multiple keys", () => {
            const obj = { a: 1, b: 2, c: 3 };
            assert.deepEqual(objOmit(obj, ["a", "c"]), { b: 2 });
        });

        it("should return a full copy when keys array is empty", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objOmit(obj, []), { a: 1, b: 2 });
        });

        it("should silently ignore keys not on source", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objOmit(obj, ["missing" as any]), { a: 1, b: 2 });
        });

        it("should return empty object when source is null", () => {
            assert.deepEqual(objOmit(null as any, ["a"]), {});
        });

        it("should return empty object when source is undefined", () => {
            assert.deepEqual(objOmit(undefined as any, ["a"]), {});
        });

        it("should not include inherited properties", () => {
            const proto = { inherited: 42 };
            const child: any = Object.create(proto);
            child.own = 1;
            child.extra = 2;
            const result = objOmit(child, ["extra"]);
            assert.deepEqual(result, { own: 1 });
        });

        it("should omit all keys when all are specified", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objOmit(obj, ["a", "b"]), {});
        });

        it("should omit numeric keys using their runtime property names", () => {
            const obj = { 1: "x", 2: "y" };
            assert.deepEqual(objOmit(obj, [1]), { 2: "y" });
        });

        it("should preserve enumerable symbol properties not in keys", () => {
            if (!hasSymbol()) {
                return;
            }

            const sym1 = Symbol("sym1");
            const sym2 = Symbol("sym2");
            const obj: any = { a: 1, b: 2 };
            obj[sym1] = "symbol1";
            obj[sym2] = "symbol2";

            const result = objOmit(obj, ["a", sym1]);
            assert.equal(result.b, 2);
            assert.isFalse("a" in result);
            assert.equal(result[sym2], "symbol2");
            assert.isFalse(sym1 in result);
        });
    });

    // ─── objPickBy ──────────────────────────────────────────────────────────────

    describe("objPickBy", () => {
        it("should pick by value predicate", () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            assert.deepEqual(objPickBy(obj, (_k, v) => v > 2), { c: 3, d: 4 });
        });

        it("should pick by key predicate", () => {
            const obj = { a: 1, b: 2, c: 3 };
            assert.deepEqual(objPickBy(obj, (k) => k !== "b"), { a: 1, c: 3 });
        });

        it("should return empty object when no property matches", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objPickBy(obj, () => false), {});
        });

        it("should return all properties when all match", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objPickBy(obj, () => true), { a: 1, b: 2 });
        });

        it("should return empty object when source is null or undefined", () => {
            assert.deepEqual(objPickBy(null as any, () => true), {});
            assert.deepEqual(objPickBy(undefined as any, () => true), {});
        });

        it("should receive correct key and value in predicate", () => {
            const obj = { x: 10 };
            let capturedKey: PropertyKey | undefined;
            let capturedVal: any;
            objPickBy(obj, (k, v) => {
                capturedKey = k;
                capturedVal = v;
                return true;
            });
            assert.equal(capturedKey, "x");
            assert.equal(capturedVal, 10);
        });

        it("should not include inherited properties", () => {
            const proto = { inherited: 99 };
            const child: any = Object.create(proto);
            child.own = 1;
            const result = objPickBy(child, () => true);
            assert.deepEqual(result, { own: 1 });
        });
    });

    // ─── objOmitBy ──────────────────────────────────────────────────────────────

    describe("objOmitBy", () => {
        it("should omit by value predicate", () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            assert.deepEqual(objOmitBy(obj, (_k, v) => v > 2), { a: 1, b: 2 });
        });

        it("should omit by key predicate", () => {
            const obj = { a: 1, b: 2, c: 3 };
            assert.deepEqual(objOmitBy(obj, (k) => k === "b"), { a: 1, c: 3 });
        });

        it("should return full copy when no property matches predicate", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objOmitBy(obj, () => false), { a: 1, b: 2 });
        });

        it("should return empty object when all properties match predicate", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objOmitBy(obj, () => true), {});
        });

        it("should return empty object when source is null or undefined", () => {
            assert.deepEqual(objOmitBy(null as any, () => true), {});
            assert.deepEqual(objOmitBy(undefined as any, () => true), {});
        });

        it("should be the inverse of objPickBy", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const pred = (_k: string, v: number) => v === 2;
            const picked = objPickBy(obj, pred);
            const omitted = objOmitBy(obj, pred);
            // The union of keys in picked + omitted should equal the original keys
            const allKeys = Object.keys(picked).concat(Object.keys(omitted)).sort();
            assert.deepEqual(allKeys, ["a", "b", "c"]);
        });
    });
});
