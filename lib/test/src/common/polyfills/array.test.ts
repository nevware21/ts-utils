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
        assert.equal(polyArrIncludes([1, 2, 3], 2), true);
        assert.equal(polyArrIncludes([1, 2, 3], 4), false);
        assert.equal(polyArrIncludes([1, 2, 3], 3, 3), false);
        assert.equal(polyArrIncludes([1, 2, 3], 3, -1), true);
        assert.equal(polyArrIncludes(["1", "2", "3"], 3 as any), false);

        // Note: This (should) be true, but the polyfill does not handle NaN comparison correctly
        assert.equal(polyArrIncludes([1, 2, NaN], NaN), false);
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
});
