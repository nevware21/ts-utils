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

                results = [theMap.g(key1)];
                theMap.s(key1, 1);
                theMap.s(key3, 3);
                theMap.s(key4, 4);
                results.push(theMap.g(key1), theMap.g(key2), theMap.g(key3), theMap.g(key4));

                // Setting an existing key replaces its value, and doesn't affect the other keys
                theMap.s(key1, 5);
                theMap.s(key4, 0);
                results.push(theMap.g(key1), theMap.g(key3), theMap.g(key4));
            } finally {
                restore && restore();
            }

            assert.deepEqual(results, [undefined, 1, undefined, 3, 4, 5, 3, 0]);
        });
    }

    _check("should use the keys identity");

    _check("should use the keys identity without a native Map", () => {
        const theGlobal: any = getGlobal();
        const orgMap = theGlobal.Map;

        theGlobal.Map = undefined;

        return () => {
            theGlobal.Map = orgMap;
        };
    });
});
