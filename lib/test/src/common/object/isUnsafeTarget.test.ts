/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isUnsafeTarget } from "../../../../src/object/isUnsafeTarget";
import { getInst } from "../../../../src/helpers/environment";

describe("object isUnsafeTarget tests", () => {
    it("should identify common built-in prototype objects", () => {
        assert.isTrue(isUnsafeTarget(Object.prototype), "Object.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Function.prototype), "Function.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Array.prototype), "Array.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Date.prototype), "Date.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(RegExp.prototype), "RegExp.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Number.prototype), "Number.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(String.prototype), "String.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(Boolean.prototype), "Boolean.prototype should be unsafe");
    });

    it("should identify error prototype objects", () => {
        assert.isTrue(isUnsafeTarget(Error.prototype), "Error.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(TypeError.prototype), "TypeError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(RangeError.prototype), "RangeError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(SyntaxError.prototype), "SyntaxError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(ReferenceError.prototype), "ReferenceError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(EvalError.prototype), "EvalError.prototype should be unsafe");
        assert.isTrue(isUnsafeTarget(URIError.prototype), "URIError.prototype should be unsafe");
    });

    it("should return false for normal targets", () => {
        assert.isFalse(isUnsafeTarget({}), "plain objects should be safe");
        assert.isFalse(isUnsafeTarget([]), "array instances should be safe");
        assert.isFalse(isUnsafeTarget(function() {}), "function instances should be safe");
        assert.isFalse(isUnsafeTarget(new Date()), "Date instances should be safe");
        assert.isFalse(isUnsafeTarget(Object.create(null)), "null prototype objects should be safe");
    });

    it("should return false for primitive and nullish values", () => {
        assert.isFalse(isUnsafeTarget(null), "null should be safe");
        assert.isFalse(isUnsafeTarget(undefined), "undefined should be safe");
        assert.isFalse(isUnsafeTarget(0), "number should be safe");
        assert.isFalse(isUnsafeTarget("test"), "string should be safe");
        assert.isFalse(isUnsafeTarget(false), "boolean should be safe");
    });

    it("should identify ES6 collection prototype objects when available", () => {
        if (typeof Map !== "undefined") {
            assert.isTrue(isUnsafeTarget(Map.prototype), "Map.prototype should be unsafe");
        }
        if (typeof Set !== "undefined") {
            assert.isTrue(isUnsafeTarget(Set.prototype), "Set.prototype should be unsafe");
        }
        if (typeof WeakMap !== "undefined") {
            assert.isTrue(isUnsafeTarget(WeakMap.prototype), "WeakMap.prototype should be unsafe");
        }
        if (typeof WeakSet !== "undefined") {
            assert.isTrue(isUnsafeTarget(WeakSet.prototype), "WeakSet.prototype should be unsafe");
        }
        if (typeof Promise !== "undefined") {
            assert.isTrue(isUnsafeTarget(Promise.prototype), "Promise.prototype should be unsafe");
        }
        if (typeof Symbol !== "undefined") {
            assert.isTrue(isUnsafeTarget((Symbol as any).prototype), "Symbol.prototype should be unsafe");
        }
    });

    it("should identify ArrayBuffer and DataView prototype objects when available", () => {
        if (typeof ArrayBuffer !== "undefined") {
            assert.isTrue(isUnsafeTarget(ArrayBuffer.prototype), "ArrayBuffer.prototype should be unsafe");
        }
        let sharedArrayBuffer: any = getInst("SharedArrayBuffer");
        if (sharedArrayBuffer) {
            assert.isTrue(isUnsafeTarget(sharedArrayBuffer["prototype"]), "SharedArrayBuffer.prototype should be unsafe");
        }
        if (typeof DataView !== "undefined") {
            assert.isTrue(isUnsafeTarget(DataView.prototype), "DataView.prototype should be unsafe");
        }
    });

    it("should identify typed-array prototype objects when available", () => {
        if (typeof Int8Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Int8Array.prototype), "Int8Array.prototype should be unsafe");
        }
        if (typeof Uint8Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Uint8Array.prototype), "Uint8Array.prototype should be unsafe");
        }
        if (typeof Uint8ClampedArray !== "undefined") {
            assert.isTrue(isUnsafeTarget(Uint8ClampedArray.prototype), "Uint8ClampedArray.prototype should be unsafe");
        }
        if (typeof Int16Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Int16Array.prototype), "Int16Array.prototype should be unsafe");
        }
        if (typeof Uint16Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Uint16Array.prototype), "Uint16Array.prototype should be unsafe");
        }
        if (typeof Int32Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Int32Array.prototype), "Int32Array.prototype should be unsafe");
        }
        if (typeof Uint32Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Uint32Array.prototype), "Uint32Array.prototype should be unsafe");
        }
        if (typeof Float32Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Float32Array.prototype), "Float32Array.prototype should be unsafe");
        }
        if (typeof Float64Array !== "undefined") {
            assert.isTrue(isUnsafeTarget(Float64Array.prototype), "Float64Array.prototype should be unsafe");
        }
        let bigInt64Array: any = getInst("BigInt64Array");
        if (bigInt64Array) {
            assert.isTrue(isUnsafeTarget(bigInt64Array["prototype"]), "BigInt64Array.prototype should be unsafe");
        }
        let bigUint64Array: any = getInst("BigUint64Array");
        if (bigUint64Array) {
            assert.isTrue(isUnsafeTarget(bigUint64Array["prototype"]), "BigUint64Array.prototype should be unsafe");
        }
    });

    it("should identify WeakRef and FinalizationRegistry prototype objects when available", () => {
        let weakRef: any = getInst("WeakRef");
        if (weakRef) {
            assert.isTrue(isUnsafeTarget(weakRef["prototype"]), "WeakRef.prototype should be unsafe");
        }
        let finalizationRegistry: any = getInst("FinalizationRegistry");
        if (finalizationRegistry) {
            assert.isTrue(isUnsafeTarget(finalizationRegistry["prototype"]), "FinalizationRegistry.prototype should be unsafe");
        }
    });

    it("should return false for instances of the new built-in types", () => {
        if (typeof ArrayBuffer !== "undefined") {
            assert.isFalse(isUnsafeTarget(new ArrayBuffer(8)), "ArrayBuffer instance should be safe");
        }
        if (typeof DataView !== "undefined") {
            assert.isFalse(isUnsafeTarget(new DataView(new ArrayBuffer(8))), "DataView instance should be safe");
        }
        if (typeof Uint8Array !== "undefined") {
            assert.isFalse(isUnsafeTarget(new Uint8Array(4)), "Uint8Array instance should be safe");
        }
        if (typeof Map !== "undefined") {
            assert.isFalse(isUnsafeTarget(new Map()), "Map instance should be safe");
        }
        if (typeof Set !== "undefined") {
            assert.isFalse(isUnsafeTarget(new Set()), "Set instance should be safe");
        }
    });
});
