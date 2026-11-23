/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";

// Only run with Node, where the modules can be loaded again (using require) while the ES5 Object.getOwnPropertyNames and
// Object.getPrototypeOf are removed (like an ES3 runtime, eg. IE 8 with a shim for Function.prototype.bind), as they are
// captured when the modules are loaded
describe("polyObjKeys, polyObjEntries and polyObjValues on a runtime without Object.getOwnPropertyNames", () => {
    const srcRoot = require.resolve("../../../src/index").replace(/index\.[jt]s$/, "");
    let es3Keys: any;

    before(function() {
        this.timeout(10000);

        const namesDesc = Object.getOwnPropertyDescriptor(Object, "getOwnPropertyNames");
        const protoDesc = Object.getOwnPropertyDescriptor(Object, "getPrototypeOf");
        const cachedModules: { [key: string]: any } = {};

        function _removeSrcModules(keep?: boolean) {
            Object.keys(require.cache).forEach((key) => {
                if (key.indexOf(srcRoot) === 0) {
                    if (keep) {
                        cachedModules[key] = require.cache[key];
                    }

                    delete require.cache[key];
                }
            });
        }

        _removeSrcModules(true);
        try {
            delete (Object as any).getOwnPropertyNames;
            delete (Object as any).getPrototypeOf;
            es3Keys = require("../../../src/polyfills/object/objKeys");
        } finally {
            // Restored before any assertion
            Object.defineProperty(Object, "getOwnPropertyNames", namesDesc);
            Object.defineProperty(Object, "getPrototypeOf", protoDesc);
            _removeSrcModules();
            Object.keys(cachedModules).forEach((key) => {
                require.cache[key] = cachedModules[key];
            });
        }
    });

    it("returns the own enumerable keys, entries and values (as in v0.16.0)", () => {
        assert.isFunction(Object.getOwnPropertyNames, "Object.getOwnPropertyNames was restored");

        const value: any = Object.create({ inherited: 1 });
        value.a = 1;
        value.b = "two";
        Object.defineProperty(value, "hidden", { value: 3, enumerable: false });

        assert.deepEqual(es3Keys.polyObjKeys(value), ["a", "b"]);
        assert.deepEqual(es3Keys.polyObjEntries(value), [["a", 1], ["b", "two"]]);
        assert.deepEqual(es3Keys.polyObjValues(value), [1, "two"]);
        assert.deepEqual(es3Keys.polyObjKeys([1, 2]), ["0", "1"], "An array's length isn't a key");
    });

    it("still throws a TypeError for null or undefined", () => {
        assert.throws(() => es3Keys.polyObjKeys(null), TypeError);
        assert.throws(() => es3Keys.polyObjEntries(undefined), TypeError);
    });
});
