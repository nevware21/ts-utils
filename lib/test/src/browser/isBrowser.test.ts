/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { hasDocument, hasWindow, isNode, isWebWorker } from "@nevware21/ts-utils";

// Define the test suite
describe("** Ensure running in a browser environment **", () => {

    it("hasWindow", () => {
        assert.equal(hasWindow(), true, "Validate that we have a window object available");
    });

    it("hasDocument", () => {
        assert.equal(hasDocument(), true, "Validate that we have a document object available");
    });

    it("not isNode", () => {
        assert.equal(isNode(), false, "Validate that we are not running in a node environment");
    });

    it ("not isWorker", () => {
        assert.equal(isWebWorker(), false, "Validate that we are not running in a worker environment");
    });
});