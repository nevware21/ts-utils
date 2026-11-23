/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyArrFind, polyArrFindLast } from "../../../../src/polyfills/array";
import { polyObjFromEntries } from "../../../../src/polyfills/object/objFromEntries";
import { polyObjGetOwnPropertyDescriptors } from "../../../../src/polyfills/object/objGetOwnProperty";
import { polyObjEntries, polyObjKeys, polyObjValues } from "../../../../src/polyfills/object/objKeys";
import { polyObjPreventExtensions } from "../../../../src/polyfills/object/objPreventExtensions";
import { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "../../../../src/polyfills/symbol";
import { polyObjHasOwn } from "../../../../src/object/has_own";
import { polyArrWith } from "../../../../src/array/with";
import { polyArrFlatMap } from "../../../../src/array/flatMap";
import { polyStrSubstr } from "../../../../src/string/substring";
import { iterToArray } from "../../../../src/iterator/iterToArray";
import { polyStrPadEnd, polyStrPadStart } from "../../../../src/string/pad";
import { polyStrReplaceAll } from "../../../../src/string/replace_all";
import { polyStrMatchAll } from "../../../../src/string/match_all";
import { polyStrStartsWith } from "../../../../src/string/starts_with";
import { polyStrEndsWith } from "../../../../src/string/ends_with";
import { polyStrIncludes } from "../../../../src/string/includes";
import { polyStrAt } from "../../../../src/string/at";
import { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "../../../../src/polyfills/trim";
import { getKnownSymbol, hasSymbol as hasSymbolFn } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { getGlobal } from "../../../../src/helpers/environment";
import { _initTestHooks, setBypassLazyCache } from "../../../../src/helpers/lazy";
import { polyStrSymSplit } from "../../../../src/polyfills/split";
import { POLYFILL_TYPE_NAME } from "../../../../src/internal/poly_helpers";

// The polyfills (and the helpers which work like a native function) compared with the native functions, for the
// values and operations (eg. how often a getter or valueOf() is called) where they used to be different
describe("polyfills match the native functions", () => {
    const hasSymbol = typeof Symbol === "function" && !!Symbol.iterator;
    const hasProxy = typeof Proxy === "function";

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

        it("polyNewSymbol() and polySymbolFor() only convert an object description or key (without reading its other properties), like Symbol() and Symbol.for()", () => {
            // A getter of the polyfill type on the prototype, which throws when it is read
            const proto = {};
            Object.defineProperty(proto, POLYFILL_TYPE_NAME, {
                get: () => {
                    throw new EvalError("read");
                }
            });

            const description: any = Object.create(proto);
            description.toString = () => "polyNewSymbol.getter";

            assert.equal((polyNewSymbol(description) as any).description, "polyNewSymbol.getter");
            assert.equal(polySymbolKeyFor(polySymbolFor(description)), "polyNewSymbol.getter");
        });

        it("an object which inherits the polyfill symbol type isn't a symbol, like the native functions", () => {
            // Its own toString() is defined, as the symbol's (inherited) toString is read-only
            const tagged: any = Object.create(polyNewSymbol("inherited") as any, {
                toString: { value: () => "polyNewSymbol.inherited" }
            });

            assert.equal((polyNewSymbol(tagged) as any).description, "polyNewSymbol.inherited", "It is converted (rather than throwing)");
            assert.throws(() => polySymbolKeyFor(tagged), TypeError, undefined, "It isn't a symbol");
        });

        it("polySymbolKeyFor() only returns the key of the registry's symbol, without calling a function of the value", () => {
            const registered: any = polySymbolFor("polySymbolKeyFor.registered");
            let calls = 0;

            // An object with the (own) polyfill symbol type, which (where there is a Proxy, which can't be read to identify
            // a symbol) isn't one of the polyfill symbols, so (like a value which isn't a symbol) it throws, otherwise
            // (eg. IE) it can't be told apart from a symbol that isn't in the registry, so (like one) it has no key
            const spoofed: any = {
                description: "polySymbolKeyFor.registered",
                _polyfill: true,
                _urid: () => {
                    calls++;
                    return registered._urid();
                }
            };
            spoofed[POLYFILL_TYPE_NAME] = "symbol";

            if (hasProxy) {
                assert.throws(() => polySymbolKeyFor(spoofed), TypeError, "object is not a symbol");
            } else {
                assert.isUndefined(polySymbolKeyFor(spoofed), "The spoofed symbol isn't in the registry");
            }

            assert.equal(calls, 0, "Its function wasn't called");
            assert.isUndefined(polySymbolKeyFor(polyNewSymbol("polySymbolKeyFor.registered")), "A symbol with the same description");
            assert.equal(polySymbolKeyFor(registered), "polySymbolKeyFor.registered", "The registry's symbol");
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
});
