/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { fnApply, fnBind, fnCall } from "../../../../src/funcs/funcs";
import { fnBindArgs } from "../../../../src/funcs/fnBindArgs";

describe("function helpers", () => {
    describe("fnBind", () => {
        it("examples", () => {
            const module1 = {
                x: 21,
                getX() {
                    return this.x;
                }
            };

            assert.equal(module1.getX(), 21);

            let module2 = {
                x: 42,
                getX(): any {
                    return null;
                }
            };

            module2.getX = fnBind(module1.getX, module2);
            assert.equal(module2.getX(), 42);

            module2.getX = fnBind(module1.getX, module1);
            assert.equal(module2.getX(), 21);
        });

        it("binds this and pre-bound arguments", () => {
            const module1 = {
                prefix: "Hello",
                log(value: string, punctuation: string) {
                    return this.prefix + " " + value + punctuation;
                }
            };

            const module2 = {
                prefix: "my"
            };

            const bound = fnBind(module1.log, module2, "friend");
            assert.equal(bound("!"), "my friend!", "pre-bound arguments should be preserved");
        });

        it("passes the this and all of the pre-bound and call arguments", () => {
            let theThis = { x: 21 };
            function getArgs(this: any, ..._args: any[]) {
                return [ this ].concat(Array.prototype.slice.call(arguments));
            }

            assert.deepEqual(fnBind(getArgs, theThis)(), [ theThis ]);
            assert.deepEqual(fnBind(getArgs, theThis)(1, 2), [ theThis, 1, 2 ]);
            assert.deepEqual(fnBind(getArgs, theThis, undefined)(), [ theThis, undefined ]);
            assert.deepEqual(fnBind(getArgs, theThis, 1, "two", null)(3), [ theThis, 1, "two", null, 3 ]);

            // A bound function can be bound again, the original this is retained
            assert.deepEqual(fnBind(fnBind(getArgs, theThis, 1), { x: 42 }, 2)(3), [ theThis, 1, 2, 3 ]);
        });

        it("does not depend on the function's own bind, call or apply properties", () => {
            function getX(this: any, value?: number) {
                return this.x + (value || 0) + arguments.length;
            }

            (getX as any).bind = () => "wrong";
            (getX as any).call = null;
            (getX as any).apply = null;
            assert.equal(fnBind(getX, { x: 20 })(), 20);
            assert.equal(fnBind(getX, { x: 20 }, 1)(), 22);
        });

        it("throws a TypeError when fn is not a function", () => {
            let invalid: any[] = [null, undefined, {}, "fn", 42];
            for (let lp = 0; lp < invalid.length; lp++) {
                let caught: any = null;
                try {
                    fnBind(invalid[lp], null);
                } catch (e) {
                    caught = e;
                }

                assert.ok(caught instanceof TypeError, "Expected a TypeError for " + String(invalid[lp]) + " - " + String(caught));
            }
        });
    });

    describe("fnApply", () => {
        it("examples", () => {
            assert.equal(fnApply(Math.max, null, [ 21, 42, 84, 168, 7, 3 ]), 168);
            assert.equal(fnApply(Math.min, null, [ 21, 42, 84, 168, 7, 3 ]), 3);
            
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

            assert.equal(fnApply(module1.getX, module1, [ 21 ]), 21);
            assert.equal(fnApply(module1.log, module1, [ "Darkness" ]), "Hello Darkness : 21");

            let module2 = {
                prefix: "my",
                x: 42
            };

            assert.equal(fnApply(module1.getX, module2), 42);
            assert.equal(fnApply(module1.log, module2, [ "friend" ]), "my friend : 42");
        });

        it("passes the this and the array-like arguments", () => {
            let theThis = { x: 21 };
            function argCount(..._args: any[]) {
                return arguments.length;
            }

            function getArgs(..._args: any[]) {
                return Array.prototype.slice.call(arguments);
            }

            function passArguments(..._args: any[]) {
                return fnApply(getArgs, null, arguments);
            }

            assert.equal(fnApply(function(this: any) {
                return this;
            }, theThis), theThis);
            assert.equal(fnApply(argCount, null), 0);
            assert.equal(fnApply(argCount, null, undefined), 0);
            assert.equal(fnApply(argCount, null, null as any), 0);
            assert.equal(fnApply(argCount, null, []), 0);
            assert.equal(fnApply(argCount, null, [ undefined ]), 1);
            assert.deepEqual(fnApply(getArgs, null, [ 1, "two", null, undefined ]), [ 1, "two", null, undefined ]);
            assert.deepEqual(fnApply(getArgs, null, { length: 2, 0: "eat", 1: "bananas" }), [ "eat", "bananas" ]);
            assert.deepEqual(passArguments(1, "two", 3), [ 1, "two", 3 ]);
        });

        it("does not depend on the function's own call or apply properties", () => {
            function getX(this: any, value?: number) {
                return this.x + (value || 0) + arguments.length;
            }

            (getX as any).call = null;
            (getX as any).apply = () => "wrong";
            assert.equal(fnApply(getX, { x: 20 }), 20);
            assert.equal(fnApply(getX, { x: 20 }, [ 1 ]), 22);
        });

        it("throws a TypeError when fn is not a function", () => {
            let invalid: any[] = [null, undefined, {}, "fn", 42];
            for (let lp = 0; lp < invalid.length; lp++) {
                let caught: any = null;
                try {
                    fnApply(invalid[lp], null, [ 1 ]);
                } catch (e) {
                    caught = e;
                }

                assert.ok(caught instanceof TypeError, "Expected a TypeError for " + String(invalid[lp]) + " - " + String(caught));
            }
        });
    });

    describe("fnBindArgs", () => {
        it("binds this and pre-bound arguments from an array", () => {
            const module1 = {
                prefix: "Hello",
                x: 21,
                log(value: string, punctuation: string) {
                    return this.prefix + " " + value + punctuation + " : " + this.x;
                }
            };

            let module2 = {
                prefix: "my",
                x: 42
            };

            let bound = fnBindArgs(module1.log, module2, [ "friend" ]);
            assert.equal(bound("!"), "my friend! : 42");
        });
    });

    describe("fnCall", () => {
        it("examples", () => {
            assert.equal(fnCall(Math.max, null, 21, 42, 84, 168, 7, 3), 168);
            assert.equal(fnCall(Math.min, null, 21, 42, 84, 168, 7, 3), 3);
            
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
        
            assert.equal(fnCall(module1.getX, module1), 21);
            assert.equal(fnCall(module1.log, module1, "Darkness"), "Hello Darkness : 21");

            let module2 = {
                prefix: "my",
                x: 42
            };

            assert.equal(fnCall(module1.getX, module2), 42);
            assert.equal(fnCall(module1.log, module2, "friend"), "my friend : 42");
        });

        it("passes the this and all of the arguments", () => {
            let theThis = { x: 21 };
            function argCount(..._args: any[]) {
                return arguments.length;
            }

            assert.equal(fnCall(function(this: any) {
                return this;
            }, theThis), theThis);
            assert.equal(fnCall(argCount, null), 0);
            assert.equal(fnCall(argCount, null, undefined), 1);
            assert.equal(fnCall(argCount, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 10);
            assert.deepEqual(fnCall(function(..._args: any[]) {
                return Array.prototype.slice.call(arguments);
            }, null, 1, "two", null, undefined), [1, "two", null, undefined]);
        });

        it("does not depend on the function's own call or apply properties", () => {
            function getX(this: any, value?: number) {
                return this.x + (value || 0) + arguments.length;
            }

            (getX as any).call = null;
            (getX as any).apply = () => "wrong";
            assert.equal(fnCall(getX, { x: 20 }), 20);
            assert.equal(fnCall(getX, { x: 20 }, 1), 22);
        });

        it("throws a TypeError when fn is not a function", () => {
            let invalid: any[] = [null, undefined, {}, "fn", 42];
            for (let lp = 0; lp < invalid.length; lp++) {
                let caught: any = null;
                try {
                    fnCall(invalid[lp], null);
                } catch (e) {
                    caught = e;
                }

                assert.ok(caught instanceof TypeError, "Expected a TypeError for " + String(invalid[lp]) + " - " + String(caught));
            }
        });
    });
});
