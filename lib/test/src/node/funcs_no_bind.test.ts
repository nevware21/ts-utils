/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import * as esbuild from "esbuild";

// Only run with Node, where the modules are bundled (by esbuild, while Function.prototype.bind exists, as the TypeScript
// transpiler used by ts-node needs it) and the bundle is then run while the native Function.prototype.bind is removed
// (like an ES3 runtime, eg. IE 8), as it is captured when the modules are loaded
describe("fnCall, fnApply and fnBind on a runtime without Function.prototype.bind", () => {
    let noBind: { funcs: any, propIsEnum: any };

    before(function() {
        this.timeout(10000);

        const srcRoot = require.resolve("../../../src/index").replace(/index\.[jt]s$/, "");
        const bundle = esbuild.buildSync({
            stdin: {
                contents: "export * as funcs from \"./funcs/funcs\"; export * as propIsEnum from \"./object/property_is_enumerable\";",
                resolveDir: srcRoot,
                loader: "ts"
            },
            bundle: true,
            format: "cjs",
            target: "es2015",
            write: false,
            logLevel: "silent"
        });

        const bindDesc = Object.getOwnPropertyDescriptor(Function.prototype, "bind");
        const theModule: any = { exports: {} };
        try {
            delete (Function.prototype as any).bind;
            // eslint-disable-next-line no-new-func
            new Function("module", "exports", bundle.outputFiles[0].text)(theModule, theModule.exports);
        } finally {
            // Restored before any assertion
            Object.defineProperty(Function.prototype, "bind", bindDesc);
        }

        noBind = theModule.exports;
    });

    it("fnCall calls the function with the this and the arguments", () => {
        function test(this: any, a: number, b: number) {
            return [this.x, a, b, arguments.length];
        }

        assert.isFunction(Function.prototype.bind, "Function.prototype.bind was restored");
        assert.deepEqual(noBind.funcs.fnCall(test, { x: 1 }, 2, 3), [1, 2, 3, 2]);
        assert.deepEqual(noBind.funcs.fnCall(test, { x: 1 }), [1, undefined, undefined, 0]);
    });

    it("fnApply calls the function with the this and the array of arguments", () => {
        function test(this: any, a: number, b: number) {
            return [this.x, a, b, arguments.length];
        }

        assert.deepEqual(noBind.funcs.fnApply(test, { x: 1 }, [2, 3]), [1, 2, 3, 2]);
        assert.deepEqual(noBind.funcs.fnApply(test, { x: 1 }), [1, undefined, undefined, 0]);
    });

    it("fnBind returns a function which calls the function with the this, the bound arguments and its own arguments", () => {
        function test(this: any, a: number, b: number, c: number) {
            return [this.x, a, b, c, arguments.length];
        }

        let ctx = { x: 1 };
        assert.deepEqual(noBind.funcs.fnBind(test, ctx)(2, 3), [1, 2, 3, undefined, 2], "No bound arguments");
        assert.deepEqual(noBind.funcs.fnBind(test, ctx, 2)(3, 4), [1, 2, 3, 4, 3], "A bound argument");
        assert.deepEqual(noBind.funcs.fnBind(test, ctx, 2, 3)(), [1, 2, 3, undefined, 2], "Only bound arguments");
    });

    it("fnCall, fnApply and fnBind don't use the function's own call, apply or bind", () => {
        function test(this: any, value: number) {
            return this.x + value;
        }

        (test as any).call = () => "wrong";
        (test as any).apply = () => "wrong";
        (test as any).bind = () => "wrong";
        assert.equal(noBind.funcs.fnCall(test, { x: 1 }, 2), 3);
        assert.equal(noBind.funcs.fnApply(test, { x: 1 }, [2]), 3);
        assert.equal(noBind.funcs.fnBind(test, { x: 1 }, 2)(), 3);
    });

    it("the internal propertyIsEnumerable works", () => {
        let value = { a: 1 };
        assert.isTrue(noBind.propIsEnum._objPropertyIsEnumerable(value, "a"));
        assert.isFalse(noBind.propIsEnum._objPropertyIsEnumerable(value, "toString"));
        assert.isFalse(noBind.propIsEnum._objPropertyIsEnumerable([1], "length"));
    });
});
