/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { fnApply, fnBind, fnCall } from "../../../../src/funcs/funcs";

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
    });
});
