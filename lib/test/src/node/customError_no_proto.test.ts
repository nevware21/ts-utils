/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";

// Only run with Node, where the modules can be loaded again (using require) while Object.setPrototypeOf and
// Object.prototype.__proto__ are removed, like IE 9 / 10 where the prototype of an existing object can't be set, so the
// custom error's prototype can't be restored on the Error object which the native Error returns
describe("createCustomError on a runtime which can't set the prototype of an object", function() {
    // The test loads new instances of the source modules, which compiles every source module again (~0.5s under
    // ts-node and nyc), so it has a longer timeout than the default
    this.timeout(10000);

    const srcRoot = require.resolve("../../../src/index").replace(/index\.[jt]s$/, "");

    /**
     * Loads new instances of the source modules while Object.setPrototypeOf and Object.prototype.__proto__ are
     * removed and calls the callback with them, then restores them and the original (cached) module instances, so the
     * other tests are not affected.
     */
    function _withoutSetProto(cb: (modules: any) => void) {
        const setProtoDesc = Object.getOwnPropertyDescriptor(Object, "setPrototypeOf");
        const protoDesc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
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
            delete (Object as any).setPrototypeOf;
            delete (Object.prototype as any).__proto__;

            cb({
                customError: require("../../../src/helpers/customError"),
                base: require("../../../src/helpers/base")
            });
        } finally {
            Object.defineProperty(Object, "setPrototypeOf", setProtoDesc);
            Object.defineProperty(Object.prototype, "__proto__", protoDesc);
            _removeSrcModules();
            Object.keys(cachedModules).forEach((key) => {
                require.cache[key] = cachedModules[key];
            });
        }
    }

    it("an instance has the name of its class", function() {
        if (!Object.getOwnPropertyDescriptor(Object.prototype, "__proto__") || !Object.getOwnPropertyDescriptor(Object, "setPrototypeOf")) {
            this.skip();
            return;
        }

        let results: any = {};

        _withoutSetProto((modules) => {
            const createCustomError = modules.customError.createCustomError;
            const AppError = createCustomError("AppError");
            const StartupError = createCustomError("StartupError", null, AppError);

            const appError = new AppError("Failed");
            const startupError = new StartupError("Not started");

            results.appName = appError.name;
            results.appMessage = appError.message;
            results.appString = String(appError);
            results.appIsError = modules.base.isError(appError);
            results.startupName = startupError.name;
            results.startupString = String(startupError);

            try {
                modules.customError.throwUnsupported("Not supported");
            } catch (e) {
                results.unsupportedString = String(e);
            }
        });

        assert.equal(results.appName, "AppError");
        assert.equal(results.appMessage, "Failed");
        assert.equal(results.appString, "AppError: Failed");
        assert.isTrue(results.appIsError, "The instance is still an Error");
        assert.equal(results.startupName, "StartupError", "A subclass instance has the name of the subclass");
        assert.equal(results.startupString, "StartupError: Not started");
        assert.equal(results.unsupportedString, "UnsupportedError: Not supported");
    });
});
