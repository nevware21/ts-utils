/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2024 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { createDeferredCachedValue, getDeferred, ICachedValue } from "../../../../src/helpers/cache";
import { ISafeReturn, safe } from "../../../../src/helpers/safe";

describe("cache helpers additional tests", () => {
    describe("createDeferredCachedValue with additional tests", () => {
        it("validate with arguments", () => {
            let deferredCacheValue = (createDeferredCachedValue as any)(function(prefix: string, suffix: string) {
                return prefix + " darkness " + suffix;
            }, ["hello", "my old friend"]);
            
            assert.equal(deferredCacheValue.v, "hello darkness my old friend");
        });

        it("validate with object argument", () => {
            interface TestObj {
                id: number;
                name: string;
            }
            
            let obj = { id: 1, name: "test" };
            let deferredCacheValue = (createDeferredCachedValue as any)(function(input: TestObj) {
                return `${input.id}-${input.name}`;
            }, [obj]);
            
            assert.equal(deferredCacheValue.v, "1-test");
        });

        it("validate with function argument", () => {
            let fnCalled = 0;
            let fn = function() {
                fnCalled++;
                return "hello darkness";
            };
            
            let deferredCacheValue = (createDeferredCachedValue as any)(function(callback: () => string) {
                return callback();
            }, [fn]);
            
            assert.equal(deferredCacheValue.v, "hello darkness");
            assert.equal(fnCalled, 1);
        });

        it("validate with safe function - successful execution", () => {
            let deferredCacheValue = createDeferredCachedValue(function() {
                return safe(function(value: string) {
                    return JSON.parse(value);
                }, ["{ \"hello\": \"darkness\" }"]);
            });
            
            let result = deferredCacheValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
        });

        it("validate with safe function - error handling", () => {
            let deferredCacheValue = createDeferredCachedValue(function() {
                return safe(function(value: string) {
                    return JSON.parse(value);
                }, ["{ invalid: json }"]);
            });
            
            let result = deferredCacheValue.v;
            assert.isTrue(!!result.e);
            assert.isTrue(result.e instanceof SyntaxError);
            assert.isUndefined(result.v);
        });

        it("validate with safe function and arguments", () => {
            let deferredCacheValue = (createDeferredCachedValue as any)(function(jsonStr: string) {
                return safe(function(value: string) {
                    return JSON.parse(value);
                }, [jsonStr]);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]);
            
            let result = deferredCacheValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });

    describe("getDeferred with additional tests", () => {
        it("validate with safe function - successful execution", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(function() {
                return safe(function(value: string) {
                    return JSON.parse(value);
                }, ["{ \"hello\": \"darkness\" }"]);
            });
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { hello: "darkness" });
        });

        it("validate with safe function - error handling", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(function() {
                return safe(function(value: string) {
                    return JSON.parse(value);
                }, ["{ invalid: json }"]);
            });
            
            let result = deferredValue.v;
            assert.isTrue(!!result.e);
            assert.isTrue(result.e instanceof SyntaxError);
            assert.isUndefined(result.v);
        });

        it("validate with safe function and arguments", () => {
            let deferredValue: ICachedValue<ISafeReturn<any>> = getDeferred(function(jsonStr: string) {
                return safe(function(value: string) {
                    return JSON.parse(value);
                }, [jsonStr]);
            }, ["{ \"greeting\": \"hello\", \"target\": \"darkness\" }"]);
            
            let result = deferredValue.v;
            assert.isUndefined(result.e);
            assert.deepEqual(result.v, { greeting: "hello", target: "darkness" });
        });
    });
});
