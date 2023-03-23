/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { polyStrSymSplit } from "../../../../src/polyfills/split";
import { asString } from "../../../../src/string/as_string";
import { strIndexOf } from "../../../../src/string/index_of";
import { strSplit, strSymSplit } from "../../../../src/string/split";
import { strSubstring } from "../../../../src/string/substring";
import { getKnownSymbol } from "../../../../src/symbol/symbol";
import { WellKnownSymbols } from "../../../../src/symbol/well_known";

describe("polyfill string split helpers", () => {
 
    describe("strSymSplit", () => {
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
    });

    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});

