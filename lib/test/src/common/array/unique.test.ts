/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrUnique } from "../../../../src/array/unique";
import { getGlobal } from "../../../../src/helpers/environment";

describe("arrUnique", () => {
    it("should keep distinct objects", () => {
        const a = { a: 1 };
        const b = { b: 2 };
        const c = { c: 3 };
        const result = arrUnique([a, b, c]);

        assert.equal(result.length, 3);
        assert.equal(result[0], a);
        assert.equal(result[1], b);
        assert.equal(result[2], c);
    });

    it("should remove repeated references and keep the first position", () => {
        const a = { a: 1 };
        const b = { b: 2 };
        const result = arrUnique([b, a, b, a, a]);

        assert.equal(result.length, 2);
        assert.equal(result[0], b);
        assert.equal(result[1], a);
    });

    it("should compare arrays, dates and functions by identity", () => {
        const list = [1, 2];
        const fn1 = function () {
            return 1;
        };
        const fn2 = function () {
            return 1;
        };

        assert.equal(arrUnique([list, [1, 2], list]).length, 2, "arrays");
        assert.equal(arrUnique([new Date(1), new Date(1), new Date(2)]).length, 3, "dates");
        assert.equal(arrUnique([fn1, fn2, fn1]).length, 2, "functions");
    });

    it("should support symbols", () => {
        const s1 = Symbol("a");
        const s2 = Symbol("a");
        const result = arrUnique([s1, s2, s1]);

        assert.equal(result.length, 2);
        assert.equal(result[0], s1);
        assert.equal(result[1], s2);
    });

    it("should keep comparing primitives by value", () => {
        assert.deepEqual(arrUnique<any>([1, "1", true, "true", 1, "1", true]), [1, "1", true, "true"]);
        assert.deepEqual(arrUnique<any>([null, undefined, null, undefined, 0, "", false]), [null, undefined, 0, "", false]);
        assert.equal(arrUnique([NaN, NaN]).length, 1, "NaN is only kept once");
    });

    it("should handle a mix of primitives and objects", () => {
        const a = { a: 1 };
        assert.deepEqual(arrUnique<any>([a, "[object Object]", a, "[object Object]", 1]), [a, "[object Object]", 1]);
    });

    it("should work without a native Map", () => {
        const a = { a: 1 };
        const b = { b: 2 };
        const s1 = Symbol("a");
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        let result: any[];

        theGlobal.Map = undefined;
        try {
            result = arrUnique<any>([a, b, a, s1, s1, 1, 1]);
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.equal(result.length, 4);
        assert.equal(result[0], a);
        assert.equal(result[1], b);
        assert.equal(result[2], s1);
        assert.equal(result[3], 1);
    });

    it("should treat -0 and +0 as the same value, keeping the first", () => {
        let result = arrUnique([-0, 1, 0, -0]);
        assert.deepEqual(result, [-0, 1]);
        assert.equal(1 / result[0], -Infinity, "The first value (-0) is kept");

        result = arrUnique([0, -0]);
        assert.deepEqual(result, [0]);
        assert.equal(1 / result[0], Infinity, "The first value (+0) is kept");
    });

    it("should work without a native Set or Map (IE 9 / 10)", () => {
        const a = { a: 1 };
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;
        let result: any[];

        theGlobal.Set = undefined;
        theGlobal.Map = undefined;
        try {
            result = arrUnique<any>([a, a, -0, 0, NaN, NaN, "1", 1]);
        } finally {
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        }

        assert.equal(result.length, 5);
        assert.equal(result[0], a);
        assert.equal(1 / result[1], -Infinity, "The first value (-0) is kept");
        assert.isTrue(result[2] !== result[2], "NaN is kept once");
        assert.equal(result[3], "1");
        assert.equal(result[4], 1);
    });

    it("should find each value with the runtime's Set, rather than by searching the result", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const searched: any[] = [];
        let result: number[];

        // A Set which records the values it is searched for. It finds NaN and treats -0 and +0 as the same value, so
        // once it has been checked (by searching for NaN and -0) it is used directly
        theGlobal.Set = function () {
            const values = new orgSet();

            return {
                has: (value: any) => {
                    searched.push(value);
                    return values.has(value);
                },
                add: (value: any) => {
                    values.add(value);
                }
            };
        };

        try {
            result = arrUnique([1, 2, 1]);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(result, [1, 2]);
        assert.deepEqual(searched, [NaN, -0, 1, 2, 1], "The check of NaN and -0, then each value");
    });

    it("should skip an empty slot, rather than adding it as undefined (unlike arrUnion)", () => {
        // eslint-disable-next-line no-sparse-arrays
        assert.deepEqual(arrUnique([1, , 3, 1]), [1, 3]);
        // eslint-disable-next-line no-sparse-arrays
        assert.deepEqual(arrUnique([1, , undefined]), [1, undefined], "An undefined value is still added");
    });
});
