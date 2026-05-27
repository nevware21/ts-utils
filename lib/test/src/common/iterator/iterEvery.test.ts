/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterEvery } from "../../../../src/iterator/iterEvery";

describe("iterEvery", () => {
    it("short-circuits when predicate fails", () => {
        assert.equal(iterEvery([2, 4, 6], (value) => value % 2 === 0), true);
        assert.equal(iterEvery([2, 3, 6], (value) => value % 2 === 0), false);
    });
});
