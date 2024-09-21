/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isNode, isWebWorker } from "../../../src/helpers/environment";

describe("browser environment helpers", () => {

    describe("isNode", () => {
        it("Validate that we are not running in a node environment", () => {
            assert.equal(isNode(), false, "Are we running in a node environment");
        });
    });

    describe("isWebWorker", () => {
        it("Validate that we are not running in a node environment", () => {
            assert.equal(isWebWorker(), false, "Are we running in a web worker environment");
        });
    });
});