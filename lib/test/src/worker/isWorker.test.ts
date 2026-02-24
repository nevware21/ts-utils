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
describe("** Ensure we are running in a web worker environment **", () => {

    it("not hasWindow", () => {
        assert.equal(hasWindow(), false, "Validate that we do not have a window object available");
    });

    it("not hasDocument", () => {
        assert.equal(hasDocument(), false, "Validate that we do not have a document object available");
    });

    it("not isNode", () => {
        assert.equal(isNode(), false, "Validate that we are not running in a node environment");
    });

    it ("isWorker", () => {
        assert.equal(isWebWorker(), true, "Validate that we are running in a worker environment");
    });
});

