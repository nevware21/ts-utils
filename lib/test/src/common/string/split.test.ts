/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { asString } from "../../../../src/string/as_string";
import { strIndexOf } from "../../../../src/string/index_of";
import { strSplit, strSymSplit } from "../../../../src/string/split";
import { strSubstring } from "../../../../src/string/substring";

describe("string split helpers", () => {

    describe("strSplit", () => {
        it("null/ undefined", () => {
            _expectThrow(() => {
                assert.deepEqual(strSplit(null as any, null as any), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(null as any, null as any, 0), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(null as any, null as any, 1), ["N"]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(null as any, null as any, 3), ["Nev"]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(null as any, null as any, 21), ["Nevware21"]);
            });

            assert.deepEqual(strSplit("Nevware21", null as any), ["Nevware21"]);

            _expectThrow(() => {
                assert.deepEqual(strSplit(undefined as any, null as any, -1), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(undefined as any, null as any, 0), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(undefined as any, null as any, 1), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(undefined as any, null as any, 3), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSplit(undefined as any, null as any, 21), [""]);
            });
            assert.deepEqual(strSplit("Nevware21", undefined as any), ["Nevware21"]);
        });

        it("values", () => {
            assert.deepEqual(strSplit("Nevware21", "", -1), ["N", "e", "v", "w", "a", "r", "e", "2", "1"]);
            assert.deepEqual(strSplit("Nevware21", "", 0), []);
            assert.deepEqual(strSplit("Nevware21", "", 1), ["N"]);
            assert.deepEqual(strSplit("Nevware21", "", 3), ["N", "e", "v"]);
            assert.deepEqual(strSplit("Nevware21", "", 21), ["N", "e", "v", "w", "a", "r", "e", "2", "1"]);
        });

        it("examples", () => {
            assert.deepEqual(
                strSplit("Oh brave new world that has such people in it.", " "),
                [ "Oh", "brave", "new", "world", "that", "has", "such", "people", "in", "it." ]);

            assert.deepEqual(
                strSplit("Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec", ","),
                [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]);
        });
    });
    
    describe("strSymSplit", () => {
        it("null/ undefined", () => {
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(null as any, null as any), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(null as any, null as any, 0), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(null as any, null as any, 1), ["N"]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(null as any, null as any, 3), ["Nev"]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(null as any, null as any, 21), ["Nevware21"]);
            });

            assert.deepEqual(strSymSplit("Nevware21", null as any), ["Nevware21"]);

            _expectThrow(() => {
                assert.deepEqual(strSymSplit(undefined as any, null as any, -1), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(undefined as any, null as any, 0), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(undefined as any, null as any, 1), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(undefined as any, null as any, 3), [""]);
            });
            _expectThrow(() => {
                assert.deepEqual(strSymSplit(undefined as any, null as any, 21), [""]);
            });
            assert.deepEqual(strSymSplit("Nevware21", undefined as any), ["Nevware21"]);
        });

        it("values", () => {
            const splitObj = {
                [Symbol.split](str: string, limit?: number) {
                    return strSplit(str, "", limit);
                }
            };

            assert.deepEqual(strSymSplit("Nevware21", splitObj, -1), ["N", "e", "v", "w", "a", "r", "e", "2", "1"]);
            assert.deepEqual(strSymSplit("Nevware21", splitObj, 0), []);
            assert.deepEqual(strSymSplit("Nevware21", splitObj, 1), ["N"]);
            assert.deepEqual(strSymSplit("Nevware21", splitObj, 3), ["N", "e", "v"]);
            assert.deepEqual(strSymSplit("Nevware21", splitObj, 21), ["N", "e", "v", "w", "a", "r", "e", "2", "1"]);
        });

        it("examples", () => {
            const splitByNumber = {
                [Symbol.split]: (str: string) => {
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
            console.log(strSymSplit(myString, splitByNumber)); // [ "a", "bc", "c5d", "e", "f" ]

            const spaceSplitObj = {
                [Symbol.split](str: string, limit?: number) {
                    return strSplit(str, " ", limit);
                }
            };
            assert.deepEqual(
                strSymSplit("Oh brave new world that has such people in it.", spaceSplitObj),
                [ "Oh", "brave", "new", "world", "that", "has", "such", "people", "in", "it." ]);

            const commaSplitObj = {
                [Symbol.split](str: string, limit?: number) {
                    return strSplit(str, ",", limit);
                }
            };
            assert.deepEqual(
                strSymSplit("Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec", commaSplitObj),
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

