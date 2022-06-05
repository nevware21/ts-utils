import * as assert from "assert";
import { dumpObj } from "../../../src/helpers/disgnostics";

describe("diagnostic helpers", () => {
    describe("dumpObj", () => {
        it("validate type null", () => {
            assert.equal(dumpObj(undefined), "[object Undefined]: undefined");
            assert.equal(dumpObj(undefined, true), "[object Undefined]: undefined");
            assert.equal(dumpObj(undefined, 2), "[object Undefined]: undefined");
            assert.equal(dumpObj(null), "[object Null]: null");
            assert.equal(dumpObj(null, true), "[object Null]: null");
            assert.equal(dumpObj(null, 2), "[object Null]: null");
        });
    });
});

