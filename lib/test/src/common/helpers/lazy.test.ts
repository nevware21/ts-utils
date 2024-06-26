/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { getLazy, getWritableLazy, setBypassLazyCache } from "../../../../src/helpers/lazy";


describe("check readonly lazy caching", () => {

    it("Check lazy", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(false);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        lazyValue = "Darkness";

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check bypass lazy before creation", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(true);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        lazyValue = "Darkness";
        assert.equal(value.v, "Darkness", "checking the initial value");
        assert.equal(2, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check bypass lazy after creation", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(false);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        setBypassLazyCache(true);
        lazyValue = "Darkness";

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check disabling bypass lazy after creating with bypass enabled", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(true);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        setBypassLazyCache(false);

        // The first access after restoring caching will still bypass
        lazyValue = "Darkness";
        assert.equal(value.v, "Darkness", "checking the initial value");
        assert.equal(2, lazyCalled, "Check that the lazy function was only called once");

        // But subsequent requests would still return the last cached value
        lazyValue = "My";
        assert.equal(value.v, "Darkness", "checking the initial value");
        assert.equal(2, lazyCalled, "Check that the lazy function was only called once");
    });
});

describe("check writable lazy caching", () => {

    it("Check lazy", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getWritableLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(false);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        lazyValue = "Darkness";

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        value.v = lazyValue;
        assert.equal(value.v, "Darkness", "checking the updated value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check setting before lazy", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getWritableLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(false);

        value.v = "my old friend";

        assert.equal(value.v, "my old friend", "checking the updated value");
        assert.equal(0, lazyCalled, "Check that the lazy function was only called once");

        lazyValue = "Darkness";

        assert.equal(value.v, "my old friend", "checking the initial value");
        assert.equal(0, lazyCalled, "Check that the lazy function was only called once");

        value.v = lazyValue;
        assert.equal(value.v, "Darkness", "checking the updated value");
        assert.equal(0, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check bypass lazy before creation", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getWritableLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(true);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        lazyValue = "Darkness";
        assert.equal(value.v, "Darkness", "checking the initial value");
        assert.equal(2, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check bypass lazy after creation", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getWritableLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(false);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        setBypassLazyCache(true);
        lazyValue = "Darkness";

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check disabling bypass lazy after creating with bypass enabled", () => {
        let lazyCalled = 0;
        let lazyValue = "Hello";

        let value = getWritableLazy(() => {
            lazyCalled++;
            return lazyValue;
        });

        setBypassLazyCache(true);

        assert.equal(value.v, "Hello", "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        setBypassLazyCache(false);

        // The first access after restoring caching will still bypass
        lazyValue = "Darkness";
        assert.equal(value.v, "Darkness", "checking the initial value");
        assert.equal(2, lazyCalled, "Check that the lazy function was only called once");

        // But subsequent requests would still return the last cached value
        lazyValue = "My";
        assert.equal(value.v, "Darkness", "checking the initial value");
        assert.equal(2, lazyCalled, "Check that the lazy function was only called once");
    });
});
