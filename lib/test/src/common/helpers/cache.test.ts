/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createCachedValue, createDeferredCachedValue, getDeferred, getWritableDeferred, ICachedValue } from "../../../../src/helpers/cache";
import { ISafeReturn, safe } from "../../../../src/helpers/safe";

describe("cache helpers", () => {
    describe("createCachedValue", () => {
        it("validate value", () => {
            let cachedValue = createCachedValue("hello darkness");
            assert.equal(cachedValue.v, "hello darkness");
        });

        it("validate readonly", () => {
            let cachedValue = createCachedValue("hello darkness");
            assert.throws(() => {
                (cachedValue as any).v = "my old friend";
            });
        });

        it("validate json", () => {
            let cachedValue = createCachedValue("hello darkness");
            assert.equal(JSON.stringify(cachedValue), "\"hello darkness\"");

            let cachedValue2 = createCachedValue({ hello: "darkness" });
            assert.equal(JSON.stringify(cachedValue2), "{\"hello\":\"darkness\"}");
        });

        it("validate numeric value", () => {
            let cachedValue = createCachedValue(42);
            assert.equal(cachedValue.v, 42);
        });

        it("validate object value", () => {
            let cachedValue = createCachedValue({ hello: "darkness" });
            assert.deepEqual(cachedValue.v, { hello: "darkness" });
        });

        it("validate array value", () => {
            let cachedValue = createCachedValue([1, 2, 3]);
            assert.deepEqual(cachedValue.v, [1, 2, 3]);
        });

        it("validate boolean value", () => {
            let cachedValue = createCachedValue(true);
            assert.equal(cachedValue.v, true);
        });

        it("validate null value", () => {
            let cachedValue = createCachedValue(null);
            assert.equal(cachedValue.v, null);
        });

        it("validate undefined value", () => {
            let cachedValue = createCachedValue(undefined);
            assert.equal(cachedValue.v, undefined);
        });

        it("validate date value", () => {
            let cachedValue = createCachedValue(new Date());
            assert.equal(cachedValue.v instanceof Date, true);
        });

        it("validate function value", () => {
            let cachedValue = createCachedValue(() => { });
            assert.equal(typeof cachedValue.v, "function");
        });

        it("validate symbol value", () => {
            let cachedValue = createCachedValue(Symbol("hello darkness"));
            assert.equal(typeof cachedValue.v, "symbol");
        });

        it("validate bigint value", () => {
            let cachedValue = createCachedValue(BigInt(42));
            assert.equal(typeof cachedValue.v, "bigint");
        });
    });
    
    describe("createDeferredCacheValue", () => {
        it("validate value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => "hello darkness");
            assert.equal(deferredCacheValue.v, "hello darkness");
        });

        it("validate readonly", () => {
            let deferredCacheValue = createDeferredCachedValue(() => "hello darkness");
            assert.throws(() => {
                (deferredCacheValue as any).v = "my old frield";
            });
        });

        it("validate json", () => {
            let deferredCacheValue = createDeferredCachedValue(() => "hello darkness");
            assert.equal(JSON.stringify(deferredCacheValue), "\"hello darkness\"");
        });

        it("validate numeric value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => 42);
            assert.equal(deferredCacheValue.v, 42);
        });

        it("validate object value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => ({ hello: "darkness" }));
            assert.deepEqual(deferredCacheValue.v, { hello: "darkness" });
        });

        it("validate object json", () => {
            let deferredCacheValue = createDeferredCachedValue(() => ({ hello: "darkness" }));
            assert.equal(JSON.stringify(deferredCacheValue), "{\"hello\":\"darkness\"}");
        });

        it("validate array value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => [1, 2, 3]);
            assert.deepEqual(deferredCacheValue.v, [1, 2, 3]);
        });

        it("validate array json", () => {
            let deferredCacheValue = createDeferredCachedValue(() => [1, 2, 3]);
            assert.equal(JSON.stringify(deferredCacheValue), "[1,2,3]");
        });

        it("validate boolean value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => true);
            assert.equal(deferredCacheValue.v, true);
        });

        it("validate null value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => null as any);
            assert.equal(deferredCacheValue.v, null);
        });

        it("validate undefined value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => undefined as any);
            assert.equal(deferredCacheValue.v, undefined);
        });

        it("validate date value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => new Date());
            assert.equal(deferredCacheValue.v instanceof Date, true);
        });

        it("validate function value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => () => { });
            assert.equal(typeof deferredCacheValue.v, "function");
        });

        it("validate symbol value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => Symbol("hello darkness"));
            assert.equal(typeof deferredCacheValue.v, "symbol");
        });

        it("validate bigint value", () => {
            let deferredCacheValue = createDeferredCachedValue(() => BigInt(42));
            assert.equal(typeof deferredCacheValue.v, "bigint");
        });

        it("validate callback is not called until accessed", () => {
            let called = 0;
            let deferredCacheValue = createDeferredCachedValue(() => {
                called++;
                return "hello darkness";
            });

            assert.equal(called, 0);
            assert.equal(deferredCacheValue.v, "hello darkness");
            assert.equal(called, 1);
            assert.equal(deferredCacheValue.v, "hello darkness");
            assert.equal(called, 1);
        });

        it("validate callback is not called until accessed - with error", () => {
            let called = 0;
            let deferredCacheValue = createDeferredCachedValue(() => {
                called++;
                throw new Error("hello darkness");
            });

            assert.equal(called, 0);
            assert.throws(() => deferredCacheValue.v);
            assert.equal(called, 1);
            assert.throws(() => deferredCacheValue.v);
            assert.equal(called, 2);
        });

        it("validate with arguments", () => {
            let deferredCacheValue = (createDeferredCachedValue as typeof getDeferred)((prefix: string, suffix: string) => {
                return prefix + " darkness " + suffix;
            }, ["hello", "my old friend"]);
            
            assert.equal(deferredCacheValue.v, "hello darkness my old friend");
        });

        it("validate with object argument", () => {
            interface TestObj {
                id: number;
                name: string;
            }
            
            let obj: TestObj = { id: 1, name: "test" };
            let deferredCacheValue = (createDeferredCachedValue as typeof getDeferred)((input: typeof obj) => {
                return `${input.id}-${input.name}`;
            }, [obj]);
            
            assert.equal(deferredCacheValue.v, "1-test");
        });

        it("validate with function argument", () => {
            let fnCalled = 0;
            let fn = () => {
                fnCalled++;
                return "hello darkness";
            };
            
            let deferredCacheValue = (createDeferredCachedValue as typeof getDeferred)((callback: any) => {
                return callback();
            }, [fn]);
            
            assert.equal(deferredCacheValue.v, "hello darkness");
            assert.equal(fnCalled, 1);
        });

        it("validate with safe function - successful execution", () => {
            let deferredCacheValue = createDeferredCachedValue(() => {
                return safe((value: any) => {
                    return JSON.parse(value);
                }, ["{ \"hello\": \"darkness\" }"]);
            });
            
            let result = deferredCacheValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
        });

        it("validate with safe function - error handling", () => {
            let deferredCacheValue = createDeferredCachedValue(() => {
                return safe((value: any) => {
                    return JSON.parse(value);
                }, ["{ invalid: json }"]);
            });
            
            let result = deferredCacheValue.v;
            assert.isTrue(!!result.e);
            assert.equal(result.e instanceof SyntaxError, true);
            assert.isUndefined(result.v);
        });

        it("validate with safe function and arguments", () => {
            let deferredCacheValue: ICachedValue<ISafeReturn<any>> = getDeferred((jsonStr: string) => {
                return safe((value: any) => {
                    return JSON.parse(value);
                }, [jsonStr]);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]);
            
            let result = deferredCacheValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });

    describe("getDeferred", () => {
        it("validate value with no arguments", () => {
            let deferredValue = getDeferred(() => "hello darkness");
            assert.equal(deferredValue.v, "hello darkness");
        });

        it("validate value with arguments", () => {
            let deferredValue = getDeferred((prefix: string, suffix: string) => {
                return prefix + " darkness " + suffix;
            }, ["hello", "my old friend"]);
            
            assert.equal(deferredValue.v, "hello darkness my old friend");
        });

        it("validate readonly", () => {
            let deferredValue = getDeferred(() => "hello darkness");
            assert.throws(() => {
                (deferredValue as any).v = "my old friend";
            });
        });

        it("validate callback is not called until accessed", () => {
            let called = 0;
            let deferredValue = getDeferred(() => {
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
            let deferredValue = getDeferred((a: number, b: number) => {
                called++;
                return a + b;
            }, [10, 20]);

            assert.equal(called, 0);
            assert.equal(deferredValue.v, 30);
            assert.equal(called, 1);
            assert.equal(deferredValue.v, 30);
            assert.equal(called, 1);
        });

        it("validate with object arguments", () => {
            interface TestObj {
                id: number;
                name: string;
            }
            
            let obj: TestObj = { id: 1, name: "test" };
            let deferredValue = getDeferred((input: any) => {
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
            
            let deferredValue = getDeferred((callback: any) => {
                return callback();
            }, [fn]);
            
            assert.equal(deferredValue.v, "hello darkness");
            assert.equal(fnCalled, 1);
        });

        it("validate callback with error", () => {
            let called = 0;
            let deferredValue = getDeferred(() => {
                called++;
                throw new Error("hello darkness");
            });

            assert.equal(called, 0);
            assert.throws(() => deferredValue.v);
            assert.equal(called, 1);
            assert.throws(() => deferredValue.v);
            assert.equal(called, 2);
        });

        it("validate with safe function - successful execution", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(() => {
                return safe((value: string) => {
                    return JSON.parse(value);
                }, ["{ \"hello\": \"darkness\" }"]);
            });
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
        });

        it("validate with safe function - error handling", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(() => {
                return safe((value: string) => {
                    return JSON.parse(value);
                }, ["{ invalid: json }"]);
            });
            
            let result = deferredValue.v;
            assert.isTrue(!!result.e);
            assert.equal(result.e instanceof SyntaxError, true);
            assert.isUndefined(result.v);
        });

        it("validate with safe function and arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred((jsonStr: string) => {
                return safe((value: string) => {
                    return JSON.parse(value);
                }, [jsonStr]);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]);
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });

    describe("getDeferred inline safe", () => {
        it("validate value with no arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [() => "hello darkness"]);
            assert.equal(deferredValue.v.v, "hello darkness");
        });

        it("validate value with arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [((prefix: string, suffix: string) => {
                return prefix + " darkness " + suffix;
            }) as (...args: unknown[]) => any, ["hello", "my old friend"]]);
            
            assert.equal(deferredValue.v.v, "hello darkness my old friend");
        });

        it("validate readonly", () => {
            let deferredValue = getDeferred(safe, [() => "hello darkness"]);
            assert.throws(() => {
                (deferredValue as any).v = { v: "my old friend" };
            });
        });

        it("validate callback is not called until accessed", () => {
            let called = 0;
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [() => {
                called++;
                return "hello darkness";
            }]);

            assert.equal(called, 0);
            assert.equal(deferredValue.v.v, "hello darkness");
            assert.equal(called, 1);
            assert.equal(deferredValue.v.v, "hello darkness");
            assert.equal(called, 1);
        });

        it("validate callback is not called until accessed - with arguments", () => {
            let called = 0;
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [(a: number, b: number) => {
                called++;
                return a + b;
            }, [10, 20]]);

            assert.equal(called, 0);
            assert.equal(deferredValue.v.v, 30);
            assert.equal(called, 1);
            assert.equal(deferredValue.v.v, 30);
            assert.equal(called, 1);
        });

        it("validate with object arguments", () => {
            interface TestObj {
                id: number;
                name: string;
            }
            
            let obj: TestObj = { id: 1, name: "test" };
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [(input: any) => {
                return `${input.id}-${input.name}`;
            }, [obj]]);
            
            assert.equal(deferredValue.v.v, "1-test");
        });

        it("validate with function arguments", () => {
            let fnCalled = 0;
            let fn = () => {
                fnCalled++;
                return "hello darkness";
            };
            
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [(callback: any) => {
                return callback();
            }, [fn]] as any);
            
            assert.equal(deferredValue.v.v, "hello darkness");
            assert.equal(fnCalled, 1);
        });

        it("validate callback with error", () => {
            let called = 0;
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [() => {
                called++;
                throw new Error("hello darkness");
            }]);

            assert.equal(called, 0);
            assert.isTrue(!!deferredValue.v.e);
            assert.equal(called, 1);
            assert.isTrue(!!deferredValue.v.e);
            assert.equal(called, 1);
        });

        it("validate with safe function - successful execution", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [(value: string) => {
                return JSON.parse(value);
            }, ["{ \"hello\": \"darkness\" }"]]);
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
        });

        it("validate with safe function - error handling", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [(value: string) => {
                return JSON.parse(value);
            }, ["{ invalid: json }"]]);
            
            let result = deferredValue.v;
            assert.isTrue(!!result.e);
            assert.equal(result.e instanceof SyntaxError, true);
            assert.isUndefined(result.v);
        });

        it("validate with safe function and arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(safe, [(value: string) => {
                return JSON.parse(value);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]]);
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });
    
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
            deferredValue.v = "my old friend";
            assert.equal(deferredValue.v, "my old friend");
        });

        it("validate changing value before initial access", () => {
            let called = 0;
            let deferredValue = getWritableDeferred(() => {
                called++;
                return "hello darkness";
            });

            // Set value before it's accessed
            deferredValue.v = "my old friend";
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
            deferredValue.v = "my old friend";
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
            let deferredValue = getWritableDeferred<string>(() => {
                called++;
                throw new Error("hello darkness");
            });

            assert.equal(called, 0);
            assert.throws(() => deferredValue.v);
            assert.equal(called, 1);
            assert.throws(() => deferredValue.v);
            assert.equal(called, 2); // Error not cached, callback called again
            
            // Set a value to prevent further errors
            deferredValue.v = "my old friend";
            assert.equal(deferredValue.v, "my old friend");
            assert.equal(called, 2); // No additional calls
        });

        it("validate json serialization", () => {
            let deferredValue = getWritableDeferred(() => {
                return { greeting: "hello", target: "darkness" };
            });
            
            assert.equal(JSON.stringify(deferredValue), "{\"greeting\":\"hello\",\"target\":\"darkness\"}");
            
            // Change the value and check serialization again
            deferredValue.v = { greeting: "hi", target: "friend" };
            assert.equal(JSON.stringify(deferredValue), "{\"greeting\":\"hi\",\"target\":\"friend\"}");
        });

        it("validate with primitive types", () => {
            const numValue = getWritableDeferred(() => 42);
            assert.strictEqual(numValue.v, 42);
            numValue.v = 100;
            assert.strictEqual(numValue.v, 100);
            
            const boolValue = getWritableDeferred(() => true);
            assert.strictEqual(boolValue.v, true);
            boolValue.v = false;
            assert.strictEqual(boolValue.v, false);
        });

        it("validate with object types", () => {
            const objValue = getWritableDeferred<any>(() => ({ a: 1, b: 2 }));
            assert.deepEqual(objValue.v, { a: 1, b: 2 });
            objValue.v = { a: 3, c: 4 };
            assert.deepEqual(objValue.v, { a: 3, c: 4 });
        });

        it("validate with array types", () => {
            const arrValue = getWritableDeferred(() => [1, 2, 3]);
            assert.deepEqual(arrValue.v, [1, 2, 3]);
            arrValue.v = [4, 5, 6];
            assert.deepEqual(arrValue.v, [4, 5, 6]);
        });

        it("validate with safe function - successful execution", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getWritableDeferred(() => {
                return safe((value: string) => {
                    return JSON.parse(value);
                }, ["{ \"hello\": \"darkness\" }"]);
            });
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
            
            // Update with a new safe result
            const newSafeResult = safe((value: string) => {
                return JSON.parse(value);
            }, ["{ \"greeting\": \"hello\" }"]);
            
            deferredValue.v = newSafeResult;
            assert.isUndefined(deferredValue.v.e);
            assert.deepEqual(deferredValue.v.v, { greeting: "hello" });
        });

        it("validate with safe function and arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getWritableDeferred((jsonStr: string) => {
                return safe((value: string) => {
                    return JSON.parse(value);
                }, [jsonStr]);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]);
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });
});