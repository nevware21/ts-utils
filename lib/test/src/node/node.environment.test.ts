import { assert } from "@nevware21/tripwire-chai";
import { isNode, isWebWorker } from "../../../src/helpers/environment";

describe("node environment helpers", () => {

    describe("isNode", () => {
        it("Validate that we are running in a node environment", () => {
            assert.equal(isNode(), true, "Are we running in a node environment");
        });
    });

    describe("isWebWorker", () => {
        it("Validate that we are not running in a node environment", () => {
            assert.equal(isWebWorker(), false, "Are we running in a web worker environment");
        });
    });
});