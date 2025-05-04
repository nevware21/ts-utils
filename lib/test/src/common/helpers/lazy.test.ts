/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
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

    it("Check lazy with arguments", () => {
        let lazyCalled = 0;
        
        let value = getLazy((prefix: string, suffix: string) => {
            lazyCalled++;
            return prefix + " World " + suffix;
        }, ["Hello", "!"]);

        setBypassLazyCache(false);

        assert.equal(value.v, "Hello World !", "checking the initial value with arguments");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        // Value should be cached and not change even if function would return something different
        assert.equal(value.v, "Hello World !", "value should be cached and not change");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check lazy with multiple arguments", () => {
        let lazyCalled = 0;
        
        let value = getLazy((a: number, b: number, c: number) => {
            lazyCalled++;
            return a + b + c;
        }, [10, 20, 30]);

        setBypassLazyCache(false);

        assert.equal(value.v, 60, "checking the initial value with multiple arguments");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        // Value should be cached and not change even if function would return something different
        assert.equal(value.v, 60, "value should be cached and not change");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check bypass lazy before creation with arguments", () => {
        let lazyCalled = 0;
        let multiplier = 2;

        let value = getLazy((num: number) => {
            lazyCalled++;
            return num * multiplier;
        }, [10]);

        setBypassLazyCache(true);

        assert.equal(value.v, 20, "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was called once");

        multiplier = 3;
        assert.equal(value.v, 30, "checking the updated value when bypassing cache");
        assert.equal(2, lazyCalled, "Check that the lazy function was called again");
    });    it("Check bypass lazy after creation", () => {
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
        assert.equal(2, lazyCalled, "Check that the lazy function was called again");
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

    it("Check edge cases with argument types", () => {
        // Test with a complex object
        interface TestObj {
            id: number;
            name: string;
        }
        let obj = { id: 1, name: "test" };
        let objLazy = getLazy<string, (input: TestObj) => string>((input) => {
            return input.id + "-" + input.name;
        }, [obj]);
        
        assert.equal(objLazy.v, "1-test", "should handle object arguments correctly");
        
        // Test with a function argument
        let fnCalled = 0;
        let fn = () => {
            fnCalled++;
            return "called";
        };
        
        let fnLazy = getLazy<string, (callback: () => string) => string>((callback) => {
            return callback();
        }, [fn]);
        
        assert.equal(fnLazy.v, "called", "should handle function arguments correctly");
        assert.equal(fnCalled, 1, "callback should be called once");
        
        // Accessing again shouldn't call the function again
        assert.equal(fnLazy.v, "called", "should cache result");
        assert.equal(fnCalled, 1, "callback shouldn't be called again");
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

    it("Check lazy with arguments", () => {
        let lazyCalled = 0;
        
        let value = getWritableLazy((prefix: string, suffix: string) => {
            lazyCalled++;
            return prefix + " World " + suffix;
        }, ["Hello", "!"]);

        setBypassLazyCache(false);

        assert.equal(value.v, "Hello World !", "checking the initial value with arguments");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        // Value should be cached and not change even if function would return something different
        assert.equal(value.v, "Hello World !", "value should be cached and not change");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        // Test setting the value directly
        value.v = "Goodbye World!";
        assert.equal(value.v, "Goodbye World!", "checking the updated value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check lazy with multiple arguments", () => {
        let lazyCalled = 0;
        
        let value = getWritableLazy((a: number, b: number, c: number) => {
            lazyCalled++;
            return a + b + c;
        }, [10, 20, 30]);

        setBypassLazyCache(false);

        assert.equal(value.v, 60, "checking the initial value with multiple arguments");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        // Value should be cached and not change even if function would return something different
        assert.equal(value.v, 60, "value should be cached and not change");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");

        // Test setting the value directly
        value.v = 100;
        assert.equal(value.v, 100, "checking the updated value");
        assert.equal(1, lazyCalled, "Check that the lazy function was only called once");
    });

    it("Check setting before lazy with arguments", () => {
        let lazyCalled = 0;
        
        let value = getWritableLazy((a: number, b: number) => {
            lazyCalled++;
            return a * b;
        }, [5, 6]);

        setBypassLazyCache(false);

        value.v = 42;

        assert.equal(value.v, 42, "checking the updated value");
        assert.equal(0, lazyCalled, "Check that the lazy function was never called");
    });

    it("Check bypass lazy before creation with arguments", () => {
        let lazyCalled = 0;
        let multiplier = 2;

        let value = getWritableLazy((num: number) => {
            lazyCalled++;
            return num * multiplier;
        }, [10]);

        setBypassLazyCache(true);

        assert.equal(value.v, 20, "checking the initial value");
        assert.equal(1, lazyCalled, "Check that the lazy function was called once");

        multiplier = 3;
        assert.equal(value.v, 30, "checking the updated value when bypassing cache");
        assert.equal(2, lazyCalled, "Check that the lazy function was called again");
    });    it("Check setting before lazy", () => {
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
    });    it("Check disabling bypass lazy after creating with bypass enabled", () => {
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

    it("Check writable lazy with complex argument types", () => {
        // Test with array arguments
        let callCount = 0;
        
        interface TestConfig {
            multiplier: number;
            prefix: string;
        }
        
        // Test with multiple complex arguments
        let value = getWritableLazy<string, (numbers: number[], config: TestConfig) => string>(
            (numbers, config) => {
                callCount++;
                const sum = numbers.reduce((a, b) => a + b * config.multiplier, 0);
                return config.prefix + sum;
            },
        [[1, 2, 3], { multiplier: 2, prefix: "Sum: " }]
        );
        
        assert.equal(value.v, "Sum: 12", "should process complex arguments correctly");
        assert.equal(callCount, 1, "function should be called once");
        
        // Test overriding the value
        value.v = "Manual value";
        assert.equal(value.v, "Manual value", "should allow overriding with a custom value");
        assert.equal(callCount, 1, "function should not be called again");
    });
});
