/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { getGlobal } from "../../../../src/helpers/environment";
import { createArrayIterator } from "../../../../src/iterator/array";
import { iterDifference } from "../../../../src/iterator/iterDifference";

describe("iterDifference", () => {
    it("returns values absent from all exclude iterables", () => {
        let difference = iterDifference([1, 2, 3, 4, 5], createArrayIterator([2, 5]), [9, 4]);
        assert.deepEqual(difference, [1, 3]);
    });

    it("treats NaN as excluded when present", () => {
        let difference = iterDifference([NaN], [NaN]);
        assert.deepEqual(difference, []);
    });

    it("returns an empty array when called with no iterables", () => {
        assert.deepEqual((iterDifference as any)(), []);
    });

    it("returns every value (including duplicates) of the source when there are no exclude iterables", () => {
        assert.deepEqual(iterDifference([1, 1, 2]), [1, 1, 2]);
        assert.deepEqual(iterDifference(createArrayIterator([3, 3, 4])), [3, 3, 4]);
        assert.deepEqual(iterDifference([]), []);
        assert.deepEqual(iterDifference(null as any), []);
    });

    it("returns every value (including duplicates) of the source which isn't excluded", () => {
        assert.deepEqual(iterDifference([1, 1, 2, 3, 2], [3]), [1, 1, 2, 2]);
        assert.deepEqual(iterDifference([0, -0, NaN, NaN, 4], [-0], createArrayIterator([5])), [NaN, NaN, 4], "-0 excludes 0 and -0, like arrIncludes()");
    });

    it("keeps -0 of the source when it isn't excluded", () => {
        const result = iterDifference([-0, 1], [1]);
        assert.deepEqual(result, [-0]);
        assert.equal(1 / result[0], -Infinity, "The value of the source (-0) is kept");
    });

    it("excludes an iterable of objects without a native Set or Map (IE 9 / 10), only searching for the values", () => {
        const objects: any[] = [];
        for (let lp = 0; lp < 1000; lp++) {
            objects.push({ lp });
        }
        const theGlobal: any = getGlobal();
        const orgSet = theGlobal.Set;
        const orgMap = theGlobal.Map;
        const arrProto: any = Array.prototype;
        const orgIndexOf = arrProto.indexOf;
        const other = {};
        let searches = 0;
        let result: any[];

        theGlobal.Set = undefined;
        theGlobal.Map = undefined;

        // Without a Set the objects which have been added are searched with indexOf()
        arrProto.indexOf = function () {
            searches++;
            return orgIndexOf.apply(this, arguments);
        };
        try {
            result = iterDifference([objects[999], other, objects[0]], objects);
        } finally {
            arrProto.indexOf = orgIndexOf;
            theGlobal.Set = orgSet;
            theGlobal.Map = orgMap;
        }

        assert.equal(result.length, 1);
        assert.equal(result[0], other);

        // Each excluded object is added without searching the objects already added, as that would be quadratic (a
        // search for each of the 1,000 objects), so there is only one search for each value of the source
        assert.equal(searches, 3);
    });
});
