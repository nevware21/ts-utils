/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { readArgs }  from "../../../../src/funcs/readArgs";
import { _initTestHooks } from "../../../../src/helpers/lazy";
import { getKnownSymbol, hasSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";

describe("args helpers", () => {
    describe("readArgs", () => {

        let _orgSymbol = Symbol;
        beforeEach(() => {
            _orgSymbol = Symbol;
            _initTestHooks();
        });
    
        afterEach(() => {
            // eslint-disable-next-line no-global-assign
            Symbol = _orgSymbol;
        });
        
        function* myGenerator() {
            yield "Hello";
            yield "Darkness";
            yield "my";
            yield "old";
            yield "friend";
        }

        function* myGenerator2() {
            yield "I've";
            yield "come";
            yield "to";
            yield "talk";
            yield "with";
            yield "you";
            yield "again";
        }

        it("examples", () => {
            let _allArgs: any[] = [];
            let _optArgs: any[] = [];
    
            function myFunc<T>(firstArg: T, ...otherArgs: any[]) {
                // Read all of the arguments
                _allArgs = readArgs(arguments);
             
                // Get all of the arguments after the first
                _optArgs = readArgs(arguments, 1);
            }
    
            myFunc("Hello");
            assert.deepEqual(_allArgs, [ "Hello" ]);
            assert.deepEqual(_optArgs, []);

            myFunc("Hello", "Darkness", "my", "old", "friend");
            assert.deepEqual(_allArgs, [ "Hello", "Darkness", "my", "old", "friend" ]);
            assert.deepEqual(_optArgs, [ "Darkness", "my", "old", "friend"]);
        });

        it("examples 2", () => {
            let theArgs: any[] = readArgs(myGenerator());

            assert.deepEqual(theArgs, [ "Hello", "Darkness", "my", "old", "friend"]);

            theArgs = readArgs(myGenerator(), 1);
            assert.deepEqual(theArgs, [ "Darkness", "my", "old", "friend"]);

            theArgs = readArgs(myGenerator(), 1, 3);
            assert.deepEqual(theArgs, [ "Darkness", "my" ]);

            theArgs = readArgs(myGenerator(), 0, 3);
            assert.deepEqual(theArgs, [ "Hello", "Darkness", "my" ]);

            theArgs = readArgs(myGenerator(), -1, 3);
            assert.deepEqual(theArgs, [ ]);

            theArgs = readArgs(myGenerator(), -4, 3);
            assert.deepEqual(theArgs, [ "Darkness", "my" ]);

            theArgs = readArgs(myGenerator2());
            assert.deepEqual(theArgs, [ "I've", "come", "to", "talk", "with", "you", "again" ]);

            theArgs = readArgs(myGenerator2(), 0, -2);
            assert.deepEqual(theArgs, [ "I've", "come", "to", "talk", "with" ]);

            theArgs = readArgs(myGenerator2(), -3, -2);
            assert.deepEqual(theArgs, [ "with" ]);
        });
    });
});

describe("readArgs with an iterable", () => {
    function _createIterable(createIterator: () => any): any {
        const iterable: any = {};
        iterable[getKnownSymbol(WellKnownSymbols.iterator)] = createIterator;

        return iterable;
    }

    function _createIterator(values: any[]): any {
        let idx = 0;
        return {
            next: () => idx < values.length ? { value: values[idx++], done: false } : { value: undefined, done: true }
        };
    }

    it("throws a TypeError when [Symbol.iterator]() doesn't return an iterator", function() {
        if (!hasSymbol()) {
            // readArgs only uses the iterator of an iterable on a runtime which supports Symbol
            this.skip();
            return;
        }

        assert.throws(() => readArgs(_createIterable(() => undefined)), TypeError);
        assert.throws(() => readArgs(_createIterable(() => ({}))), TypeError);
    });

    it("processes the iterator returned by [Symbol.iterator]() rather than that iterator's own [Symbol.iterator]", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        const value = _createIterable(() => {
            const iterator = _createIterator([1, 2, 3]);
            iterator[getKnownSymbol(WellKnownSymbols.iterator)] = () => _createIterator(["X", "Y"]);

            return iterator;
        });

        assert.deepEqual(readArgs(value), [1, 2, 3]);
    });

    it("returns the same values as arrSlice for a positive start and a negative end", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        const values = [1, 2, 3, 4, 5];
        const ranges = [[1, -1], [2, -1], [1, -2], [4, -3], [0, -1], [undefined, -2], [-3, -1], [1, 3]];
        for (let lp = 0; lp < ranges.length; lp++) {
            const start = ranges[lp][0];
            const end = ranges[lp][1];
            assert.deepEqual(readArgs(_createIterable(() => _createIterator(values)), start, end), values.slice(start, end),
                "readArgs(iterable, " + start + ", " + end + ")");
        }
    });

    it("converts a fractional or NaN start and end to an integer, like arrSlice", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        const values = [1, 2, 3, 4, 5];
        const ranges = [
            [1.5], [1.5, -1], [0.5, -0.5], [2.9, 4.1], [-2.5], [-2.5, 4.5],
            [NaN], [NaN, 2], [NaN, -1], [0, NaN], [1, NaN],
            [0, 2.5], [1, 3.5], [Infinity], [-Infinity, 2], [1, Infinity], [1, -Infinity]
        ];
        for (let lp = 0; lp < ranges.length; lp++) {
            const start = ranges[lp][0];
            const end = ranges[lp][1];
            assert.deepEqual(readArgs(_createIterable(() => _createIterator(values)), start, end), values.slice(start, end),
                "readArgs(iterable, " + start + ", " + end + ")");
        }
    });

    it("calls the iterator function without using its own call property", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        const iterFn: any = () => _createIterator([1, 2]);
        iterFn.call = null;

        assert.deepEqual(readArgs(_createIterable(iterFn)), [1, 2]);
    });

    it("adds each value as an own property when Array.prototype has a setter for the index", () => {
        const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
        let setterCalls = 0;
        let result: any[];
        try {
            Object.defineProperty(Array.prototype, "0", {
                set: () => {
                    setterCalls++;
                },
                configurable: true
            });

            result = readArgs(_createIterable(() => _createIterator(["a", "b"])));
        } finally {
            // Restore Array.prototype before any assert is used
            if (previous) {
                Object.defineProperty(Array.prototype, "0", previous);
            } else {
                delete (Array.prototype as any)[0];
            }
        }

        assert.equal(setterCalls, 0, "The Array.prototype setter should not be called");
        assert.deepEqual(Object.getOwnPropertyDescriptor(result, "0"), { value: "a", writable: true, enumerable: true, configurable: true });
        assert.deepEqual(result, ["a", "b"]);
    });
});

describe("readArgs closes the iterator like for...of", () => {
    function _createIterable(returnValue: any): any {
        let idx = 0;
        const iterable: any = {};
        iterable[getKnownSymbol(WellKnownSymbols.iterator)] = () => ({
            next: () => ({ value: idx++, done: false }),
            return: () => returnValue
        });

        return iterable;
    }

    it("throws a TypeError when it stops early and return() doesn't return an object", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        assert.throws(() => readArgs(_createIterable(undefined), 0, 2), TypeError);
        assert.deepEqual(readArgs(_createIterable({}), 0, 2), [0, 1]);
    });
});

describe("readArgs converts the start and end of an iterable like arrSlice", () => {
    // A start / end which records each time it is converted to a number
    function _counted(value: number, calls: string[], name: string): any {
        return {
            valueOf: () => {
                calls.push(name);
                return value;
            }
        };
    }

    it("converts the start and end once (like Array.prototype.slice), rather than for each value", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        const values = ["a", "b", "c", "d"];
        const ranges = [[1, undefined], [1, 3], [-2, undefined], [1, -1], [-3, -1], [0, 2], [undefined, -1]];
        ranges.forEach(([start, end]) => {
            const sliceCalls: string[] = [];
            const readArgsCalls: string[] = [];
            const expected = values.slice(
                start === undefined ? undefined : _counted(start, sliceCalls, "start"),
                end === undefined ? undefined : _counted(end, sliceCalls, "end"));
            // A Set is an iterable without a length
            const result = readArgs(new Set(values),
                start === undefined ? undefined : _counted(start, readArgsCalls, "start"),
                end === undefined ? undefined : _counted(end, readArgsCalls, "end"));

            const details = "readArgs(iterable, " + start + ", " + end + ")";
            assert.deepEqual(result, expected, details);
            assert.deepEqual(readArgsCalls, sliceCalls, details + " converts the start and end like slice");
        });
    });
});

describe("readArgs with a [Symbol.iterator] which isn't a function", () => {
    it("throws a TypeError for a falsy [Symbol.iterator] which isn't null or undefined, like Array.from", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        const nativeFrom = (Array as any).from;
        [0, false, "", NaN, 5].forEach((iterFn) => {
            const value: any = {};
            value[getKnownSymbol(WellKnownSymbols.iterator)] = iterFn;

            const details = "[Symbol.iterator] is " + (typeof iterFn === "string" ? JSON.stringify(iterFn) : String(iterFn));

            assert.throws(() => readArgs(value), TypeError, undefined, details);
            if (nativeFrom) {
                assert.throws(() => nativeFrom(value), TypeError, undefined, "Array.from: " + details);
            }
        });
    });

    it("ignores a null or undefined [Symbol.iterator], like Array.from", function() {
        if (!hasSymbol()) {
            this.skip();
            return;
        }

        [null, undefined].forEach((iterFn) => {
            const value: any = {};
            value[getKnownSymbol(WellKnownSymbols.iterator)] = iterFn;

            assert.deepEqual(readArgs(value), [], "[Symbol.iterator] is " + iterFn);
        });
    });
});
