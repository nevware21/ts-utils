/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isUnsafePropKey } from "../../../../src/object/isUnsafePropKey";

describe("object isUnsafePropKey tests", () => {
    it("should identify blocked poisoning keys", () => {
        assert.isTrue(isUnsafePropKey("__proto__"), "__proto__ should be blocked");
        assert.isTrue(isUnsafePropKey("constructor"), "constructor should be blocked");
        assert.isTrue(isUnsafePropKey("prototype"), "prototype should be blocked");
    });

    it("should allow normal keys", () => {
        assert.isFalse(isUnsafePropKey("safeKey"), "normal keys should not be blocked");
        assert.isFalse(isUnsafePropKey("length"), "length should not be blocked");
        assert.isFalse(isUnsafePropKey(0), "numeric keys should not be blocked");
        assert.isFalse(isUnsafePropKey(Symbol("k")), "symbol keys should not be blocked");
    });
});
