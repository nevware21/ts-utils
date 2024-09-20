import { assert } from "@nevware21/tripwire-chai";
import { isNode, isWebWorker } from "../../../src/helpers/environment";

describe("worker environment helpers", () => {

    describe("isNode", () => {
        it("Validate that we are running in a node environment", () => {
            assert.equal(isNode(), false, "Are we running in a node environment");
        });
    });

    describe("isWebWorker", () => {
        it("Validate that we are running in a node environment", () => {
            assert.equal(isWebWorker(), true, "Are we running in a web worker environment");
        });
    });
});