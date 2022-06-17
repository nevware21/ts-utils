import { assert } from "chai";
import { arrAppend, arrForEach } from "../../../../src/helpers/array";

describe("array helpers", () => {
    describe("arrForEach", () => {
        it("Validate passing null values doesn't throw", () => {
            arrForEach(null, null);
            arrForEach(null, null, null);
            assert.ok(true, "Passing null values");
        });
    
        it("Validate passing undefined values doesn't throw", () => {
            arrForEach(undefined, undefined);
            arrForEach(undefined, undefined, undefined);
            assert.ok(true, "Passing null values");
        });
    
        it("Validate passing undefined callback doesn't throw", () => {
            arrForEach([], undefined);
            arrForEach([], undefined, undefined);
            assert.ok(true, "Passing null values");
        });
    
        it("Validate passing processing all entries", () => {
            let values = [ 1, 2, 3, 4 ];
            let cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
            });
    
            assert.equal(cnt, 4, "Expecting 4 callbacks");
        });
    
        it("Validate passing processing all entries even when invalid or missing", () => {
            let values = [ 1, 2, 3, null, 4, undefined ];
            let expected = values.length;
            let cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
            });
    
            assert.equal(cnt, expected, "Expecting " + expected + " callbacks");
    
            // validate deleting an entry
            values = [ 1, 2, 3, null, 4, undefined ];
            expected = values.length;
            delete values[1];
            expected --;
    
            cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
            });
    
            assert.equal(cnt, expected, "Expecting " + expected + " callbacks after deleting");
    
            values = [ 1, 2, 3, null, 4, undefined ];
            expected = values.length;
            cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
                if (cnt > 2) {
                    // delete older entries
                    delete values[cnt-2];
                }
            });
    
            assert.equal(cnt, expected, "Expecting " + expected + " callbacks after deleting already visited entries");
        });
    
        it("Validate stopping iteration ", () => {
            let values = [ 1, 2, -1, 4 ];
            let cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
                if (value < 0) {
                    return -1;
                }
            });
    
            assert.equal(cnt, 3, "Expecting 3 callbacks");
    
            values = [ -1, 2, 3, 4 ];
            cnt = 0;
            arrForEach(values, (value) => {
                cnt++;
                if (value < 0) {
                    return -1;
                }
            });
    
            assert.equal(cnt, 1, "Expecting 1 callback");
        });
    });

    describe("arrAppend", () => {
        it("Validate passing null values doesn't throw", () => {
            let target = arrAppend(null, null);
            assert.ok(true, "Passing null values");
            assert.equal(target, null, "Validate the target is returned");
            assert.equal(arrAppend(null, []), null, "Expected null response");
        });
    
        it("Validate passing undefined values doesn't throw", () => {
            let target = arrAppend(undefined, undefined);
            assert.ok(true, "Passing null values");
            assert.equal(target, undefined, "Validate the target is returned");
            assert.equal(arrAppend(undefined, []), null, "Expected null response");
        });

        it("Validate passing undefined values doesn't throw", () => {
            let target = arrAppend(undefined, undefined);
            assert.ok(true, "Passing null values");
            assert.equal(target, undefined, "Validate the target is returned");
            assert.equal(arrAppend(undefined, []), undefined, "Expected undefined response");
        });

        it("Should throw when passed target is not an array", () => {
            _expectThrow(() => {
                arrAppend({} as any, null);
            });
            _expectThrow(() => {
                arrAppend({} as any, []);
            });

            _expectThrow(() => {
                arrAppend("" as any, null);
            });
            _expectThrow(() => {
                arrAppend("" as any, []);
            });

            _expectThrow(() => {
                arrAppend(0 as any, null);
            });
            _expectThrow(() => {
                arrAppend(0 as any, []);
            });
        });

        it("Validate appending values", () => {
            let target = arrAppend([], []);
            assert.equal(target.length, 0, "Should have no elements");

            target = arrAppend([], [0]);
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 0, "Should have value of zero");

            target = arrAppend([1], []);
            assert.equal(target.length, 1, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");

            target = arrAppend([1], [2]);
            assert.equal(target.length, 2, "Should have 1 element");
            assert.equal(target[0], 1, "Should have value of 1");
            assert.equal(target[1], 2, "Should have value of 2");
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