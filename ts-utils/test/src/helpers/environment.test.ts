import * as assert from "assert";
import { hasWindow, isNode, isWebWorker } from "../../../src/helpers/environment";

describe("environment helpers", () => {

    describe("isNode", () => {
        if (!hasWindow()) {
            it("Validate that we are running in a node environment", () => {
                assert.equal(isNode(), true, "We are running in a node environment");
            });
        } else {
            it("Validate that we are NOT running in a node environment", () => {
                assert.equal(isNode(), false, "We are NOT running in a node environment");
            });
        }
    });

    describe("isWebWorker", () => {
        it("Validate that we are running in a node environment", () => {
            assert.equal(isWebWorker(), false, "We are not running in a web worker environment");
        });
    });
});