/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";

// Only run with Node, where the module can be loaded again (using require) while Object.prototype.__proto__ is removed,
// as whether the __proto__ property can set the prototype is only checked (and cached) the first time the
// _polyObjSetPrototypeOf polyfill is called, so it copies the properties like it does on IE 9 / 10
describe("_polyObjSetPrototypeOf for a runtime which can't set __proto__", () => {
    const modulePath = require.resolve("../../../src/object/set_proto");

    /**
     * Loads a new instance of the set_proto module and calls the callback with it while Object.prototype.__proto__
     * is removed, then restores it and the original (cached) module instance, so the other tests are not affected.
     */
    function _withoutProto(cb: (setProto: any) => void) {
        const protoDesc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
        const cachedModule = require.cache[modulePath];

        try {
            delete (Object.prototype as any).__proto__;
            delete require.cache[modulePath];

            cb({
                setProto: require("../../../src/object/set_proto")
            }.setProto);
        } finally {
            Object.defineProperty(Object.prototype, "__proto__", protoDesc);
            require.cache[modulePath] = cachedModule;
        }
    }

    it("copies every property of the prototype, including one whose value is -1", function() {
        if (!Object.getOwnPropertyDescriptor(Object.prototype, "__proto__")) {
            this.skip();
            return;
        }

        let target: any = {};
        let result: any;

        _withoutProto((setProto) => {
            result = setProto._polyObjSetPrototypeOf(target, { a: 1, b: -1, c: 3, d: 0 });
        });

        assert.strictEqual(result, target, "The target is returned");
        assert.deepEqual(Object.keys(target), ["a", "b", "c", "d"], "Every property was copied");
        assert.equal(target.b, -1);
        assert.equal(target.c, 3, "The copy continued after the value of -1");
        assert.equal(target.d, 0);
    });
});
