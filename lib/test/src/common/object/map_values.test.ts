/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objMapValues } from "../../../../src/object/map_values";
import { hasSymbol } from "../../../../src/symbol/symbol";

describe("object map_values utilities", () => {

    describe("objMapValues", () => {
        it("should map all values with a transform function", () => {
            const obj = { a: 1, b: 2, c: 3 };
            assert.deepEqual(objMapValues(obj, (v) => v * 2), { a: 2, b: 4, c: 6 });
        });

        it("should pass the key as the second argument to mapper", () => {
            const obj = { x: 10, y: 20 };
            const keysReceived: PropertyKey[] = [];
            objMapValues(obj, (v, k) => {
                keysReceived.push(k);
                return v;
            });
            assert.deepEqual(keysReceived.sort(), ["x", "y"]);
        });

        it("should support changing value type", () => {
            const obj = { firstName: "ada", lastName: "lovelace" };
            const result = objMapValues(obj, (v) => v.toUpperCase());
            assert.deepEqual(result, { firstName: "ADA", lastName: "LOVELACE" });
        });

        it("should return empty object when source is null", () => {
            assert.deepEqual(objMapValues(null as any, (v) => v), {});
        });

        it("should return empty object when source is undefined", () => {
            assert.deepEqual(objMapValues(undefined as any, (v) => v), {});
        });

        it("should return empty object when source has no own properties", () => {
            assert.deepEqual(objMapValues({}, (v) => v), {});
        });

        it("should handle mapper returning undefined", () => {
            const obj = { a: 1, b: 2 };
            const result = objMapValues(obj, () => undefined);
            assert.isTrue("a" in result);
            assert.isTrue("b" in result);
            assert.isUndefined(result.a);
            assert.isUndefined(result.b);
        });

        it("should handle mapper returning null", () => {
            const obj = { a: 1, b: 2 };
            const result = objMapValues(obj, () => null);
            assert.isNull(result.a);
            assert.isNull(result.b);
        });

        it("should not include inherited properties", () => {
            const proto = { inherited: 42 };
            const child: any = Object.create(proto);
            child.own = 1;
            const result = objMapValues(child, (v) => v * 10);
            assert.deepEqual(result, { own: 10 });
        });

        it("should produce a new independent object", () => {
            const obj = { a: 1 };
            const result = objMapValues(obj, (v) => v);
            result.a = 99;
            assert.equal(obj.a, 1, "original should not be mutated");
        });

        it("should handle objects with many properties", () => {
            const obj: Record<string, number> = {};
            for (let i = 0; i < 100; i++) {
                obj["k" + i] = i;
            }
            const result = objMapValues(obj, (v) => v + 1);
            for (let i = 0; i < 100; i++) {
                assert.equal(result["k" + i], i + 1);
            }
        });

        it("should map enumerable symbol properties", () => {
            if (!hasSymbol()) {
                return;
            }

            const sym1 = Symbol("sym1");
            const sym2 = Symbol("sym2");
            const obj: any = { a: 1, b: 2 };
            obj[sym1] = 10;
            obj[sym2] = 20;

            const result = objMapValues(obj, (v) => (v as number) * 2);
            assert.equal(result.a, 2);
            assert.equal(result.b, 4);
            assert.equal((result as any)[sym1], 20);
            assert.equal((result as any)[sym2], 40);
        });
    });
});
