/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyStrSymSplit } from "../../../../src/polyfills/split";
import { asString } from "../../../../src/string/as_string";
import { strIndexOf } from "../../../../src/string/index_of";
import { strSplit, strSymSplit } from "../../../../src/string/split";
import { strSubstring } from "../../../../src/string/substring";
import { getKnownSymbol, hasSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";
import { _initTestHooks, setBypassLazyCache } from "../../../../src/helpers/lazy";

describe("polyfill string split helpers", () => {
  
    describe("strSymSplit", () => {

        let _orgSymbol = Symbol;
        beforeEach(() => {
            _orgSymbol = Symbol;
            _initTestHooks();
        });
    
        afterEach(() => {
            // eslint-disable-next-line no-global-assign
            Symbol = _orgSymbol;
        });

        it("null/ undefined", () => {
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(null as any, null as any), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(null as any, null as any, 0), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(null as any, null as any, 1), ["N"]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(null as any, null as any, 3), ["Nev"]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(null as any, null as any, 21), ["Nevware21"]);
            });

            assert.deepEqual(polyStrSymSplit("Nevware21", null as any), ["Nevware21"]);

            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(undefined as any, null as any, -1), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(undefined as any, null as any, 0), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(undefined as any, null as any, 1), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(undefined as any, null as any, 3), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(polyStrSymSplit(undefined as any, null as any, 21), [""]);
            });

            assert.deepEqual(polyStrSymSplit("Nevware21", undefined as any), ["Nevware21"]);
        });

        it("values", () => {
            const splitObj = {
                [Symbol.split](str: string, limit?: number) {
                    return strSplit(str, "", limit);
                }
            };

            assert.deepEqual(polyStrSymSplit("Nevware21", splitObj, -1), ["N", "e", "v", "w", "a", "r", "e", "2", "1"]);
            assert.deepEqual(polyStrSymSplit("Nevware21", splitObj, 0), []);
            assert.deepEqual(polyStrSymSplit("Nevware21", splitObj, 1), ["N"]);
            assert.deepEqual(polyStrSymSplit("Nevware21", splitObj, 3), ["N", "e", "v"]);
            assert.deepEqual(polyStrSymSplit("Nevware21", splitObj, 21), ["N", "e", "v", "w", "a", "r", "e", "2", "1"]);
        });

        it("examples", () => {
            const splitByNumber = {
                [getKnownSymbol<typeof Symbol.split>(WellKnownSymbols.split)]: (str: string) => {
                    let num = 1;
                    let pos = 0;
                    const result: string[] = [];
                    while (pos < str.length) {
                        const matchPos = strIndexOf(str, asString(num), pos);
                        if (matchPos === -1) {
                            result.push(strSubstring(str, pos));
                            break;
                        }
                        result.push(strSubstring(str, pos, matchPos));
                        pos = matchPos + String(num).length;
                        num++;
                    }
                    return result;
                }
            };
                
            const myString = "a1bc2c5d3e4f";
            console.log(polyStrSymSplit(myString, splitByNumber)); // [ "a", "bc", "c5d", "e", "f" ]

            const spaceSplitObj = {
                [getKnownSymbol<typeof Symbol.split>(WellKnownSymbols.split)](str: string, limit?: number) {
                    return strSplit(str, " ", limit);
                }
            };
            assert.deepEqual(
                polyStrSymSplit("Oh brave new world that has such people in it.", spaceSplitObj),
                [ "Oh", "brave", "new", "world", "that", "has", "such", "people", "in", "it." ]);

            const commaSplitObj = {
                [getKnownSymbol<typeof Symbol.split>(WellKnownSymbols.split)](str: string, limit?: number) {
                    return strSplit(str, ",", limit);
                }
            };
            assert.deepEqual(
                polyStrSymSplit("Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec", commaSplitObj),
                [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]);
        });

        it("calls the splitter's polyfill [Symbol.split] on a runtime without Symbol (eg. IE), like the native split", () => {
            const calls: any[] = [];
            const results: any = {};

            _withoutSymbol(() => {
                const splitKey: any = getKnownSymbol(WellKnownSymbols.split);
                const splitter: any = {};
                splitter[splitKey] = function (this: any, str: string, limit?: number) {
                    calls.push({ thisArg: this, str: str, limit: limit, count: arguments.length });
                    return ["split"];
                };

                results.splitKeyType = typeof splitKey;
                results.splitter = splitter;
                results.poly = polyStrSymSplit("a,b", splitter, 1);
                results.strSymSplit = strSymSplit("a,b", splitter);
            });

            assert.notEqual(results.splitKeyType, "symbol", "The polyfill symbol is used");
            assert.deepEqual(results.poly, ["split"]);
            assert.deepEqual(results.strSymSplit, ["split"], "strSymSplit uses the polyfill");
            assert.equal(calls.length, 2);
            assert.strictEqual(calls[0].thisArg, results.splitter, "Called with the splitter as this");
            assert.equal(calls[0].str, "a,b");
            assert.equal(calls[0].limit, 1);
            assert.equal(calls[0].count, 2, "Called with the value and the limit");
            assert.strictEqual(calls[1].limit, undefined);
            assert.equal(calls[1].count, 2, "Called with the value and the (undefined) limit");
        });

        it("splits like the native split, when the splitter has no polyfill [Symbol.split] on a runtime without Symbol (eg. IE)", () => {
            const commaObj = { toString: () => "," };
            const results: any = {};

            _withoutSymbol(() => {
                const nullSplitter: any = { toString: () => "," };
                nullSplitter[getKnownSymbol<any>(WellKnownSymbols.split)] = null;

                results.str = strSymSplit("a,b,c", "," as any);
                results.limit = strSymSplit("a,b,c", "," as any, 2);
                results.regex = strSymSplit("a1b2c", /\d/ as any);
                results.obj = strSymSplit("a,b", commaObj as any);
                results.nullFn = polyStrSymSplit("a,b", nullSplitter);
                results.nullSplitter = polyStrSymSplit("a,b", null as any);
                results.undefSplitter = polyStrSymSplit("a,b", undefined as any);
            });

            assert.deepEqual(results.str, ["a", "b", "c"], "A string is used as the separator");
            assert.deepEqual(results.limit, ["a", "b"]);
            assert.deepEqual(results.regex, ["a", "b", "c"], "A RegExp is used as the pattern");
            assert.deepEqual(results.obj, ["a", "b"], "Any other value is converted to a string");
            assert.deepEqual(results.nullFn, ["a", "b"], "A null [Symbol.split] is ignored");
            assert.deepEqual(results.nullSplitter, ["a,b"]);
            assert.deepEqual(results.undefSplitter, ["a,b"]);

            // The same as the native split (which on a runtime with Symbol has no Symbol.split for these)
            assert.deepEqual(results.str, "a,b,c".split(","));
            assert.deepEqual(results.limit, "a,b,c".split(",", 2));
            assert.deepEqual(results.regex, "a1b2c".split(/\d/));
            assert.deepEqual(results.obj, "a,b".split(commaObj as any));
            assert.deepEqual(results.nullSplitter, "a,b".split(null as any));
            assert.deepEqual(results.undefSplitter, "a,b".split(undefined as any));
        });

        it("throws a TypeError like the native split, on a runtime without Symbol (eg. IE)", () => {
            const results: any = {};

            _withoutSymbol(() => {
                const splitKey: any = getKnownSymbol(WellKnownSymbols.split);
                const notFn: any = {};
                notFn[splitKey] = 1;
                const falsyNotFn: any = {};
                falsyNotFn[splitKey] = 0;

                let reads = 0;
                const counted: any = {};
                Object.defineProperty(counted, splitKey, {
                    get: () => {
                        reads++;
                        return () => ["split"];
                    }
                });

                try {
                    polyStrSymSplit("a,b", notFn);
                } catch (e) {
                    results.notFnError = e;
                }

                try {
                    polyStrSymSplit("a,b", falsyNotFn);
                } catch (e) {
                    results.falsyNotFnError = e;
                }

                try {
                    polyStrSymSplit(null as any, counted);
                } catch (e) {
                    results.nullError = e;
                }

                results.nullReads = reads;
                results.counted = polyStrSymSplit("a,b", counted);
                results.reads = reads;
            });

            assert.instanceOf(results.notFnError, TypeError, "A [Symbol.split] which isn't a function throws a TypeError");
            assert.instanceOf(results.falsyNotFnError, TypeError, "A falsy [Symbol.split] (other than null or undefined) which isn't a function throws a TypeError");
            if (typeof Symbol === "function" && Symbol.split) {
                // Like the native split
                assert.throws(() => "a,b".split({ [Symbol.split]: 0 } as any), TypeError);
            }
            assert.instanceOf(results.nullError, TypeError, "A null value throws a TypeError");
            assert.equal(results.nullReads, 0, "The value is checked before the splitter's [Symbol.split] is read");
            assert.deepEqual(results.counted, ["split"]);
            assert.equal(results.reads, 1, "The splitter's [Symbol.split] is read once");
        });

        it("reads the splitter's native [Symbol.split] once, like the native split", () => {
            if (typeof Symbol === "function" && Symbol.split) {
                let reads = 0;
                const splitter: any = { toString: () => "," };
                Object.defineProperty(splitter, Symbol.split, {
                    get: () => {
                        reads++;
                        return undefined;
                    }
                });

                assert.deepEqual(polyStrSymSplit("a,b", splitter), ["a", "b"]);
                assert.equal(reads, 1, "polyStrSymSplit reads it once");

                reads = 0;
                assert.deepEqual(strSymSplit("a,b", splitter), ["a", "b"]);
                assert.equal(reads, 1, "strSymSplit reads it once");

                reads = 0;
                assert.deepEqual("a,b".split(splitter), ["a", "b"]);
                assert.equal(reads, 1, "The native split reads it once");
            }
        });
    });

    /**
     * Removes the Symbol (bypassing the lazy cache, so the polyfills see that there is no Symbol), calls the callback
     * and then restores it. The callback must capture any results, as other code (including the assertions) can't be
     * run while the Symbol is removed.
     */
    function _withoutSymbol(cb: () => void) {
        const orgSymbol = Symbol;

        _initTestHooks();
        setBypassLazyCache(true);
        try {
            // eslint-disable-next-line no-global-assign
            Symbol = undefined;
            cb();
        } finally {
            // eslint-disable-next-line no-global-assign
            Symbol = orgSymbol;

            // Read the Symbol again while the cache is bypassed, so the cached value is the native Symbol for the later tests
            hasSymbol();
            setBypassLazyCache(false);
        }
    }

    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});

