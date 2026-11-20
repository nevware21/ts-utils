/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";

// Only run with Node, where the module can be loaded again (using require) while a class is removed, as the built-in
// prototypes are found when isUnsafeTarget is first called, so (like a class added by a polyfill) a class which is
// added after that is only identified by checking the classes which were missing again
describe("isUnsafeTarget with a class which is defined after the first check", function() {
    // Each test loads new instances of the source modules (so the first call is a first call), which compiles every
    // source module again (~0.5s under ts-node and nyc), so the tests have a longer timeout than the default
    this.timeout(10000);

    const srcRoot = require.resolve("../../../src/index").replace(/index\.[jt]s$/, "");

    /**
     * Loads a new instance of the isUnsafeTarget module
     */
    function _loadModule() {
        return {
            unsafeTarget: require("../../../src/object/isUnsafeTarget")
        };
    }

    it("identifies the prototype of a class which was missing when it was first called", function() {
        const weakRefDesc = Object.getOwnPropertyDescriptor(global, "WeakRef");
        if (!weakRefDesc || typeof Proxy !== "function") {
            this.skip();
            return;
        }

        const cachedModules: { [key: string]: any } = {};
        let results: any = {};

        Object.keys(require.cache).forEach((key) => {
            if (key.indexOf(srcRoot) === 0) {
                cachedModules[key] = require.cache[key];
                delete require.cache[key];
            }
        });

        try {
            delete (global as any).WeakRef;
            const isUnsafeTarget = _loadModule().unsafeTarget.isUnsafeTarget;

            // The first check, which finds the built-in prototypes while WeakRef is missing
            results.first = isUnsafeTarget({});

            // While a class is missing a target which can't be checked doesn't throw
            const revocable = (Proxy as any).revocable({}, {});
            revocable.revoke();
            results.revoked = isUnsafeTarget(revocable.proxy);

            // WeakRef is added (eg. by a polyfill) after the first check
            Object.defineProperty(global, "WeakRef", weakRefDesc);
            results.weakRef = isUnsafeTarget((global as any).WeakRef.prototype);
        } finally {
            Object.defineProperty(global, "WeakRef", weakRefDesc);
            Object.keys(require.cache).forEach((key) => {
                if (key.indexOf(srcRoot) === 0) {
                    delete require.cache[key];
                }
            });

            Object.keys(cachedModules).forEach((key) => {
                require.cache[key] = cachedModules[key];
            });
        }

        assert.isFalse(results.first, "A plain object is safe");
        assert.isFalse(results.revoked, "A revoked Proxy is not a class prototype");
        assert.isTrue(results.weakRef, "WeakRef.prototype should be identified after WeakRef is added");
    });

    /**
     * Replaces the global WeakRef with a getter (which calls the onRead function), loads new instances of the source
     * modules and calls the callback with them, then restores WeakRef and the original (cached) module instances
     */
    function _withWeakRefGetter(onRead: () => any, cb: (modules: any) => void) {
        const weakRefDesc = Object.getOwnPropertyDescriptor(global, "WeakRef");
        const cachedModules: { [key: string]: any } = {};

        Object.keys(require.cache).forEach((key) => {
            if (key.indexOf(srcRoot) === 0) {
                cachedModules[key] = require.cache[key];
                delete require.cache[key];
            }
        });

        try {
            Object.defineProperty(global, "WeakRef", {
                configurable: true,
                get: onRead
            });

            cb({
                unsafeTarget: require("../../../src/object/isUnsafeTarget"),
                extend: require("../../../src/helpers/extend")
            });
        } finally {
            Object.defineProperty(global, "WeakRef", weakRefDesc);
            Object.keys(require.cache).forEach((key) => {
                if (key.indexOf(srcRoot) === 0) {
                    delete require.cache[key];
                }
            });

            Object.keys(cachedModules).forEach((key) => {
                require.cache[key] = cachedModules[key];
            });
        }
    }

    it("only looks up the missing classes again for a class prototype of a different class", function() {
        if (!Object.getOwnPropertyDescriptor(global, "WeakRef")) {
            this.skip();
            return;
        }

        let reads = 0;
        let results: any = {};

        class MyClass {
        }

        class OtherClass {
        }

        // WeakRef is missing (undefined) until it is returned by the getter
        let weakRef: any = undefined;
        const orgWeakRef = (global as any).WeakRef;

        _withWeakRefGetter(() => {
            reads++;
            return weakRef;
        }, (modules) => {
            const isUnsafeTarget = modules.unsafeTarget.isUnsafeTarget;

            results.first = isUnsafeTarget({});
            results.readsAfterFirst = reads;

            // The missing classes are only looked up again for the first check of the same class prototype
            isUnsafeTarget(MyClass.prototype);
            isUnsafeTarget(MyClass.prototype);
            isUnsafeTarget(MyClass.prototype);
            results.readsAfterSameClass = reads;

            isUnsafeTarget(OtherClass.prototype);
            results.readsAfterOtherClass = reads;

            // WeakRef is added (eg. by a polyfill) and its prototype is identified, as its class is different
            weakRef = orgWeakRef;
            results.weakRef = isUnsafeTarget(orgWeakRef.prototype);
        });

        assert.isFalse(results.first, "A plain object is safe");
        assert.equal(results.readsAfterSameClass, results.readsAfterFirst + 1, "The same class only looks up the missing classes once");
        assert.equal(results.readsAfterOtherClass, results.readsAfterSameClass + 1, "A different class looks up the missing classes again");
        assert.isTrue(results.weakRef, "WeakRef.prototype should be identified after WeakRef is added");
    });

    it("a call made while the first call is looking up the classes doesn't throw", function() {
        if (!Object.getOwnPropertyDescriptor(global, "WeakRef")) {
            this.skip();
            return;
        }

        let innerResults: any[] = [];
        let results: any = {};
        let modulesRef: any;
        const orgWeakRef = (global as any).WeakRef;

        _withWeakRefGetter(() => {
            // Reading the class (eg. a lazily created polyfill) uses a helper which checks for an unsafe target
            if (modulesRef) {
                try {
                    innerResults.push(modulesRef.extend.objExtend({}, { a: 1 }));
                } catch (e) {
                    innerResults.push(e);
                }
            }

            return orgWeakRef;
        }, (modules) => {
            modulesRef = modules;
            results.outer = modules.extend.objExtend({}, { b: 2 });
            results.mapProto = modules.unsafeTarget.isUnsafeTarget(Map.prototype);
            results.weakRefProto = modules.unsafeTarget.isUnsafeTarget(orgWeakRef.prototype);
        });

        assert.isAbove(innerResults.length, 0, "The class was read while the first call was looking up the classes");
        innerResults.forEach((value) => {
            assert.deepEqual(value, { a: 1 }, "The inner call should not throw");
        });
        assert.deepEqual(results.outer, { b: 2 });
        assert.isTrue(results.mapProto, "Map.prototype is still identified");
        assert.isTrue(results.weakRefProto, "WeakRef.prototype is identified");
    });

    it("a class whose prototype can't be read doesn't stop the classes after it being identified", function() {
        const finRegDesc = Object.getOwnPropertyDescriptor(global, "FinalizationRegistry");
        if (!Object.getOwnPropertyDescriptor(global, "WeakRef") || !finRegDesc || typeof Proxy !== "function") {
            this.skip();
            return;
        }

        // Reading the prototype of a revoked Proxy throws
        const revocable = (Proxy as any).revocable(function() {
            // Not called
        }, {});
        revocable.revoke();

        let results: any = {};
        const finRegProto = (global as any).FinalizationRegistry.prototype;

        try {
            // WeakRef is read before FinalizationRegistry (the last of the classes)
            _withWeakRefGetter(() => revocable.proxy, (modules) => {
                try {
                    results.first = modules.unsafeTarget.isUnsafeTarget({});
                } catch (e) {
                    results.firstError = e;
                }

                results.finRegProto = modules.unsafeTarget.isUnsafeTarget(finRegProto);
                modules.extend.objExtend(finRegProto, JSON.parse("{\"polluted\": 1}"));
                results.polluted = finRegProto.polluted;
            });
        } finally {
            delete finRegProto.polluted;
        }

        assert.isUndefined(results.firstError, "The first call should not throw");
        assert.isFalse(results.first, "A plain object is safe");
        assert.isTrue(results.finRegProto, "FinalizationRegistry.prototype should still be identified");
        assert.isUndefined(results.polluted, "FinalizationRegistry.prototype should not be changed by objExtend");
    });

    it("a global getter which creates a new class each time it is read doesn't make a later lookup repeat", function() {
        if (!Object.getOwnPropertyDescriptor(global, "WeakRef")) {
            this.skip();
            return;
        }

        let created = 0;
        let derefAdded: boolean[] = [];
        let results: any = {};
        let modulesRef: any;

        class MyClass {
        }

        _withWeakRefGetter(() => {
            // Like a lazily created polyfill which is only cached once it has been initialized, each read (once
            // the modules are loaded) creates a new class and adds to its prototype, which checks for an unsafe target.
            // Only a limited number are created, so a lookup which is repeated for each class fails quickly (rather
            // than when the stack overflows)
            if (modulesRef && created < 10) {
                const theClass: any = function() {
                    // Empty
                };

                created++;
                modulesRef.extend.objExtend(theClass.prototype, {
                    deref: function(): any {
                        return undefined;
                    }
                });
                derefAdded.push(typeof theClass.prototype.deref === "function");

                return theClass;
            }

            return undefined;
        }, (modules) => {
            // The first check, while WeakRef is not defined
            results.first = modules.unsafeTarget.isUnsafeTarget({});
            modulesRef = modules;

            // The prototype of a class which isn't known looks up the missing classes again, which reads WeakRef
            results.myClass = modules.unsafeTarget.isUnsafeTarget(MyClass.prototype);
        });

        assert.isFalse(results.first, "A plain object is safe");
        assert.isFalse(results.myClass, "MyClass.prototype is not a built-in prototype");
        // A lookup reads each global twice (getInst checks the value and then returns it), while a lookup made for each
        // class created by the getter reads it again (and again), until the stack overflows
        assert.isAbove(created, 0, "WeakRef should be read by the lookup");
        assert.isAtMost(created, 2, "WeakRef should only be read by the one lookup");
        derefAdded.forEach((added) => {
            assert.isTrue(added, "The polyfill should be able to add to its own prototype");
        });
    });
});
