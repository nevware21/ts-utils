/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { _objCreateNull } from "../../../src/internal/own_props";
import { polyObjCreate } from "../../../src/object/create";

// Only run with Node, where the module can be loaded again (using require) while the native Object.create is removed,
// as _objCreateNull uses the Object.create captured when the module is loaded
describe("_objCreateNull for a runtime without Object.create", () => {
    const modulePath = require.resolve("../../../src/internal/own_props");

    it("creates an object without a prototype using the native Object.create", () => {
        const value = _objCreateNull();

        assert.isNull(Object.getPrototypeOf(value), "The object has no prototype");
        assert.deepEqual(Object.keys(value), [], "The object is empty");
        assert.notStrictEqual(value, _objCreateNull(), "A new object is created for each call");
    });

    it("creates an empty object without Object.create, like polyObjCreate(null)", () => {
        // Object.create is only removed while the module is loaded again, and restored before any assertion
        const createDesc = Object.getOwnPropertyDescriptor(Object, "create");
        const cachedModule = require.cache[modulePath];
        let noCreate: any;

        try {
            delete require.cache[modulePath];
            delete (Object as any).create;
            noCreate = require("../../../src/internal/own_props");
        } finally {
            Object.defineProperty(Object, "create", createDesc);
            require.cache[modulePath] = cachedModule;
        }

        const value = noCreate._objCreateNull();
        assert.notStrictEqual(noCreate._objCreateNull, _objCreateNull, "The module was loaded again");
        assert.isFunction(Object.create, "Object.create was restored");
        assert.strictEqual(Object.getPrototypeOf(value), Object.prototype, "An empty object (with Object.prototype)");
        assert.deepEqual(Object.keys(value), [], "The object is empty");
        assert.notStrictEqual(value, noCreate._objCreateNull(), "A new object is created for each call");

        // polyObjCreate(null) (the objCreate fallback for a runtime without Object.create) also returns an empty object
        assert.strictEqual(Object.getPrototypeOf(polyObjCreate(null)), Object.prototype, "polyObjCreate(null)");
    });
});
