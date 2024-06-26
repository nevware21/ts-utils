/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { strIncludes, polyStrIncludes, strContains } from "../../../../src/string/includes";

function _expectThrow(cb: () => void): Error {
    try {
        cb();
    } catch (e) {
        assert.ok(true, "Expected an exception to be thrown");
        return e;
    }
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

