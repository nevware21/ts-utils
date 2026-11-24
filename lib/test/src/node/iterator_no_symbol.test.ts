/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { WellKnownSymbols } from "../../../src/symbol/well_known";

// Only run with Node, where the modules can be loaded again (using require) while the global Symbol is removed, as the
// iterator symbol is resolved (to the native or the polyfill symbol) and cached when it is first used. The arrays
// still have their native [Symbol.iterator], but (like on IE, which has no Symbol) the modules loaded without Symbol
// use the polyfill symbol, which an array doesn't have, so an array isn't iterable for them
describe("iterForOf and the helpers which use it on a runtime without Symbol", () => {
    const srcRoot = require.resolve("../../../src/index").replace(/index\.[jt]s$/, "");

    /**
     * Loads new instances of the modules used by the tests
     */
    function _loadModules() {
        return {
            symbol: require("../../../src/symbol/symbol"),
            forOf: require("../../../src/iterator/forOf"),
            getSet: require("../../../src/helpers/get_set_value"),
            iterUnion: require("../../../src/iterator/iterUnion"),
            iterDifference: require("../../../src/iterator/iterDifference"),
            iterToArray: require("../../../src/iterator/iterToArray"),
            iterMap: require("../../../src/iterator/iterMap"),
            readArgs: require("../../../src/funcs/readArgs"),
            create: require("../../../src/iterator/create"),
            iterator: require("../../../src/iterator/iterator"),
            polyArray: require("../../../src/polyfills/array"),
            fromEntries: require("../../../src/polyfills/object/objFromEntries"),
            append: require("../../../src/array/append")
        };
    }

    // The modules loaded without Symbol, they are loaded once (loading them again compiles every source module again,
    // which took ~0.5s for each test) and used by every test
    let noSymbolModules: any;

    /**
     * Loads new instances of the source modules while the global Symbol is removed, then restores Symbol and the
     * original (cached) module instances, so the other tests are not affected.
     */
    before(function() {
        this.timeout(10000);

        const symbolDesc = Object.getOwnPropertyDescriptor(global, "Symbol");
        const cachedModules: { [key: string]: any } = {};

        function _removeSrcModules(keep?: boolean) {
            Object.keys(require.cache).forEach((key) => {
                if (key.indexOf(srcRoot) === 0) {
                    if (keep) {
                        cachedModules[key] = require.cache[key];
                    }

                    delete require.cache[key];
                }
            });
        }

        _removeSrcModules(true);
        try {
            delete (global as any).Symbol;

            noSymbolModules = _loadModules();
        } finally {
            Object.defineProperty(global, "Symbol", symbolDesc);
            _removeSrcModules();
            Object.keys(cachedModules).forEach((key) => {
                require.cache[key] = cachedModules[key];
            });
        }
    });

    /**
     * Calls the test with the modules which were loaded without Symbol, while the global Symbol is still removed (as
     * some values are only resolved when they are first used), then restores Symbol.
     */
    function _runWithoutSymbol<T>(test: (modules: any) => T): T {
        const symbolDesc = Object.getOwnPropertyDescriptor(global, "Symbol");

        try {
            delete (global as any).Symbol;

            return test(noSymbolModules);
        } finally {
            Object.defineProperty(global, "Symbol", symbolDesc);
        }
    }

    it("doesn't have Symbol (so the test is valid)", () => {
        const result = _runWithoutSymbol((modules) => modules.symbol.hasSymbol());

        assert.isFalse(result, "The modules should be loaded without Symbol");
        assert.isFunction(Symbol, "Symbol should be restored");
    });

    it("caches the string key of the polyfill iterator symbol, rather than the polyfill symbol object", () => {
        const result = _runWithoutSymbol((modules) => {
            let polySymbol = modules.symbol.getKnownSymbol(WellKnownSymbols.iterator);
            let key = modules.iterator._getIterKey();

            return {
                keyType: typeof key,
                isPolySymbol: key === polySymbol,
                matchesPolySymbol: key === String(polySymbol),
                isIterable: modules.iterator.isIterable(modules.create.createIterableIterator({ n: () => true }))
            };
        });

        // Using the polyfill symbol object as the key would convert it into its string key on every property access
        assert.equal(result.keyType, "string");
        assert.isFalse(result.isPolySymbol, "The key isn't the polyfill symbol object");
        assert.isTrue(result.matchesPolySymbol, "The key is the polyfill symbol's string key");
        assert.isTrue(result.isIterable, "An iterable created with the polyfill symbol is iterable");
    });

    it("iterForOf processes an array", () => {
        const values = _runWithoutSymbol((modules) => {
            const result: any[] = [];
            modules.forOf.iterForOf(["a", "b", "c"], (value: any, count: number) => {
                result.push(value + count);
            });

            return result;
        });

        assert.deepEqual(values, ["a0", "b1", "c2"]);
    });

    it("iterForOf stops processing an array when the callback returns -1", () => {
        const values = _runWithoutSymbol((modules) => {
            const result: any[] = [];
            modules.forOf.iterForOf([1, 2, 3], (value: any) => {
                result.push(value);
                if (value === 2) {
                    return -1;
                }
            });

            return result;
        });

        assert.deepEqual(values, [1, 2]);
    });

    it("iterForOf reads an array as it is iterated, like the array iterator", () => {
        const values = _runWithoutSymbol((modules) => {
            const theArray = [1, 2];
            const result: any[] = [];
            modules.forOf.iterForOf(theArray, (value: any) => {
                result.push(value);
                if (value <= 2) {
                    // Like for...of, a value added while the array is iterated is also processed
                    theArray.push(value + 2);
                }
            });

            return result;
        });

        assert.deepEqual(values, [1, 2, 3, 4]);
    });

    it("setValueByKey and setValueByIter set the value", () => {
        const results = _runWithoutSymbol((modules) => {
            const byKey: any = {};
            const byIter: any = {};
            modules.getSet.setValueByKey(byKey, "a.b", 1);
            modules.getSet.setValueByIter(byIter, ["a", "b"], 2);

            const unsafe: any = {};
            modules.getSet.setValueByKey(unsafe, "a.__proto__.polluted", 3);

            return { byKey, byIter, unsafe };
        });

        assert.deepEqual(results.byKey, { a: { b: 1 } }, "setValueByKey");
        assert.deepEqual(results.byIter, { a: { b: 2 } }, "setValueByIter");
        assert.deepEqual(results.unsafe, {}, "An unsafe path is still blocked and the added object is removed");
        assert.isUndefined(({} as any).polluted, "Object.prototype should not be changed");
    });

    it("getValueByIter returns the value", () => {
        const results = _runWithoutSymbol((modules) => {
            const target = { a: { b: 2 } };

            return [modules.getSet.getValueByIter(target, ["a", "b"], "def"), modules.getSet.getValueByIter(target, ["a", "c"], "def")];
        });

        assert.deepEqual(results, [2, "def"]);
    });

    it("iterUnion and iterDifference process arrays", () => {
        const results = _runWithoutSymbol((modules) => {
            return [
                modules.iterUnion.iterUnion([1, 2], [2, 3]),
                modules.iterDifference.iterDifference([1, 2, 3, 4], [2], [4])
            ];
        });

        assert.deepEqual(results[0], [1, 2, 3], "iterUnion");
        assert.deepEqual(results[1], [1, 3], "iterDifference");
    });

    it("iterToArray and iterMap process an array or array-like by its indexes as it is iterated", () => {
        const results = _runWithoutSymbol((modules) => {
            const theArray = [1, 2];
            const mapped = modules.iterToArray.iterToArray(theArray, (value: number) => {
                if (value <= 2) {
                    // Like the array iterator, a value added while the array is iterated is also processed
                    theArray.push(value + 2);
                }

                return value * 10;
            });

            return [
                mapped,
                modules.iterToArray.iterToArray({ length: 2, 0: "a", 1: "b" }),
                modules.iterToArray.iterToArray(modules.iterMap.iterMap([1, 2, 3], (value: number) => value + 1))
            ];
        });

        assert.deepEqual(results[0], [10, 20, 30, 40], "iterToArray reads the array as it is iterated");
        assert.deepEqual(results[1], ["a", "b"], "iterToArray processes an array-like");
        assert.deepEqual(results[2], [2, 3, 4], "iterMap processes an array");
    });

    it("readArgs and isIterable use the polyfill iterator of an iterable (eg. one created by createIterableIterator)", () => {
        const results = _runWithoutSymbol((modules) => {
            const createIterable = () => {
                let idx = 0;
                return modules.create.createIterableIterator({
                    n: function() {
                        this.v = ++idx;
                        return idx > 3;
                    }
                });
            };

            return {
                isIterable: modules.iterator.isIterable(createIterable()),
                all: modules.readArgs.readArgs(createIterable()),
                fromOne: modules.readArgs.readArgs(createIterable(), 1)
            };
        });

        assert.isTrue(results.isIterable, "isIterable");
        assert.deepEqual(results.all, [1, 2, 3], "readArgs");
        assert.deepEqual(results.fromOne, [2, 3], "readArgs with a start");
    });

    // Like IE 11, which has Map and Set but no Symbol, the native [Symbol.iterator] of a Map or Set is not the polyfill
    // iterator symbol used by the modules, so a Map or Set isn't iterable for them and is processed using its forEach()
    it("a Map or Set isn't iterable (so the following tests are valid)", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.iterator.isIterable(new Map([["a", 1]])),
                set: modules.iterator.isIterable(new Set([1]))
            };
        });

        assert.isFalse(results.map, "A Map should not be iterable");
        assert.isFalse(results.set, "A Set should not be iterable");
    });

    it("iterForOf processes the entries of a Map and the values of a Set", () => {
        const results = _runWithoutSymbol((modules) => {
            const mapValues: any[] = [];
            const setValues: any[] = [];

            modules.forOf.iterForOf(new Map<any, any>([["a", 1], ["b", 2]]), (value: any, count: number) => {
                mapValues.push([value, count]);
            });

            modules.forOf.iterForOf(new Set(["x", "y", "z"]), (value: any) => {
                setValues.push(value);
                if (value === "y") {
                    return -1;
                }
            });

            return { mapValues, setValues };
        });

        assert.deepEqual(results.mapValues, [[["a", 1], 0], [["b", 2], 1]], "The [key, value] entries of the Map");
        assert.deepEqual(results.setValues, ["x", "y"], "The values of the Set, until the callback returned -1");
    });

    it("iterToArray and iterMap return the entries of a Map and the values of a Set", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.iterToArray.iterToArray(new Map<any, any>([["a", 1], ["b", 2]])),
                set: modules.iterToArray.iterToArray(new Set([1, 2, 3]), (value: number) => value * 2),
                mapped: modules.iterToArray.iterToArray(modules.iterMap.iterMap(new Set([1, 2]), (value: number) => value + 1))
            };
        });

        assert.deepEqual(results.map, [["a", 1], ["b", 2]], "iterToArray of a Map");
        assert.deepEqual(results.set, [2, 4, 6], "iterToArray of a Set with a mapFn");
        assert.deepEqual(results.mapped, [2, 3], "iterMap of a Set");
    });

    it("polyArrFrom returns the entries of a Map and the values of a Set, like Array.from", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.polyArray.polyArrFrom(new Map<any, any>([["a", 1], ["b", 2]])),
                set: modules.polyArray.polyArrFrom(new Set(["x", "y"]), (value: string, idx: number) => value + idx),
                emptyMap: modules.polyArray.polyArrFrom(new Map())
            };
        });

        assert.deepEqual(results.map, Array.from(new Map<any, any>([["a", 1], ["b", 2]])), "polyArrFrom of a Map");
        assert.deepEqual(results.set, ["x0", "y1"], "polyArrFrom of a Set with a mapFn");
        assert.deepEqual(results.emptyMap, [], "polyArrFrom of an empty Map");
    });

    it("polyObjFromEntries creates an object from the entries of a Map or a Set of entries, like Object.fromEntries", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.fromEntries.polyObjFromEntries(new Map<any, any>([["a", 1], ["b", 2]])),
                set: modules.fromEntries.polyObjFromEntries(new Set([["c", 3]]))
            };
        });

        assert.deepEqual(results.map, { a: 1, b: 2 }, "polyObjFromEntries of a Map");
        assert.deepEqual(results.set, { c: 3 }, "polyObjFromEntries of a Set of entries");
    });

    it("polyArrFrom and polyObjFromEntries read a Map or Set live (like its iterator), so a value changed by the mapFn or a key conversion is used", () => {
        // A mapFn (or a key's conversion) which deletes a value which hasn't been read yet and adds another
        const changeSet = (theSet: Set<any>, deleteValue: any, addValue: any) => {
            let changed = false;
            return () => {
                if (!changed) {
                    changed = true;
                    theSet.delete(deleteValue);
                    theSet.add(addValue);
                }
            };
        };

        const getResults = (from: (value: any, mapFn?: any) => any[], fromEntries: (value: any) => any) => {
            let set = new Set([1, 2]);
            let change = changeSet(set, 2, 3);
            let arrResult = from(set, (value: number) => {
                change();
                return value;
            });

            // The first entry's key conversion deletes the second entry and adds a third
            let entries = new Set<any>();
            let bEntry = ["b", 2];
            let keyChange = changeSet(entries, bEntry, ["c", 3]);
            entries.add([{
                toString: () => {
                    keyChange();
                    return "a";
                }
            }, 1]);
            entries.add(bEntry);

            let ctorCalls = 0;
            let ctorResult = from.call(function(this: any) {
                ctorCalls++;
                return this;
            }, new Set(["x"]));

            return { arrResult, objResult: fromEntries(entries), ctorCalls, ctorLength: ctorResult.length, ctorValue: ctorResult[0] };
        };

        const polyResults = _runWithoutSymbol((modules) => getResults(modules.polyArray.polyArrFrom, modules.fromEntries.polyObjFromEntries));
        const expected = { arrResult: [1, 3], objResult: { a: 1, c: 3 }, ctorCalls: 1, ctorLength: 1, ctorValue: "x" };

        assert.deepEqual(polyResults, expected, "polyArrFrom / polyObjFromEntries");
        assert.deepEqual(getResults(Array.from, Object.fromEntries), expected, "Array.from / Object.fromEntries");
    });

    it("polyArrFrom creates the result of a constructor before it reads a Map, Set or String object, like Array.from", () => {
        function getResults(from: any) {
            const results: any = {};

            const empty = new Set<number>();
            results.addToEmpty = Array.prototype.slice.call(from.call(function () {
                empty.add(1);
            }, empty));

            const full = new Set<number>([5, 6]);
            results.clear = Array.prototype.slice.call(from.call(function () {
                full.clear();
            }, full));

            const map = new Map<any, any>([["a", 1]]);
            results.addToMap = Array.prototype.slice.call(from.call(function () {
                map.set("b", 2);
            }, map));

            // Like the String iterator a String object is converted when it is read, after the constructor is called
            const order: string[] = [];
            const str: any = new String("ab");
            str.toString = () => {
                order.push("toString");
                return "ab";
            };
            from.call(function () {
                order.push("constructor");
            }, str);
            results.strOrder = order;

            return results;
        }

        const expected = getResults(Array.from);
        assert.deepEqual(expected, { addToEmpty: [1], clear: [], addToMap: [["a", 1], ["b", 2]], strOrder: ["constructor", "toString"] }, "Array.from");
        assert.deepEqual(_runWithoutSymbol((modules) => getResults(modules.polyArray.polyArrFrom)), expected, "polyArrFrom");
    });

    it("polyArrFrom doesn't read the forEach of an array-like which isn't a Map or Set, like Array.from", () => {
        const getReads = (from: (value: any) => any[]) => {
            let reads = 0;
            let arrayLike: any = { length: 2, 0: "a", 1: "b" };
            Object.defineProperty(arrayLike, "forEach", {
                get: () => {
                    reads++;
                    return () => {
                        // Not called
                    };
                }
            });

            return { result: from(arrayLike), reads };
        };

        assert.deepEqual(_runWithoutSymbol((modules) => getReads(modules.polyArray.polyArrFrom)), { result: ["a", "b"], reads: 0 }, "polyArrFrom");
        assert.deepEqual(getReads(Array.from), { result: ["a", "b"], reads: 0 }, "Array.from");
    });

    it("arrAppend appends a Map or a Set as a single value (it isn't iterable without Symbol.iterator, arrFrom adds its values)", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.append.arrAppend([0], new Map<any, any>([["a", 1], ["b", 2]])),
                set: modules.append.arrAppend([0], new Set([1, 2, 3])),
                emptyMap: modules.append.arrAppend([0], new Map())
            };
        });

        assert.deepEqual(results.map, [0, new Map<any, any>([["a", 1], ["b", 2]])], "arrAppend of a Map appends the Map");
        assert.deepEqual(results.set, [0, new Set([1, 2, 3])], "arrAppend of a Set appends the Set");
        assert.deepEqual(results.emptyMap, [0, new Map()], "arrAppend of an empty Map appends the Map");
    });

    it("arrAppend appends every value of a large iterator (more than apply() accepts as arguments)", () => {
        const results = _runWithoutSymbol((modules) => {
            const theSet = new Set<number>();
            for (let lp = 0; lp < 200000; lp++) {
                theSet.add(lp);
            }

            const result = modules.append.arrAppend([-1], theSet.values());

            return {
                length: result.length,
                first: result[0],
                second: result[1],
                last: result[result.length - 1]
            };
        });

        assert.equal(results.length, 200001, "Every value was appended");
        assert.equal(results.first, -1);
        assert.equal(results.second, 0);
        assert.equal(results.last, 199999);
    });

    it("readArgs reads the entries of a Map and the values of a Set", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.readArgs.readArgs(new Map<any, any>([["a", 1], ["b", 2]])),
                set: modules.readArgs.readArgs(new Set([1, 2, 3]), 1),
                setEnd: modules.readArgs.readArgs(new Set([1, 2, 3]), 0, -1)
            };
        });

        assert.deepEqual(results.map, [["a", 1], ["b", 2]], "readArgs of a Map");
        assert.deepEqual(results.set, [2, 3], "readArgs of a Set from index 1");
        assert.deepEqual(results.setEnd, [1, 2], "readArgs of a Set to the end - 1");
    });

    it("polyArrFrom and polyObjFromEntries add the values of a Map or Set as own properties when Array.prototype has a setter for the index", () => {
        const results = _runWithoutSymbol((modules) => {
            const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
            let setterCalls = 0;
            try {
                Object.defineProperty(Array.prototype, "0", {
                    set: () => {
                        setterCalls++;
                    },
                    configurable: true
                });

                return {
                    set: modules.polyArray.polyArrFrom(new Set(["own"])),
                    map: modules.polyArray.polyArrFrom(new Map<any, any>([["k", "v"]])),
                    entries: modules.fromEntries.polyObjFromEntries(new Map<any, any>([["k", "v"]])),
                    setterCalls: setterCalls
                };
            } finally {
                // Restore Array.prototype before any assert is used
                if (previous) {
                    Object.defineProperty(Array.prototype, "0", previous);
                } else {
                    delete (Array.prototype as any)[0];
                }
            }
        });

        assert.equal(results.setterCalls, 0, "The Array.prototype setter should not be called");
        assert.deepEqual(Object.getOwnPropertyDescriptor(results.set, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
        assert.deepEqual(results.map, [["k", "v"]], "polyArrFrom of a Map");
        assert.deepEqual(results.entries, { k: "v" }, "polyObjFromEntries of a Map");
    });

    it("polyArrFrom and polyObjFromEntries add the values of a Map or Set when Array.prototype has a read-only index", () => {
        const results = _runWithoutSymbol((modules) => {
            const previous = Object.getOwnPropertyDescriptor(Array.prototype, "0");
            try {
                Object.defineProperty(Array.prototype, "0", { value: "inherited", writable: false, configurable: true });

                return {
                    set: modules.polyArray.polyArrFrom(new Set(["own"])),
                    entries: modules.fromEntries.polyObjFromEntries(new Map<any, any>([["k", "v"]]))
                };
            } finally {
                // Restore Array.prototype before any assert is used
                if (previous) {
                    Object.defineProperty(Array.prototype, "0", previous);
                } else {
                    delete (Array.prototype as any)[0];
                }
            }
        });

        assert.deepEqual(Object.getOwnPropertyDescriptor(results.set, "0"), { value: "own", writable: true, enumerable: true, configurable: true });
        assert.deepEqual(results.entries, { k: "v" }, "polyObjFromEntries of a Map");
    });

    it("polyObjFromEntries reads an array or a string by its indexes (like their native iterators), and arrAppend appends every value of an array", () => {
        const results = _runWithoutSymbol((modules) => {
            const run = (fn: () => any) => {
                try {
                    return fn();
                } catch (e) {
                    return (e as any).name;
                }
            };

            return {
                array: run(() => modules.fromEntries.polyObjFromEntries([["a", 1], ["b", 2]])),
                emptyString: run(() => modules.fromEntries.polyObjFromEntries("")),
                emptyStringObject: run(() => modules.fromEntries.polyObjFromEntries(new String(""))),
                string: run(() => modules.fromEntries.polyObjFromEntries("ab")),
                notIterable: run(() => modules.fromEntries.polyObjFromEntries({ a: 1 })),
                append: modules.append.arrAppend([0], [1, 2])
            };
        });

        assert.deepEqual(results.array, { a: 1, b: 2 }, "An array");
        assert.deepEqual(results.emptyString, {}, "An empty string has no entries");
        assert.deepEqual(results.emptyStringObject, {}, "An empty String object has no entries");
        assert.equal(results.string, "TypeError", "The characters of a string are not entries");
        assert.equal(results.notIterable, "TypeError", "An object isn't iterable");
        assert.deepEqual(results.append, [0, 1, 2], "arrAppend of an array");
    });

    it("iterForOf, iterToArray and iterMap process a string by its code points, like the String iterator, and arrAppend appends it as a single value", () => {
        const results = _runWithoutSymbol((modules) => {
            const forOfValues: string[] = [];
            modules.forOf.iterForOf("a😀b", (value: string) => {
                forOfValues.push(value);
            });

            return {
                forOf: forOfValues,
                stringObject: modules.iterToArray.iterToArray(new String("a😀")),
                map: modules.iterToArray.iterToArray(modules.iterMap.iterMap("ab", (value: string) => value + value)),
                append: modules.append.arrAppend([0], "a😀"),
                appendEmpty: modules.append.arrAppend([0], "")
            };
        });

        assert.deepEqual(results.forOf, ["a", "😀", "b"], "iterForOf of a string");
        assert.deepEqual(results.stringObject, ["a", "😀"], "iterToArray of a String object");
        assert.deepEqual(results.map, ["aa", "bb"], "iterMap of a string");
        assert.deepEqual(results.append, [0, "a😀"], "arrAppend of a string appends the string (it isn't iterable without Symbol.iterator)");
        assert.deepEqual(results.appendEmpty, [0, ""], "arrAppend of an empty string appends the string");

        // Like where there is Symbol.iterator
        assert.deepEqual(Array.from("a😀b"), ["a", "😀", "b"], "Array.from()");
    });

    it("arrAppend appends an array by its indexes (unlike spread an array's own polyfill iterator isn't used)", () => {
        const results = _runWithoutSymbol((modules) => {
            const withIterator: any = [1, 2];
            let idx = 0;
            withIterator[modules.symbol.getKnownSymbol("iterator")] = () => ({
                next: () => (idx < 2 ? { value: "x" + idx++, done: false } : { value: undefined, done: true })
            });

            return {
                own: modules.append.arrAppend([0], withIterator),
                array: modules.append.arrAppend([0], [1, 2])
            };
        });

        assert.deepEqual(results.own, [0, 1, 2], "The array's own polyfill iterator isn't used");
        assert.deepEqual(results.array, [0, 1, 2], "An array without one is appended by its indexes");
    });
});
