/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { createFnDeferredProxy, createProxyFuncs } from "../../../../src/funcs/fnProxy";

describe("function proxy helpers", () => {
    describe("fnProxy", () => {
        it("examples", () => {
            const module1 = {
                prefix: "Hello",
                x: 21,
                getX() {
                    return this.x;
                },
                log(value: string) {
                    return this.prefix + " " + value + " : " + this.x
                }
            };

            assert.equal(module1.getX(), 21);
            assert.equal(module1.log("Darkness"), "Hello Darkness : 21");
            
            let module2: any = {
                prefix: "my"
            };
            
            let getHost = () => {
                return module1;
            };
             
            let deferredFn = createFnDeferredProxy(getHost, "getX");
            let logFn = createFnDeferredProxy(getHost, "log");

            assert.equal(deferredFn(), 21);
            assert.equal(logFn("Darkness"), "Hello Darkness : 21");
           
            module2.defX = deferredFn;
            module2.log = logFn;
            assert.equal(module2.defX(), 21);
            assert.equal(module2.log("Darkness"), "Hello Darkness : 21");

            module1.x = 42;
            assert.equal(deferredFn(), 42);
            assert.equal(module2.defX(), 42);
            assert.equal(module2.log("Darkness"), "Hello Darkness : 42");
        });
    });

    describe("createProxyFuncs", () => {
        it("examples", () => {
            let test = {
                x: 21,
                func1() {
                    return this.x;
                }
            };

            assert.equal(test.func1(), 21);

            let newTarget = createProxyFuncs({} as any, test, [
                { n: "func1" },
                { n: "func1", as: "aliasFn" }
            ]);

            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);

            newTarget.x = 42;
            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);
        });

        it("examples with existing alias fn", () => {
            let test = {
                x: 21,
                func1() {
                    return this.x;
                }
            };

            assert.equal(test.func1(), 21);

            let newTarget = createProxyFuncs({
                aliasFn() {
                    return 42;
                }
            } as any, test, [
                { n: "func1" },
                { n: "func1", as: "aliasFn" }
            ]);

            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);

            newTarget.x = 42;
            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);
        });

        it("deferred examples", () => {
            let test = {
                x: 21,
                func1() {
                    return this.x;
                }
            };

            assert.equal(test.func1(), 21);
            let getHostFn = () => {
                return test;
            };

            let newTarget = createProxyFuncs({} as any, getHostFn, [
                { n: "func1" },
                { n: "func1", as: "aliasFn" }
            ]);

            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);

            newTarget.x = 42;
            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);
        });

        it("deferred examples with existing alias fn", () => {
            let test = {
                x: 21,
                func1() {
                    return this.x;
                }
            };

            assert.equal(test.func1(), 21);
            let getHostFn = () => {
                return test;
            };

            let newTarget = createProxyFuncs({
                aliasFn() {
                    return 42;
                }
            } as any, getHostFn, [
                { n: "func1" },
                { n: "func1", as: "aliasFn" }
            ]);

            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);

            newTarget.x = 42;
            assert.equal(newTarget.func1(), 21);
            assert.equal(newTarget.aliasFn(), 21);
        });

        it("deferred examples with existing alias fn and don't replace", () => {
            let test = {
                x: 21,
                func1() {
                    return this.x;
                }
            };

            assert.equal(test.func1(), 21);
            let getHostFn = () => {
                return test;
            };

            let newTarget = createProxyFuncs({
                aliasFn() {
                    return 42;
                }
            } as any, getHostFn, [
                { n: "func1" },
                { n: "func1", as: "aliasFn", rp: false }
            ]);

            test.x = 7;

            assert.equal(newTarget.func1(), 7);
            assert.equal(newTarget.aliasFn(), 42);

            newTarget.x = 14;
            assert.equal(newTarget.func1(), 7);
            assert.equal(newTarget.aliasFn(), 42);
        });
    });
});
