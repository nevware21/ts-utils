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
import { iterEvery } from "../../../../src/iterator/iterEvery";
import { iterSome } from "../../../../src/iterator/iterSome";
import { iterReduce } from "../../../../src/iterator/iterReduce";
import { iterForOf } from "../../../../src/iterator/forOf";
import { getKnownSymbol, hasSymbol as hasSymbolFn } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { getGlobal } from "../../../../src/helpers/environment";
import { _initTestHooks, setBypassLazyCache } from "../../../../src/helpers/lazy";
import { polyStrSymSplit } from "../../../../src/polyfills/split";
import { POLYFILL_TAG, POLYFILL_TYPE_NAME } from "../../../../src/internal/poly_helpers";
import { _getGlobalConfig } from "../../../../src/internal/global";
import { dumpObj } from "../../../../src/helpers/diagnostics";

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

    // An iterator which isn't iterable, whose "next" getter counts how often it is read and only returns the next()
    // function the first time
    function _directIterator(values: any[], counts: { next: number }): any {
        let idx = 0;
        const iterator: any = {};
        Object.defineProperty(iterator, "next", {
            get: () => {
                counts.next++;
                return counts.next === 1 ? () => (idx < values.length ? { value: values[idx++], done: false } : { value: undefined, done: true }) : undefined;
            }
        });

        return iterator;
    }

    // Calls the callback with the global Symbol replaced (eg. with undefined like IE, or with a shim), while the lazy
    // Symbol is bypassed (so getKnownSymbol() uses it), then restores it
    function _withGlobalSymbol<T>(theSymbol: any, callback: () => T): T {
        const theGlobal: any = getGlobal();
        const orgSymbol = theGlobal.Symbol;

        _initTestHooks();
        setBypassLazyCache(true);
        try {
            theGlobal.Symbol = theSymbol;

            return callback();
        } finally {
            theGlobal.Symbol = orgSymbol;

            // The lazy Symbol is read again (while it is bypassed), so it isn't left as the replacement
            hasSymbolFn();
            setBypassLazyCache(false);
        }
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
                with: { poly: polyArrWith, native: arrayProto.with, args: [0, "y"] },

                // An array-like (a value which isn't iterable), Array.from() is called with the value (the `this`)
                from: { poly: polyArrFrom, native: function(this: any) {
                    return Array.from(this);
                }, args: [] }
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
        it("reads the [Symbol.iterator] to identify an iterable and again to iterate it (spread reads it once)", function() {
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
            assert.equal(reads, 2);
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

        it("appends an array by its indexes (unlike spread its own [Symbol.iterator] isn't used)", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const arr: any = [1, 2];
            arr[Symbol.iterator] = () => ["x"][Symbol.iterator]();

            assert.deepEqual(arrAppend([0], arr), [0, 1, 2]);
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

        it("appends an array by its indexes (unlike spread a replaced Array.prototype[Symbol.iterator] isn't read or used)", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const orgDesc = Object.getOwnPropertyDescriptor(Array.prototype, Symbol.iterator);
            const orgValues = Array.prototype.values;
            let reads = 0;
            let result: any[];
            let appendReads: number;
            let nativeResult: any[];

            Object.defineProperty(Array.prototype, Symbol.iterator, {
                get: () => {
                    reads++;
                    return function () {
                        return orgValues.call(["x"]);
                    };
                },
                configurable: true
            });

            try {
                // The results are compared once the iterator is restored (as the assertions may use it)
                result = arrAppend([0], [1, 2]);
                appendReads = reads;

                // The native spread (ES2015 syntax isn't used, so this compiles to ES5)
                nativeResult = new Function("target", "values", "target.push(...values); return target;")([0], [1, 2]);
            } finally {
                Object.defineProperty(Array.prototype, Symbol.iterator, orgDesc);
            }

            assert.deepEqual(result, [0, 1, 2], "The replaced iterator wasn't used");
            assert.equal(appendReads, 0, "The iterator wasn't read");
            assert.deepEqual(nativeResult, [0, "x"], "spread");
            assert.equal(reads - appendReads, 1, "spread read it once");
        });

        it("throws a TypeError when the [Symbol.iterator] of an iterable returns a value which isn't an object (including a falsy value), like spread", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            [null, undefined, false, 0, "", "abc"].forEach((iterResult) => {
                const iterable: any = {};
                iterable[Symbol.iterator] = () => iterResult;
                const arr: any = [1, 2];
                arr[Symbol.iterator] = () => iterResult;
                const target = [0];

                assert.throws(() => arrAppend(target, iterable), TypeError, undefined, "An iterable returning " + dumpObj(iterResult));
                assert.deepEqual(arrAppend([0], arr), [0, 1, 2], "An array returning " + dumpObj(iterResult) + " is appended by its indexes");
                assert.deepEqual(target, [0], "Nothing was appended");
                assert.throws(() => new Function("target", "values", "target.push(...values);")([0], iterable), TypeError, undefined, "spread of " + dumpObj(iterResult));
            });
        });

        it("reads the next() of an iterator which isn't iterable to identify it and again to iterate it (the native GetIteratorDirect reads it once)", () => {
            const counts = { next: 0 };

            // The iterator's next getter only returns its next() for the first read, so (as it's read again to iterate it)
            // nothing is appended
            assert.deepEqual(arrAppend([0], _directIterator([1, 2], counts)), [0], "The second read of next isn't a function");
            assert.equal(counts.next, 2, "next was read twice");
        });

        it("reads an array which uses the native array iterator by its indexes (unlike spread a replaced next() of the native array iterators isn't called), but uses it for an array iterator or an arguments object", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const arrayIterProto = Object.getPrototypeOf([][Symbol.iterator]());
            const orgNext = arrayIterProto.next;
            let nextCalls = 0;
            let result: any[];
            let iterResult: any[];
            let argsResult: any[];
            let nativeResult: any[];
            let appendCalls: number;
            let iterCalls: number;
            let argsCalls: number;
            const theArgs = (function() {
                return arguments;
            } as any)(3, 4);

            arrayIterProto.next = function() {
                nextCalls++;
                return orgNext.call(this);
            };

            try {
                // The results are compared once next() is restored (as the assertions may use it)
                result = arrAppend([0], [1, 2]);
                appendCalls = nextCalls;
                nextCalls = 0;
                iterResult = arrAppend([0], [1, 2][Symbol.iterator]());
                iterCalls = nextCalls;
                nextCalls = 0;
                argsResult = arrAppend([0], theArgs as any);
                argsCalls = nextCalls;
                nextCalls = 0;
                nativeResult = new Function("target", "values", "target.push(...values); return target;")([0], [1, 2]);
            } finally {
                arrayIterProto.next = orgNext;
            }

            assert.deepEqual(result, [0, 1, 2]);
            assert.equal(appendCalls, 0, "The array was read by its indexes (the documented difference from spread)");
            assert.deepEqual(iterResult, [0, 1, 2], "An array iterator");
            assert.equal(iterCalls, 3, "The replaced next() was called for each value of an array iterator (and once more for done)");
            assert.deepEqual(argsResult, [0, 3, 4], "An arguments object");
            assert.equal(argsCalls, 3, "The replaced next() was called for each value of an arguments object (and once more for done)");
            assert.deepEqual(nativeResult, [0, 1, 2], "spread");
            assert.equal(nextCalls, 3, "spread called the replaced next()");
        });
    });

    describe("readArgs", () => {
        it("returns an array for a string, like Array.prototype.slice.call()", () => {
            assert.deepEqual(readArgs("hello" as any, 1), ["e", "l", "l", "o"]);
            assert.deepEqual(Array.prototype.slice.call("hello", 1), ["e", "l", "l", "o"], "Array.prototype.slice.call");
        });

        it("converts the start / end before creating the iterator, unlike Array.from(value).slice() (which reads every value first)", function() {
            if (!hasSymbol) {
                this.skip();
                return;
            }

            const throwingStart = {
                valueOf: (): number => {
                    throw new RangeError("start");
                }
            };

            let iterCalls = 0;
            const iterable: any = {};
            iterable[Symbol.iterator] = () => {
                iterCalls++;
                return _throwingIterable()[Symbol.iterator]();
            };

            assert.throws(() => readArgs(iterable, throwingStart as any, -1), RangeError, undefined, "The start threw first");
            assert.equal(iterCalls, 0, "The iterator wasn't created");
            assert.throws(() => Array.from(_throwingIterable()).slice(throwingStart as any, -1), EvalError, undefined, "Array.from(value).slice() calls next() first");

            // Also before a [Symbol.iterator] which isn't a function throws
            const notCallable: any = {};
            notCallable[Symbol.iterator] = {};
            assert.throws(() => readArgs(notCallable, throwingStart as any, -1), RangeError, undefined, "The start of a non-callable [Symbol.iterator]");

            // And when the iterator has no values
            const empty: any = {};
            empty[Symbol.iterator] = () => [][Symbol.iterator]();
            assert.throws(() => readArgs(empty, throwingStart as any, -1), RangeError, undefined, "The start of an empty iterable");
        });

        it("reads a Map whose own [Symbol.iterator] is null (it isn't iterable) by a copy of its entries, unlike Array.from (and polyArrFrom)", function() {
            if (!hasSymbol || typeof Map !== "function") {
                this.skip();
                return;
            }

            const map: any = new Map([["k", "v"]]);
            map[Symbol.iterator] = null;

            // A helper (like iterForOf) processes a Map or Set which isn't iterable, while the polyfill follows the native
            // function (an array-like without a length, so it has no values)
            assert.deepEqual(readArgs(map), [["k", "v"]]);
            assert.deepEqual(polyArrFrom(map), [], "polyArrFrom");
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
            // Compared with the value converted to an object (like ES2015+), as an ES5 Object.keys (eg. IE 11) throws a
            // TypeError for a primitive
            assert.deepEqual(Object.keys(Object("ab")), ["0", "1"], "Object.keys");
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

            // The native function is only compared where it returns a value which isn't an object (ES2015+), as on ES5
            // (eg. IE) it throws a TypeError
            let isES5 = false;
            let nativeResult: any;
            try {
                nativeResult = Object.preventExtensions(1 as any);
            } catch (e) {
                isES5 = true;
            }

            if (!isES5) {
                assert.strictEqual(nativeResult, 1, "Object.preventExtensions");
            }
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

        it("polySymbolFor() supports __proto__ in a shared registry which an earlier version created (its keys have Object.prototype)", function() {
            const setPrototypeOf = (Object as any).setPrototypeOf;
            if (!setPrototypeOf) {
                this.skip();
                return;
            }

            polySymbolFor("the registry exists");
            const registry: any = _getGlobalConfig().gblSym;
            const keys = registry.k;
            const keysProto = Object.getPrototypeOf(keys);
            const ownProtoKey = Object.getOwnPropertyDescriptor(keys, "__proto__");
            let protoSym: any;

            // Like the registry of v0.10.1 to v0.16.0, which is created as { k: {}, s: {} }
            delete keys["__proto__"];
            setPrototypeOf(keys, Object.prototype);
            try {
                protoSym = polySymbolFor("__proto__");

                assert.ok(protoSym, "A symbol is returned");
                assert.strictEqual(polySymbolFor("__proto__"), protoSym, "The same symbol is returned again");
                assert.equal(polySymbolKeyFor(protoSym), "__proto__");
                assert.ok(Object.prototype.hasOwnProperty.call(keys, "__proto__"), "__proto__ is an own key of the registry");
                assert.strictEqual(Object.getPrototypeOf(keys), Object.prototype, "The prototype of the registry's keys is unchanged");
            } finally {
                delete keys["__proto__"];
                setPrototypeOf(keys, keysProto);
                protoSym && protoSym._urid && delete registry.s[protoSym._urid()];
                ownProtoKey && Object.defineProperty(keys, "__proto__", ownProtoKey);
            }
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
                // A native symbol isn't in the polyfill registry, so (like v0.16.0) it has no key
                assert.isUndefined(polySymbolKeyFor(Symbol.for("polySymbolKeyFor.native")));
            }
        });

        it("polyGetKnownSymbol() only returns a well-known symbol (not one for an inherited name, eg. toString)", () => {
            assert.isUndefined(polyGetKnownSymbol("toString"));
            assert.isUndefined(polyGetKnownSymbol("constructor"));
            assert.ok(polyGetKnownSymbol("iterator"), "A well-known symbol");
        });

        it("polySymbolKeyFor() returns the key of a symbol which an earlier version added to the shared registry", () => {
            polySymbolFor("the registry exists");
            const registry: any = _getGlobalConfig().gblSym;

            // Like a registered polyfill symbol of an earlier version, whose registry id is in the registry's s: v0.10.1 to
            // v0.11.8 only tag it as a polyfill, v0.12.0 and later also add the polyfill type
            const v11: any = {
                description: "a v0.11 key",
                toString: () => "Symbol(a v0.11 key)",
                _polyfill: true
            };
            const v16: any = Object.create(null);
            Object.defineProperty(v16, "description", { value: "a v0.16 key" });
            Object.defineProperty(v16, "toString", { value: () => "Symbol(a v0.16 key)$nw21sym_0_earlier" });
            Object.defineProperty(v16, "_polyfill", { value: true });
            Object.defineProperty(v16, POLYFILL_TYPE_NAME, { value: "symbol" });

            [v11, v16].forEach((earlier, idx) => {
                earlier._urid = () => idx + "_earlier_" + earlier.toString();
                registry.k[earlier.description] = earlier;
                registry.s[earlier._urid()] = earlier.description;
                try {
                    assert.strictEqual(polySymbolFor(earlier.description), earlier, "The registry's symbol is returned");
                    assert.equal(polySymbolKeyFor(earlier), earlier.description);
                } finally {
                    delete registry.k[earlier.description];
                    delete registry.s[earlier._urid()];
                }
            });
        });

        it("a registered polyfill symbol and the shared registry have what an earlier version (v0.16.0) reads from them", () => {
            // The names which v0.16.0 uses (rather than this version's constants, so changing one of them fails)
            const sym: any = polySymbolFor("the shared registry contract");
            const registry: any = (getGlobal() as any)["__tsUtils$gblCfg"].gblSym;

            // Its polySymbolFor() returns the symbol of the registry's own key
            assert.strictEqual(registry, _getGlobalConfig().gblSym, "The registry is in the global config");
            assert.ok(Object.prototype.hasOwnProperty.call(registry.k, "the shared registry contract"), "The key is an own key of the registry");
            assert.strictEqual(registry.k["the shared registry contract"], sym);

            // Its polySymbolKeyFor() checks that the string starts with "Symbol" and that the symbol is a polyfill, then
            // returns the key of the symbol's registry id (from the registry's s)
            assert.equal(sym.toString().substring(0, 7), "Symbol(");
            assert.isTrue(sym._polyfill, "The polyfill tag");
            assert.equal(typeof sym._urid, "function", "The registry id function");
            assert.equal(registry.s[sym._urid()], "the shared registry contract", "The key of the registry id");
            assert.isUndefined((polyNewSymbol("the shared registry contract") as any)._urid, "A symbol which isn't registered has no registry id");

            // Its isSymbol() reads the polyfill type
            assert.equal(sym["__nw21$polytype__"], "symbol", "The polyfill type");
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

        it("calls the searchValue's method for the polyfill Symbol.replace on a runtime without Symbol (eg. IE)", () => {
            const calls: any[] = [];
            const searchValue: any = {};
            const results = _withGlobalSymbol(undefined, () => {
                searchValue[getKnownSymbol(WellKnownSymbols.replace) as any] = function(this: any, value: any, replaceValue: any) {
                    calls.push([this, value, replaceValue]);
                    return "replaced";
                };

                return [polyStrReplaceAll("a-b-a", searchValue, "X"), polyStrReplaceAll("a-b-a", /a/g, "X")];
            });

            assert.equal(results[0], "replaced");
            assert.equal(calls.length, 1, "Called once");
            assert.strictEqual(calls[0][0], searchValue, "Called with the searchValue as this");
            assert.equal(calls[0][1], "a-b-a");
            assert.equal(calls[0][2], "X");
            assert.equal(results[1], "X-b-X", "A RegExp is still used like its native [Symbol.replace]");
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

        it("calls the matcher's method for the polyfill Symbol.matchAll on a runtime without Symbol (eg. IE)", () => {
            const calls: any[] = [];
            const matcher: any = {};
            const iter: any = { next: () => ({ done: true }) };
            const results = _withGlobalSymbol(undefined, () => {
                matcher[getKnownSymbol(WellKnownSymbols.matchAll) as any] = function(this: any, value: any) {
                    calls.push([this, value]);
                    return iter;
                };

                const matches: string[] = [];
                const regExpIter = polyStrMatchAll("a-b-a", /a/g);
                for (let next = regExpIter.next(); !next.done; next = regExpIter.next()) {
                    matches.push(next.value.index + ":" + next.value[0]);
                }

                return [polyStrMatchAll("a-b-a", matcher), matches];
            });

            assert.strictEqual(results[0], iter, "The method's result is returned");
            assert.equal(calls.length, 1, "Called once");
            assert.strictEqual(calls[0][0], matcher, "Called with the matcher as this");
            assert.equal(calls[0][1], "a-b-a");
            assert.deepEqual(results[1], ["0:a", "4:a"], "A RegExp is still iterated like its native [Symbol.matchAll]");
        });
    });

    describe("polyStrSymSplit", () => {
        it("calls the splitter's method for the key of a global Symbol shim (which isn't a native symbol, so the runtime's split doesn't use it)", () => {
            const shimSymbol: any = function() {
                // Not used
            };
            shimSymbol.split = "@@split";
            shimSymbol.iterator = "@@iterator";
            const calls: any[] = [];
            const splitter: any = {
                "@@split": function(this: any, value: any, limit: any) {
                    calls.push([this, value, limit]);
                    return ["shim"];
                }
            };

            const result = _withGlobalSymbol(shimSymbol, () => polyStrSymSplit("a,b", splitter, 1));

            assert.deepEqual(result, ["shim"]);
            assert.equal(calls.length, 1, "Called once");
            assert.strictEqual(calls[0][0], splitter, "Called with the splitter as this");
            assert.equal(calls[0][1], "a,b");
            assert.equal(calls[0][2], 1);
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
            assert.isTrue(Array.isArray((polyArrFrom as any).call(Array, [1])), "Array");
            assert.isTrue(Array.isArray((polyArrFrom as any).call(undefined, [1])), "undefined");

            // A built-in function which isn't a constructor (on every runtime), and an arrow function (created from its
            // source, as an arrow function written here is compiled to an ES5 function, which is a constructor, and only
            // identified as not being a constructor on a runtime with Proxy)
            assert.isTrue(Array.isArray((polyArrFrom as any).call(Math.max, [1])), "A built-in function which isn't a constructor");
            assert.isTrue(Array.isArray((Array.from as any).call(Math.max, [1])), "Array.from with a built-in function");
            if (hasProxy) {
                const arrowFn = new Function("return () => { throw new Error(\"Not called\"); }")();
                assert.isTrue(Array.isArray((polyArrFrom as any).call(arrowFn, [1])), "An arrow function isn't a constructor");
                assert.isTrue(Array.isArray((Array.from as any).call(arrowFn, [1])), "Array.from with an arrow function");
            }
        });
    });

    describe("the polyfills and helpers don't use a replaced Function.prototype.call", () => {
        it("call a callback (or the intrinsic slice) with the intrinsic call, like the native functions", () => {
            const funcProto: any = Function.prototype;
            const orgCall = funcProto.call;
            const results: { [name: string]: any } = {};
            let calls = 0;
            const forOfValues: any[] = [];

            funcProto.call = function(this: any) {
                calls++;
                return orgCall.apply(this, arguments);
            };

            try {
                // The results are compared once call is restored (as the assertions may use it)
                results.from = polyArrFrom([1, 2]);
                results.readArgs = readArgs([1, 2, 3], 1);
                iterForOf([1, 2], (value) => {
                    forOfValues.push(value);
                });
                results.flatMap = polyArrFlatMap([1, [2]], (value: any) => [value]);
                results.descriptors = polyObjGetOwnPropertyDescriptors({ a: 1 });
                results.calls = calls;
                results.nativeFrom = Array.from([1, 2]);
                results.nativeCalls = calls - results.calls;
            } finally {
                funcProto.call = orgCall;
            }

            assert.equal(results.calls, 0, "The replaced call wasn't used");
            assert.equal(results.nativeCalls, 0, "Array.from didn't use it");
            assert.deepEqual(results.from, [1, 2]);
            assert.deepEqual(results.readArgs, [2, 3]);
            assert.deepEqual(forOfValues, [1, 2]);
            assert.deepEqual(results.flatMap, [1, [2]]);
            assert.deepEqual(results.descriptors, { a: { value: 1, writable: true, enumerable: true, configurable: true } });
        });
    });

    describe("the polyfills don't read a value to create a TypeError, like the native functions", () => {
        it("don't call a Proxy's traps for the error (only for the operations of the native function)", function() {
            if (!hasProxy) {
                this.skip();
                return;
            }

            const traps: string[] = [];
            const handler: ProxyHandler<any> = {
                get: (target, key) => {
                    traps.push("get " + String(key));
                    return target[key];
                },
                getOwnPropertyDescriptor: (target, key) => {
                    traps.push("getOwnPropertyDescriptor " + String(key));
                    return Object.getOwnPropertyDescriptor(target, key);
                },
                ownKeys: (target) => {
                    traps.push("ownKeys");
                    return Reflect.ownKeys(target);
                },
                has: (target, key) => {
                    traps.push("has " + String(key));
                    return key in target;
                }
            };
            const proxy = new Proxy({ toString: () => "described" }, handler);
            const objCls: any = Object;
            const symbolCls: any = Symbol;

            // polySymbolKeyFor identifies a polyfill symbol by its polyfill tag, which (unlike the native function) is
            // read from the value, but every runtime with a Proxy has a native Symbol, so it is only seen when the poly
            // function is called directly
            const tagTrap = "get " + POLYFILL_TAG;
            const cases: { [name: string]: [() => any, () => any] } = {
                "polyArrFrom mapFn": [() => polyArrFrom([1], proxy), () => Array.from([1], proxy)],
                "polyObjFromEntries": [() => polyObjFromEntries(proxy), () => objCls.fromEntries(proxy)],
                "polySymbolKeyFor": [() => polySymbolKeyFor(proxy), () => symbolCls.keyFor(proxy)]
            };

            Object.keys(cases).forEach((name) => {
                traps.length = 0;
                assert.throws(cases[name][0], TypeError, undefined, name);
                const polyTraps = traps.splice(0, traps.length);
                if (name !== "polyObjFromEntries" || objCls.fromEntries) {
                    assert.throws(cases[name][1], TypeError, undefined, name + " native");
                    assert.deepEqual(polyTraps, name === "polySymbolKeyFor" ? [tagTrap].concat(traps) : traps, name + " called the same traps as the native function");
                }
            });

            // A description or key is converted once, like the native functions
            traps.length = 0;
            assert.equal((polyNewSymbol(proxy) as any).description, "described");
            const polyTraps = traps.splice(0, traps.length);
            assert.equal((Symbol(proxy) as any).description, "described", "Symbol()");
            assert.deepEqual(polyTraps, traps, "polyNewSymbol() called the same traps as Symbol()");

            traps.length = 0;
            polySymbolFor(proxy);
            const forTraps = traps.splice(0, traps.length);
            Symbol.for(proxy);
            assert.deepEqual(forTraps, traps, "polySymbolFor() called the same traps as Symbol.for()");
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

        it("read the next() of an iterator which isn't iterable once, like the native Iterator.from() and its helpers", () => {
            const helpers: { [name: string]: (iter: any) => any } = {
                iterToArray: (iter) => iterToArray(iter),
                iterMap: (iter) => iterToArray(iterMap(iter, (value: any) => value)),
                iterFilter: (iter) => iterToArray(iterFilter(iter, () => true)),
                iterTake: (iter) => iterToArray(iterTake(iter, 5)),
                iterEvery: (iter) => iterEvery(iter, () => true),
                iterSome: (iter) => iterSome(iter, () => false),
                iterReduce: (iter) => iterReduce(iter, (prev: any, value: any) => prev + value, 0)
            };
            const expected: { [name: string]: any } = {
                iterEvery: true,
                iterSome: false,
                iterReduce: 6
            };

            Object.keys(helpers).forEach((name) => {
                const counts = { next: 0 };
                const result = helpers[name](_directIterator([1, 2, 3], counts));

                assert.deepEqual(result, name in expected ? expected[name] : [1, 2, 3], name);
                assert.equal(counts.next, 1, name + " read next once");
            });

            const IteratorCls = (getGlobal() as any).Iterator;
            if (IteratorCls && IteratorCls.from) {
                const counts = { next: 0 };
                assert.deepEqual(IteratorCls.from(_directIterator([1, 2, 3], counts)).toArray(), [1, 2, 3], "Iterator.from()");
                assert.equal(counts.next, 1, "Iterator.from() read next once");
            }
        });

        it("return() returns an undefined value (rather than the value passed to it), like the native helpers", () => {
            const helpers: { [name: string]: (iter: any) => any } = {
                iterMap: (iter) => iterMap(iter, (value: any) => value),
                iterFilter: (iter) => iterFilter(iter, () => true),
                iterTake: (iter) => iterTake(iter, 5)
            };

            Object.keys(helpers).forEach((name) => {
                const helper = helpers[name]([1, 2, 3]);
                helper.next();
                const result = helper.return(7);

                assert.isTrue(result.done, name);
                assert.isUndefined(result.value, name + " has an undefined value");
                assert.isTrue("value" in result, name + " has its own value");
            });

            const IteratorCls = (getGlobal() as any).Iterator;
            if (IteratorCls && IteratorCls.from) {
                const nativeHelper = IteratorCls.from([1, 2, 3]).map((value: any) => value);
                nativeHelper.next();
                assert.isUndefined(nativeHelper.return(7).value, "The native map()");
            }
        });

        it("throw a TypeError for a callbackfn which isn't a function before reading a value (closing the source), like Iterator.from(value) and its helpers", () => {
            const log: string[] = [];
            const source = () => {
                let idx = 0;
                const iter: any = {
                    next: () => {
                        log.push("next");
                        return idx < 2 ? { value: idx++, done: false } : { value: undefined, done: true };
                    },
                    return: () => {
                        log.push("return");
                        return { done: true };
                    }
                };

                return iter;
            };
            const helpers: { [name: string]: (iter: any) => any } = {
                iterMap: (iter) => iterMap(iter, 5 as any),
                iterFilter: (iter) => iterFilter(iter, 5 as any),
                iterEvery: (iter) => iterEvery(iter, 5 as any),
                iterSome: (iter) => iterSome(iter, 5 as any),
                iterReduce: (iter) => iterReduce(iter, 5 as any, 0)
            };

            Object.keys(helpers).forEach((name) => {
                log.length = 0;
                assert.throws(() => helpers[name](source()), TypeError, undefined, name);
                assert.deepEqual(log, ["return"], name + " closed the source without reading a value");
            });

            // A source whose return() throws still throws the TypeError
            log.length = 0;
            const throwingReturn = source();
            throwingReturn.return = () => {
                log.push("return");
                throw new Error("return");
            };
            assert.throws(() => iterMap(throwingReturn, 5 as any), TypeError, undefined, "The return() error is ignored");
            assert.deepEqual(log, ["return"]);

            // Like the current spec the native helpers close the source when an argument isn't valid (engines from
            // before that change, eg. Node 22, don't close it), and none of them read a value
            const IteratorCls = (getGlobal() as any).Iterator;
            if (IteratorCls && IteratorCls.from) {
                ["map", "filter", "every", "some", "reduce"].forEach((name) => {
                    log.length = 0;
                    assert.throws(() => IteratorCls.from(source())[name](5), TypeError, undefined, "The native " + name + "()");
                    assert.include(["", "return"], log.join(","), "The native " + name + "() didn't read a value");
                });
            }
        });

        it("iterTake converts the count once, like the native take()", () => {
            let calls = 0;
            const count: any = {
                valueOf: () => {
                    calls++;
                    return 2;
                }
            };

            assert.deepEqual(iterToArray(iterTake([1, 2, 3], count)), [1, 2]);
            assert.equal(calls, 1, "valueOf() was called once");

            const IteratorCls = (getGlobal() as any).Iterator;
            if (IteratorCls && IteratorCls.from) {
                calls = 0;
                assert.deepEqual(IteratorCls.from([1, 2, 3]).take(count).toArray(), [1, 2], "The native take()");
                assert.equal(calls, 1, "The native take() called valueOf() once");
            }
        });
    });
});
