import { assert } from "@nevware21/tripwire-chai";
import { safeGetLazy } from "../../../../src/helpers/safe_lazy";
import { ILazyValue } from "../../../../src/helpers/lazy";
import { safeGetWritableLazy } from "../../../../src/helpers/safe_lazy";

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