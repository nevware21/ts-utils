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
import { polyArrAt } from "../../../../src/array/at";
import { polyArrFill } from "../../../../src/array/fill";
import { polyArrWith } from "../../../../src/array/with";

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

        it("supports callback thisArg and defaults to the array", () => {
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
            assert.equal(cbThis, values);

            cbThis = null;
            assert.equal(polyArrFindIndex(values, function(value) {
                cbThis = this;
                return value === 3;
            }, undefined), 2);
            assert.equal(cbThis, values);

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

        it("supports callback thisArg and defaults to the array", () => {
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
            assert.equal(cbThis, values);


            cbThis = null;
            assert.equal(polyArrFindLastIndex(values, function(value) {
                cbThis = this;
                return value === 1;
            }, undefined), 0);
            assert.equal(cbThis, values);

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

        if ((Array.prototype as any).at) {
            const proto: any = Array.prototype;
            assert.equal(polyArrAt(arrayLike(), -1), proto.at.call(arrayLike(), -1));
            assert.deepEqual(polyArrWith(arrayLike(), -1, "z"), proto.with.call(arrayLike(), -1, "z"));
            assert.deepEqual(Object.keys(polyArrFill(arrayLike(), "z" as any, -1)), Object.keys(proto.fill.call(arrayLike(), "z", -1)));
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
