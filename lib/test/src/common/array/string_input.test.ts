/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrChunk } from "../../../../src/array/chunk";
import { arrCompact } from "../../../../src/array/compact";
import { arrDifference } from "../../../../src/array/difference";
import { arrForEach } from "../../../../src/array/forEach";
import { arrGroupBy } from "../../../../src/array/groupBy";
import { arrIntersection } from "../../../../src/array/intersection";
import { arrPartition } from "../../../../src/array/partition";
import { arrShuffle } from "../../../../src/array/shuffle";
import { arrUnique } from "../../../../src/array/unique";
import { polyArrWith } from "../../../../src/array/with";
import { polyArrFindLastIndex } from "../../../../src/polyfills/array";

// A string is an ArrayLike, so these helpers need to work when passed a string primitive
describe("array helpers with a string value", () => {
    it("arrForEach should visit each character", () => {
        const result: Array<[string, number]> = [];
        arrForEach("abc", (value, index) => {
            result.push([value, index]);
        });

        assert.deepEqual(result, [["a", 0], ["b", 1], ["c", 2]]);
    });

    it("arrForEach should still skip the holes of a sparse array", () => {
        const sparse: number[] = [1];
        sparse[2] = 3;
        const result: number[] = [];
        arrForEach(sparse, (value) => {
            result.push(value);
        });

        assert.deepEqual(result, [1, 3]);
    });

    it("arrChunk", () => {
        assert.deepEqual(arrChunk("abc", 2), [["a", "b"], ["c"]]);
    });

    it("arrCompact", () => {
        assert.deepEqual(arrCompact("ab"), ["a", "b"]);
    });

    it("arrUnique", () => {
        assert.deepEqual(arrUnique("aab"), ["a", "b"]);
    });

    it("arrGroupBy", () => {
        assert.deepEqual(arrGroupBy("aab", (value: string) => value), { a: ["a", "a"], b: ["b"] });
    });

    it("arrPartition", () => {
        assert.deepEqual(arrPartition("ab", (value: string) => value === "a"), [["a"], ["b"]]);
    });

    it("arrIntersection", () => {
        assert.deepEqual(arrIntersection("ab", "bc"), ["b"]);
    });

    it("arrDifference", () => {
        assert.deepEqual(arrDifference("ab", "b"), ["a"]);
    });

    it("arrShuffle should return an array of the characters", () => {
        const result = arrShuffle("abc");

        assert.ok(Array.isArray(result), "The result is an array");
        assert.deepEqual(result.sort(), ["a", "b", "c"]);
    });

    it("polyArrWith should return an array of the characters", () => {
        assert.deepEqual(polyArrWith("abc", 1, "z"), ["a", "z", "c"]);
    });

    it("polyArrFindLastIndex", () => {
        assert.equal(polyArrFindLastIndex("abb", (value: string) => value === "b"), 2);
    });
});
