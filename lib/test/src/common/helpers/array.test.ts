import { assert } from "chai";
import { arrAppend, arrForEach, arrIndexOf } from "../../../../src/helpers/array";
import { dumpObj } from "../../../../src/helpers/diagnostics";

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

    describe("arrIndexOf", () => {

        it("with no args", () => {
            _expectThrow(() => {
                (arrIndexOf as any)();
            });
        });

        it("null / undefined", () => {
            _expectThrow(() => {
                arrIndexOf(null as any, null);
            });

            _expectThrow(() => {
                arrIndexOf(undefined as any, null);
            });
        });

        it("simple example 1", () => {
            const array = [2, 9, 9];
            assert.equal(arrIndexOf(array, 2), 0);
            assert.equal(arrIndexOf(array, 7), -1);
            assert.equal(arrIndexOf(array, 9, 2), 2);
            assert.equal(arrIndexOf(array, 2, -1), -1);
            assert.equal(arrIndexOf(array, 2, -3), 0);
        });
        
        it("example 2", () => {
            let indices: number[] = [];
            const array = ["a", "b", "a", "c", "a", "d"];
            const element = "a";
            let idx = arrIndexOf(array, element);
            while (idx !== -1) {
                indices.push(idx);
                idx = arrIndexOf(array, element, idx + 1);
            }

            assert.equal(indices.length, 3, "checking length");
            assert.equal(indices[0], 0, "1st");
            assert.equal(indices[1], 2, "2dn");
            assert.equal(indices[2], 4, "3rd");
        });

        it("example 3", () => {
            function updateVegetablesCollection (veggies: string[], veggie: string) {
                if (veggies.indexOf(veggie) === -1) {
                    veggies.push(veggie);
                }
            }
            
            let veggies = ["potato", "tomato", "chillies", "green-pepper"];
            
            updateVegetablesCollection(veggies, "spinach");

            assert.equal(veggies.length, 5, "checking length - " + dumpObj(veggies));
            assert.equal(veggies[0], "potato");
            assert.equal(veggies[1], "tomato");
            assert.equal(veggies[2], "chillies");
            assert.equal(veggies[3], "green-pepper");
            assert.equal(veggies[4], "spinach");

            // New veggies collection is : potato,tomato,chillies,green-pepper,spinach
            updateVegetablesCollection(veggies, "spinach");
            assert.equal(veggies.length, 5, "checking length 2 - " + dumpObj(veggies));
            assert.equal(veggies[0], "potato");
            assert.equal(veggies[1], "tomato");
            assert.equal(veggies[2], "chillies");
            assert.equal(veggies[3], "green-pepper");
            assert.equal(veggies[4], "spinach");
        })
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