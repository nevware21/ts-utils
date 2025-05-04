import { assert } from "@nevware21/tripwire-chai";
import { safeGetLazy, safeGetWritableLazy, safeGetDeferred, safeGetWritableDeferred } from "../../../../src/helpers/safe_lazy";
import { ILazyValue } from "../../../../src/helpers/lazy";
import { ICachedValue } from "../../../../src/helpers/cache";

describe("safeGetLazy", () => {
    it("should return the cached value on multiple accesses", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetLazy(() => {
            called++;
            return 42;
        }, 0);

        assert.equal(lazyValue.v, 42);
        assert.equal(lazyValue.v ,42);
        assert.equal(called, 1);
    });

    it("should return the default value if the callback throws", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetLazy(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
    });

    it("should not call the callback until the value is accessed", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetLazy(() => {
            called++;
            return 42;
        }, 0);
        assert.equal(called, 0);
        assert.equal(lazyValue.v, 42);
        assert.equal(called, 1);
        assert.equal(lazyValue.v, 42);
        assert.equal(called, 1);
    });

    it("should return the same instance on multiple accesses", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetLazy(() => {
            called++;
            return 42;
        }, 0);
        const firstAccess = lazyValue.v;
        const secondAccess = lazyValue.v;

        assert.equal(firstAccess, secondAccess);
        assert.equal(called, 1);
    });

    it("should return the default if the callback throws", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetLazy(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
    });
});

describe("safeGetWritableLazy", () => {
    it("should return the cached value on multiple accesses", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetWritableLazy(() => {
            called++;
            return 42;
        }, 0);

        assert.equal(lazyValue.v, 42);
        assert.equal(lazyValue.v, 42);
        assert.equal(called, 1);
    });

    it("should return the default value if the callback throws", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetWritableLazy(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
    });

    it("should not call the callback until the value is accessed", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetWritableLazy(() => {
            called++;
            return 42;
        }, 0);

        assert.equal(called, 0);
        assert.equal(lazyValue.v, 42);
        assert.equal(called, 1);
    });

    it("should return the same instance on multiple accesses", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetWritableLazy(() => {
            called++;
            return 42;
        }, 0);

        const firstAccess = lazyValue.v;
        const secondAccess = lazyValue.v;

        assert.equal(firstAccess, secondAccess);
        assert.equal(called, 1);
    });

    it("should allow changing the cached value", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetWritableLazy(() => {
            called++;
            return 42;
        }, 0);

        assert.equal(lazyValue.v, 42);
        assert.equal(called, 1);
        lazyValue.v = 100;
        assert.equal(lazyValue.v, 100);
        assert.equal(called, 1);
    });
    
    it("should return the default if the callback throws", () => {
        let called = 0;
        const lazyValue: ILazyValue<number> = safeGetWritableLazy(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
        assert.equal(lazyValue.v, 0);
        assert.equal(called, 1);
    });
});

describe("safeGetDeferred", () => {
    it("should return the cached value on multiple accesses", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetDeferred(() => {
            called++;
            return 42;
        }, 0);

        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
    });

    it("should return the default value if the callback throws", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetDeferred(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.strictEqual(cachedValue.v, 0);
        assert.strictEqual(called, 1);
        assert.strictEqual(cachedValue.v, 0);
        assert.strictEqual(called, 1);
    });

    it("should not call the callback until the value is accessed", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetDeferred(() => {
            called++;
            return 42;
        }, 0);
        
        assert.strictEqual(called, 0);
        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
    });

    it("should return the same instance on multiple accesses", () => {
        let called = 0;
        const cachedValue: ICachedValue<object> = safeGetDeferred(() => {
            called++;
            return { value: 42 };
        }, { value: 0 });

        const firstAccess = cachedValue.v;
        const secondAccess = cachedValue.v;

        assert.strictEqual(firstAccess, secondAccess);
        assert.strictEqual(called, 1);
    });

    it("should support passing arguments to the callback", () => {
        let called = 0;
        const cachedValue = safeGetDeferred((a: number, b: number) => {
            called++;
            return a + b;
        }, 0, [20, 22]);

        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
    });

    it("should work with JSON serialization", () => {
        const cachedValue = safeGetDeferred(() => {
            return { name: "test", value: 42 };
        }, { name: "default", value: 0 });

        const json = JSON.stringify(cachedValue);
        assert.strictEqual(json, "{\"name\":\"test\",\"value\":42}");
    });
});

describe("safeGetWritableDeferred", () => {
    it("should return the cached value on multiple accesses", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetWritableDeferred(() => {
            called++;
            return 42;
        }, 0);

        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
    });

    it("should return the default value if the callback throws", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetWritableDeferred(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.strictEqual(cachedValue.v, 0);
        assert.strictEqual(called, 1);
        assert.strictEqual(cachedValue.v, 0);
        assert.strictEqual(called, 1);
    });

    it("should not call the callback until the value is accessed", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetWritableDeferred(() => {
            called++;
            return 42;
        }, 0);
        
        assert.strictEqual(called, 0);
        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
    });

    it("should return the same instance on multiple accesses", () => {
        let called = 0;
        const cachedValue: ICachedValue<object> = safeGetWritableDeferred(() => {
            called++;
            return { value: 42 };
        }, { value: 0 });

        const firstAccess = cachedValue.v;
        const secondAccess = cachedValue.v;

        assert.strictEqual(firstAccess, secondAccess);
        assert.strictEqual(called, 1);
    });

    it("should support passing arguments to the callback", () => {
        let called = 0;
        const cachedValue = safeGetWritableDeferred((a: number, b: number) => {
            called++;
            return a + b;
        }, 0, [20, 22]);

        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
    });

    it("should work with JSON serialization", () => {
        const cachedValue = safeGetWritableDeferred(() => {
            return { name: "test", value: 42 };
        }, { name: "default", value: 0 });

        const json = JSON.stringify(cachedValue);
        assert.strictEqual(json, "{\"name\":\"test\",\"value\":42}");
    });

    it("should allow changing the cached value", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetWritableDeferred(() => {
            called++;
            return 42;
        }, 0);

        assert.strictEqual(cachedValue.v, 42);
        assert.strictEqual(called, 1);
        
        // Change the value - note we need to use a cast since the ICachedValue interface doesn't expose setting
        (cachedValue as any).v = 100;
        assert.strictEqual(cachedValue.v, 100);
        assert.strictEqual(called, 1);
    });
    
    it("should allow changing the cached value before accessing", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetWritableDeferred(() => {
            called++;
            return 42;
        }, 0);

        // Set value before it's accessed
        (cachedValue as any).v = 100;
        assert.strictEqual(called, 0); // Callback should not be called
        assert.strictEqual(cachedValue.v, 100);
        assert.strictEqual(called, 0); // Callback still not called
    });

    it("should allow changing object properties", () => {
        let called = 0;
        const cachedValue: ICachedValue<{a: number, b: number}> = safeGetWritableDeferred(() => {
            called++;
            return { a: 1, b: 2 };
        }, { a: 0, b: 0 });

        assert.deepEqual(cachedValue.v, { a: 1, b: 2 });
        assert.strictEqual(called, 1);
        
        // Change the value
        (cachedValue as any).v = { a: 3, b: 4 };
        assert.deepEqual(cachedValue.v, { a: 3, b: 4 });
        assert.strictEqual(called, 1);
    });
    
    it("should work with changing cached errors", () => {
        let called = 0;
        const cachedValue: ICachedValue<number> = safeGetWritableDeferred(() => {
            called++;
            throw new Error("Test error");
        }, 0);

        assert.strictEqual(cachedValue.v, 0);
        assert.strictEqual(called, 1);
        
        // Set value to override the default error result
        (cachedValue as any).v = 100;
        assert.strictEqual(cachedValue.v, 100);
        assert.strictEqual(called, 1);
    });
});