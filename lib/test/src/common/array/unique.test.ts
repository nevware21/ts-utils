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
});
