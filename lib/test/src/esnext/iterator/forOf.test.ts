/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrForEach } from "../../../../src/array/forEach";
import { iterForOf } from "../../../../src/iterator/forOf";
import { iterMap } from "../../../../src/iterator/iterMap";
import { iterToArray } from "../../../../src/iterator/iterToArray";

describe("ESNext iterForOf tests", () => {
    // The generators (like the collection below) are typed as any, so this file also type checks with the ES5 test
    // tsconfig (which includes it), as without downlevelIteration an ES5 target only allows for...of of an array
    function _createGenerator(log: string[]): any {
        return (function* () {
            try {
                yield 1;
                yield 2;
                yield 3;
            } finally {
                log.push("finally");
            }
        })();
    }

    // Like a jQuery collection, which is array-like and iterable (using the native array iterator) but also has a
    // next() function, which returns the next sibling elements (another collection) rather than an iterator result
    function _createCollection(): any {
        let collection: any = {
            0: "a",
            1: "b",
            length: 2,
            next: function() {
                return collection;
            }
        };

        collection[Symbol.iterator] = Array.prototype[Symbol.iterator];

        return collection;
    }

    it("processes a generator like for...of", () => {
        let log: string[] = [];
        let values: number[] = [];
        iterForOf<number>(_createGenerator(log), (value) => {
            values.push(value);
        });

        let nativeLog: string[] = [];
        let nativeValues: number[] = [];
        for (let value of _createGenerator(nativeLog)) {
            nativeValues.push(value);
        }

        assert.deepEqual(values, nativeValues);
        assert.deepEqual(log, nativeLog);
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(log, ["finally"]);
    });

    it("runs the generator's finally block when the callbackfn returns -1, like break in for...of", () => {
        let log: string[] = [];
        let values: number[] = [];
        iterForOf<number>(_createGenerator(log), (value) => {
            values.push(value);
            if (value === 2) {
                return -1;
            }
        });

        let nativeLog: string[] = [];
        let nativeValues: number[] = [];
        for (let value of _createGenerator(nativeLog)) {
            nativeValues.push(value);
            if (value === 2) {
                break;
            }
        }

        assert.deepEqual(values, nativeValues);
        assert.deepEqual(log, nativeLog);
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(log, ["finally"], "The generator's finally block should be run");
    });

    it("runs the generator's finally block when the callbackfn throws, like for...of", () => {
        let error = new Error("callbackfn failed");
        let log: string[] = [];
        let caught: any;
        try {
            iterForOf<number>(_createGenerator(log), (value) => {
                if (value === 2) {
                    throw error;
                }
            });
        } catch (e) {
            caught = e;
        }

        let nativeLog: string[] = [];
        let nativeCaught: any;
        try {
            for (let value of _createGenerator(nativeLog)) {
                if (value === 2) {
                    throw error;
                }
            }
        } catch (e) {
            nativeCaught = e;
        }

        assert.strictEqual(caught, error, "The error thrown by the callbackfn should be thrown");
        assert.strictEqual(nativeCaught, error);
        assert.deepEqual(log, nativeLog);
        assert.deepEqual(log, ["finally"], "The generator's finally block should be run");
    });

    it("throws the callbackfn's error rather than an error thrown by the generator's finally block, like for...of", () => {
        let error = new Error("callbackfn failed");
        function* failingGenerator(): any {
            try {
                yield 1;
            } finally {
                // eslint-disable-next-line no-unsafe-finally
                throw new Error("finally failed");
            }
        }

        let caught: any;
        try {
            iterForOf(failingGenerator(), () => {
                throw error;
            });
        } catch (e) {
            caught = e;
        }

        let nativeCaught: any;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (let value of failingGenerator()) {
                throw error;
            }
        } catch (e) {
            nativeCaught = e;
        }

        assert.strictEqual(nativeCaught, error);
        assert.strictEqual(caught, error, "The error thrown by the callbackfn should be thrown");
    });

    it("processes an iterable which also has a next() function (eg. a jQuery collection) like for...of", () => {
        let values: string[] = [];
        iterForOf(_createCollection(), (value: string) => {
            values.push(value);
        });

        let nativeValues: string[] = [];
        for (let value of _createCollection()) {
            nativeValues.push(value);
        }

        assert.deepEqual(values, nativeValues);
        assert.deepEqual(values, ["a", "b"]);
    });

    it("iterMap and iterToArray process an iterable which also has a next() function like for...of", () => {
        assert.deepEqual(iterToArray(iterMap(_createCollection(), (value: string) => value + "!")), ["a!", "b!"]);
        assert.deepEqual(iterToArray(_createCollection()), ["a", "b"]);
    });

    it("processes a Map, Set and string like for...of", () => {
        let map = new Map<string, number>([["a", 1], ["b", 2]]);
        let set = new Set<number>([1, 2, 2, 3]);
        let str = "a\uD83D\uDE00b";

        arrForEach([map, set, str], (source: any) => {
            let values: any[] = [];
            iterForOf(source, (value) => {
                values.push(value);
            });

            let nativeValues: any[] = [];
            for (let value of source) {
                nativeValues.push(value);
            }

            assert.deepEqual(values, nativeValues);
        });
    });
});
