/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import * as indexExports from "../../../../src/index";
import * as polyfillExports from "../../../../src/polyfills";
import { arrFlatMap, polyArrFlatMap } from "../../../../src/array/flatMap";

describe("arrFlatMap", () => {
    it("should map and flatten one level", () => {
        assert.deepEqual(arrFlatMap([1, 2, 3], (value) => [value, value * 2]), [1, 2, 2, 4, 3, 6]);
    });

    it("should support array-like objects", () => {
        const arrayLike = { length: 2, 0: "a", 1: "b" };

        assert.deepEqual(arrFlatMap(arrayLike, (value, index) => [index, value]), [0, "a", 1, "b"]);
    });

    it("should only flatten one level", () => {
        assert.deepEqual(arrFlatMap([1, 2], (value) => [[value, value + 10]] as any), [[1, 11], [2, 12]]);
    });

    it("should throw for null and undefined", () => {
        assert.throws(() => arrFlatMap(null as any, (value) => [value]));
        assert.throws(() => arrFlatMap(undefined as any, (value) => [value]));
    });

    it("should use undefined as callback this when thisArg is omitted", () => {
        const contexts: any[] = [];

        const result = arrFlatMap([1, 2], function(this: any, value) {
            contexts.push(this);
            return [value];
        });

        assert.deepEqual(result, [1, 2]);
        assert.strictEqual(contexts[0], undefined);
        assert.strictEqual(contexts[1], undefined);
    });
});

describe("native Array.prototype.flatMap", () => {
    it("should flatten arrays and not flatten strings", () => {
        if (!Array.prototype.flatMap) {
            return;
        }

        const source = [1, 2];
        const result = source.flatMap((value) => {
            return value === 1 ? ["a", "b"] : "cd" as any;
        });

        assert.deepEqual(result, ["a", "b", "cd"]);
    });

    it("should not flatten non-array array-like callback results", () => {
        if (!Array.prototype.flatMap) {
            return;
        }

        const mappedValue = { length: 2, 0: "x", 1: "y" };
        const result = [1].flatMap(() => mappedValue as any);

        assert.equal(result.length, 1);
        assert.strictEqual(result[0], mappedValue);
    });

    it("should ignore Symbol.isConcatSpreadable=true on non-array callback values", () => {
        if (!Array.prototype.flatMap) {
            return;
        }

        const spreadSym = typeof Symbol !== "undefined" && Symbol.isConcatSpreadable;
        if (!spreadSym) {
            return;
        }

        const mappedValue: any = { length: 2, 0: "x", 1: "y" };
        mappedValue[spreadSym] = true;

        const result = [1].flatMap(() => mappedValue);
        assert.equal(result.length, 1);
        assert.strictEqual(result[0], mappedValue);
    });

    it("should flatten arrays even when Symbol.isConcatSpreadable=false", () => {
        if (!Array.prototype.flatMap) {
            return;
        }

        const spreadSym = typeof Symbol !== "undefined" && Symbol.isConcatSpreadable;
        if (!spreadSym) {
            return;
        }

        const mappedValue: any = ["x", "y"];
        mappedValue[spreadSym] = false;

        const result = [1].flatMap(() => mappedValue);
        assert.deepEqual(result, ["x", "y"]);
    });
});

describe("polyArrFlatMap", () => {
    it("should match native Array.prototype.flatMap for arrays", () => {
        const source = [1, 2, 3, 4];
        const callback = (value: number) => {
            return value % 2 ? [value, value * 10] : [];
        };

        const polyResult = polyArrFlatMap(source, callback);
        const nativeResult = source.flatMap ? source.flatMap(callback) : [1, 10, 3, 30];

        assert.deepEqual(polyResult, nativeResult);
    });

    it("should respect a falsy thisArg", () => {
        const contexts: any[] = [];

        const result = polyArrFlatMap([1], function(this: any, value) {
            contexts.push(this);
            return [value];
        }, 0);

        assert.deepEqual(result, [1]);
        assert.strictEqual(contexts[0], 0);
    });

    it("should skip holes in the source and mapped arrays", () => {
        const source = new Array(3);
        source[1] = 2;

        const result = polyArrFlatMap(source, (value) => {
            const mapped = new Array(3);
            mapped[1] = value;
            return mapped;
        });

        assert.deepEqual(result, [2]);
    });

    it("should not flatten non-array array-like callback results", () => {
        const mappedValue = { length: 2, 0: "x", 1: "y" };
        const result = polyArrFlatMap([1], () => mappedValue as any);

        assert.equal(result.length, 1);
        assert.strictEqual(result[0], mappedValue);
    });

    it("should not flatten strings returned by callback", () => {
        const source = ["a", "b"];
        const callback = (value: string) => value + value;

        const polyResult = polyArrFlatMap(source, callback as any);
        const nativeResult = source.flatMap ? source.flatMap(callback as any) : ["aa", "bb"];

        assert.deepEqual(polyResult, nativeResult);
    });

    it("should ignore Symbol.isConcatSpreadable=true on non-array callback values", () => {
        const spreadSym = typeof Symbol !== "undefined" && Symbol.isConcatSpreadable;
        if (!spreadSym) {
            return;
        }

        const mappedValue: any = { length: 2, 0: "x", 1: "y" };
        mappedValue[spreadSym] = true;

        const result = polyArrFlatMap([1], () => mappedValue);
        assert.equal(result.length, 1);
        assert.strictEqual(result[0], mappedValue);
    });

    it("should flatten arrays even when Symbol.isConcatSpreadable=false", () => {
        const spreadSym = typeof Symbol !== "undefined" && Symbol.isConcatSpreadable;
        if (!spreadSym) {
            return;
        }

        const mappedValue: any = ["x", "y"];
        mappedValue[spreadSym] = false;

        const result = polyArrFlatMap([1], () => mappedValue);
        assert.deepEqual(result, ["x", "y"]);
    });

    it("should match native behavior for spreadability edge cases", () => {
        const spreadSym = typeof Symbol !== "undefined" && Symbol.isConcatSpreadable;
        if (!Array.prototype.flatMap || !spreadSym) {
            return;
        }

        const nonArraySpreadable: any = { 0: "n", 1: "a", length: 2 };
        nonArraySpreadable[spreadSym] = true;

        const arrayNonSpreadable: any = ["a", "r"];
        arrayNonSpreadable[spreadSym] = false;

        const source = [1, 2];
        const callback = (value: number) => {
            return value === 1 ? nonArraySpreadable : arrayNonSpreadable;
        };

        const polyResult = polyArrFlatMap(source, callback);
        const nativeResult = source.flatMap(callback);

        assert.deepEqual(polyResult, nativeResult);
    });

    it("should use undefined as callback this when thisArg is omitted", () => {
        const contexts: any[] = [];
        const source = [4, 5];

        const result = polyArrFlatMap(source, function(this: any, value, index, array) {
            contexts.push(this);
            assert.strictEqual(array, source);
            return [value + (index || 0)];
        });

        assert.deepEqual(result, [4, 6]);
        assert.strictEqual(contexts[0], undefined);
        assert.strictEqual(contexts[1], undefined);
    });

    it("should throw for null, undefined and non-function callbacks", () => {
        assert.throws(() => polyArrFlatMap(null as any, () => []), TypeError);
        assert.throws(() => polyArrFlatMap(undefined as any, () => []), TypeError);
        assert.throws(() => polyArrFlatMap([1, 2, 3], null as any), TypeError);
    });
});

describe("arrFlatMap exports", () => {
    it("should export arrFlatMap from the main index only", () => {
        assert.strictEqual(indexExports.arrFlatMap, arrFlatMap);
        assert.isUndefined((indexExports as any).polyArrFlatMap);
    });

    it("should export polyArrFlatMap from the polyfills entry", () => {
        assert.strictEqual((polyfillExports as any).polyArrFlatMap, polyArrFlatMap);
    });
});