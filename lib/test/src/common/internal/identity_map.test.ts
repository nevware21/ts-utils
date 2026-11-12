/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { getGlobal } from "../../../../src/helpers/environment";
import { _createIdentityMap } from "../../../../src/internal/identity_map";

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

                // Adding a key returns undefined, as there was no existing value
                results = [theMap(key1, 1), theMap(key2, 2), theMap(key3, 3), theMap(key4, 4)];

                // Finding a key returns its value and doesn't replace it
                results.push(theMap(key1, 9), theMap(key2, 9), theMap(key3, 9), theMap(key4, 9), theMap(key1, 8));

                // Primitives are compared by value, and NaN is equal to itself
                results.push(theMap(NaN, 5), theMap(NaN, 9), theMap(1, 6), theMap("1", 7), theMap(1, 9), theMap("1", 9));
                results.push(theMap(0, 8), theMap(-0, 9), theMap(null, 10), theMap(undefined, 11), theMap(null, 9), theMap(undefined, 9));
            } finally {
                restore && restore();
            }

            assert.deepEqual(results, [
                undefined, undefined, undefined, undefined,
                1, 2, 3, 4, 1,
                undefined, 5, undefined, undefined, 6, 7,
                undefined, 8, undefined, undefined, 10, 11
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
});
