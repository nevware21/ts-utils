/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyArrFind, polyArrFindLast } from "../../../../src/polyfills/array";
import { polyArrWith } from "../../../../src/array/with";
import { polyArrFlatMap } from "../../../../src/array/flatMap";

// The polyfills (and the helpers which work like a native function) compared with the native functions, for the
// values and operations (eg. how often a getter or valueOf() is called) where they used to be different
describe("polyfills match the native functions", () => {
    const hasSymbol = typeof Symbol === "function" && !!Symbol.iterator;
    const hasProxy = typeof Proxy === "function";

    describe("polyArrFind and polyArrFindLast", () => {
        it("return the value which was passed to the callbackFn (the element isn't read again)", () => {
            const changeAndMatch = (value: any, idx: number, theArray: any) => {
                theArray[idx] = "changed";
                return true;
            };

            assert.equal(polyArrFind([1, 2], changeAndMatch), 1, "polyArrFind");
            assert.equal(polyArrFindLast([1, 2], changeAndMatch), 2, "polyArrFindLast");

            const arrayProto: any = Array.prototype;
            if (arrayProto.find) {
                assert.equal(arrayProto.find.call([1, 2], changeAndMatch), 1, "Array.prototype.find");
            }

            if (arrayProto.findLast) {
                assert.equal(arrayProto.findLast.call([1, 2], changeAndMatch), 2, "Array.prototype.findLast");
            }
        });

        it("read each element once (a getter is only called once)", () => {
            let reads = 0;
            const arrayLike: any = { length: 1 };
            Object.defineProperty(arrayLike, "0", {
                get: () => {
                    reads++;
                    return "x";
                }
            });

            assert.equal(polyArrFind(arrayLike, () => true), "x");
            assert.equal(reads, 1, "polyArrFind read the element once");

            reads = 0;
            assert.equal(polyArrFindLast(arrayLike, () => true), "x");
            assert.equal(reads, 1, "polyArrFindLast read the element once");
        });
    });

    describe("polyArrWith", () => {
        it("converts the index before checking a length which is longer than an array can be, like Array.prototype.with", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const arrayLike = { length: 4294967296 };
            assert.throws(() => polyArrWith(arrayLike as any, Symbol() as any, 1), TypeError, undefined, "The Symbol index throws first");

            let valueOfCalls = 0;
            const index = {
                valueOf: () => {
                    valueOfCalls++;
                    return 1;
                }
            };

            assert.throws(() => polyArrWith(arrayLike as any, index as any, 1), RangeError, undefined, "The length is then too long");
            assert.equal(valueOfCalls, 1, "The index was converted once");

            const nativeWith = (Array.prototype as any).with;
            if (nativeWith) {
                assert.throws(() => nativeWith.call(arrayLike, Symbol(), 1), TypeError, undefined, "Array.prototype.with");
            }
        });
    });

    describe("polyArrFlatMap", () => {
        let SubArray: any;
        try {
            // A real subclass (ES5 can't subclass Array), unless the runtime doesn't support the class syntax (eg. IE)
            SubArray = new Function("return class SubArray extends Array {}")();
        } catch (e) {
            SubArray = null;
        }

        it("creates the result of an array using its constructor's [Symbol.species], like Array.prototype.flatMap", function() {
            if (!SubArray || typeof Symbol !== "function" || !Symbol.species) {
                this.skip();
                return;
            }

            const source = SubArray.of(1, 2);
            const result: any = polyArrFlatMap(source, (value: number) => [value, value * 10]);

            assert.instanceOf(result, SubArray);
            assert.deepEqual(Array.prototype.slice.call(result), [1, 10, 2, 20]);

            const nativeFlatMap = (Array.prototype as any).flatMap;
            if (nativeFlatMap) {
                assert.instanceOf(nativeFlatMap.call(source, (value: number) => [value]), SubArray, "Array.prototype.flatMap");
            }
        });

        it("throws a TypeError for a constructor or species which is the string \"undefined\" (only undefined creates an Array), like Array.prototype.flatMap", function() {
            if (typeof Symbol !== "function" || !Symbol.species) {
                this.skip();
                return;
            }

            const ctorString: any = [1];
            ctorString.constructor = "undefined";
            const speciesString: any = [1];
            const ctor: any = {};
            ctor[Symbol.species] = "undefined";
            speciesString.constructor = ctor;
            const mapper = (value: number) => [value];

            assert.throws(() => polyArrFlatMap(ctorString, mapper), TypeError, undefined, "The constructor");
            assert.throws(() => polyArrFlatMap(speciesString, mapper), TypeError, undefined, "The species");

            const nativeFlatMap = (Array.prototype as any).flatMap;
            if (nativeFlatMap) {
                assert.throws(() => nativeFlatMap.call(ctorString, mapper), TypeError, undefined, "Array.prototype.flatMap: the constructor");
                assert.throws(() => nativeFlatMap.call(speciesString, mapper), TypeError, undefined, "Array.prototype.flatMap: the species");
            }
        });

        it("throws a TypeError for a constructor which isn't a constructor, and ignores a null species", function() {
            if (typeof Symbol !== "function" || !Symbol.species) {
                this.skip();
                return;
            }

            const nativeFlatMap = (Array.prototype as any).flatMap;
            [5, null, "x"].forEach((ctor) => {
                const arr: any = [1];
                arr.constructor = ctor;
                assert.throws(() => polyArrFlatMap(arr, (value: number) => value), TypeError, undefined, "The constructor is " + ctor);
                if (nativeFlatMap) {
                    assert.throws(() => nativeFlatMap.call(arr, (value: number) => value), TypeError, undefined, "Array.prototype.flatMap: the constructor is " + ctor);
                }
            });

            const nullSpecies: any = [1];
            nullSpecies.constructor = {};
            nullSpecies.constructor[Symbol.species] = null;
            const result = polyArrFlatMap(nullSpecies, (value: number) => [value]);
            assert.isTrue(Array.isArray(result), "A null species creates an Array");
            assert.deepEqual(result, [1]);
        });

        it("doesn't read the constructor of an array-like (which isn't an array), like Array.prototype.flatMap", () => {
            let reads = 0;
            const arrayLike: any = { length: 1, 0: "a" };
            Object.defineProperty(arrayLike, "constructor", {
                get: () => {
                    reads++;
                    return Array;
                }
            });

            assert.deepEqual(polyArrFlatMap(arrayLike, (value: string) => [value]), ["a"]);
            assert.equal(reads, 0);
        });

        it("reads the length of a returned array once, like Array.prototype.flatMap", function() {
            const nativeFlatMap = (Array.prototype as any).flatMap;
            if (!hasProxy || !nativeFlatMap) {
                this.skip();
                return;
            }

            // The callback returns a Proxy of an array (an array for IsArray), which counts the reads of its length
            const reads = { poly: 0, native: 0 };
            const mapper = (name: "poly" | "native") => (value: number) => new Proxy([value, value * 10], {
                get: (target: any, key: PropertyKey) => {
                    if (key === "length") {
                        reads[name]++;
                    }

                    return target[key];
                }
            });

            assert.deepEqual(polyArrFlatMap([1, 2], mapper("poly")), [1, 10, 2, 20]);
            assert.deepEqual(nativeFlatMap.call([1, 2], mapper("native")), [1, 10, 2, 20], "Array.prototype.flatMap");
            assert.equal(reads.poly, 2, "The length of each returned array was read once");
            assert.equal(reads.native, 2, "Array.prototype.flatMap read each length once");
        });
    });
});
