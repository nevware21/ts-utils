/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objMergeIf, objDefaults } from "../../../../src/object/defaults";

describe("object defaults utilities", () => {

    // ─── objMergeIf ─────────────────────────────────────────────────────────────

    describe("objMergeIf", () => {
        it("should merge properties when predicate returns true", () => {
            const target: any = { a: 1, b: 2 };
            const source = { b: 99, c: 3 };
            objMergeIf(target, source, () => true);
            assert.deepEqual(target, { a: 1, b: 99, c: 3 });
        });

        it("should not merge properties when predicate returns false", () => {
            const target = { a: 1, b: 2 };
            const source = { b: 99, c: 3 };
            objMergeIf(target, source, () => false);
            assert.deepEqual(target, { a: 1, b: 2 });
        });

        it("should merge only selected properties by value", () => {
            const target: any = { a: 1, b: 2 };
            const source = { b: 99, c: 3 };
            objMergeIf(target, source, (_k, srcVal) => srcVal > 2);
            assert.equal(target.b, 99);
            assert.equal(target.c, 3);
            assert.equal(target.a, 1);
        });

        it("should pass srcValue and tgtValue correctly to predicate", () => {
            const target: any = { a: 10 };
            const source: any = { a: 20 };
            let receivedSrc: any;
            let receivedTgt: any;
            objMergeIf(target, source, (_k, sv, tv) => {
                receivedSrc = sv;
                receivedTgt = tv;
                return true;
            });
            assert.equal(receivedSrc, 20);
            assert.equal(receivedTgt, 10);
        });

        it("should return the target object", () => {
            const target: any = { a: 1 };
            const result = objMergeIf(target, { b: 2 }, () => true);
            assert.equal(result, target);
        });

        it("should safely ignore null source", () => {
            const target = { a: 1 };
            objMergeIf(target, null, () => true);
            assert.deepEqual(target, { a: 1 });
        });

        it("should safely ignore undefined source", () => {
            const target = { a: 1 };
            objMergeIf(target, undefined, () => true);
            assert.deepEqual(target, { a: 1 });
        });

        it("should use predicate key argument correctly", () => {
            const target: any = { a: 1, b: 2 };
            const source: any = { a: 100, b: 200 };
            objMergeIf(target, source, (k) => k === "b");
            assert.equal(target.a, 1);
            assert.equal(target.b, 200);
        });

        it("should support merging when target property is undefined", () => {
            const target: any = { a: 1 };
            const source: any = { b: 2 };
            objMergeIf(target, source, (_k, _sv, tv) => tv === undefined);
            assert.equal(target.b, 2);
            assert.equal(target.a, 1);
        });

        it("should not process inherited source properties", () => {
            const proto = { inherited: 42 };
            const source: any = Object.create(proto);
            source.own = 99;
            const target: any = {};
            objMergeIf(target, source, () => true);
            assert.equal(target.own, 99);
            assert.isFalse("inherited" in target);
        });

        it("should ignore unsafe source keys", () => {
            const target: any = {};
            objMergeIf(target, { "__proto__": { polluted: true }, constructor: "bad", prototype: "bad", safe: 1 } as any, () => true);
            assert.equal(target.safe, 1);
            assert.isFalse(Object.prototype.hasOwnProperty.call(target, "__proto__"));
            assert.isFalse(Object.prototype.hasOwnProperty.call(target, "constructor"));
            assert.isFalse(Object.prototype.hasOwnProperty.call(target, "prototype"));
            assert.isUndefined((target as any).polluted);
            assert.isUndefined(({} as any).polluted);
        });

        it("should not write through unsafe targets", () => {
            const original = (Object.prototype as any).polluted;
            try {
                objMergeIf(Object.prototype as any, { polluted: "bad" }, () => true);
                assert.equal((Object.prototype as any).polluted, original);
            } finally {
                if (original === undefined) {
                    delete (Object.prototype as any).polluted;
                } else {
                    (Object.prototype as any).polluted = original;
                }
            }
        });
    });

    // ─── objDefaults ────────────────────────────────────────────────────────────

    describe("objDefaults", () => {
        it("should assign properties not present on target", () => {
            const target: any = { a: 1 };
            objDefaults(target, { b: 2, c: 3 });
            assert.deepEqual(target, { a: 1, b: 2, c: 3 });
        });

        it("should not overwrite properties already defined on target", () => {
            const target: any = { a: 1, b: 5 };
            objDefaults(target, { a: 99, b: 99, c: 3 });
            assert.equal(target.a, 1);
            assert.equal(target.b, 5);
            assert.equal(target.c, 3);
        });

        it("should fill in undefined values on target", () => {
            const target: any = { a: undefined };
            objDefaults(target, { a: 42 });
            assert.equal(target.a, 42);
        });

        it("should NOT fill in null values (null is defined)", () => {
            const target: any = { a: null };
            objDefaults(target, { a: 42 });
            assert.isNull(target.a, "null is a defined value and should not be replaced");
        });

        it("should handle multiple sources left-to-right, first wins", () => {
            const result: any = {};
            objDefaults(result, { a: 1 }, { a: 99, b: 2 }, { b: 99, c: 3 });
            assert.equal(result.a, 1);
            assert.equal(result.b, 2);
            assert.equal(result.c, 3);
        });

        it("should skip null sources", () => {
            const target: any = {};
            objDefaults(target, null, { a: 1 });
            assert.equal(target.a, 1);
        });

        it("should skip undefined sources", () => {
            const target: any = {};
            objDefaults(target, undefined, { a: 1 });
            assert.equal(target.a, 1);
        });

        it("should return the target object", () => {
            const target: any = { a: 1 };
            const result = objDefaults(target, { b: 2 });
            assert.equal(result, target);
        });

        it("should work with zero sources", () => {
            const target: any = { a: 1 };
            objDefaults(target);
            assert.deepEqual(target, { a: 1 });
        });

        it("should not include inherited source properties", () => {
            const proto = { inherited: 99 };
            const source: any = Object.create(proto);
            source.own = 1;
            const target: any = {};
            objDefaults(target, source);
            assert.equal(target.own, 1);
            assert.isFalse("inherited" in target);
        });

        it("should ignore unsafe source keys", () => {
            const target: any = {};
            objDefaults(target, { "__proto__": { polluted: true }, constructor: "bad", prototype: "bad", safe: 1 } as any);
            assert.equal(target.safe, 1);
            assert.isFalse(Object.prototype.hasOwnProperty.call(target, "__proto__"));
            assert.isFalse(Object.prototype.hasOwnProperty.call(target, "constructor"));
            assert.isFalse(Object.prototype.hasOwnProperty.call(target, "prototype"));
            assert.isUndefined((target as any).polluted);
            assert.isUndefined(({} as any).polluted);
        });

        it("should not write through unsafe targets", () => {
            const original = (Object.prototype as any).polluted;
            try {
                objDefaults(Object.prototype as any, { polluted: "bad" });
                assert.equal((Object.prototype as any).polluted, original);
            } finally {
                if (original === undefined) {
                    delete (Object.prototype as any).polluted;
                } else {
                    (Object.prototype as any).polluted = original;
                }
            }
        });

        it("should handle target with no existing properties", () => {
            const target: any = {};
            objDefaults(target, { x: 10, y: 20 });
            assert.deepEqual(target, { x: 10, y: 20 });
        });
    });
});
