/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";

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

    it("arrAppend appends the entries of a Map and the values of a Set, like it does where they are iterable", () => {
        const results = _runWithoutSymbol((modules) => {
            return {
                map: modules.append.arrAppend([0], new Map<any, any>([["a", 1], ["b", 2]])),
                set: modules.append.arrAppend([0], new Set([1, 2, 3])),
                emptyMap: modules.append.arrAppend([0], new Map())
            };
        });

        assert.deepEqual(results.map, [0, ["a", 1], ["b", 2]], "arrAppend of a Map");
        assert.deepEqual(results.set, [0, 1, 2, 3], "arrAppend of a Set");
        assert.deepEqual(results.emptyMap, [0], "arrAppend of an empty Map");
    });

    it("arrAppend appends every value of a large Set (more than apply() accepts as arguments)", () => {
        const results = _runWithoutSymbol((modules) => {
            const theSet = new Set<number>();
            for (let lp = 0; lp < 200000; lp++) {
                theSet.add(lp);
            }

            const result = modules.append.arrAppend([-1], theSet);

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
});
