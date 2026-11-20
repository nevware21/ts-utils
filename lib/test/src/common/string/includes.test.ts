/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { strIncludes, polyStrIncludes, strContains } from "../../../../src/string/includes";
import { polyStrEndsWith } from "../../../../src/string/ends_with";
import { polyStrStartsWith } from "../../../../src/string/starts_with";

function _expectThrow(cb: () => void): Error {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Expected an exception to be thrown");
        return e;
    }

    // Nothing was thrown
    assert.fail("Expected an exception to be thrown");
}

describe("strIncludes", () => {
    it("null/undefined", () => {
        _expectThrow(() => {
            assert.equal(strIncludes(null as any, null as any), true);
        });

        _expectThrow(() => {
            assert.equal(strIncludes(null as any, undefined as any), false);
        });

        _expectThrow(() => {
            assert.equal(strIncludes(undefined as any, null as any), false);
        });

        _expectThrow(() => {
            assert.equal(strIncludes(undefined as any, undefined as any), true);
        });
    });

    it("Basic", () => {
        assert.equal(strIncludes("Blue Whale", "blue"), false);

        let value = "Hello Darkness my old friend, I've come to talk with you again";

        assert.equal(strIncludes(value, "Hello Darkness"), true);
        assert.equal(strIncludes(value, "Hello Darkness", 1), false);
        assert.equal(strIncludes(value, "friend"), true);
        assert.equal(strIncludes(value, "talk"), true);
        assert.equal(strIncludes(value, "Old Friend", 1), false);
        assert.equal(strIncludes(value, "old friend", 1), true);
        assert.equal(strIncludes(value, "with you again"), true);
        assert.equal(strIncludes(value, ""), true);
    });

    it("Search is not a string", () => {
        let value = "Hello Darkness my old friend";
        assert.equal(strIncludes(value, null as any), false);
        assert.equal(strIncludes(value, undefined as any), false);
        assert.equal(strIncludes("value is null", null as any), true);
        assert.equal(strIncludes("undefined as the value", undefined as any), true);
    });

    it("regexp search", () => {
        _expectThrow(() => {
            strIncludes("Hello Darkness", (/Darkness/g) as any);
        })
    });
});

describe("strContains", () => {
    it("null/undefined", () => {
        _expectThrow(() => {
            assert.equal(strContains(null as any, null as any), true);
        });

        _expectThrow(() => {
            assert.equal(strContains(null as any, undefined as any), false);
        });

        _expectThrow(() => {
            assert.equal(strContains(undefined as any, null as any), false);
        });

        _expectThrow(() => {
            assert.equal(strContains(undefined as any, undefined as any), true);
        });
    });

    it("Basic", () => {
        assert.equal(strContains("Blue Whale", "blue"), false);

        let value = "Hello Darkness my old friend, I've come to talk with you again";

        assert.equal(strContains(value, "Hello Darkness"), true);
        assert.equal(strContains(value, "Hello Darkness", 1), false);
        assert.equal(strContains(value, "friend"), true);
        assert.equal(strContains(value, "talk"), true);
        assert.equal(strContains(value, "Old Friend", 1), false);
        assert.equal(strContains(value, "old friend", 1), true);
        assert.equal(strContains(value, "with you again"), true);
        assert.equal(strContains(value, ""), true);
    });

    it("Search is not a string", () => {
        let value = "Hello Darkness my old friend";
        assert.equal(strContains(value, null as any), false);
        assert.equal(strContains(value, undefined as any), false);
        assert.equal(strContains("value is null", null as any), true);
        assert.equal(strContains("undefined as the value", undefined as any), true);
    });

    it("regexp search", () => {
        _expectThrow(() => {
            strContains("Hello Darkness", (/Darkness/g) as any);
        })
    });
});

describe("polyStrIncludes", () => {
    it("null/undefined", () => {
        _expectThrow(() => {
            assert.equal(polyStrIncludes(null as any, null as any), true);
        });

        _expectThrow(() => {
            assert.equal(polyStrIncludes(null as any, undefined as any), false);
        });

        _expectThrow(() => {
            assert.equal(polyStrIncludes(undefined as any, null as any), false);
        });

        _expectThrow(() => {
            assert.equal(polyStrIncludes(undefined as any, undefined as any), true);
        });
    });

    it("Basic", () => {
        assert.equal(polyStrIncludes("Blue Whale", "blue"), false);

        let value = "Hello Darkness my old friend, I've come to talk with you again";

        assert.equal(polyStrIncludes(value, "Hello Darkness"), true);
        assert.equal(polyStrIncludes(value, "Hello Darkness", 1), false);
        assert.equal(polyStrIncludes(value, "friend"), true);
        assert.equal(polyStrIncludes(value, "talk"), true);
        assert.equal(polyStrIncludes(value, "Old Friend", 1), false);
        assert.equal(polyStrIncludes(value, "old friend", 1), true);
        assert.equal(polyStrIncludes(value, "with you again"), true);
        assert.equal(polyStrIncludes(value, ""), true);
    });

    it("Search is not a string", () => {
        let value = "Hello Darkness my old friend";
        assert.equal(polyStrIncludes(value, null as any), false);
        assert.equal(polyStrIncludes(value, undefined as any), false);
        assert.equal(strIncludes("value is null", null as any), true);
        assert.equal(strIncludes("undefined as the value", undefined as any), true);
    });

    it("regexp search", () => {
        _expectThrow(() => {
            polyStrIncludes("Hello Darkness", (/Darkness/g) as any);
        })
    });
});

describe("polyStrIncludes value conversion", () => {
    it("converts the value to a string, like the native function", () => {
        const values: any[] = [["abc"], [1, 2, 3], 123, new String("abc"), { toString: () => "abc" }, true];
        const searches: any[] = ["b", 2, "2", "bc", "ab", "rue", "1,2", "z"];
        for (let lp = 0; lp < values.length; lp++) {
            for (let sp = 0; sp < searches.length; sp++) {
                assert.equal(polyStrIncludes(values[lp], searches[sp]), String.prototype.includes.call(values[lp], searches[sp]),
                    "Checking includes of [" + String(values[lp]) + "] for [" + searches[sp] + "]");
            }
        }

        // Previously the value's own indexOf() was used, eg. Array.prototype.indexOf for an array
        assert.isTrue(polyStrIncludes(["abc"] as any, "b"));
        assert.isTrue(polyStrIncludes([1, 2, 3] as any, 2 as any));
        assert.isFalse(polyStrIncludes({ toString: () => "abc", indexOf: () => 0 } as any, "z"), "The value's own indexOf() should not be used");
    });

    it("converts the value, then the searchString and then the position, like the native function", () => {
        function _getLog(includesFn: (value: any, search: any, position: any) => boolean) {
            let log: string[] = [];
            includesFn({
                toString: () => {
                    log.push("value");
                    return "abc";
                }
            }, {
                toString: () => {
                    log.push("search");
                    return "b";
                }
            }, {
                valueOf: () => {
                    log.push("position");
                    return 0;
                }
            });

            return log;
        }

        const polyLog = _getLog((value, search, position) => polyStrIncludes(value, search, position));
        const nativeLog = _getLog((value, search, position) => String.prototype.includes.call(value, search, position));

        assert.deepEqual(polyLog, ["value", "search", "position"]);
        assert.deepEqual(polyLog, nativeLog);
    });

    it("throws the value's error before checking for a RegExp searchString, like the native function", () => {
        const error = new Error("value error");
        const value = {
            toString: () => {
                throw error;
            }
        };

        let caught: any;
        try {
            polyStrIncludes(value as any, /a/ as any);
        } catch (e) {
            caught = e;
        }

        assert.strictEqual(caught, error);
    });
});

describe("polyStrIncludes null and undefined values", () => {
    it("throws a TypeError for a null or undefined value, like the native function", () => {
        assert.throws(() => polyStrIncludes(null as any, "u"), TypeError);
        assert.throws(() => polyStrIncludes(undefined as any, "u"), TypeError);
        assert.throws(() => String.prototype.includes.call(null, "u"), TypeError);
    });
});

describe("polyStrIncludes Symbol values", () => {
    it("converts a Symbol value or searchString (a documented difference from the native function, which throws a TypeError)", function() {
        if (typeof Symbol !== "function") {
            this.skip();
            return;
        }

        // This is the documented behaviour of polyStrIncludes (see its docs and the CHANGELOG), rather than the native
        // behaviour, as the value and searchString are converted with asString()
        assert.isTrue(polyStrIncludes(Symbol("abc") as any, "b"), "The value is converted to \"Symbol(abc)\"");
        assert.isTrue(polyStrIncludes("Symbol(abc)", Symbol("abc") as any), "The searchString is converted to \"Symbol(abc)\"");
    });
});

describe("polyStrIncludes / polyStrStartsWith / polyStrEndsWith with a Symbol.match", () => {
    it("use a defined Symbol.match to decide whether the searchString is a RegExp, like the native functions", function () {
        if (typeof Symbol !== "function" || !Symbol.match) {
            this.skip();
            return;
        }

        const notRegExp: any = /a/;
        notRegExp[Symbol.match] = false;
        const regExpLike: any = {
            toString: () => "x"
        };
        regExpLike[Symbol.match] = true;

        // A RegExp whose Symbol.match is false is searched for as a string (its source)
        assert.isTrue(polyStrIncludes("x/a/y", notRegExp));
        assert.isTrue(polyStrStartsWith("/a/y", notRegExp));
        assert.isTrue(polyStrEndsWith("x/a/", notRegExp));

        // An object whose Symbol.match is truthy is treated as a RegExp
        assert.throws(() => polyStrIncludes("x", regExpLike), TypeError);
        assert.throws(() => polyStrStartsWith("x", regExpLike), TypeError);
        assert.throws(() => polyStrEndsWith("x", regExpLike), TypeError);

        // A RegExp without a Symbol.match override still throws, and a falsy Symbol.match isn't a RegExp
        assert.throws(() => polyStrIncludes("a", /a/ as any), TypeError);
        const falsyMatch: any = {
            toString: () => "b"
        };
        falsyMatch[Symbol.match] = 0;
        assert.isTrue(polyStrIncludes("abc", falsyMatch));

        const nativeIncludes = (String.prototype as any).includes;
        if (nativeIncludes) {
            assert.equal(polyStrIncludes("x/a/y", notRegExp), nativeIncludes.call("x/a/y", notRegExp));
            assert.equal(polyStrIncludes("abc", falsyMatch), nativeIncludes.call("abc", falsyMatch));
            assert.throws(() => nativeIncludes.call("x", regExpLike), TypeError);
        }
    });
});
