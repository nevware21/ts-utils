/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { objIsFrozen, objIsSealed } from "../../../src/object/object_state";
import { polyObjIsFrozen } from "../../../src/polyfills/object/objIsFrozen";
import { polyObjIsSealed } from "../../../src/polyfills/object/objIsSealed";

// Only run with Node, where the module can be loaded again (using require) while the native Object.isFrozen and
// Object.isSealed are removed, as objIsFrozen and objIsSealed are resolved (to the native or the polyfill function)
// when the module is loaded
describe("objIsFrozen and objIsSealed for a runtime without Object.isFrozen and Object.isSealed", () => {
    const modulePath = require.resolve("../../../src/object/object_state");

    /**
     * Loads a new instance of the object_state module while the native Object.isFrozen and Object.isSealed are
     * removed, then restores them and the original (cached) module instance, so the other tests are not affected.
     */
    function _loadWithoutNatives(): { objIsFrozen: (obj: any) => boolean, objIsSealed: (obj: any) => boolean } {
        const isFrozenDesc = Object.getOwnPropertyDescriptor(Object, "isFrozen");
        const isSealedDesc = Object.getOwnPropertyDescriptor(Object, "isSealed");
        const cachedModule = require.cache[modulePath];

        try {
            delete (Object as any).isFrozen;
            delete (Object as any).isSealed;
            delete require.cache[modulePath];

            return require("../../../src/object/object_state");
        } finally {
            Object.defineProperty(Object, "isFrozen", isFrozenDesc);
            Object.defineProperty(Object, "isSealed", isSealedDesc);
            require.cache[modulePath] = cachedModule;
        }
    }

    it("uses the native functions when they are defined", () => {
        assert.strictEqual(objIsFrozen, Object.isFrozen);
        assert.strictEqual(objIsSealed, Object.isSealed);
    });

    it("falls back to the polyfill functions when there are no native functions", () => {
        const noNatives = _loadWithoutNatives();

        assert.strictEqual(noNatives.objIsFrozen, polyObjIsFrozen, "objIsFrozen should be the polyfill");
        assert.strictEqual(noNatives.objIsSealed, polyObjIsSealed, "objIsSealed should be the polyfill");
        assert.notStrictEqual(noNatives.objIsFrozen, objIsFrozen, "The module should have been loaded again");
        assert.isFunction(Object.isFrozen, "Object.isFrozen should be restored");
        assert.isFunction(Object.isSealed, "Object.isSealed should be restored");
    });

    it("the fallback reports a primitive (including null and undefined) as frozen and sealed", () => {
        const noNatives = _loadWithoutNatives();

        [null, undefined, 0, 1, NaN, "", "a", true, false, Symbol("test")].forEach((value) => {
            assert.isTrue(noNatives.objIsFrozen(value), "objIsFrozen(" + String(value) + ")");
            assert.isTrue(noNatives.objIsSealed(value), "objIsSealed(" + String(value) + ")");
            assert.equal(noNatives.objIsFrozen(value), Object.isFrozen(value), "Same as the native Object.isFrozen(" + String(value) + ")");
            assert.equal(noNatives.objIsSealed(value), Object.isSealed(value), "Same as the native Object.isSealed(" + String(value) + ")");
        });
    });

    it("the fallback reports an object or function as not frozen or sealed", () => {
        const noNatives = _loadWithoutNatives();

        [{}, { a: 1 }, [], [1], function() {}, new Date(), /a/].forEach((value) => {
            assert.isFalse(noNatives.objIsFrozen(value), "objIsFrozen(" + Object.prototype.toString.call(value) + ")");
            assert.isFalse(noNatives.objIsSealed(value), "objIsSealed(" + Object.prototype.toString.call(value) + ")");
        });

        // Without the native functions an object can't be frozen or sealed, so (unlike the native functions) a
        // frozen or sealed object is also reported as not frozen or sealed
        assert.isFalse(noNatives.objIsFrozen(Object.freeze({ a: 1 })), "A frozen object isn't identified");
        assert.isFalse(noNatives.objIsSealed(Object.seal({ a: 1 })), "A sealed object isn't identified");
    });
});
