/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { getWritableDeferred, ICachedValue } from "../../../../src/helpers/cache";
import { ISafeReturn, safe } from "../../../../src/helpers/safe";

describe("cache writable helpers", () => {
    describe("getWritableDeferred", () => {
        it("validate value with no arguments", () => {
            let deferredValue = getWritableDeferred(() => "hello darkness");
            assert.equal(deferredValue.v, "hello darkness");
        });

        it("validate value with arguments", () => {
            let deferredValue = getWritableDeferred((prefix: string, suffix: string) => {
                return prefix + " darkness " + suffix;
            }, ["hello", "my old friend"]);
            
            assert.equal(deferredValue.v, "hello darkness my old friend");
        });

        it("validate writable", () => {
            let deferredValue = getWritableDeferred(() => "hello darkness");
            assert.equal(deferredValue.v, "hello darkness");
            
            // Change the value
            (deferredValue as any).v = "my old friend";
            assert.equal(deferredValue.v, "my old friend");
        });

        it("validate changing value before initial access", () => {
            let called = 0;
            let deferredValue = getWritableDeferred(() => {
                called++;
                return "hello darkness";
            });

            // Set value before it's accessed
            (deferredValue as any).v = "my old friend";
            assert.equal(called, 0); // Callback should not be called
            assert.equal(deferredValue.v, "my old friend");
            assert.equal(called, 0); // Callback still not called
        });

        it("validate callback is not called until accessed", () => {
            let called = 0;
            let deferredValue = getWritableDeferred(() => {
                called++;
                return "hello darkness";
            });

            assert.equal(called, 0);
            assert.equal(deferredValue.v, "hello darkness");
            assert.equal(called, 1);
            assert.equal(deferredValue.v, "hello darkness");
            assert.equal(called, 1);
        });

        it("validate callback is not called until accessed - with arguments", () => {
            let called = 0;
            let deferredValue = getWritableDeferred((a: number, b: number) => {
                called++;
                return a + b;
            }, [10, 20]);

            assert.equal(called, 0);
            assert.equal(deferredValue.v, 30);
            assert.equal(called, 1);
            assert.equal(deferredValue.v, 30);
            assert.equal(called, 1);
        });

        it("validate changing value after initial access", () => {
            let called = 0;
            let deferredValue = getWritableDeferred(() => {
                called++;
                return "hello darkness";
            });

            assert.equal(called, 0);
            assert.equal(deferredValue.v, "hello darkness");
            assert.equal(called, 1);
            
            // Change the value
            (deferredValue as any).v = "my old friend";
            assert.equal(deferredValue.v, "my old friend");
            assert.equal(called, 1); // Callback should not be called again
        });

        it("validate with object arguments", () => {
            interface TestObj {
                id: number;
                name: string;
            }
            
            let obj: TestObj = { id: 1, name: "test" };
            let deferredValue = getWritableDeferred((input: any) => {
                return `${input.id}-${input.name}`;
            }, [obj]);
            
            assert.equal(deferredValue.v, "1-test");
        });

        it("validate with function arguments", () => {
            let fnCalled = 0;
            let fn = () => {
                fnCalled++;
                return "hello darkness";
            };
            
            let deferredValue = getWritableDeferred((callback: any) => {
                return callback();
            }, [fn]);
            
            assert.equal(deferredValue.v, "hello darkness");
            assert.equal(fnCalled, 1);
        });

        it("validate callback with error", () => {
            let called = 0;
            let deferredValue = getWritableDeferred(() => {
                called++;
                throw new Error("hello darkness");
            });

            assert.equal(called, 0);
            assert.throws(() => deferredValue.v);
            assert.equal(called, 1);
            assert.throws(() => deferredValue.v);
            assert.equal(called, 2); // Error not cached, callback called again
            
            // Set a value to prevent further errors
            (deferredValue as any).v = "my old friend";
            assert.equal(deferredValue.v, "my old friend");
            assert.equal(called, 2); // No additional calls
        });

        it("validate json serialization", () => {
            let deferredValue = getWritableDeferred(() => {
                return { greeting: "hello", target: "darkness" };
            });
            
            assert.equal(JSON.stringify(deferredValue), "{\"greeting\":\"hello\",\"target\":\"darkness\"}");
            
            // Change the value and check serialization again
            (deferredValue as any).v = { greeting: "hi", target: "friend" };
            assert.equal(JSON.stringify(deferredValue), "{\"greeting\":\"hi\",\"target\":\"friend\"}");
        });

        it("validate with primitive types", () => {
            const numValue = getWritableDeferred(() => 42);
            assert.strictEqual(numValue.v, 42);
            (numValue as any).v = 100;
            assert.strictEqual(numValue.v, 100);
            
            const boolValue = getWritableDeferred(() => true);
            assert.strictEqual(boolValue.v, true);
            (boolValue as any).v = false;
            assert.strictEqual(boolValue.v, false);
        });

        it("validate with object types", () => {
            type TestObject = {a: number; b?: number; c?: number};
            
            const objValue = getWritableDeferred(() => ({ a: 1, b: 2 } as TestObject));
            assert.deepEqual(objValue.v, { a: 1, b: 2 });
            (objValue as any).v = { a: 3, c: 4 };
            assert.deepEqual(objValue.v, { a: 3, c: 4 });
        });

        it("validate with array types", () => {
            const arrValue = getWritableDeferred(() => [1, 2, 3]);
            assert.deepEqual(arrValue.v, [1, 2, 3]);
            (arrValue as any).v = [4, 5, 6];
            assert.deepEqual(arrValue.v, [4, 5, 6]);
        });

        it("validate with safe function - successful execution", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getWritableDeferred(() => {
                return safe((value: any) => {
                    return JSON.parse(value);
                }, ["{ \"hello\": \"darkness\" }"]);
            });
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
            
            // Update with a new safe result
            const newSafeResult = safe((value: any) => {
                return JSON.parse(value);
            }, ["{ \"greeting\": \"hello\" }"]);
            
            (deferredValue as any).v = newSafeResult;
            assert.isUndefined(deferredValue.v.e);
            assert.deepEqual(deferredValue.v.v, { greeting: "hello" });
        });

        it("validate with safe function and arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getWritableDeferred((jsonStr: string) => {
                return safe((value: any) => {
                    return JSON.parse(value);
                }, [jsonStr]);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]);
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });
});
