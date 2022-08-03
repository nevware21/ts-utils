import { assert } from "chai";
import { strIndexOf } from "../../../../src/string/index_of";

describe("strIndexOf", () => {

    it("with no args", () => {
        _expectThrow(() => {
            (strIndexOf as any)();
        });
    });

    it("null / undefined", () => {
        _expectThrow(() => {
            strIndexOf(null as any, null as any);
        });

        _expectThrow(() => {
            strIndexOf(undefined as any, null as any);
        });
    });


    function _expectThrow(cb: () => void): Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }
});

