/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { polyStrSubstr, strLeft, strRight } from "../../../../src/string/substring";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isUndefined } from "../../../../src/helpers/base";

describe("substring string helpers", () => {

    describe("strLeft", () => {
        it("null/ undefined", () => {
            _expectThrow(() => {
                assert.equal(strLeft(null as any, -1), "");
            });
            _expectThrow(() => {
                assert.equal(strLeft(null as any, 0), "");
            });
            _expectThrow(() => {
                assert.equal(strLeft(null as any, 1), "N");
            });
            _expectThrow(() => {
                assert.equal(strLeft(null as any, 3), "Nev");
            });
            _expectThrow(() => {
                assert.equal(strLeft(null as any, 21), "Nevware21");
            });

            assert.equal(strLeft("Nevware21", null as any), "");

            _expectThrow(() => {
                assert.equal(strLeft(undefined as any, -1), "");
            });
            _expectThrow(() => {
                assert.equal(strLeft(undefined as any, 0), "");
            });
            _expectThrow(() => {
                assert.equal(strLeft(undefined as any, 1), "N");
            });
            _expectThrow(() => {
                assert.equal(strLeft(undefined as any, 3), "Nev");
            });
            _expectThrow(() => {
                assert.equal(strLeft(undefined as any, 21), "Nevware21");
            });
            assert.equal(strLeft("Nevware21", undefined as any), "Nevware21");
        });

        it("values", () => {
            assert.equal(strLeft("Nevware21", -1), "");
            assert.equal(strLeft("Nevware21", 0), "");
            assert.equal(strLeft("Nevware21", 1), "N");
            assert.equal(strLeft("Nevware21", 3), "Nev");
            assert.equal(strLeft("Nevware21", 21), "Nevware21");
        });
    });

    describe("strRight", () => {
        it("null/ undefined", () => {
            _expectThrow(() => {
                assert.equal(strRight(null as any, -1), "");
            });
            _expectThrow(() => {
                assert.equal(strRight(null as any, 0), "");
            });
            _expectThrow(() => {
                assert.equal(strRight(null as any, 1), "N");
            });
            _expectThrow(() => {
                assert.equal(strRight(null as any, 3), "Nev");
            });
            _expectThrow(() => {
                assert.equal(strRight(null as any, 21), "Nevware21");
            });

            assert.equal(strRight("Nevware21", null as any), "");

            _expectThrow(() => {
                assert.equal(strRight(undefined as any, -1), "");
            });
            _expectThrow(() => {
                assert.equal(strRight(undefined as any, 0), "");
            });
            _expectThrow(() => {
                assert.equal(strRight(undefined as any, 1), "N");
            });
            _expectThrow(() => {
                assert.equal(strRight(undefined as any, 3), "Nev");
            });
            _expectThrow(() => {
                assert.equal(strRight(undefined as any, 21), "Nevware21");
            });
            assert.equal(strRight("Nevware21", undefined as any), "Nevware21");
        });

        it("values", () => {
            assert.equal(strRight("Nevware21", -1), "");
            assert.equal(strRight("Nevware21", 0), "");
            assert.equal(strRight("Nevware21", 1), "1");
            assert.equal(strRight("Nevware21", 3), "e21");
            assert.equal(strRight("Nevware21", 21), "Nevware21");
        });
    });
    
    describe("polyStrSubStr", () => {
        it("Validate polyStrSubstr With  null / undefined against String.prototype.substr", () => {
            _checkPolySubStr(null);
            _checkPolySubStr(undefined);
    
            _checkPolySubStr(null, 0, 2);
            _checkPolySubStr(null, -2, 2);
            _checkPolySubStr(null, 0, 1);
            _checkPolySubStr(null, 1, 0);
            _checkPolySubStr(null, -1, 1);
            _checkPolySubStr(null, 1, -1);
            _checkPolySubStr(null, -3);
            _checkPolySubStr(null, 1);
            _checkPolySubStr(null, -20, 2);
            _checkPolySubStr(null, 20, 2);
    
            _checkPolySubStr(undefined, 0, 2);
            _checkPolySubStr(undefined, -2, 2);
            _checkPolySubStr(undefined, 0, 1);
            _checkPolySubStr(undefined, 1, 0);
            _checkPolySubStr(undefined, -1, 1);
            _checkPolySubStr(undefined, 1, -1);
            _checkPolySubStr(undefined, -3);
            _checkPolySubStr(undefined, 1);
            _checkPolySubStr(undefined, -20, 2);
            _checkPolySubStr(undefined, 20, 2);
        });
    
        it("Validate polyStrSubstr With values against String.prototype.substr", () => {
            _checkPolySubStr("null");
            _checkPolySubStr("undefined");
            _checkPolySubStr("");
            _checkPolySubStr(" ");
            _checkPolySubStr("  ");
            _checkPolySubStr("                  ");
            _checkPolySubStr("a");
            _checkPolySubStr("a ");
            _checkPolySubStr(" a");
            _checkPolySubStr(" a ");
            _checkPolySubStr("ab");
            _checkPolySubStr("  ab");
            _checkPolySubStr("ab  ");
            _checkPolySubStr("  ab  ");
            _checkPolySubStr("abba");
            _checkPolySubStr("     abba");
            _checkPolySubStr("abba     ");
            _checkPolySubStr(" abba     ");
            _checkPolySubStr("zyxyvutsrqponmlkjihgfedcba");
            _checkPolySubStr(" zyxyvutsrqponmlkjihgfedcba");
            _checkPolySubStr(" abba     ");
            _checkPolySubStr(" abba     ");
            _checkPolySubStr("Nevware21", 0, 2);
            _checkPolySubStr("Nevware21", -2, 2);
            _checkPolySubStr("Nevware21", 0, 1);
            _checkPolySubStr("Nevware21", 1, 0);
            _checkPolySubStr("Nevware21", -1, 1);
            _checkPolySubStr("Nevware21", 1, -1);
            _checkPolySubStr("Nevware21", -3);
            _checkPolySubStr("Nevware21", 1);
            _checkPolySubStr("Nevware21", -20, 2);
            _checkPolySubStr("Nevware21", 20, 2);
        });

        it("converts the start and length to integers like String.prototype.substr", () => {
            assert.equal(polyStrSubstr("abcdef", 1.5, 2.5), "bc");
            assert.equal(polyStrSubstr("abcdef", -2.5, 1.9), "e");
            assert.equal(polyStrSubstr("abcdef", 1, 0.5), "");
            assert.equal(polyStrSubstr("abcdef", undefined as any, 2), "ab");

            const starts: any[] = [1.5, -2.5, -0.5, 0.9, NaN, null, undefined, "2", Infinity, -Infinity, 10];
            const lengths: any[] = [2.5, 0.5, -0.5, -1, 0, NaN, null, undefined, "2", Infinity, -Infinity];
            for (let slp = 0; slp < starts.length; slp++) {
                for (let llp = 0; llp < lengths.length; llp++) {
                    _checkPolySubStr("abcdef", starts[slp], lengths[llp]);
                }
            }
        });

        it("an undefined start is 0 and an undefined length is the rest of the string, like String.prototype.substr", () => {
            // An undefined start
            assert.equal(polyStrSubstr("abcdef", undefined as any), "abcdef");
            assert.equal(polyStrSubstr("abcdef", undefined as any, 2), "ab");
            assert.equal(polyStrSubstr("abcdef", undefined as any, undefined), "abcdef");

            // An undefined (or missing) length
            assert.equal(polyStrSubstr("abcdef", 2), "cdef");
            assert.equal(polyStrSubstr("abcdef", 2, undefined), "cdef");
            assert.equal(polyStrSubstr("abcdef", -2, undefined), "ef");

            // Only undefined is the default length, the string "undefined" is converted to an integer (NaN is 0)
            assert.equal(polyStrSubstr("abcdef", 2, "undefined" as any), "");

            // The native function returns the same
            assert.equal(polyStrSubstr("abcdef", undefined as any), "abcdef".substr(undefined as any));
            assert.equal(polyStrSubstr("abcdef", undefined as any, 2), "abcdef".substr(undefined as any, 2));
            assert.equal(polyStrSubstr("abcdef", undefined as any, undefined), "abcdef".substr(undefined as any, undefined));
            assert.equal(polyStrSubstr("abcdef", 2, undefined), "abcdef".substr(2, undefined));
            assert.equal(polyStrSubstr("abcdef", -2, undefined), "abcdef".substr(-2, undefined));
            assert.equal(polyStrSubstr("abcdef", 2, "undefined" as any), "abcdef".substr(2, "undefined" as any));
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

    function _checkPolySubStr(value: any, start: number = NaN, length?: number) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polyStrSubstr(value, start, length);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = String.prototype.substr.call(value as any, start, length);
        } catch (e) {
            nativeThrew = e;
        }

        if (polyThrew) {
            assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                "Checking whether the Native and polyStrSubstr threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] - " + dumpObj(arguments));
        } else if(nativeThrew) {
            assert.ok(false,
                "Native threw but polyStrSubstr didn't [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] - " + dumpObj(arguments));
        } else {
            assert.equal(polyResult, nativeResult,
                "Checking whether the Native and polyStrSubstr returned the same [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "] - " + dumpObj(arguments));
        }
    }
});

