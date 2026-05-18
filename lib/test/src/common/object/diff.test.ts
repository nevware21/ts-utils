/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objDiff } from "../../../../src/object/diff";
import { hasSymbol } from "../../../../src/symbol/symbol";

describe("object diff utilities", () => {

    describe("objDiff", () => {
        it("should return changed values", () => {
            const prev = { x: 1, y: 2, z: 3 };
            const next = { x: 1, y: 99, z: 3 };
            assert.deepEqual(objDiff(prev, next), { y: 99 });
        });

        it("should return empty object when objects are identical", () => {
            const obj = { a: 1, b: 2 };
            assert.deepEqual(objDiff(obj, { a: 1, b: 2 }), {});
        });

        it("should include keys added in modified", () => {
            assert.deepEqual(objDiff({ a: 1 }, { a: 1, b: 2 }), { b: 2 });
        });

        it("should not include keys removed in modified", () => {
            const result = objDiff({ a: 1, b: 2 }, { a: 1 } as any);
            assert.isFalse("b" in result);
        });

        it("should detect null vs undefined as different", () => {
            assert.deepEqual(objDiff({ a: null } as any, { a: undefined }), { a: undefined });
            assert.deepEqual(objDiff({ a: undefined } as any, { a: null }), { a: null });
        });

        it("should detect value-to-null change", () => {
            assert.deepEqual(objDiff({ a: 1 } as any, { a: null }), { a: null });
        });

        it("should detect value-to-undefined change", () => {
            const result = objDiff({ a: 1 }, { a: undefined });
            assert.isTrue("a" in result);
            assert.isUndefined((result as any).a);
        });

        it("should return all keys when all differ", () => {
            const prev = { a: 1, b: 2 };
            const next = { a: 10, b: 20 };
            assert.deepEqual(objDiff(prev, next), { a: 10, b: 20 });
        });

        it("should handle empty base object", () => {
            assert.deepEqual(objDiff({}, { a: 1, b: 2 }), { a: 1, b: 2 });
        });

        it("should handle empty modified object", () => {
            assert.deepEqual(objDiff({ a: 1 }, {}), {});
        });

        it("should handle both objects empty", () => {
            assert.deepEqual(objDiff({}, {}), {});
        });

        it("should return empty object when base is null", () => {
            assert.deepEqual(objDiff(null as any, null as any), {});
        });

        it("should return empty object when modified is null", () => {
            assert.deepEqual(objDiff({ a: 1 }, null as any), {});
        });

        it("should use strict equality (no type coercion)", () => {
            const result = objDiff({ a: 1 } as any, { a: "1" });
            assert.deepEqual(result, { a: "1" });
        });

        it("should treat false and 0 as different from undefined", () => {
            const result = objDiff({} as any, { a: false, b: 0 });
            assert.deepEqual(result, { a: false, b: 0 });
        });

        it("should not include inherited properties from modified", () => {
            const proto = { inherited: 99 };
            const modified: any = Object.create(proto);
            modified.own = 1;
            const result = objDiff({}, modified);
            assert.equal(result.own, 1);
            assert.isFalse("inherited" in result);
        });

        it("should detect object reference changes", () => {
            const shared = { nested: true };
            const prev = { ref: shared };
            const next = { ref: { nested: true } };  // different reference, same shape
            const result = objDiff(prev, next);
            // Different reference => included in diff
            assert.deepEqual(result, { ref: { nested: true } });
        });

        it("should NOT detect object reference changes when same reference", () => {
            const shared = { nested: true };
            const result = objDiff({ ref: shared }, { ref: shared });
            assert.deepEqual(result, {});
        });

        it("should detect changes in enumerable symbol properties", () => {
            if (!hasSymbol()) {
                return;
            }

            const sym1 = Symbol("sym1");
            const sym2 = Symbol("sym2");
            const prev: any = { a: 1 };
            prev[sym1] = "old";
            prev[sym2] = "same";

            const next: any = { a: 1 };
            next[sym1] = "new";
            next[sym2] = "same";

            const result = objDiff(prev, next);
            assert.isFalse("a" in result);
            assert.equal((result as any)[sym1], "new");
            assert.isFalse(sym2 in result);
        });

        it("should include added symbol properties in modified", () => {
            if (!hasSymbol()) {
                return;
            }

            const sym = Symbol("sym");
            const prev: any = { a: 1 };
            const next: any = { a: 1 };
            next[sym] = "added";

            const result = objDiff(prev, next);
            assert.equal((result as any)[sym], "added");
        });
    });
});
