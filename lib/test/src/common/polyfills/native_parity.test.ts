/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyArrFind, polyArrFindLast, polyArrFrom, polyArrIncludes } from "../../../../src/polyfills/array";
import { polyArrAt } from "../../../../src/array/at";
import { polyArrFill } from "../../../../src/array/fill";
import { polyObjFromEntries } from "../../../../src/polyfills/object/objFromEntries";
import { polyObjGetOwnPropertyDescriptors } from "../../../../src/polyfills/object/objGetOwnProperty";
import { polyObjEntries, polyObjKeys, polyObjValues } from "../../../../src/polyfills/object/objKeys";
import { polyObjPreventExtensions } from "../../../../src/polyfills/object/objPreventExtensions";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../../../../src/polyfills/symbol";
import { polyObjHasOwn } from "../../../../src/object/has_own";
import { polyArrWith } from "../../../../src/array/with";
import { polyArrFlatMap } from "../../../../src/array/flatMap";
import { arrAppend } from "../../../../src/array/append";
import { polyStrSubstr } from "../../../../src/string/substring";
import { iterToArray } from "../../../../src/iterator/iterToArray";
import { readArgs } from "../../../../src/funcs/readArgs";
import { polyStrPadEnd, polyStrPadStart } from "../../../../src/string/pad";
import { polyStrReplaceAll } from "../../../../src/string/replace_all";
import { polyStrMatchAll } from "../../../../src/string/match_all";
import { polyStrStartsWith } from "../../../../src/string/starts_with";
import { polyStrEndsWith } from "../../../../src/string/ends_with";
import { polyStrIncludes } from "../../../../src/string/includes";
import { polyStrAt } from "../../../../src/string/at";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../../../../src/polyfills/trim";
import { iterFilter } from "../../../../src/iterator/iterFilter";
import { iterMap } from "../../../../src/iterator/iterMap";
import { iterTake } from "../../../../src/iterator/iterTake";

// The polyfills (and the helpers which work like a native function) compared with the native functions, for the
// values and operations (eg. how often a getter or valueOf() is called) where they used to be different
describe("polyfills match the native functions", () => {
    const hasSymbol = typeof Symbol === "function" && !!Symbol.iterator;
    const hasProxy = typeof Proxy === "function";

    // An iterable whose iterator has a "next" getter, which counts how often it is read
    function _nextCountingIterable(values: any[], counts: { next: number }): any {
        const iterable: any = {};
        iterable[Symbol.iterator] = () => {
            let idx = 0;
            const iterator: any = {};
            Object.defineProperty(iterator, "next", {
                get: () => {
                    counts.next++;
                    return () => (idx < values.length ? { value: values[idx++], done: false } : { value: undefined, done: true });
                }
            });

            return iterator;
        };

        return iterable;
    }

    // An iterable whose next() throws an EvalError
    function _throwingIterable(): any {
        const iterable: any = {};
        iterable[Symbol.iterator] = () => ({
            next: () => {
                throw new EvalError("next");
            }
        });

        return iterable;
    }

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

    describe("polyArrFrom", () => {
        it("uses an array's own [Symbol.iterator], like Array.from", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const arr: any = ["a", "b"];
            arr[Symbol.iterator] = () => ["x"][Symbol.iterator]();

            assert.deepEqual(polyArrFrom(arr), ["x"]);
            assert.deepEqual(Array.from(arr), ["x"], "Array.from");
        });

        it("reads an array whose own [Symbol.iterator] is null as an array-like, like Array.from", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const arr: any = ["a", "b"];
            arr[Symbol.iterator] = null;

            assert.deepEqual(polyArrFrom(arr), ["a", "b"]);
            assert.deepEqual(Array.from(arr), ["a", "b"], "Array.from");
        });

        it("reads the iterator's next() once, like Array.from", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const counts = { next: 0 };
            assert.deepEqual(polyArrFrom(_nextCountingIterable([1, 2, 3], counts)), [1, 2, 3]);
            assert.equal(counts.next, 1, "polyArrFrom read next once");

            counts.next = 0;
            Array.from(_nextCountingIterable([1, 2, 3], counts));
            assert.equal(counts.next, 1, "Array.from read next once");
        });

        it("doesn't iterate a Map or Set whose own [Symbol.iterator] is null (it isn't iterable), like Array.from", function() {
            if (!hasSymbol || typeof Map !== "function") {
                this.skip();
                return;
            }

            const map: any = new Map([["k", "v"]]);
            map[Symbol.iterator] = null;

            assert.deepEqual(polyArrFrom(map), []);
            assert.deepEqual(Array.from(map), [], "Array.from");
        });

        it("adds own values when the prototype of Array.prototype is a Proxy (which the native function doesn't use)", function() {
            if (!hasProxy) {
                this.skip();
                return;
            }

            const orgProto = Object.getPrototypeOf(Array.prototype);
            const traps: string[] = [];
            const isIndex = (key: PropertyKey) => typeof key === "string" && /^\d+$/.test(key);
            const proxy = new Proxy(orgProto, {
                has: (target: any, key: PropertyKey) => {
                    isIndex(key) && traps.push("has " + String(key));
                    return Reflect.has(target, key);
                },
                set: (target: any, key: PropertyKey, value: any, receiver: any) => {
                    if (isIndex(key)) {
                        // Swallows the value (so an assignment which used the prototype would lose it)
                        traps.push("set " + String(key));
                        return true;
                    }

                    return Reflect.set(target, key, value, receiver);
                }
            });

            let result: any[];
            let nativeResult: any[];
            try {
                Object.setPrototypeOf(Array.prototype, proxy);
                result = polyArrFrom({ length: 2, 0: "a", 1: "b" });
                nativeResult = Array.from({ length: 2, 0: "a", 1: "b" });
            } finally {
                // Restored before any assert is used
                Object.setPrototypeOf(Array.prototype, orgProto);
            }

            assert.deepEqual(traps, [], "The Proxy wasn't used");
            assert.deepEqual(result, ["a", "b"]);
            assert.deepEqual(nativeResult, ["a", "b"], "Array.from");
        });
    });

    describe("polyObjFromEntries", () => {
        it("converts an object key once and keeps a symbol (eg. from a Symbol object or Symbol.toPrimitive), like Object.fromEntries", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const symObj = Object(Symbol.for("polyObjFromEntries.symObj"));
            const toPrim: any = {};
            toPrim[Symbol.toPrimitive] = () => Symbol.for("polyObjFromEntries.toPrim");
            const calls: string[] = [];
            const objKey = {
                toString: () => {
                    calls.push("toString");
                    return "k";
                }
            };

            const result: any = polyObjFromEntries([[symObj, 1], [toPrim, 2], [objKey, 3]] as any);

            assert.equal(result[Symbol.for("polyObjFromEntries.symObj")], 1, "The Symbol object key");
            assert.equal(result[Symbol.for("polyObjFromEntries.toPrim")], 2, "The Symbol.toPrimitive key");
            assert.equal(result.k, 3, "The object key");
            assert.deepEqual(calls, ["toString"], "The object key was converted once");

            const nativeFromEntries = (Object as any).fromEntries;
            if (nativeFromEntries) {
                const nativeResult: any = nativeFromEntries([[symObj, 1], [toPrim, 2]]);
                assert.equal(nativeResult[Symbol.for("polyObjFromEntries.symObj")], 1, "Object.fromEntries: the Symbol object key");
                assert.equal(nativeResult[Symbol.for("polyObjFromEntries.toPrim")], 2, "Object.fromEntries: the Symbol.toPrimitive key");
            }
        });

        it("uses an array's own [Symbol.iterator], and throws for an array whose own [Symbol.iterator] is null, like Object.fromEntries", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const nativeFromEntries = (Object as any).fromEntries;
            const ownIter: any = [["a", 1]];
            ownIter[Symbol.iterator] = () => [["z", 9]][Symbol.iterator]();
            const nullIter: any = [["a", 1]];
            nullIter[Symbol.iterator] = null;

            assert.deepEqual(polyObjFromEntries(ownIter), { z: 9 });
            assert.throws(() => polyObjFromEntries(nullIter), TypeError);
            if (nativeFromEntries) {
                assert.deepEqual(nativeFromEntries(ownIter), { z: 9 }, "Object.fromEntries");
                assert.throws(() => nativeFromEntries(nullIter), TypeError, undefined, "Object.fromEntries");
            }
        });

        it("reads the iterator's next() once", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const counts = { next: 0 };
            assert.deepEqual(polyObjFromEntries(_nextCountingIterable([["a", 1], ["b", 2]], counts)), { a: 1, b: 2 });
            assert.equal(counts.next, 1);
        });
    });

    describe("polyObjGetOwnPropertyDescriptors", () => {
        it("adds an own __proto__ key (without changing the result's prototype), like Object.getOwnPropertyDescriptors", () => {
            const value = JSON.parse("{\"__proto__\": { \"x\": 1 }, \"b\": 2}");
            const result = polyObjGetOwnPropertyDescriptors(value);

            assert.deepEqual(Object.getOwnPropertyNames(result), ["__proto__", "b"]);
            assert.strictEqual(Object.getPrototypeOf(result), Object.prototype, "The prototype wasn't changed");
            assert.deepEqual((Object.getOwnPropertyDescriptor(result, "__proto__") as any).value.value, { x: 1 });

            const nativeFn = (Object as any).getOwnPropertyDescriptors;
            if (nativeFn) {
                assert.deepEqual(Object.getOwnPropertyNames(nativeFn(value)), ["__proto__", "b"], "Object.getOwnPropertyDescriptors");
            }
        });

        it("adds a key which has a setter on Object.prototype", () => {
            let setterCalls = 0;
            let keys: string[];
            try {
                Object.defineProperty(Object.prototype, "polyDescriptorsKey", {
                    set: () => {
                        setterCalls++;
                    },
                    configurable: true
                });

                keys = Object.keys(polyObjGetOwnPropertyDescriptors({ polyDescriptorsKey: 1, a: 2 }));
            } finally {
                delete (Object.prototype as any).polyDescriptorsKey;
            }

            assert.deepEqual(keys, ["polyDescriptorsKey", "a"]);
            assert.equal(setterCalls, 0, "The Object.prototype setter wasn't called");
        });

        it("reads the own keys of a Proxy once, and works when it is called again from a trap", function() {
            if (!hasProxy) {
                this.skip();
                return;
            }

            const traps: string[] = [];
            let nested: any;
            const proxy = new Proxy({ a: 1, b: 2 }, {
                ownKeys: (target: any) => {
                    traps.push("ownKeys");
                    return Reflect.ownKeys(target);
                },
                getOwnPropertyDescriptor: (target: any, key: PropertyKey) => {
                    if (key === "a" && !nested) {
                        // Called again (re-entrantly) for another object
                        nested = polyObjGetOwnPropertyDescriptors({ c: 3 });
                    }

                    return Reflect.getOwnPropertyDescriptor(target, key);
                }
            });

            assert.deepEqual(Object.keys(polyObjGetOwnPropertyDescriptors(proxy)), ["a", "b"]);
            assert.deepEqual(traps, ["ownKeys"], "The ownKeys trap was called once");
            assert.deepEqual(Object.keys(nested), ["c"], "The nested call returned the descriptors");
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

    describe("the array polyfills convert a primitive array to an object (ToObject) before reading it", () => {
        it("call a strict getter of Number.prototype with the Number object, like the native functions", () => {
            const previousLength = Object.getOwnPropertyDescriptor(Number.prototype, "length");
            const previous0 = Object.getOwnPropertyDescriptor(Number.prototype, "0");
            const arrayProto: any = Array.prototype;
            const calls: { [name: string]: { poly: Function, native: Function, args: any[] } } = {
                at: { poly: polyArrAt, native: arrayProto.at, args: [0] },
                fill: { poly: polyArrFill, native: arrayProto.fill, args: ["y", 1] },
                includes: { poly: polyArrIncludes, native: arrayProto.includes, args: ["z"] },
                find: { poly: polyArrFind, native: arrayProto.find, args: [() => false] },
                findLast: { poly: polyArrFindLast, native: arrayProto.findLast, args: [() => false] },
                with: { poly: polyArrWith, native: arrayProto.with, args: [0, "y"] }
            };
            const receivers: { [name: string]: string[] } = {};
            const nativeReceivers: { [name: string]: string[] } = {};
            let current: string[];

            try {
                Object.defineProperty(Number.prototype, "length", {
                    get: function() {
                        "use strict";
                        current.push("length " + typeof this);
                        return 1;
                    },
                    configurable: true
                });
                Object.defineProperty(Number.prototype, "0", {
                    get: function() {
                        "use strict";
                        current.push("0 " + typeof this);
                        return "x";
                    },
                    configurable: true
                });

                Object.keys(calls).forEach((name) => {
                    const call = calls[name];
                    current = receivers[name] = [];
                    call.poly.apply(null, [5].concat(call.args));

                    if (call.native) {
                        current = nativeReceivers[name] = [];
                        call.native.apply(5, call.args);
                    }
                });
            } finally {
                // Restored before any assert is used
                if (previousLength) {
                    Object.defineProperty(Number.prototype, "length", previousLength);
                } else {
                    delete (Number.prototype as any).length;
                }

                if (previous0) {
                    Object.defineProperty(Number.prototype, "0", previous0);
                } else {
                    delete (Number.prototype as any)[0];
                }
            }

            Object.keys(calls).forEach((name) => {
                assert.equal(receivers[name][0], "length object", name + " read the length of the Number object");
                receivers[name].forEach((receiver) => {
                    assert.isTrue(/ object$/.test(receiver), name + ": " + receiver);
                });

                if (nativeReceivers[name]) {
                    assert.deepEqual(receivers[name], nativeReceivers[name], name + " like the native function");
                }
            });
        });
    });

    describe("polyStrSubstr", () => {
        it("throws a TypeError for a Symbol, like String.prototype.substr", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            assert.throws(() => polyStrSubstr(Symbol("s") as any, 0, 3), TypeError);
            assert.throws(() => String.prototype.substr.call(Symbol("s"), 0, 3), TypeError, undefined, "String.prototype.substr");
        });
    });

    describe("iterToArray", () => {
        it("adds each value as an own property when Array.prototype has a setter for the index, like Array.from", function() {
            if (!hasSymbol || typeof Set !== "function") {
                this.skip();
                return;
            }

            const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
            let setterCalls = 0;
            let result: any[];
            let nativeResult: any[];
            try {
                Object.defineProperty(Array.prototype, "0", {
                    set: () => {
                        setterCalls++;
                    },
                    configurable: true
                });

                result = iterToArray(new Set(["a", "b"]));
                nativeResult = Array.from(new Set(["a", "b"]));
            } finally {
                // Restored before any assert is used
                if (previous) {
                    Object.defineProperty(Array.prototype, "0", previous);
                } else {
                    delete (Array.prototype as any)[0];
                }
            }

            assert.equal(setterCalls, 0, "The Array.prototype setter wasn't called");
            assert.deepEqual(Object.keys(result), ["0", "1"]);
            assert.deepEqual(Object.keys(nativeResult), ["0", "1"], "Array.from");
        });
    });

    describe("arrAppend", () => {
        it("reads the [Symbol.iterator] once, like spread", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            let reads = 0;
            const iterable: any = {};
            Object.defineProperty(iterable, Symbol.iterator, {
                get: () => {
                    reads++;
                    return () => [1, 2][Symbol.iterator]();
                }
            });

            assert.deepEqual(arrAppend([0], iterable), [0, 1, 2]);
            assert.equal(reads, 1);
        });

        it("doesn't change the target when the iterator throws, like spread", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            let count = 0;
            const iterable: any = {};
            iterable[Symbol.iterator] = () => ({
                next: () => {
                    if (count++ < 2) {
                        return { value: count, done: false };
                    }

                    throw new EvalError("next");
                }
            });

            const target = [0];
            assert.throws(() => arrAppend(target, iterable), EvalError);
            assert.deepEqual(target, [0], "No values were appended");
        });

        it("uses an array's own [Symbol.iterator], like spread", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const arr: any = [1, 2];
            arr[Symbol.iterator] = () => ["x"][Symbol.iterator]();

            assert.deepEqual(arrAppend([0], arr), [0, "x"]);
        });

        it("appends the values of an array whose own [Symbol.iterator] is null or undefined", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const nullIter: any = [1, 2];
            nullIter[Symbol.iterator] = null;
            const undefinedIter: any = [3, 4];
            undefinedIter[Symbol.iterator] = undefined;

            assert.deepEqual(arrAppend([0], nullIter), [0, 1, 2], "A null iterator");
            assert.deepEqual(arrAppend([0], undefinedIter), [0, 3, 4], "An undefined iterator");
        });
    });

    describe("readArgs", () => {
        it("returns an array for a string, like Array.prototype.slice.call()", () => {
            assert.deepEqual(readArgs("hello" as any, 1), ["e", "l", "l", "o"]);
            assert.deepEqual(Array.prototype.slice.call("hello", 1), ["e", "l", "l", "o"], "Array.prototype.slice.call");
        });

        it("throws the iterator's error before converting the start / end, like Array.from(value).slice()", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const throwingStart = {
                valueOf: (): number => {
                    throw new RangeError("start");
                }
            };

            assert.throws(() => readArgs(_throwingIterable(), throwingStart as any, -1), EvalError, undefined, "next() threw first");
            assert.throws(() => Array.from(_throwingIterable()).slice(throwingStart as any, -1), EvalError, undefined, "Array.from(value).slice()");

            const notCallable: any = {};
            notCallable[Symbol.iterator] = {};
            assert.throws(() => readArgs(notCallable, throwingStart as any, -1), TypeError, undefined, "The [Symbol.iterator] threw first");

            // The start is still converted (once) when the iterator has no values
            const empty: any = {};
            empty[Symbol.iterator] = () => [][Symbol.iterator]();
            assert.throws(() => readArgs(empty, throwingStart as any, -1), RangeError, undefined, "The start of an empty iterable");
        });

        it("doesn't iterate a Map whose own [Symbol.iterator] is null (it isn't iterable), like Array.from", function() {
            if (!hasSymbol || typeof Map !== "function") {
                this.skip();
                return;
            }

            const map: any = new Map([["k", "v"]]);
            map[Symbol.iterator] = null;

            assert.deepEqual(readArgs(map), []);
            assert.deepEqual(Array.from(map), [], "Array.from");
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
    });

    describe("polyObjHasOwn", () => {
        it("works for a primitive (eg. a string's length) and converts the key once, like Object.hasOwn", () => {
            const calls: string[] = [];
            const key = {
                toString: () => {
                    calls.push("toString");
                    return "zz";
                }
            };

            assert.isTrue(polyObjHasOwn("", "length"), "\"\" has its own length");
            assert.isFalse(polyObjHasOwn("abc", "x"));
            assert.isFalse(polyObjHasOwn(0, "x"));
            assert.isFalse(polyObjHasOwn({}, key as any));
            assert.deepEqual(calls, ["toString"], "The key was converted once");
            assert.throws(() => polyObjHasOwn(null, "x"), TypeError);

            const nativeHasOwn = (Object as any).hasOwn;
            if (nativeHasOwn) {
                assert.isTrue(nativeHasOwn("", "length"), "Object.hasOwn");
            }
        });
    });

    describe("polyObjKeys, polyObjEntries and polyObjValues", () => {
        it("return the keys of a primitive or a function (only null and undefined throw), like Object.keys (ES2015+)", () => {
            const fn: any = function() {
                // Empty
            };
            fn.a = 1;

            assert.deepEqual(polyObjKeys("ab"), ["0", "1"]);
            assert.deepEqual(polyObjKeys(1), []);
            assert.deepEqual(polyObjKeys(true), []);
            assert.deepEqual(polyObjKeys(fn), ["a"]);
            assert.throws(() => polyObjKeys(null), TypeError);
            assert.throws(() => polyObjKeys(undefined), TypeError);
            assert.deepEqual(Object.keys("ab"), ["0", "1"], "Object.keys");
            assert.deepEqual(Object.keys(fn), ["a"], "Object.keys");
        });

        it("skip a key which a getter made non-enumerable before it was reached, like Object.entries / Object.values", () => {
            function _create(): any {
                const value: any = { b: 2 };
                Object.defineProperty(value, "a", {
                    get: function(this: any) {
                        Object.defineProperty(this, "b", { enumerable: false });
                        return 1;
                    },
                    enumerable: true,
                    configurable: true
                });

                return value;
            }

            // Like the native functions the keys are in property creation order, "b" was created first
            const nativeEntries = (Object as any).entries;
            const expectedEntries = nativeEntries ? nativeEntries(_create()) : [["b", 2], ["a", 1]];
            assert.deepEqual(polyObjEntries(_create()), expectedEntries);

            // A getter which is reached first makes the later key non-enumerable
            const getterFirst: any = {};
            Object.defineProperty(getterFirst, "a", {
                get: function(this: any) {
                    Object.defineProperty(this, "b", { enumerable: false });
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            getterFirst.b = 2;

            assert.deepEqual(polyObjEntries(getterFirst), [["a", 1]]);

            const getterFirst2: any = {};
            Object.defineProperty(getterFirst2, "a", {
                get: function(this: any) {
                    Object.defineProperty(this, "b", { enumerable: false });
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            getterFirst2.b = 2;
            assert.deepEqual(polyObjValues(getterFirst2), [1]);
        });

        it("read the own keys of a Proxy once and each descriptor once", function() {
            if (!hasProxy) {
                this.skip();
                return;
            }

            const traps: string[] = [];
            const proxy = new Proxy({ a: 1, b: 2 }, {
                ownKeys: (target: any) => {
                    traps.push("ownKeys");
                    return Reflect.ownKeys(target);
                },
                getOwnPropertyDescriptor: (target: any, key: PropertyKey) => {
                    traps.push("gOPD " + String(key));
                    return Reflect.getOwnPropertyDescriptor(target, key);
                },
                getPrototypeOf: (target: any) => {
                    traps.push("getPrototypeOf");
                    return Reflect.getPrototypeOf(target);
                }
            });

            assert.deepEqual(polyObjEntries(proxy), [["a", 1], ["b", 2]]);
            assert.deepEqual(traps, ["ownKeys", "gOPD a", "gOPD b"]);
        });
    });

    describe("polyObjPreventExtensions", () => {
        it("returns a primitive value, like Object.preventExtensions (ES2015+)", () => {
            assert.strictEqual(polyObjPreventExtensions(1), 1);
            assert.strictEqual(polyObjPreventExtensions("abc"), "abc");
            assert.strictEqual(Object.preventExtensions(1 as any), 1, "Object.preventExtensions");
        });
    });

    describe("the Symbol polyfill", () => {
        it("polySymbolFor() and polySymbolKeyFor() support the names of Object.prototype (eg. __proto__)", () => {
            const protoSym = polySymbolFor("__proto__");

            assert.equal(polySymbolKeyFor(protoSym), "__proto__");
            assert.strictEqual(polySymbolFor("__proto__"), protoSym, "The same symbol is returned again");

            const valueOfSym = polySymbolFor("valueOf");
            assert.notEqual(typeof valueOfSym, "function", "valueOf is a symbol (not the inherited function)");
            assert.equal(polySymbolKeyFor(valueOfSym), "valueOf");
        });

        it("polySymbolFor() converts the key once, like Symbol.for()", () => {
            const calls: string[] = [];
            const key = {
                toString: () => {
                    calls.push("toString");
                    return "polySymbolFor.converted";
                }
            };

            const sym = polySymbolFor(key as any);
            assert.deepEqual(calls, ["toString"]);
            assert.strictEqual(polySymbolFor("polySymbolFor.converted"), sym);
        });

        it("polyNewSymbol() has an undefined description when none is provided, like Symbol()", () => {
            const sym: any = polyNewSymbol();

            assert.isUndefined(sym.description);
            assert.equal(String(sym).indexOf("Symbol()"), 0, "The string starts with Symbol()");
            if (hasSymbol) {
                assert.isUndefined((Symbol() as any).description, "Symbol()");
            }
        });

        it("polyNewSymbol() converts an object description once (with its toString()), like Symbol()", () => {
            const calls: string[] = [];
            const description = {
                toString: () => {
                    calls.push("toString");
                    return "o";
                },
                valueOf: () => {
                    calls.push("valueOf");
                    return "v";
                }
            };

            const sym: any = polyNewSymbol(description as any);
            assert.equal(sym.description, "o");
            assert.equal(String(sym).indexOf("Symbol(o)"), 0);
            assert.deepEqual(calls, ["toString"]);
        });

        it("polyNewSymbol() and polySymbolFor() throw a TypeError for a symbol, like Symbol() and Symbol.for()", () => {
            assert.throws(() => polyNewSymbol(polyNewSymbol("a") as any), TypeError);
            assert.throws(() => polySymbolFor(polyNewSymbol("a") as any), TypeError);
            if (hasSymbol) {
                assert.throws(() => polyNewSymbol(Symbol("a") as any), TypeError);
                assert.throws(() => polySymbolFor(Symbol("a") as any), TypeError);
                assert.throws(() => Symbol(Symbol("a") as any), TypeError, undefined, "Symbol()");
            }
        });

        it("polySymbolKeyFor() throws a TypeError for a value which isn't a symbol (without converting it), like Symbol.keyFor()", () => {
            const calls: string[] = [];
            const notSymbol = {
                toString: () => {
                    calls.push("toString");
                    return "Symbol(x)";
                }
            };

            assert.throws(() => polySymbolKeyFor("Symbol(a)" as any), TypeError);
            assert.throws(() => polySymbolKeyFor(notSymbol as any), TypeError);
            assert.deepEqual(calls, [], "The value wasn't converted");
            if (hasSymbol) {
                assert.equal(polySymbolKeyFor(Symbol.for("polySymbolKeyFor.native")), "polySymbolKeyFor.native", "A native symbol uses the native registry");
                assert.isUndefined(polySymbolKeyFor(Symbol("x")));
            }
        });

        it("polyGetKnownSymbol() only returns a well-known symbol (not one for an inherited name, eg. toString)", () => {
            assert.isUndefined(polyGetKnownSymbol("toString"));
            assert.isUndefined(polyGetKnownSymbol("constructor"));
            assert.ok(polyGetKnownSymbol("iterator"), "A well-known symbol");
        });
    });
    describe("polyStrPadStart and polyStrPadEnd", () => {
        it("convert the value to a string and the targetLength to a length, like String.prototype.padStart / padEnd", () => {
            const nativePadStart = (String.prototype as any).padStart;
            const conv = { toString: () => "abcabc", valueOf: () => 7 };
            const cases: any[] = [
                [42, 6, "a"], [["a", "b"], 6, "a"], [conv, 9, "a"], [-0, 2, "a"], ["abcabc", Infinity, ""],
                ["abcabc", -2147483649, "a"], ["abc", 5.9, "xy"], ["abc", "6", null], ["abc", NaN, "a"]
            ];

            cases.forEach(([value, targetLength, padString]) => {
                const details = JSON.stringify([value, targetLength, padString]);
                const expected = nativePadStart ? nativePadStart.call(value, targetLength, padString) : undefined;
                if (nativePadStart) {
                    assert.equal(polyStrPadStart(value, targetLength, padString), expected, "padStart " + details);
                    assert.equal(polyStrPadEnd(value, targetLength, padString), (String.prototype as any).padEnd.call(value, targetLength, padString), "padEnd " + details);
                }
            });

            assert.equal(polyStrPadStart(42 as any, 6, "a"), "aaaa42");
            assert.equal(polyStrPadEnd(["a", "b"] as any, 6, "a"), "a,baaa");
            assert.equal(polyStrPadStart(conv as any, 9, "a"), "aaaabcabc", "The value's toString() is used");
        });

        it("throw a RangeError for a padded string which is longer than a string can be, and a TypeError for null or a Symbol", function() {
            assert.throws(() => polyStrPadStart("abc", Math.pow(2, 53), "a"), RangeError);
            assert.throws(() => polyStrPadEnd("abc", Infinity, "a"), RangeError);

            let valueOfCalls = 0;
            const targetLength = {
                valueOf: () => {
                    valueOfCalls++;
                    return 5;
                }
            };

            assert.throws(() => polyStrPadStart(null as any, targetLength as any, "a"), TypeError);
            assert.equal(valueOfCalls, 0, "The targetLength isn't converted when the value is null");
            if (hasSymbol) {
                assert.throws(() => polyStrPadStart("abc", 9, Symbol() as any), TypeError, undefined, "A Symbol padString");
                assert.throws(() => polyStrPadStart(Symbol() as any, 9, "a"), TypeError, undefined, "A Symbol value");
            }
        });
    });

    describe("the string polyfills convert a Symbol like the native functions", () => {
        it("throw a TypeError for a Symbol value or argument", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const sym: any = Symbol("abc");
            [polyStrTrim, polyStrTrimStart, polyStrTrimEnd].forEach((trimFn: any) => {
                assert.throws(() => trimFn(sym), TypeError);
            });

            assert.throws(() => polyStrAt(sym, 0), TypeError, undefined, "polyStrAt");
            assert.throws(() => polyStrStartsWith("abc", sym), TypeError, undefined, "polyStrStartsWith searchString");
            assert.throws(() => polyStrStartsWith(sym, "a"), TypeError, undefined, "polyStrStartsWith value");
            assert.throws(() => polyStrEndsWith("abc", sym), TypeError, undefined, "polyStrEndsWith searchString");
            assert.throws(() => polyStrIncludes("abc", sym), TypeError, undefined, "polyStrIncludes searchString");
            assert.throws(() => polyStrReplaceAll(sym, "a", "X"), TypeError, undefined, "polyStrReplaceAll value");
            assert.throws(() => polyStrReplaceAll("abc", sym, "X"), TypeError, undefined, "polyStrReplaceAll searchValue");
            assert.throws(() => String.prototype.trim.call(sym), TypeError, undefined, "String.prototype.trim");
            assert.throws(() => "abc".startsWith(sym), TypeError, undefined, "String.prototype.startsWith");
        });

        it("convert their values with the original String.prototype.concat, so a replaced one isn't used", () => {
            const orgConcat = String.prototype.concat;
            let concatCalls = 0;
            const results: any = {};

            try {
                String.prototype.concat = function() {
                    concatCalls++;
                    return "replaced";
                };

                results.startsWith = polyStrStartsWith("abc", "a");
                results.endsWith = polyStrEndsWith("abc", "c");
                results.includes = polyStrIncludes("abc", "b");
                results.padStart = polyStrPadStart("a", 3, "-");
                results.padEnd = polyStrPadEnd("a", 3, "-");
                results.at = polyStrAt("abc", 1);
                results.substr = polyStrSubstr("abc", 1, 1);
                results.trim = polyStrTrim(" a ");
                results.replaceAll = polyStrReplaceAll("aba", "a", "x");
                results.matchAll = iterToArray(polyStrMatchAll("aba", "a")).length;
            } finally {
                // Restored before any assert is used
                String.prototype.concat = orgConcat;
            }

            assert.equal(concatCalls, 0, "The replaced concat wasn't called");
            assert.deepEqual(results, {
                startsWith: true,
                endsWith: true,
                includes: true,
                padStart: "--a",
                padEnd: "a--",
                at: "b",
                substr: "b",
                trim: "a",
                replaceAll: "xbx",
                matchAll: 2
            });
        });
    });

    describe("polyStrStartsWith, polyStrEndsWith and polyStrIncludes identify a RegExp like the native functions (IsRegExp)", () => {
        it("don't use the Symbol.toStringTag of a value", function() {
            if (!hasSymbol || !Symbol.toStringTag) {
                this.skip();
                return;
            }

            const tagged: any = { toString: () => "a" };
            tagged[Symbol.toStringTag] = "RegExp";

            assert.isTrue(polyStrStartsWith("abc", tagged), "polyStrStartsWith");
            assert.isTrue(polyStrIncludes("abc", tagged), "polyStrIncludes");
            assert.isTrue("abc".startsWith(tagged), "String.prototype.startsWith");
        });

        it("don't read any more of a regular expression's properties before throwing", function() {
            if (!hasSymbol || !Symbol.match) {
                this.skip();
                return;
            }

            const reads: string[] = [];
            const regExpLike: any = {
                toJSON: () => {
                    reads.push("toJSON");
                    return "x";
                }
            };
            regExpLike[Symbol.match] = true;
            Object.defineProperty(regExpLike, "a", {
                get: () => {
                    reads.push("a");
                    return 1;
                },
                enumerable: true
            });

            assert.throws(() => polyStrStartsWith("abc", regExpLike), TypeError);
            assert.throws(() => "abc".startsWith(regExpLike), TypeError, undefined, "String.prototype.startsWith");
            assert.deepEqual(reads, [], "No other properties were read");
        });
    });

    describe("polyStrReplaceAll", () => {
        it("checks the searchValue like String.prototype.replaceAll (IsRegExp, its flags and its Symbol.replace)", function() {
            if (!hasSymbol || !Symbol.match || !Symbol.replace) {
                this.skip();
                return;
            }

            const nativeReplaceAll = (String.prototype as any).replaceAll;
            const regExpLike: any = { toString: () => "a" };
            regExpLike[Symbol.match] = true;
            const tagged: any = { toString: () => "a" };
            tagged[Symbol.toStringTag] = "RegExp";
            const notRegExp: any = /a/;
            notRegExp[Symbol.match] = 0;
            const emptyFlags: any = /a/g;
            Object.defineProperty(emptyFlags, "flags", { get: () => "" });
            const badReplace: any = { toString: () => "a" };
            badReplace[Symbol.replace] = 5;

            assert.throws(() => polyStrReplaceAll("abcabc", regExpLike, "X"), TypeError, undefined, "A truthy Symbol.match without flags");
            assert.equal(polyStrReplaceAll("abcabc", tagged, "X"), "XbcXbc", "A Symbol.toStringTag of RegExp isn't a RegExp");
            assert.equal(polyStrReplaceAll("abcabc", notRegExp, "X"), "Xbcabc", "A falsy Symbol.match isn't a regular expression, its Symbol.replace is used");
            assert.throws(() => polyStrReplaceAll("abcabc", emptyFlags, "X"), TypeError, undefined, "The flags are used (rather than global)");
            assert.throws(() => polyStrReplaceAll("abcabc", badReplace, "X"), TypeError, undefined, "A Symbol.replace which isn't a function");

            if (nativeReplaceAll) {
                assert.throws(() => nativeReplaceAll.call("abcabc", regExpLike, "X"), TypeError, undefined, "native: regExpLike");
                assert.equal(nativeReplaceAll.call("abcabc", tagged, "X"), "XbcXbc", "native: tagged");
                assert.equal(nativeReplaceAll.call("abcabc", notRegExp, "X"), "Xbcabc", "native: notRegExp");
                assert.throws(() => nativeReplaceAll.call("abcabc", emptyFlags, "X"), TypeError, undefined, "native: emptyFlags");
                assert.throws(() => nativeReplaceAll.call("abcabc", badReplace, "X"), TypeError, undefined, "native: badReplace");
            }
        });

        it("calls the Symbol.replace (not its own call property) with the value before it is converted", function() {
            if (!hasSymbol || !Symbol.replace) {
                this.skip();
                return;
            }

            const calls: any[] = [];
            const replacer: any = function(this: any, value: any, replaceValue: any) {
                calls.push([this, value, replaceValue]);
                return "replaced";
            };
            replacer.call = () => "own call";
            const searchValue: any = {};
            searchValue[Symbol.replace] = replacer;
            const theValue = { toString: () => "abc" };

            assert.equal(polyStrReplaceAll(theValue as any, searchValue, "X"), "replaced");
            assert.strictEqual(calls[0][0], searchValue, "Called with the searchValue as this");
            assert.strictEqual(calls[0][1], theValue, "Passed the value (not converted)");
            assert.equal(calls[0][2], "X");
        });
    });

    describe("polyStrMatchAll", () => {
        it("checks the matcher like String.prototype.matchAll (IsRegExp, its flags and its Symbol.matchAll)", function() {
            if (!hasSymbol || !Symbol.match || !(Symbol as any).matchAll) {
                this.skip();
                return;
            }

            const regExpLike: any = { toString: () => "a" };
            regExpLike[Symbol.match] = true;
            const globalLike: any = { flags: "g", toString: () => "a" };
            globalLike[Symbol.match] = true;
            const notRegExp: any = /a/;
            notRegExp[Symbol.match] = false;
            const badMatchAll: any = /a/g;
            badMatchAll[(Symbol as any).matchAll] = 5;
            const count = (iter: any) => {
                let found = 0;
                while (!iter.next().done) {
                    found++;
                }

                return found;
            };

            assert.throws(() => polyStrMatchAll("abcabc", regExpLike), TypeError, undefined, "A truthy Symbol.match without flags");
            assert.equal(count(polyStrMatchAll("abcabc", globalLike)), 2, "A regular expression like object with a g flag");
            assert.equal(count(polyStrMatchAll("abcabc", notRegExp)), 1, "A RegExp whose Symbol.match is false (not global)");
            assert.throws(() => polyStrMatchAll("abcabc", badMatchAll), TypeError, undefined, "A Symbol.matchAll which isn't a function");

            const nativeMatchAll = (String.prototype as any).matchAll;
            if (nativeMatchAll) {
                assert.throws(() => nativeMatchAll.call("abcabc", regExpLike), TypeError, undefined, "native: regExpLike");
                assert.equal(count(nativeMatchAll.call("abcabc", globalLike)), 2, "native: globalLike");
                assert.equal(count(nativeMatchAll.call("abcabc", notRegExp)), 1, "native: notRegExp");
                assert.throws(() => nativeMatchAll.call("abcabc", badMatchAll), TypeError, undefined, "native: badMatchAll");
            }
        });
    });

    describe("polyArrFrom with a constructor this", () => {
        it("creates the result with the constructor, like Array.from", () => {
            const calls: any[][] = [];
            const Ctor: any = function(this: any) {
                calls.push(Array.prototype.slice.call(arguments));
            };

            const arrayLike: any = (polyArrFrom as any).call(Ctor, { length: 3, 0: "a", 2: "c" });
            assert.isTrue(arrayLike instanceof Ctor, "An instance of the constructor");
            assert.deepEqual(calls, [[3]], "An array-like passes its length");
            assert.deepEqual(Object.getOwnPropertyDescriptor(arrayLike, "0"), { value: "a", writable: true, enumerable: true, configurable: true });
            assert.equal(arrayLike[1], undefined);
            assert.equal(arrayLike.length, 3, "The length is set");

            const nativeArrayLike: any = (Array.from as any).call(Ctor, { length: 3, 0: "a", 2: "c" });
            assert.isTrue(nativeArrayLike instanceof Ctor, "Array.from");
            assert.equal(nativeArrayLike.length, 3, "Array.from length");

            if (hasSymbol) {
                calls.length = 0;
                const iterable: any = (polyArrFrom as any).call(Ctor, new Set(["x", "y"]) as any);
                assert.deepEqual(calls, [[]], "An iterable passes no arguments");
                assert.equal(iterable.length, 2);
                assert.equal(iterable[1], "y");
            }
        });

        it("creates an Array when this is Array, undefined or a function which isn't a constructor", () => {
            const arrow: any = () => {
                throw new Error("Not called");
            };

            assert.isTrue(Array.isArray((polyArrFrom as any).call(Array, [1])), "Array");
            assert.isTrue(Array.isArray((polyArrFrom as any).call(undefined, [1])), "undefined");
            if (hasProxy) {
                // An arrow function (on a runtime with Proxy, where it can be identified as not being a constructor)
                const viaArrow = (polyArrFrom as any).call(new Function("return () => {}")(), [1]);
                assert.isTrue(Array.isArray(viaArrow), "An arrow function isn't a constructor");
            }

            assert.isFunction(arrow);
        });
    });

    describe("the iterator helpers", () => {
        it("read the source iterator's next() once, like the native iterator helpers", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const helpers: { [name: string]: (iter: any) => any } = {
                iterMap: (iter) => iterMap(iter, (value: any) => value),
                iterFilter: (iter) => iterFilter(iter, () => true),
                iterTake: (iter) => iterTake(iter, 5)
            };

            Object.keys(helpers).forEach((name) => {
                const counts = { next: 0 };
                assert.deepEqual(iterToArray(helpers[name](_nextCountingIterable([1, 2, 3], counts))), [1, 2, 3], name);
                assert.equal(counts.next, 1, name + " read next once");
            });
        });
    });
});
