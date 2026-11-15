/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isUnsafeTarget } from "../../../../src/object/isUnsafeTarget";
import { getGlobal, getInst } from "../../../../src/helpers/environment";

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

    it("should identify the %TypedArray% prototype that the typed arrays inherit from when available", () => {
        if (typeof Uint8Array !== "undefined") {
            const typedArrayProto = Object.getPrototypeOf(Uint8Array.prototype);
            assert.notStrictEqual(typedArrayProto, Object.prototype, "The typed arrays inherit from %TypedArray%.prototype");
            assert.isTrue(isUnsafeTarget(typedArrayProto), "%TypedArray%.prototype should be unsafe");
            assert.isTrue(isUnsafeTarget(Object.getPrototypeOf(Int32Array.prototype)), "%TypedArray%.prototype should be unsafe");
        }

        let float16Array: any = getInst("Float16Array");
        if (float16Array) {
            assert.isTrue(isUnsafeTarget(float16Array["prototype"]), "Float16Array.prototype should be unsafe");
        }
    });

    it("should identify the AggregateError, BigInt and Iterator prototype objects when available", () => {
        let aggregateError: any = getInst("AggregateError");
        if (aggregateError) {
            assert.isTrue(isUnsafeTarget(aggregateError["prototype"]), "AggregateError.prototype should be unsafe");
        }
        let bigInt: any = getInst("BigInt");
        if (bigInt) {
            assert.isTrue(isUnsafeTarget(bigInt["prototype"]), "BigInt.prototype should be unsafe");
        }
        let iterator: any = getInst("Iterator");
        if (iterator) {
            assert.isTrue(isUnsafeTarget(iterator["prototype"]), "Iterator.prototype should be unsafe");
        }
    });

    it("should identify the prototype of a class which is defined after the first check (eg. a polyfill)", function() {
        // The classes that isUnsafeTarget looks for which this runtime doesn't define (so were not defined when it was
        // first called), the test defines one of them (like a polyfill would) and then removes it
        const classNames = [
            "AggregateError", "Map", "Set", "WeakMap", "WeakSet", "Promise", "BigInt", "Iterator", "SharedArrayBuffer",
            "Float16Array", "WeakRef", "FinalizationRegistry"
        ];
        let missingName: string | undefined;
        for (let lp = 0; lp < classNames.length; lp++) {
            if (!getInst(classNames[lp])) {
                missingName = classNames[lp];
                break;
            }
        }

        if (!missingName) {
            // Every class is defined by this runtime
            this.skip();
            return;
        }

        // Make sure the list of prototypes has been created before the "polyfill" is defined
        assert.isTrue(isUnsafeTarget(Object.prototype));

        const theGlobal: any = getGlobal();
        const PolyfillClass: any = function () {
            // A polyfill of the missing class
        };
        PolyfillClass.prototype.polyMethod = function () {
            return 42;
        };

        theGlobal[missingName] = PolyfillClass;
        try {
            assert.isTrue(isUnsafeTarget(PolyfillClass.prototype), missingName + " polyfill prototype should be unsafe");
            assert.isFalse(isUnsafeTarget(new PolyfillClass()), missingName + " polyfill instance should be safe");
        } finally {
            delete theGlobal[missingName];
        }
    });

    it("should return false for the prototype of a class which is not a built-in", () => {
        class MyClass {
            public value = 1;
        }

        function MyFunction() {
            // A function used as a class
        }

        assert.isFalse(isUnsafeTarget(MyClass.prototype), "A class prototype should be safe");
        assert.isFalse(isUnsafeTarget((MyFunction as any).prototype), "A function prototype should be safe");
        assert.isFalse(isUnsafeTarget(new MyClass()), "A class instance should be safe");
    });
});
