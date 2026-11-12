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
import { arrDrop } from "../../../../src/array/drop";
import { arrDropWhile } from "../../../../src/array/drop_while";
import { arrForEach } from "../../../../src/array/forEach";
import { arrUnion } from "../../../../src/array/union";
import { arrGroupBy } from "../../../../src/array/groupBy";
import { arrIntersection } from "../../../../src/array/intersection";
import { arrPartition } from "../../../../src/array/partition";
import { arrRotate } from "../../../../src/array/rotate";
import { arrShuffle } from "../../../../src/array/shuffle";
import { arrTake } from "../../../../src/array/take";
import { arrTakeWhile } from "../../../../src/array/take_while";
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

    it("arrDropWhile should return an array", () => {
        assert.deepEqual(arrDropWhile("abc", () => false), ["a", "b", "c"]);
        assert.deepEqual(arrDropWhile("abc", (value: string) => value === "a"), ["b", "c"]);
        assert.deepEqual(arrDropWhile("abc", () => true), []);
    });

    it("arrTakeWhile should return an array", () => {
        assert.deepEqual(arrTakeWhile("abc", (value: string) => value !== "c"), ["a", "b"]);
    });

    it("arrDrop should return an array", () => {
        assert.deepEqual(arrDrop("abc", 1), ["b", "c"]);
        assert.deepEqual(arrDrop("abc", 0), ["a", "b", "c"]);
    });

    it("arrTake should return an array", () => {
        assert.deepEqual(arrTake("abc", 2), ["a", "b"]);
    });

    it("arrRotate should return an array", () => {
        assert.deepEqual(arrRotate("abc", 1), ["b", "c", "a"]);
        assert.deepEqual(arrRotate("abc", 0), ["a", "b", "c"]);
        assert.deepEqual(arrRotate("abc", 3), ["a", "b", "c"]);
    });

    // A surrogate pair is 2 elements (like the other helpers), which also shows that a string's iterator isn't used
    // as that isn't available on every runtime
    it("arrRotate should use each character code", () => {
        assert.deepEqual(arrRotate("a\uD83D\uDE00b", 1), ["\uD83D", "\uDE00", "b", "a"]);
        assert.deepEqual(arrRotate("a\uD83D\uDE00b", 0), ["a", "\uD83D", "\uDE00", "b"]);
    });

    it("arrUnion should use each character code", () => {
        assert.deepEqual(arrUnion("ab", ["c"]), ["a", "b", "c"]);
        assert.deepEqual(arrUnion("a\uD83D\uDE00", "a"), ["a", "\uD83D", "\uDE00"]);
    });

    it("arrIntersection should compare the characters of a string, not substrings", () => {
        assert.deepEqual(arrIntersection<any>([1], "123"), []);
        assert.deepEqual(arrIntersection(["ab"], "xaby"), []);
        assert.deepEqual(arrIntersection(["a", "b", "z"], "xaby"), ["a", "b"]);
        assert.deepEqual(arrIntersection("abc", "cb"), ["b", "c"]);
    });

    it("arrDifference should compare the characters of a string, not substrings", () => {
        assert.deepEqual(arrDifference(["ab", "x"], "xaby"), ["ab"]);
        assert.deepEqual(arrDifference<any>([1, 2], "123"), [1, 2]);
        assert.deepEqual(arrDifference("abc", "b"), ["a", "c"]);
    });

    it("polyArrWith should return an array of the characters", () => {
        assert.deepEqual(polyArrWith("abc", 1, "z"), ["a", "z", "c"]);
    });

    it("polyArrFindLastIndex", () => {
        assert.equal(polyArrFindLastIndex("abb", (value: string) => value === "b"), 2);
    });
});
