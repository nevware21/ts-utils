/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { arrUnique } from "../../../../src/array/unique";
import { getGlobal } from "../../../../src/helpers/environment";
import { _createIdentityMap, _createIncludes, _createSeenSet } from "../../../../src/internal/identity_map";

describe("_createIdentityMap", () => {
    function _check(name: string, setup?: () => () => void) {
        it(name, () => {
            const restore = setup ? setup() : null;
            let results: any[];

            try {
                const theMap = _createIdentityMap<number>();
                const key1 = { a: 1 };
                const key2 = { a: 1 };
                const key3 = function () {
                    return 1;
                };
                const key4 = Symbol("a");

                // Adding a key returns the value which was added, as there was no existing value
                results = [theMap.getOrAdd(key1, 1), theMap.getOrAdd(key2, 2), theMap.getOrAdd(key3, 3), theMap.getOrAdd(key4, 4)];

                // Finding a key returns its value and doesn't replace it
                results.push(theMap.getOrAdd(key1, 9), theMap.getOrAdd(key2, 9), theMap.getOrAdd(key3, 9), theMap.getOrAdd(key4, 9), theMap.getOrAdd(key1, 8));

                // Primitives are compared by value, and NaN is equal to itself
                results.push(theMap.getOrAdd(NaN, 5), theMap.getOrAdd(NaN, 9), theMap.getOrAdd(1, 6), theMap.getOrAdd("1", 7), theMap.getOrAdd(1, 9), theMap.getOrAdd("1", 9));
                results.push(theMap.getOrAdd(0, 8), theMap.getOrAdd(-0, 9), theMap.getOrAdd(null, 10), theMap.getOrAdd(undefined, 11), theMap.getOrAdd(null, 9), theMap.getOrAdd(undefined, 9));
            } finally {
                restore && restore();
            }

            assert.deepEqual(results, [
                1, 2, 3, 4,
                1, 2, 3, 4, 1,
                5, 5, 6, 7, 6, 7,
                8, 8, 10, 11, 10, 11
            ]);
        });
    }

    _check("should use the keys identity");

    _check("should treat -0 and +0 as the same key with a Map that doesn't (IE 11)", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;

        // A minimal Map which compares the keys like Object.is(), as the IE 11 Map does
        theGlobal.Map = function () {
            const keys: any[] = [];
            const values: any[] = [];
            const find = (key: any) => {
                for (let lp = 0; lp < keys.length; lp++) {
                    const k = keys[lp];
                    if (k === key ? (k !== 0 || 1 / k === 1 / key) : (k !== k && key !== key)) {
                        return lp;
                    }
                }

                return -1;
            };

            return {
                get: (key: any) => values[find(key)],
                set: (key: any, value: any) => {
                    const idx = find(key);
                    values[idx < 0 ? keys.push(key) - 1 : idx] = value;
                }
            };
        };

        return () => {
            theGlobal.Map = orgMap;
        };
    });

    _check("should use the keys identity without a native Map", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;

        theGlobal.Map = undefined;

        return () => {
            theGlobal.Map = orgMap;
        };
    });

    _check("should use the keys identity when the global Map isn't a function (eg. an element with the id \"Map\" on IE 9 / 10)", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;

        theGlobal.Map = {};

        return () => {
            theGlobal.Map = orgMap;
        };
    });

    it("without a native Map finding a primitive key doesn't replace its value", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        let results: any[];

        theGlobal.Map = undefined;
        try {
            const theMap = _createIdentityMap<number>();
            results = [theMap.getOrAdd(1, 1), theMap.getOrAdd(1, 2), theMap.getOrAdd(1, 3)];
            results.push(theMap.getOrAdd(NaN, 4), theMap.getOrAdd(NaN, 5), theMap.getOrAdd(NaN, 6));
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [1, 1, 1, 4, 4, 4]);
    });

    it("without a native Map a value added to Object.prototype or Array.prototype doesn't make a key look found", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        let results: any[];

        try {
            theGlobal.Map = undefined;

            // The key used for the primitive 1 and the index used for an object which is not found
            (Object.prototype as any)["number_1"] = 99;
            (Array.prototype as any)["-1"] = 98;

            const theMap = _createIdentityMap<number>();
            const key = { a: 1 };
            results = [theMap.getOrAdd(1, 1), theMap.getOrAdd(key, 2), theMap.getOrAdd(1, 9), theMap.getOrAdd(key, 9)];
        } finally {
            theGlobal.Map = orgMap;
            delete (Object.prototype as any)["number_1"];
            delete (Array.prototype as any)["-1"];
        }

        assert.deepEqual(results, [1, 2, 1, 2]);
    });

    it("should find -0 and +0 as the same key when -0 is added first, with a Map which treats them as different keys (IE 11)", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        let results: number[];

        // A Map which stores -0 as a different key to +0, like the IE 11 Map
        theGlobal.Map = function () {
            const values = new orgMap();
            const negZero = {};

            return {
                get: (key: any) => values.get(1 / key === -Infinity ? negZero : key),
                set: (key: any, value: any) => {
                    values.set(1 / key === -Infinity ? negZero : key, value);
                }
            };
        };

        try {
            const theMap = _createIdentityMap<number>();
            results = [theMap.getOrAdd(-0, 1), theMap.getOrAdd(0, 2), theMap.getOrAdd(-0, 3)];
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [1, 1, 1]);
    });

    it("should check the global Map when the first key is looked up, rather than when the map is created", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        const key = { a: 1 };
        let created = 0;
        let results: any[];

        try {
            // Without a Map when the map is created, and with one when the first key is looked up
            theGlobal.Map = undefined;
            let theMap = _createIdentityMap<number>();
            theGlobal.Map = function () {
                created++;
                return new orgMap();
            };
            results = [theMap.getOrAdd(key, 1), theMap.getOrAdd(key, 2), created];

            // With a Map when the map is created, and without one when the first key is looked up
            theMap = _createIdentityMap<number>();
            theGlobal.Map = undefined;
            results.push(theMap.getOrAdd(key, 3), theMap.getOrAdd(key, 4), created);
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [1, 1, 1, 3, 3, 1], "The Map is only used when there is one at the first lookup");
    });

    it("should keep the map chosen at the first lookup when the global Map is changed after it", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        const key = { a: 1 };
        let results: number[];

        try {
            // The native Map is used from the first lookup, so the key is still found once the global Map is removed
            let theMap = _createIdentityMap<number>();
            results = [theMap.getOrAdd(key, 1)];
            theGlobal.Map = undefined;
            results.push(theMap.getOrAdd(key, 2));

            // Without a Map at the first lookup the poly map is used, so the key is still found once a Map is added
            theMap = _createIdentityMap<number>();
            results.push(theMap.getOrAdd(key, 3));
            theGlobal.Map = orgMap;
            results.push(theMap.getOrAdd(key, 4));
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [1, 1, 3, 3]);
    });
});

describe("_createIdentityMap with a getOrInsert()", () => {
    it("should not use a getOrInsert added to Object.prototype, a function or not", () => {
        const objProto: any = Object.prototype;
        const key = { a: 1 };
        let results: any[];

        try {
            objProto.getOrInsert = 1;
            let theMap = _createIdentityMap<number>();
            results = [theMap.getOrAdd(key, 1), theMap.getOrAdd(key, 2)];

            objProto.getOrInsert = function () {
                throw new Error("Object.prototype.getOrInsert is called");
            };
            theMap = _createIdentityMap<number>();
            results.push(theMap.getOrAdd(key, 3), theMap.getOrAdd(key, 4));
        } finally {
            delete objProto.getOrInsert;
        }

        assert.deepEqual(results, [1, 1, 3, 3]);
    });

    it("should not call the getOrInsert() of a native Map (eg. a polyfill which doesn't work with the native Map)", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        const theKey = { a: 1 };
        let results: any[];

        // A Map with a getOrInsert() which throws, like the es-shims one with the native Map of IE 11
        theGlobal.Map = function () {
            const values = new orgMap();

            return {
                get: (key: any) => values.get(key),
                set: (key: any, value: any) => {
                    values.set(key, value);
                },
                getOrInsert: () => {
                    throw new Error("getOrInsert() is called");
                }
            };
        };

        try {
            const theMap = _createIdentityMap<number>();
            results = [theMap.getOrAdd(theKey, 1), theMap.getOrAdd(theKey, 2)];
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [1, 1]);
    });

    it("should only create the native Map when the first key is looked up", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;
        let created = 0;
        let results: any[];

        theGlobal.Map = function () {
            created++;
            return new orgMap();
        };

        try {
            const theMap = _createIdentityMap<number>();
            results = [created];
            results.push(theMap.getOrAdd("a", 1), created, theMap.getOrAdd("a", 2), theMap.getOrAdd("b", 3), created);
        } finally {
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [0, 1, 1, 1, 3, 1]);
    });
});

describe("_createSeenSet", () => {
    // A Set which doesn't find -0 after +0 is added, like the IE 11 Set
    function _ie11LikeSet(orgSet: any) {
        return function () {
            const values = new orgSet();

            return {
                has: (value: any) => 1 / value === -Infinity ? false : values.has(value),
                add: (value: any) => {
                    values.add(value);
                }
            };
        };
    }

    function _checkSeen(name: string, setup?: () => () => void) {
        it(name, () => {
            const restore = setup ? setup() : null;
            let results: any[];

            try {
                const seen = _createSeenSet();
                const obj1 = { a: 1 };
                const obj2 = { a: 1 };
                const sym = Symbol("a");
                const fn = function () {
                    return 1;
                };

                // Returns whether the value has been added, and adds it when it hasn't (as the set helpers do)
                const hasOrAdd = (value: any) => {
                    const found = seen.has(value);
                    found || seen.add(value);

                    return found;
                };

                // A value which hasn't been seen is added (false), and is then seen (true), objects by their identity
                results = [hasOrAdd(obj1), hasOrAdd(obj2), hasOrAdd(sym), hasOrAdd(fn), hasOrAdd(obj1), hasOrAdd(obj2), hasOrAdd(sym), hasOrAdd(fn)];

                // Primitives are compared by value (SameValueZero), so NaN is equal to itself and -0 to +0
                results.push(hasOrAdd(1), hasOrAdd("1"), hasOrAdd(1), hasOrAdd("1"), hasOrAdd(NaN), hasOrAdd(NaN), hasOrAdd(-0), hasOrAdd(0));
                results.push(hasOrAdd(null), hasOrAdd(undefined), hasOrAdd(null), hasOrAdd(undefined));

                // Only finding a value doesn't add it
                results.push(seen.has(2), seen.has({}), seen.has(2), hasOrAdd(2), seen.has(2), seen.has(obj1));

                // -0 and +0 are also found as the same value
                const zeros = _createSeenSet();
                const negZeros = _createSeenSet();
                results.push(zeros.has(0));
                zeros.add(0);
                results.push(zeros.has(-0), zeros.has(0), negZeros.has(-0));
                negZeros.add(-0);
                results.push(negZeros.has(0), negZeros.has(-0));

                // A function is compared by its identity, rather than by its source
                const fn2 = function () {
                    return 1;
                };
                results.push(hasOrAdd(fn2), hasOrAdd(fn2), seen.has(fn));

                // Adding a value which has already been added doesn't change it
                const obj3 = { a: 3 };
                seen.add(obj3);
                seen.add(obj3);
                seen.add(3);
                seen.add(3);
                results.push(seen.has(obj3), seen.has(3), hasOrAdd(obj3), hasOrAdd(3));
            } finally {
                restore && restore();
            }

            assert.deepEqual(results, [
                false, false, false, false, true, true, true, true,
                false, false, true, true, false, true, false, true,
                false, false, true, true,
                false, false, false, false, true, true,
                false, true, true, false, true, true,
                false, true, true,
                true, true, true, true
            ]);
        });
    }

    _checkSeen("should use a native Set");

    it("should return the native Set when it treats -0 and +0 as the same value", () => {
        assert.isTrue(_createSeenSet() instanceof Set);
    });

    _checkSeen("should treat -0 and +0 as the same value with a Set that doesn't (IE 11)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;

        // A minimal Set which compares the values like Object.is(), as the IE 11 Set does
        theGlobal.Set = function () {
            const values: any[] = [];
            const find = (value: any) => {
                for (let lp = 0; lp < values.length; lp++) {
                    const v = values[lp];
                    if (v === value ? (v !== 0 || 1 / v === 1 / value) : (v !== v && value !== value)) {
                        return lp;
                    }
                }

                return -1;
            };
            return {
                has: (value: any) => find(value) !== -1,
                add: (value: any) => {
                    if (find(value) < 0) {
                        values.push(value);
                    }
                }
            };
        };

        return () => {
            theGlobal.Set = orgSet;
        };
    });

    _checkSeen("should only use has() and add() of a Set (its size was a function before Firefox 19)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;

        // It uses a native Set (which finds NaN and treats -0 and +0 as the same value), so it is used directly and
        // only its has() and add() are called
        theGlobal.Set = function () {
            const values = new orgSet();

            return {
                size: () => values.size,
                has: (value: any) => values.has(value),
                add: (value: any) => {
                    values.add(value);
                }
            };
        };

        return () => {
            theGlobal.Set = orgSet;
        };
    });

    _checkSeen("should use the identity map's dictionary without a native Set, and not a native Map", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;

        theGlobal.Set = undefined;
        theGlobal.Map = function () {
            throw new Error("The Map is used");
        };

        return () => {
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        };
    });

    _checkSeen("should use the identity map's dictionary without a native Set or Map (IE 9 / 10)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;

        theGlobal.Set = undefined;
        theGlobal.Map = undefined;

        return () => {
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        };
    });

    _checkSeen("should use the identity map's dictionary when the global Set isn't a function (eg. an element with the id \"Set\" on IE 9 / 10)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;

        theGlobal.Set = {};

        return () => {
            theGlobal.Set = orgSet;
        };
    });

    it("without a native Set or Map an object is added without searching the objects already added", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;
        const arrProto: any = Array.prototype;
        const orgIndexOf = arrProto.indexOf;
        const objects = [{}, {}, {}, {}];
        let searches = 0;
        let results: boolean[];

        theGlobal.Set = undefined;
        theGlobal.Map = undefined;

        // Without a Set the objects which have been added are searched with indexOf()
        arrProto.indexOf = function () {
            searches++;
            return orgIndexOf.apply(this, arguments);
        };
        try {
            const seen = _createSeenSet();
            objects.forEach((value) => {
                seen.add(value);
            });
            results = [seen.has(objects[3]), seen.has({})];
        } finally {
            arrProto.indexOf = orgIndexOf;
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [true, false]);
        assert.equal(searches, 2, "Only has() searches the objects");
    });

    it("without a native Set or Map two symbols with the same description, and a boolean and a string with the same text, are different values", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;
        let results: boolean[];

        theGlobal.Set = undefined;
        theGlobal.Map = undefined;
        try {
            const seen = _createSeenSet();
            seen.add(Symbol("a"));
            seen.add(true);
            seen.add("1");
            results = [seen.has(Symbol("a")), seen.has("true"), seen.has(true), seen.has(1)];
        } finally {
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        }

        assert.deepEqual(results, [false, false, true, false]);
    });

    it("should only call has() and add() of a Set which treats -0 and +0 as different values (IE 11), passing -0 as +0", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const calls: string[] = [];
        const name = (value: any) => 1 / value === -Infinity ? "-0" : String(value);
        let results: boolean[];

        // A Set which stores -0 as a different value to +0 (like the IE 11 Set), recording its calls
        theGlobal.Set = function () {
            const values = new orgSet();
            const negZero = {};
            const key = (value: any) => 1 / value === -Infinity ? negZero : value;

            return {
                has: (value: any) => {
                    calls.push("has " + name(value));
                    return values.has(key(value));
                },
                add: (value: any) => {
                    calls.push("add " + name(value));
                    values.add(key(value));
                }
            };
        };

        try {
            // It doesn't find -0 after +0 is added, so it is used with -0 converted to +0
            const seen = _createSeenSet();
            results = [seen.has(1)];
            seen.add(1);
            results.push(seen.has(1), seen.has(-0));
            seen.add(-0);
            results.push(seen.has(0), seen.has(2));
            seen.add(3);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(results, [false, true, false, true, false]);
        assert.deepEqual(calls, [
            "add 4", "add 3", "add 2", "add 1", "add 0", "add NaN", "has NaN", "has -0",
            "has 1", "add 1", "has 1", "has 0", "add 0", "has 0", "has 2", "add 3"
        ], "The first calls check whether a Set with +0 (and 5 other values) finds NaN and has -0");
    });

    it("should not use a Set directly which doesn't find -0 once it has 5 or more values (V8, about Chrome 42 and before)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let results: boolean[];

        // A Set which stores -0 as +0 (also when it is created with it), but doesn't find -0 once it has 5 or more
        // values
        theGlobal.Set = function (initial?: any) {
            const values = new orgSet(initial);

            return {
                has: (value: any) => (1 / value === -Infinity && values.size >= 5) ? false : values.has(value),
                add: (value: any) => {
                    values.add(value);
                }
            };
        };

        try {
            const seen = _createSeenSet();
            [0, 1, 2, 3, 4].forEach((value) => {
                seen.add(value);
            });
            results = [seen.has(-0), seen.has(0)];
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(results, [true, true], "-0 is found as +0");
    });

    it("should check a Set without creating it with values, so an array isn't iterated", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let results: boolean[];

        // Creating a Set with an array calls Array.prototype[Symbol.iterator], which may have been replaced or removed
        theGlobal.Set = function (initial?: any) {
            if (initial !== undefined) {
                throw new Error("Created with values");
            }

            return new orgSet();
        };

        try {
            const seen = _createSeenSet();
            seen.add(1);
            results = [seen.has(1), seen.has(2)];
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(results, [true, false]);
    });

    it("should only check a Set once, until the global Set is replaced", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let created = 0;

        theGlobal.Set = function () {
            created++;
            return new orgSet();
        };

        try {
            _createSeenSet();
            _createSeenSet();
            _createSeenSet();
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.equal(created, 4, "One Set to check it, and one for each seen set");
    });

    it("should use the native Set directly again once the global Set is restored after one which needs a wrapper", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let results: boolean[];

        theGlobal.Set = _ie11LikeSet(orgSet);
        try {
            results = [_createSeenSet() instanceof orgSet];
        } finally {
            theGlobal.Set = orgSet;
        }

        results.push(_createSeenSet() instanceof Set);
        assert.deepEqual(results, [false, true], "The wrapper is used, then the native Set");
    });

    it("should only convert 0 for a Set which treats -0 and +0 as different values (IE 11)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let results: boolean[];

        theGlobal.Set = _ie11LikeSet(orgSet);
        try {
            const seen = _createSeenSet();
            seen.add(-1);
            results = [seen.has(-1), seen.has(1)];
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(results, [true, false]);
    });

    it("should not use a Set which searches its values and has a _values array, like the polyfill-library ones", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const results: any[] = [];
        let searched = 0;

        try {
            [true, false].forEach((withEs6Set) => {
                // Like the polyfill-library Set (used by polyfill.io), each Set has its values in a _values array,
                // which has() and add() search, and from polyfill-library 3.26 also an _es6Set (polyfill-service 3.x,
                // used for polyfill.io /v2/, has none). Like it, it finds NaN, so only its _values makes it not used
                theGlobal.Set = function () {
                    const values: any[] = [];
                    const theSet: any = {
                        _values: values,
                        has: (value: any) => {
                            searched++;
                            return values.indexOf(value) !== -1 || (value !== value && values.some((item) => item !== item));
                        },
                        add: (value: any) => {
                            values.indexOf(value) === -1 && values.push(value);
                        }
                    };

                    if (withEs6Set) {
                        theSet._es6Set = true;
                    }

                    return theSet;
                };
                searched = 0;

                const seen = _createSeenSet();
                const obj = {};
                seen.add(1);
                seen.add(obj);
                results.push([seen.has(1), seen.has(2), seen.has(obj), seen.has({}), searched]);
            });
        } finally {
            theGlobal.Set = orgSet;
        }

        // Only the check of each Set calls its has() (for -0), and then the native Set is used again
        assert.deepEqual(results, [[true, false, true, false, 1], [true, false, true, false, 1]]);
        assert.isTrue(_createSeenSet() instanceof Set);
    });

    it("should still convert -0 for a Set which needs it after the check of another Set throws", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let threw = false;
        let result: any[];

        // The same Set constructor is checked again after the other one, so it uses the results of its own check
        const ie11Set = _ie11LikeSet(orgSet);

        try {
            theGlobal.Set = ie11Set;
            _createSeenSet();

            // A Set which finds -0 after +0 is added, but reading its _values throws, so its check throws
            theGlobal.Set = function () {
                const values = new orgSet();
                const theSet = {
                    has: (value: any) => values.has(value),
                    add: (value: any) => {
                        values.add(value);
                    }
                };

                Object.defineProperty(theSet, "_values", {
                    get: () => {
                        throw new Error("_values");
                    }
                });

                return theSet;
            };
            try {
                _createSeenSet();
            } catch (e) {
                threw = true;
            }

            // The check of the IE 11 like Set is still the one which is used for it
            theGlobal.Set = ie11Set;
            result = arrUnique([0, -0]);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.isTrue(threw, "The check of the second Set throws");
        assert.equal(result.length, 1, "-0 is still the same value as +0 with the IE 11 like Set");
    });

    it("should check a Set again when its check throws, rather than using the results of the last Set", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let negZeroCalls = 0;
        let threw = false;
        let result: any[];

        // The native Set is the last one checked, so its results (it treats -0 and +0 as the same value) are cached
        _createSeenSet();

        // Like the IE 11 Set, it doesn't find -0 after +0 is added, and its has(-0) throws the first time it is called
        // (so its first check throws after it has found NaN)
        theGlobal.Set = function () {
            const values = new orgSet();

            return {
                has: (value: any) => {
                    if (1 / value === -Infinity && !negZeroCalls++) {
                        throw new Error("has(-0)");
                    }

                    return 1 / value === -Infinity ? false : values.has(value);
                },
                add: (value: any) => {
                    values.add(value);
                }
            };
        };

        try {
            try {
                _createSeenSet();
            } catch (e) {
                threw = true;
            }

            // The Set is checked again, rather than used with the results of the native Set
            result = arrUnique([0, -0]);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.isTrue(threw, "The first check of the Set throws");
        assert.equal(result.length, 1, "-0 is the same value as +0 with the IE 11 like Set");
    });

    it("should not use a Set which doesn't find NaN, like the Dojo one (which compares its values with indexOf())", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let searched = 0;
        let result: any[];

        // Like the Dojo Set (which it installs on eg. IE 9 to 11), has() searches its values with indexOf(), so it
        // finds -0 as +0 but never finds NaN
        theGlobal.Set = function () {
            const values: any[] = [];

            return {
                has: (value: any) => {
                    searched++;
                    return values.indexOf(value) !== -1;
                },
                add: (value: any) => {
                    values.indexOf(value) === -1 && values.push(value);
                }
            };
        };

        try {
            result = arrUnique([NaN, NaN, 1, NaN]);
        } finally {
            theGlobal.Set = orgSet;
        }

        // Only the check of the Set calls its has() (for NaN and -0), so NaN is found by the map used without a usable
        // Set
        assert.deepEqual(result, [NaN, 1], "NaN is only added once");
        assert.equal(searched, 2, "The check of NaN and -0");
    });

    it("should check a Set again when the check of another Set throws, rather than using that Set's results", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        let threw = false;
        let results: any[];

        // Like the Dojo Set, it compares its values with indexOf(), so it finds -0 as +0 but never finds NaN
        const dojoSet = function () {
            const values: any[] = [];

            return {
                has: (value: any) => values.indexOf(value) !== -1,
                add: (value: any) => {
                    values.indexOf(value) === -1 && values.push(value);
                }
            };
        };

        try {
            theGlobal.Set = dojoSet;
            results = [arrUnique([NaN, NaN])];

            // A Set which finds NaN, but whose has(-0) throws, so its check throws after it has found NaN
            theGlobal.Set = function () {
                const values = new orgSet();

                return {
                    has: (value: any) => {
                        if (1 / value === -Infinity) {
                            throw new Error("has(-0)");
                        }

                        return values.has(value);
                    },
                    add: (value: any) => {
                        values.add(value);
                    }
                };
            };
            try {
                _createSeenSet();
            } catch (e) {
                threw = true;
            }

            // The Dojo like Set is checked again, so it still isn't used
            theGlobal.Set = dojoSet;
            results.push(arrUnique([NaN, NaN]));
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.isTrue(threw, "The check of the second Set throws");
        assert.deepEqual(results, [[NaN], [NaN]], "NaN is only added once, before and after the check which throws");
    });
});

describe("_createIncludes", () => {
    it("should read each index once and in order, only until the value is found", () => {
        const reads: number[] = [];
        const values: any = { length: 5 };
        [1, 2, NaN, -0, 5].forEach((value, idx) => {
            Object.defineProperty(values, idx, {
                get: () => {
                    reads.push(idx);
                    return value;
                }
            });
        });

        // Only the indexes before the (converted) length which it is passed are read
        const includes = _createIncludes(values, 4);
        const results = [includes(2), includes(1), includes(0), includes(NaN), includes(5), includes(2)];

        // The values are compared like arrIncludes() (SameValueZero), so 0 matches -0 and NaN is found
        assert.deepEqual(results, [true, true, true, true, false, true]);
        assert.deepEqual(reads, [0, 1, 2, 3]);
    });

    it("should only match NaN with NaN when comparing the values it reads", () => {
        assert.isFalse(_createIncludes([NaN], 1)(1), "A NaN which is read doesn't match 1");
        assert.isFalse(_createIncludes([1], 1)(NaN), "NaN doesn't match a 1 which is read");
        assert.isTrue(_createIncludes([1, NaN], 2)(NaN), "NaN matches a NaN which is read");
    });

    it("should add the values which it reads to a set of 5,000 values, then to new sets which hold twice as many", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const values: number[] = [];
        const added: number[] = [];
        let results: boolean[];

        for (let lp = 0; lp < 35001; lp++) {
            values.push(lp);
        }

        // A Set which counts the values added to it (it finds NaN and treats -0 and +0 as the same value, so it is used
        // directly)
        theGlobal.Set = function () {
            const setValues = new orgSet();
            const setIdx = added.length;
            added.push(0);

            return {
                has: (value: any) => setValues.has(value),
                add: (value: any) => {
                    added[setIdx]++;
                    setValues.add(value);
                }
            };
        };

        try {
            // -1 isn't included, so every value is read, then each value is found in the set it was added to
            const includes = _createIncludes(values, values.length);
            results = [includes(-1), includes(0), includes(4999), includes(5000), includes(14999), includes(15000), includes(35000), includes(35001)];
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(results, [false, true, true, true, true, true, true, false]);
        assert.deepEqual(added, [6, 5000, 10000, 20000, 1], "The check of the Set (6 values), then sets of 5,000, 10,000 and 20,000 values, and one with the last of the 35,001 values");
    });

    it("should add at most 2^20 values to a set", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const added: number[] = [];
        let found: boolean;

        // An array-like without values, so each index which is read is undefined, with as many as fill the sets of
        // 5,000 to 640,000 values (1,275,000), two of 2^20 (rather than 1,280,000 and 2,560,000) values and one more.
        // It has no prototype, so a missing index is read as quickly once another test has added an index to
        // Object.prototype
        const values: any = Object.create(null);
        values.length = 1275000 + 1048576 * 2 + 1;

        // A Set which only counts the values added to it (it finds NaN and -0 when it is checked, so it is used
        // directly)
        theGlobal.Set = function () {
            const setIdx = added.length;
            added.push(0);

            return {
                has: (value: any) => value === 0 || value !== value,
                add: () => {
                    added[setIdx]++;
                }
            };
        };

        try {
            found = _createIncludes(values, values.length)(-1);
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.isFalse(found);
        assert.deepEqual(added, [6, 5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1048576, 1048576, 1], "The check of the Set, then each set");
    });

    it("should find a value in a full set without reading any more values", () => {
        const values: any = { length: 5002 };
        for (let lp = 0; lp < 5001; lp++) {
            values[lp] = lp;
        }
        Object.defineProperty(values, 5001, {
            get: () => {
                throw new Error("Read");
            }
        });

        // Reading up to 5000 fills the first set (0 to 4,999) and adds 5000 to a second set, so 3 is then found in the
        // first set without reading index 5001
        const includes = _createIncludes(values, values.length);
        const results = [includes(5000), includes(3)];

        assert.deepEqual(results, [true, true]);
        assert.throws(() => includes(-1), Error, "Read");
    });

    it("should treat -0 and +0 as the same value in each of its sets, with a Set which treats them as different values (IE 11)", () => {
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const values: number[] = [];
        let results: boolean[];

        for (let lp = 1; lp <= 6000; lp++) {
            values.push(lp);
        }
        values.push(-0);

        // Like the IE 11 Set, it stores -0 as a different value to +0
        theGlobal.Set = function () {
            const setValues = new orgSet();
            const negZero = {};
            const key = (value: any) => 1 / value === -Infinity ? negZero : value;

            return {
                has: (value: any) => setValues.has(key(value)),
                add: (value: any) => {
                    setValues.add(key(value));
                }
            };
        };

        try {
            // -1 reads every value, so -0 is added to the second set, where 0 is then found
            const includes = _createIncludes(values, values.length);
            results = [includes(-1), includes(0), includes(3)];
        } finally {
            theGlobal.Set = orgSet;
        }

        assert.deepEqual(results, [false, true, true]);
    });
});
