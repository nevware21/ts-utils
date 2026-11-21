/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as vm from "vm";
import { assert } from "@nevware21/tripwire-chai";
import { isConstructor, isNativeFn } from "../../../src/funcs/isNative";
import { polyArrFlatMap } from "../../../src/array/flatMap";

// Another realm's (a vm context's) built-in functions, like an iframe's in a browser
describe("isNativeFn and isConstructor with another realm's functions", () => {
    it("identify another realm's Array as the native Array and a constructor", () => {
        const otherArray = vm.runInNewContext("Array");

        assert.notStrictEqual(otherArray, Array, "It is another realm's Array");
        assert.isTrue(isNativeFn(otherArray, "Array"));
        assert.isTrue(isConstructor(otherArray));
        assert.isFalse(isConstructor(vm.runInNewContext("Math.max")));
    });

    it("polyArrFlatMap creates an Array of this realm for another realm's array, like Array.prototype.flatMap", () => {
        const otherArray = vm.runInNewContext("[1, 2]");

        const result = polyArrFlatMap(otherArray, (value: number) => [value, value * 10]);
        assert.isTrue(result instanceof Array, "An Array of this realm");
        assert.deepEqual(Array.prototype.slice.call(result), [1, 10, 2, 20]);

        const nativeFlatMap = (Array.prototype as any).flatMap;
        if (nativeFlatMap) {
            assert.isTrue(nativeFlatMap.call(otherArray, (value: number) => [value]) instanceof Array, "Array.prototype.flatMap");
        }
    });
});
