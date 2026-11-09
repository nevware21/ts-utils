/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
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

        it("passes all of the arguments and resolves the host on every call", () => {
            interface IHost {
                name: string;
                getArgs(...args: any[]): any[];
            }

            let getArgs = function(this: IHost, ..._args: any[]) {
                return [ this.name, arguments.length ].concat(Array.prototype.slice.call(arguments));
            };

            let host1: IHost = { name: "host1", getArgs: getArgs };
            let host2: IHost = { name: "host2", getArgs: getArgs };
            let theHost = host1;
            let hostCalls = 0;
            let proxyFn = createFnDeferredProxy<IHost, (...args: any[]) => any[]>(() => {
                hostCalls++;
                return theHost;
            }, "getArgs");

            assert.deepEqual(proxyFn(), [ "host1", 0 ]);
            assert.deepEqual(proxyFn(1, "two", undefined), [ "host1", 3, 1, "two", undefined ]);

            theHost = host2;
            assert.deepEqual(proxyFn(null), [ "host2", 1, null ]);
            assert.equal(hostCalls, 3, "The host is resolved for every call");
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
