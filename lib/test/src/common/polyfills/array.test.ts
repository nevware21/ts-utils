/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex, polyArrFrom, polyArrIncludes, polyIsArray } from "../../../../src/polyfills/array";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { getKnownSymbol, hasSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { _initTestHooks, setBypassLazyCache } from "../../../../src/helpers/lazy";
import { polyArrAt } from "../../../../src/array/at";
import { polyArrFill } from "../../../../src/array/fill";
import { polyArrWith } from "../../../../src/array/with";
import { polyArrFlatMap } from "../../../../src/array/flatMap";

describe("array polyfills", () => {
    it("polyIsArray", () => {
        _checkIsArray(null);
        _checkIsArray(undefined);
        _checkIsArray("null");
        _checkIsArray("undefined");
        _checkIsArray("1");
        _checkIsArray("aa");
        _checkIsArray(new Date());
        _checkIsArray(1);
        _checkIsArray("");
        _checkIsArray(_dummyFunction);
        _checkIsArray([]);
        _checkIsArray(new Array(1));
        _checkIsArray(true);
        _checkIsArray(false);
        _checkIsArray("true");
        _checkIsArray("false");
        _checkIsArray(new Boolean(true));
        _checkIsArray(new Boolean(false));
        _checkIsArray(new Boolean("true"));
        _checkIsArray(new Boolean("false"));
        _checkIsArray(/[a-z]/g);
        _checkIsArray(new RegExp(""));
        _checkIsArray(_getFile());
        _checkIsArray(_getFormData());
        _checkIsArray(_getBlob());
        _checkIsArray(new ArrayBuffer(0));
        _checkIsArray(new Error("Test Error"));
        _checkIsArray(new TypeError("Test TypeError"));
        _checkIsArray(new TestError("Test TestError"));
        _checkIsArray(_dummyError());
        _checkIsArray(Promise.reject());
        _checkIsArray(Promise.resolve());
        _checkIsArray(new Promise(() => {}));
        _checkIsArray(_simplePromise());
        _checkIsArray(_simplePromiseLike());
    });

    describe("polyArrIncludes", () => {
        // These were previously asserted directly in the describe (so ran when the tests were loaded)
        it("examples", () => {
            assert.equal(polyArrIncludes([1, 2, 3], 2), true);
            assert.equal(polyArrIncludes([1, 2, 3], 4), false);
            assert.equal(polyArrIncludes([1, 2, 3], 3, 3), false);
            assert.equal(polyArrIncludes([1, 2, 3], 3, -1), true);
            assert.equal(polyArrIncludes(["1", "2", "3"], 3 as any), false);

            // NaN is found, as the polyfill now uses the same SameValueZero comparison as the native function
            assert.equal(polyArrIncludes([1, 2, NaN], NaN), true);
        });

        it("array-like objects", () => {
            assert.equal(polyArrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 2), true);
            assert.equal(polyArrIncludes({ length: 3, 0: 1, 1: 2, 2: 3 }, 4), false);
        });

        it("matches NaN (SameValueZero) like the native function", () => {
            assert.equal(polyArrIncludes({ length: 3, 0: 1, 1: 2, 2: NaN }, NaN), true);
            assert.equal(polyArrIncludes([1, 2, 3], NaN), false);
            assert.equal(polyArrIncludes([0], -0), true);
            assert.equal(polyArrIncludes([-0], 0), true);
        });

        it("an empty slot or missing index matches undefined like the native function", () => {
            const sparse: any[] = [1];
            sparse[2] = 3;
            assert.equal(polyArrIncludes(sparse, undefined), true);
            assert.equal(polyArrIncludes({ length: 3, 0: "a", 2: "c" } as any, undefined), true);
            assert.equal(polyArrIncludes([1, 2, 3], undefined), false);
        });

        it("throws for null or undefined like the native function", () => {
            assert.throws(() => polyArrIncludes(null as any, 1), TypeError);
            assert.throws(() => polyArrIncludes(undefined as any, 1), TypeError);
        });

        it("matches the native function", function() {
            const nativeIncludes = (Array.prototype as any).includes;
            if (!nativeIncludes) {
                this.skip();
                return;
            }

            // The values searched for and the fromIndex values (including fractions, out of range and non-numeric
            // values, which are converted to an integer) each value is checked with
            const searches: any[] = [1, 3, NaN, undefined, "b", "c", 0];
            const fromIndexes: any[] = [undefined, 0, 1, 1.5, -1, -2.5, -10, 10, NaN, null, "1", Infinity, -Infinity];

            function _checkMatchesNative(value: any) {
                for (let slp = 0; slp < searches.length; slp++) {
                    for (let flp = 0; flp < fromIndexes.length; flp++) {
                        const search = searches[slp];
                        const fromIndex = fromIndexes[flp];
                        assert.equal(
                            polyArrIncludes(value, search, fromIndex),
                            nativeIncludes.call(value, search, fromIndex),
                            "includes(" + dumpObj(value) + ", " + String(search) + ", " + String(fromIndex) + ")");
                    }
                }
            }

            // Arrays
            _checkMatchesNative([1, 2, 3]);
            _checkMatchesNative([1, NaN, 3]);

            // A sparse array, where an empty slot is undefined
            const sparse: any[] = [1];
            sparse[3] = NaN;
            _checkMatchesNative(sparse);

            // A string
            _checkMatchesNative("abc");

            // Array-like objects with a fractional, negative and string length
            _checkMatchesNative({ length: 2.5, 0: "a", 1: "b", 2: "c" });
            _checkMatchesNative({ length: -1, 0: "a" });
            _checkMatchesNative({ length: "2", 0: "a", 1: undefined });
        });
    });

    describe("polyArrFind", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                return fruit.name === "cherries";
            }

            assert.deepEqual(polyArrFind(inventory, isCherries), { name: "cherries", quantity: 5 });
        });

        it("example 2", () => {
            function isPrime(element: number, index: number, array: number[]) {
                let start = 2;
                while (start <= Math.sqrt(element)) {
                    if (element % start++ < 1) {
                        return false;
                    }
                }

                return element > 1;
            }
              
            assert.equal(polyArrFind([4, 6, 8, 12], isPrime), undefined);
            assert.equal(polyArrFind([4, 5, 8, 12], isPrime), 5);
        });

        it("example 3 - array like", () => {
            const arrayLike = {
                length: 3,
                0: 2,
                1: 7.3,
                2: 4
            };

            assert.equal(polyArrFind(arrayLike, (x) => !Number.isInteger(x)), 7.3);
        });
    });

    describe("polyArrFindIndex", () => {
        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            let called = 0;
            function isCherries(fruit: { name: string, quantity: number}) {
                called++;
                return fruit.name === "cherries";
            }

            assert.deepEqual(polyArrFindIndex(inventory, isCherries), 2);
            assert.equal(called, 3);
        });

        it("example 2", () => {
            let called = 0;
            function isPrime(element: number) {
                called++;
                if (element % 2 === 0 || element < 2) {
                    return false;
                }

                for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
                    if (element % factor === 0) {
                        return false;
                    }
                }

                return true;
            }
            called = 0;
            assert.equal(polyArrFindIndex([4, 6, 8, 9, 12], isPrime), -1);
            assert.equal(called, 5);
            called = 0;
            assert.equal(polyArrFindIndex([4, 6, 7, 9, 12], isPrime), 2);
            assert.equal(called, 3);
        });

        it("supports callback thisArg and defaults to undefined like the native function", () => {
            const values = [1, 2, 3];
            const thisArg = { match: 2 };
            let cbThis: any = null;

            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === this.match;
            }, thisArg), 1);
            assert.equal(cbThis, thisArg);

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }), 2);
            assert.equal(cbThis, undefined, "Like the native function this is undefined");

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, undefined), 2);
            assert.equal(cbThis, undefined, "Like the native function this is undefined");

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, 0), 2);
            assert.equal(cbThis, 0);

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, ""), 2);
            assert.equal(cbThis, "");

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, false), 2);
            assert.equal(cbThis, false);

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, "undefined"), 2);
            assert.equal(cbThis, "undefined");

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, "null"), 2);
            assert.equal(cbThis, "null");
        });
    });

    describe("polyArrFindLast", () => {
        it ("example 1", () => {
            let called = 0;
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            
            function isCherries(fruit: { name: string, quantity: number}) {
                called++;
                return fruit.name === "cherries";
            }

            assert.deepEqual(polyArrFindLast(inventory, isCherries), { name: "cherries", quantity: 5 });
            assert.equal(called, 1);
        });

        it("example 2", () => {
            let called = 0;
            function isPrime(element: number, index: number, array: number[]) {
                called++;
                let start = 2;
                while (start <= Math.sqrt(element)) {
                    if (element % start++ < 1) {
                        return false;
                    }
                }

                return element > 1;
            }
              
            assert.equal(called, 0);
            assert.equal(polyArrFindLast([4, 6, 8, 12], isPrime), undefined);
            assert.equal(called, 4);

            called = 0;
            assert.equal(called, 0);
            assert.equal(polyArrFindLast([4, 5, 8, 12], isPrime), 5);
            assert.equal(called, 3);
        });
    });

    describe("polyArrFindLastIndex", () => {
        it("visits every index of a sparse array like the native function", () => {
            const sparse: Array<number | undefined> = [1];
            sparse[2] = 3;
            const visited: number[] = [];
            assert.equal(polyArrFindLastIndex(sparse, (value, index) => {
                visited.push(index);
                return value === undefined;
            }), 1, "The empty slot is treated as undefined");
            assert.deepEqual(visited, [2, 1]);

            if ((Array.prototype as any).findLastIndex) {
                const nativeVisited: number[] = [];
                assert.equal((sparse as any).findLastIndex((value: any, index: number) => {
                    nativeVisited.push(index);
                    return value === undefined;
                }), 1);
                assert.deepEqual(visited, nativeVisited, "Matches the native function");
            }
        });

        it ("example 1", () => {
            const inventory: Array<{ name: string, quantity: number}> = [
                { name: "apples", quantity: 2 },
                { name: "bananas", quantity: 0 },
                { name: "cherries", quantity: 5 }
            ];
            let called = 0;
            function isCherries(fruit: { name: string, quantity: number}) {
                called++;
                return fruit.name === "cherries";
            }

            assert.deepEqual(polyArrFindLastIndex(inventory, isCherries), 2);
            assert.equal(called, 1);
        });

        it("example 2", () => {
            let called = 0;
            function isPrime(element: number) {
                called++;
                if (element % 2 === 0 || element < 2) {
                    return false;
                }

                for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
                    if (element % factor === 0) {
                        return false;
                    }
                }

                return true;
            }
            called = 0;
            assert.equal(polyArrFindLastIndex([4, 6, 8, 9, 12], isPrime), -1);
            assert.equal(called, 5);
            called = 0;
            assert.equal(polyArrFindLastIndex([4, 6, 7, 9, 12], isPrime), 2);
            assert.equal(called, 3);
        });

        it("supports callback thisArg and defaults to undefined like the native function", () => {
            const values = [1, 2, 3];
            const thisArg = { match: 2 };
            let cbThis: any = null;

            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === this.match;
            }, thisArg), 1);
            assert.equal(cbThis, thisArg);

            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }), 0);
            assert.equal(cbThis, undefined, "Like the native function this is undefined");


            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, undefined), 0);
            assert.equal(cbThis, undefined, "Like the native function this is undefined");

            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, 0), 0);
            assert.equal(cbThis, 0);

            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, ""), 0);
            assert.equal(cbThis, "");

            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, false), 0);
            assert.equal(cbThis, false);

            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, "undefined"), 0);
            assert.equal(cbThis, "undefined");

            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, "null"), 0);
            assert.equal(cbThis, "null");
        });
    });

    describe("polyArrFrom", () => {
        it("examples", () => {
            const map = new Map([
                [ 1, "Hello" ],
                [ 2, "Darkness" ],
                [ 3, "my" ],
                [ 4, "old" ],
                [ 5, "friend"]
            ]);

            assert.deepEqual(polyArrFrom("Hello"), [ "H", "e", "l", "l", "o" ]);
            assert.deepEqual(polyArrFrom(new Set(["Hello", "Darkness", "my", "old", "friend"])), ["Hello", "Darkness", "my", "old", "friend"]);
            assert.deepEqual(polyArrFrom(map.values()), ["Hello", "Darkness", "my", "old", "friend"]);
            assert.deepEqual(polyArrFrom(map.keys()), [ 1, 2, 3, 4, 5 ]);
            assert.deepEqual(polyArrFrom(map.entries()), [ [ 1, "Hello" ], [ 2, "Darkness" ], [ 3, "my" ], [ 4, "old" ], [ 5, "friend"] ]);
        });


        it("with mapFn", () => {
            const kvArray = [
                { key: 1, value: 10 },
                { key: 2, value: 20 },
                { key: 3, value: 30 }
            ];

            const reformattedArray = polyArrFrom(kvArray, ({ key, value}) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 3);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":10},{\"2\":20},{\"3\":30}]");
            assert.equal(JSON.stringify(kvArray), "[{\"key\":1,\"value\":10},{\"key\":2,\"value\":20},{\"key\":3,\"value\":30}]");

            // kvArray is still:
            // [{key: 1, value: 10},
            //  {key: 2, value: 20},
            //  {key: 3, value: 30}]
        });

        it("with mapFn using a map", () => {
            const map = new Map([
                [ 1, "Hello" ],
                [ 2, "Darkness" ],
                [ 3, "my" ],
                [ 4, "old" ],
                [ 5, "friend"]
            ]);

            const reformattedArray = polyArrFrom(map, ([ key, value ]) => ({ [key]: value }));

            assert.equal(reformattedArray.length, 5);
            assert.equal(JSON.stringify(reformattedArray), "[{\"1\":\"Hello\"},{\"2\":\"Darkness\"},{\"3\":\"my\"},{\"4\":\"old\"},{\"5\":\"friend\"}]");
        });

        it("array-like values which are not iterable", () => {
            assert.deepEqual(polyArrFrom({ length: 2, 0: "a", 1: "b" }), ["a", "b"]);
            assert.deepEqual(polyArrFrom({ length: 3, 0: "a", 2: "c" } as any), ["a", undefined, "c"]);
            assert.deepEqual(polyArrFrom({ length: 2 } as any), [undefined, undefined]);
            assert.deepEqual(polyArrFrom({ length: 2.5, 0: "a", 1: "b", 2: "c" }), ["a", "b"]);
            assert.deepEqual(polyArrFrom({ length: -1, 0: "a" }), []);
            assert.deepEqual(polyArrFrom({ length: "2", 0: "a", 1: "b" } as any), ["a", "b"]);
            assert.deepEqual(polyArrFrom({ length: 2, 0: 1, 1: 2 }, (value: number, idx?: number) => value * 10 + (idx as number)), [10, 21]);

            // A value with no length (including a number and an iterator which isn't iterable) is an empty array
            assert.deepEqual(polyArrFrom({} as any), []);
            assert.deepEqual(polyArrFrom(42 as any), []);
            assert.deepEqual(polyArrFrom({ next: () => ({ done: false, value: 1 }) } as any), []);
        });

        it("arguments", () => {
            function _getArgs(..._args: any[]) {
                return arguments;
            }

            assert.deepEqual(polyArrFrom(_getArgs(1, "a", null)), [1, "a", null]);
        });

        it("an empty slot of a sparse array is undefined", () => {
            const sparse: any[] = [1];
            sparse[2] = 3;
            const result = polyArrFrom(sparse);

            assert.deepEqual(result, [1, undefined, 3]);
            assert.isTrue(1 in result, "The empty slot is not kept");
        });

        it("a string is split into its code points", () => {
            assert.deepEqual(polyArrFrom("Hello"), ["H", "e", "l", "l", "o"]);
            assert.deepEqual(polyArrFrom("a𐐨b"), ["a", "𐐨", "b"]);
            assert.deepEqual(polyArrFrom("\uD801a\uDC28"), ["\uD801", "a", "\uDC28"], "Unpaired surrogates are a single value");
            assert.deepEqual(polyArrFrom(""), []);
        });

        it("the mapFn is only passed the value and index", () => {
            const calls: any[] = [];
            const thisArg = { name: "thisArg" };
            const mapFn = function (this: any) {
                calls.push({ args: Array.prototype.slice.call(arguments), self: this });
                return arguments.length;
            };

            assert.deepEqual(polyArrFrom<any, number>([1, 2], mapFn as any, thisArg), [2, 2]);
            assert.deepEqual(polyArrFrom<any, number>({ length: 1, 0: "a" }, mapFn as any, thisArg), [2]);
            assert.deepEqual(polyArrFrom<any, number>(new Set(["x"]), mapFn as any, thisArg), [2]);
            assert.deepEqual(calls[0].args, [1, 0]);
            assert.deepEqual(calls[1].args, [2, 1]);
            assert.deepEqual(calls[2].args, ["a", 0]);
            assert.deepEqual(calls[3].args, ["x", 0]);
            assert.strictEqual(calls[0].self, thisArg);
        });

        it("throws for null, undefined or a mapFn which is not a function", () => {
            assert.throws(() => polyArrFrom(null as any), TypeError);
            assert.throws(() => polyArrFrom(undefined as any), TypeError);
            assert.throws(() => polyArrFrom([1], null as any), TypeError);
            assert.throws(() => polyArrFrom([1], "fn" as any), TypeError);
            assert.deepEqual(polyArrFrom([1], undefined), [1], "An undefined mapFn is no mapping");
        });

        it("throws for a mapFn which is the string \"undefined\", as it is not a function", () => {
            assert.throws(() => polyArrFrom([1], "undefined" as any), TypeError);
            assert.throws(() => polyArrFrom([], "undefined" as any), TypeError);
        });

        it("throws a RangeError for a length which is longer than an array can be, like the native function", () => {
            // Without the check these would add values until the runtime runs out of memory
            assert.throws(() => polyArrFrom({ length: Math.pow(2, 32) } as any), RangeError);
            assert.throws(() => polyArrFrom({ length: Infinity } as any), RangeError);
            assert.throws(() => polyArrFrom({ length: Number.MAX_VALUE } as any, (value: any) => value), RangeError);

            // A length which an array can be is not rejected
            assert.deepEqual(polyArrFrom({ length: 3 } as any), [undefined, undefined, undefined]);
        });

        it("matches the native function", function() {
            const nativeFrom = (Array as any).from;
            if (!nativeFrom) {
                this.skip();
                return;
            }

            // Checks the result without and with a mapFn (which returns the value and index it was passed)
            function _checkMatchesNative(value: any) {
                assert.deepEqual(polyArrFrom(value), nativeFrom(value), "Array.from(" + dumpObj(value) + ")");
                assert.deepEqual(
                    polyArrFrom(value, (item: any, idx?: number) => [item, idx]),
                    nativeFrom(value, (item: any, idx?: number) => [item, idx]),
                    "Array.from(" + dumpObj(value) + ", mapFn)");
            }

            // An array
            _checkMatchesNative([1, 2, 3]);

            // A sparse array, where an empty slot is undefined
            const sparse: any[] = [1];
            sparse[2] = 3;
            _checkMatchesNative(sparse);

            // A string with a surrogate pair, which is a single code point
            _checkMatchesNative("a𐐨b");

            // Array-like objects with a missing index, a fractional length and a negative length
            _checkMatchesNative({ length: 3, 0: "a", 2: "c" });
            _checkMatchesNative({ length: 2.5, 0: 1, 1: 2, 2: 3 });
            _checkMatchesNative({ length: -1 });

            // Values with no length
            _checkMatchesNative({});
            _checkMatchesNative(42);
            _checkMatchesNative(true);

            // Iterables
            _checkMatchesNative(new Set([1, 2]));
            _checkMatchesNative(new Map([[1, "a"]]));
            _checkMatchesNative(new Uint8Array([1, 2]));
        });

        describe("matches the native function for the iterator function, mapFn and new values", () => {
            // These cases were found by the tests of PR #645 (for issue #644), each is also checked with the native
            // function (when it exists)
            const iteratorSymbol = getKnownSymbol(WellKnownSymbols.iterator);
            const nativeFrom = (Array as any).from;

            function _createIterator(values: any[]) {
                let idx = 0;
                return {
                    next: () => idx < values.length ? { value: values[idx++], done: false } : { value: undefined, done: true }
                };
            }

            function _checkBoth(check: (from: (value: any, mapFn?: any, thisArg?: any) => any[]) => void) {
                check(polyArrFrom);
                if (nativeFrom) {
                    check(nativeFrom);
                }
            }

            it("reads the iterator function once", () => {
                _checkBoth((from) => {
                    let reads = 0;
                    const value: any = { length: 1, 0: "array-like" };
                    Object.defineProperty(value, iteratorSymbol, {
                        get: () => {
                            reads++;
                            return () => _createIterator(["iterated"]);
                        }
                    });

                    assert.deepEqual(from(value), ["iterated"]);
                    assert.equal(reads, 1, "The iterator function should only be read once");
                });
            });

            it("uses the iterator returned by the iterator function as-is", () => {
                _checkBoth((from) => {
                    const iterator: any = _createIterator(["iterated"]);
                    Object.defineProperty(iterator, iteratorSymbol, {
                        get: () => {
                            throw new Error("The [Symbol.iterator] of the returned iterator should not be read");
                        }
                    });

                    const value: any = {};
                    value[iteratorSymbol] = () => iterator;
                    assert.deepEqual(from(value), ["iterated"]);
                });
            });

            it("throws a TypeError for an iterator function which is not a function", () => {
                _checkBoth((from) => {
                    const invalid: any[] = [true, false, 0, 1, "invalid", {}];
                    for (let idx = 0; idx < invalid.length; idx++) {
                        const value: any = { length: 1, 0: "array-like" };
                        value[iteratorSymbol] = invalid[idx];
                        assert.throws(() => from(value), TypeError, undefined, "An iterator function of " + dumpObj(invalid[idx]));
                    }

                    // A null or undefined iterator function is not used, so the value is an array-like
                    const nullIter: any = { length: 1, 0: "array-like" };
                    nullIter[iteratorSymbol] = null;
                    assert.deepEqual(from(nullIter), ["array-like"]);

                    const undefinedIter: any = { length: 1, 0: "array-like" };
                    undefinedIter[iteratorSymbol] = undefined;
                    assert.deepEqual(from(undefinedIter), ["array-like"]);
                });
            });

            it("throws a TypeError when the iterator function doesn't return an iterator", () => {
                _checkBoth((from) => {
                    const invalid: any[] = [undefined, null, 1, {}];
                    for (let idx = 0; idx < invalid.length; idx++) {
                        const value: any = {};
                        value[iteratorSymbol] = () => invalid[idx];
                        assert.throws(() => from(value), TypeError, undefined, "An iterator of " + dumpObj(invalid[idx]));
                    }
                });
            });

            it("calls the mapFn without using its own call property", () => {
                _checkBoth((from) => {
                    const mapFn: any = (value: number, idx: number) => value * 10 + idx;
                    mapFn.call = null;

                    assert.deepEqual(from([1, 2], mapFn), [10, 21]);
                    assert.deepEqual(from({ length: 2, 0: 1, 1: 2 }, mapFn), [10, 21]);
                    assert.deepEqual(from(new Set([1, 2]), mapFn), [10, 21]);
                });
            });

            it("adds each value as an own property when Array.prototype has a setter for the index", () => {
                _checkBoth((from) => {
                    const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
                    let setterCalls = 0;
                    let arrayResult: any[];
                    let iteratorResult: any[];
                    try {
                        Object.defineProperty(Array.prototype, "0", {
                            set: () => {
                                setterCalls++;
                            },
                            configurable: true
                        });

                        arrayResult = from(["own"]);
                        iteratorResult = from(new Set(["own"]));
                    } finally {
                        // Restore Array.prototype before any assert is used
                        if (previous) {
                            Object.defineProperty(Array.prototype, "0", previous);
                        } else {
                            delete (Array.prototype as any)[0];
                        }
                    }

                    assert.equal(setterCalls, 0, "The Array.prototype setter should not be called");
                    assert.deepEqual(Object.getOwnPropertyDescriptor(arrayResult, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
                    assert.deepEqual(Object.getOwnPropertyDescriptor(iteratorResult, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
                });
            });

            it("adds each value as an own property when Array.prototype has a read-only index", () => {
                _checkBoth((from) => {
                    const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
                    let arrayResult: any[];
                    let arrayLikeResult: any[];
                    let failure: any;
                    try {
                        Object.defineProperty(Array.prototype, "0", { value: "inherited", writable: false, configurable: true });

                        arrayResult = from(["own"]);
                        arrayLikeResult = from({ length: 1, 0: "own" });
                    } catch (e) {
                        failure = e;
                    } finally {
                        // Restore Array.prototype before any assert is used
                        if (previous) {
                            Object.defineProperty(Array.prototype, "0", previous);
                        } else {
                            delete (Array.prototype as any)[0];
                        }
                    }

                    assert.equal(failure, undefined, "The read-only Array.prototype index should not stop the value being added");
                    assert.deepEqual(Object.getOwnPropertyDescriptor(arrayResult, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
                    assert.deepEqual(Object.getOwnPropertyDescriptor(arrayLikeResult, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
                });
            });
        });
    });

    function _checkIsArray(value: any) {
        let polyResult = polyIsArray(value);
        let nativeResult = Array.isArray(value);

        assert.equal(polyResult, nativeResult, "Checking Native and polyfill result for [" + dumpObj(value) + "]");
    }

    function _dummyFunction() {

    }

    function _dummyError(): Error {
        return {
            name: "Dummy Error",
            message: "Dummy Message"
        };
    }

    function _getFile(): File {
        let theFile: File = null;
        try {
            theFile = new File([], "text.txt");
        } catch (e) {
            // Node doesn't have the file class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return theFile;
    }

    function _getFormData(): FormData {
        let formData: FormData = null;
        try {
            formData = new FormData();
        } catch (e) {
            // Node doesn't have the FormData class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return formData;
    }

    function _getBlob(): Blob {
        let blob: Blob = null;
        try {
            blob = new Blob();
        } catch (e) {
            // Node doesn't have the Blob class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return blob;
    }

    function _simplePromise(): any {
        return {
            then: _dummyFunction,
            catch: _dummyFunction
        };
    }

    function _simplePromiseLike(): any {
        return {
            then: _dummyFunction
        };
    }

    class TestError extends Error {
        public constructor(message: string) {
            super(message);
        }
    }
});

describe("array polyfills compared to the native functions", () => {
    function _visits(fn: (value: any, callback: (value: any, index: number) => boolean) => any, theValue: any) {
        const visited: number[] = [];
        let result: any;

        try {
            // Stop after a few calls, so a length which isn't converted correctly can't loop for a long time
            result = fn(theValue, (value: any, index: number) => {
                visited.push(index);
                return visited.length > 4;
            });
        } catch (e) {
            result = "throws";
        }

        return { result: result, visited: visited };
    }

    const finds: Array<[string, Function]> = [
        ["find", polyArrFind],
        ["findIndex", polyArrFindIndex],
        ["findLast", polyArrFindLast],
        ["findLastIndex", polyArrFindLastIndex]
    ];

    const lengths: any[] = [3, 2.5, 0.5, 0, -1, -2.5, NaN, "2", "abc", true, null, undefined, Infinity];

    for (let lp = 0; lp < finds.length; lp++) {
        const name = finds[lp][0];
        const polyFn = finds[lp][1];

        it(name + " visits every index of a sparse array", () => {
            const sparse: any[] = [1];
            sparse[2] = 3;
            const actual = _visits((value, cb) => polyFn(value, cb), sparse);
            assert.deepEqual(actual.visited, name.indexOf("Last") !== -1 ? [2, 1, 0] : [0, 1, 2]);

            const nativeFn = (Array.prototype as any)[name];
            if (nativeFn) {
                assert.deepEqual(actual, _visits((value, cb) => nativeFn.call(value, cb), sparse), "Matches the native function");
            }
        });

        it(name + " converts the length like the native function", () => {
            const nativeFn = (Array.prototype as any)[name];
            for (let idx = 0; idx < lengths.length; idx++) {
                const length = lengths[idx];
                const actual = _visits((value, cb) => polyFn(value, cb), { length: length, 0: "a", 1: "b", 2: "c" });
                if (nativeFn) {
                    const expected = _visits((value, cb) => nativeFn.call(value, cb), { length: length, 0: "a", 1: "b", 2: "c" });
                    assert.deepEqual(actual, expected, "Length " + String(length));
                }
            }

            const noCalls = _visits((value, cb) => polyFn(value, cb), { length: -1, 0: "a" });
            assert.deepEqual(noCalls.visited, [], "A negative length is 0");
        });
    }

    it("at, with and fill truncate a fractional length", () => {
        const arrayLike = () => ({ length: 2.5, 0: "a", 1: "b", 2: "c" } as any);

        assert.equal(polyArrAt(arrayLike(), -1), "b");
        assert.equal(polyArrAt(arrayLike(), 2), undefined);
        assert.deepEqual(polyArrWith(arrayLike(), -1, "z"), ["a", "z"]);

        const filled = polyArrFill(arrayLike(), "z" as any, -1);
        assert.deepEqual([filled[0], filled[1], filled[2]], ["a", "z", "c"]);
        assert.equal(Object.keys(filled).indexOf("1.5"), -1, "No fractional index is added");

        // Each native function is checked only when it exists (eg. Node 18 has at but not with)
        const proto: any = Array.prototype;
        if (proto.at) {
            assert.equal(polyArrAt(arrayLike(), -1), proto.at.call(arrayLike(), -1));
        }

        if (proto.with) {
            assert.deepEqual(polyArrWith(arrayLike(), -1, "z"), proto.with.call(arrayLike(), -1, "z"));
        }

        if (proto.fill) {
            assert.deepEqual(Object.keys(polyArrFill(arrayLike(), "z" as any, -1)), Object.keys(proto.fill.call(arrayLike(), "z", -1)));
        }
    });

    it("with throws a RangeError for a length which is longer than an array can be, like the native function", () => {
        // Without the check this would add values until the runtime runs out of memory
        assert.throws(() => polyArrWith({ length: Math.pow(2, 32) + 1 } as any, 0, 1), RangeError);
        assert.throws(() => polyArrWith({ length: Infinity } as any, 0, 1), RangeError);

        const proto: any = Array.prototype;
        if (proto.with) {
            assert.throws(() => proto.with.call({ length: Math.pow(2, 32) + 1 }, 0, 1), RangeError);
        }
    });

    it("with reads every other index, so an empty slot is undefined", () => {
        const sparse: any[] = [1];
        sparse[2] = 3;
        const result = polyArrWith(sparse, 0, 9);

        assert.deepEqual(result, [9, undefined, 3]);
        assert.isTrue(1 in result, "The empty slot is not kept");
        assert.deepEqual(polyArrWith({ length: 3, 0: "a", 2: "c" } as any, 2, "z"), ["a", undefined, "z"]);
        assert.deepEqual(polyArrWith("abc" as any, 1, "z"), ["a", "z", "c"]);

        const proto: any = Array.prototype;
        if (proto.with) {
            assert.deepEqual(result, proto.with.call(sparse, 0, 9));
            assert.deepEqual(polyArrWith({ length: 3, 0: "a", 2: "c" } as any, 2, "z"), proto.with.call({ length: 3, 0: "a", 2: "c" }, 2, "z"));
        }
    });
});

describe("polyArrFrom with a String object", () => {
    it("iterates a String object, and uses its indexes when it has no iterator function, like the native function", () => {
        const pair = String.fromCharCode(0xD83D, 0xDE00);

        // A String object with an iterator function is iterated (by its code points)
        assert.deepEqual(polyArrFrom(new String("a" + pair + "b") as any), ["a", pair, "b"]);

        // On a runtime with Symbol.iterator a String object without an iterator function is an array-like (like the
        // native function), on a runtime without Symbol it is split into its code points (see bundle-runtime-check.js)
        const value: any = new String("a" + pair + "b");
        value[getKnownSymbol(WellKnownSymbols.iterator)] = undefined;
        if (hasSymbol()) {
            assert.deepEqual(polyArrFrom(value), ["a", pair.charAt(0), pair.charAt(1), "b"], "An array-like is read by its indexes");
        }

        const nativeFrom = (Array as any).from;
        if (nativeFrom) {
            assert.deepEqual(polyArrFrom(value), nativeFrom(value));
            assert.deepEqual(polyArrFrom(value, (item: string, idx?: number) => item + idx), nativeFrom(value, (item: string, idx?: number) => item + idx));
        }
    });

    it("splits a String object into its code points on a runtime without Symbol", () => {
        const pair = String.fromCharCode(0xD83D, 0xDE00);
        const orgSymbol = Symbol;
        let result: any;

        // Bypass the lazy cache, so the polyfills see that there is no Symbol
        _initTestHooks();
        setBypassLazyCache(true);
        try {
            // eslint-disable-next-line no-global-assign
            Symbol = undefined;
            result = polyArrFrom(new String("a" + pair + "b") as any);
        } finally {
            // eslint-disable-next-line no-global-assign
            Symbol = orgSymbol;

            // Read the Symbol again while the cache is bypassed, so the cached value is the native Symbol for the later tests
            hasSymbol();
            setBypassLazyCache(false);
        }

        assert.deepEqual(result, ["a", pair, "b"]);
    });

    it("converts a String object with its own toString() on a runtime without Symbol, like the String iterator", () => {
        const orgSymbol = Symbol;
        const value: any = new String("abc");
        value.toString = () => "xyz";
        let result: any;

        // Bypass the lazy cache, so the polyfills see that there is no Symbol
        _initTestHooks();
        setBypassLazyCache(true);
        try {
            // eslint-disable-next-line no-global-assign
            Symbol = undefined;
            result = polyArrFrom(value);
        } finally {
            // eslint-disable-next-line no-global-assign
            Symbol = orgSymbol;

            // Read the Symbol again while the cache is bypassed, so the cached value is the native Symbol for the later tests
            hasSymbol();
            setBypassLazyCache(false);
        }

        assert.deepEqual(result, ["x", "y", "z"], "The String object should be converted with its toString()");

        // Like the native function (and the polyfill on a runtime with Symbol), which use the String iterator
        assert.deepEqual(polyArrFrom(value), ["x", "y", "z"]);
        const nativeFrom = (Array as any).from;
        if (nativeFrom) {
            assert.deepEqual(nativeFrom(value), ["x", "y", "z"]);
        }
    });
});

describe("polyArrFind / polyArrFindIndex / polyArrFindLast / polyArrFindLastIndex check the callbackFn like the native functions", () => {
    const findFns: { [name: string]: Function } = { polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex };

    Object.keys(findFns).forEach((name) => {
        const findFn = findFns[name];

        it(name + " should throw a TypeError for a callbackFn which is not a function, even for an empty array", () => {
            assert.throws(() => findFn([], undefined), TypeError);
            assert.throws(() => findFn({ length: 0 }, {}), TypeError);
            assert.throws(() => findFn([1, 2], null), TypeError);
        });

        it(name + " should read the length before checking the callbackFn", () => {
            const order: string[] = [];
            const arrayLike = {
                get length() {
                    order.push("length");
                    return 0;
                }
            };

            assert.throws(() => findFn(arrayLike, undefined), TypeError);
            assert.deepEqual(order, ["length"]);
        });

        it(name + " should pass the String object of a string to the callbackFn", () => {
            let arrays: any[] = [];
            findFn("ab", (value: string, index: number, theArray: any) => {
                arrays.push(theArray);
                return false;
            });

            assert.equal(arrays.length, 2);
            assert.equal(typeof arrays[0], "object", "The string is passed as its String object");
            assert.equal(String(arrays[0]), "ab");
            assert.strictEqual(arrays[1], arrays[0], "The same object is passed for every value");
        });
    });
});

describe("array polyfills convert the array like the native functions", () => {
    const arrProto: any = Array.prototype;
    const MARK = { mark: true };

    // A new set of values for each call, as fill changes them (and with an empty slot, a string length, an object
    // length, a fractional string length, no length, primitives, a function and null / undefined)
    function _values(): any[] {
        return [
            // eslint-disable-next-line no-sparse-arrays
            [1, , 3], "abc", { length: "2", 0: "x", 1: "y", 2: "z" }, { length: { valueOf: () => 1 }, 0: "a" },
            { length: "1.5", 0: "a" }, { 0: "a" }, 5, true, (a: any, b: any) => a + b, null, undefined
        ];
    }

    // The type, value and own enumerable properties of a value, so the object of a primitive value (eg. a String
    // object) can be compared
    function _snapshot(value: any): any {
        if (value === null || (typeof value !== "object" && typeof value !== "function")) {
            return value;
        }

        return {
            type: typeof value,
            isArray: Array.isArray(value),
            value: String(value.valueOf()),
            props: Object.keys(value).map((key) => key + "=" + String(value[key]))
        };
    }

    function _run(fn: () => any) {
        try {
            return { result: _snapshot(fn()) };
        } catch (e) {
            return { error: (e as any).name };
        }
    }

    function _callbackArgs(calls: any[][], thisArg?: any) {
        let callback = function (this: any, value: any, index: number, theArray: any) {
            calls.push([this === MARK, _snapshot(value), index, _snapshot(theArray)]);
            return index === 1;
        };

        return arguments.length > 1 ? [callback, thisArg] : [callback];
    }

    const callbackArgSets: Array<(calls: any[][]) => any[]> = [
        (calls: any[][]) => _callbackArgs(calls),
        (calls: any[][]) => _callbackArgs(calls, MARK),
        () => [undefined],
        () => [{}]
    ];

    const tests: { [name: string]: [Function, Function, Array<(calls: any[][]) => any[]>] } = {
        at: [arrProto.at, polyArrAt, [() => [0], () => [-1], () => [1]]],
        with: [arrProto.with, polyArrWith, [() => [0, 9], () => [-1, 9]]],
        fill: [arrProto.fill, polyArrFill, [() => [7], () => [7, 1], () => [7, 5]]],
        find: [arrProto.find, polyArrFind, callbackArgSets],
        findIndex: [arrProto.findIndex, polyArrFindIndex, callbackArgSets],
        findLast: [arrProto.findLast, polyArrFindLast, callbackArgSets],
        findLastIndex: [arrProto.findLastIndex, polyArrFindLastIndex, callbackArgSets],
        flatMap: [arrProto.flatMap, polyArrFlatMap, callbackArgSets]
    };

    Object.keys(tests).forEach((name) => {
        const [nativeFn, polyFn, argSets] = tests[name];

        (nativeFn ? it : it.skip)(name + " should return (or throw) the same as the native function", () => {
            for (let setIdx = 0; setIdx < argSets.length; setIdx++) {
                for (let idx = 0; idx < _values().length; idx++) {
                    const nativeCalls: any[][] = [];
                    const polyCalls: any[][] = [];
                    const nativeValue = _values()[idx];
                    const polyValue = _values()[idx];
                    const msg = name + " value " + idx + " arguments " + setIdx;

                    const nativeResult = _run(() => nativeFn.apply(nativeValue, argSets[setIdx](nativeCalls)));
                    const polyResult = _run(() => polyFn.apply(null, [polyValue].concat(argSets[setIdx](polyCalls))));

                    assert.deepEqual(polyResult, nativeResult, msg);
                    assert.deepEqual(polyCalls, nativeCalls, msg + " (the callbackFn calls)");
                    assert.deepEqual(_snapshot(polyValue), _snapshot(nativeValue), msg + " (the value after the call)");
                }
            }
        });
    });
});
