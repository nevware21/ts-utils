/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { iterSome } from "../../../../src/iterator/iterSome";

describe("iterSome", () => {
    it("short-circuits when predicate matches", () => {
        assert.equal(iterSome([1, 3, 5, 8], (value) => value % 2 === 0), true);
        assert.equal(iterSome([1, 3, 5], (value) => value % 2 === 0), false);
    });
});
