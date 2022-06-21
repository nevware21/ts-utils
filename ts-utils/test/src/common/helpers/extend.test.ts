import { assert } from "chai";
import { isObject } from "../../../../src/helpers/base";
import { deepExtend, objExtend } from "../../../../src/helpers/extend";
import { objKeys } from "../../../../src/object/object";

describe("extend helpers", () => {

    describe("objExtend", () => {
        it("null arguments", () => {
            let newObject = objExtend(null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = objExtend(null, null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = objExtend(null, null, null, null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");
        });

        it("undefined arguments", () => {
            let newObject = objExtend(undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = objExtend(undefined, undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = objExtend(undefined, undefined, undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");
        });

        it("null and undefined arguments", () => {
            let newObject = objExtend(undefined, null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = objExtend(null, undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");
        });

        it("with objects 1 <= 2", () => {
            let obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            let obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            let expected = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            let newObject = objExtend(obj1, obj2);

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            assert.equal("o2.prop1", newObject.prop1);
            assert.equal("o2.nestedprop1", newObject.prop2.nestedprop1);
            assert.equal("o2.nestedprop2", newObject.prop2.nestedprop2[0]);
            assert.equal("prop3_arrayObject1", newObject.prop3[0].prop3_arrayObject1);
            assert.equal("prop3_arrayObject2", newObject.prop3[1].prop3_arrayObject2);

            // Update the deepn values object (which was deep copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o2.nestedprop1", newObject.prop2.nestedprop1);

            // Update the top level object (which was deep overwritten), the new object should be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o2.prop1", newObject.prop1);
        });

        it("with objects 2 <= 1", () => {
            let obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            let obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            let expected = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            let newObject = objExtend(obj2, obj1);

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            assert.equal("o1.prop1", newObject.prop1);
            assert.equal("o1.nestedprop1", newObject.prop2.nestedprop1);
            assert.equal("o1.nestedprop2", newObject.prop2.nestedprop2[0]);
            assert.equal("prop3_arrayObject1", newObject.prop3[0].prop3_arrayObject1);
            assert.equal("prop3_arrayObject2", newObject.prop3[1].prop3_arrayObject2);

            // Update the deepn values object (which was copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("Hello!", newObject.prop2.nestedprop1);

            // Update the top level object (which was overwritten), the new object should be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("p1.Hello!", newObject.prop1);
        });

        it("with invalid and value arguments", () => {
            let obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            let obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            let expected = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            let newObject = objExtend(undefined, null, obj1, null, obj2, null) as any;

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o2.nestedprop1", newObject.prop2.nestedprop1);

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o2.prop1", newObject.prop1);


            obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            expected = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            newObject = objExtend(null, undefined, obj2, undefined, obj1, null);

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            assert.equal("o1.prop1", newObject.prop1);
            assert.equal("o1.nestedprop1", newObject.prop2.nestedprop1);
            assert.equal("o1.nestedprop2", newObject.prop2.nestedprop2[0]);
            assert.equal("prop3_arrayObject1", newObject.prop3[0].prop3_arrayObject1);
            assert.equal("prop3_arrayObject2", newObject.prop3[1].prop3_arrayObject2);

            // Update the deepn values object (which was copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o1.nestedprop1", newObject.prop2.nestedprop1);

            // Update the top level object (which was deep Copied), the new object should be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o1.prop1", newObject.prop1);
        });

        it("extend with array", () => {
            let arr1 = [ "Hello", "Darkness" ];
            let arr2 = [ "Goodbye" ];

            let expected = [ "Goodbye", "Darkness" ];

            let result = objExtend(arr1, arr2);

            assert.equal(result.length, expected.length, "Checking length");
            assert.equal(JSON.stringify(result), JSON.stringify(expected));

            // The original array should have been modified
            assert.ok(arr1 === result, "Returned array should be the original target");
            assert.equal(JSON.stringify(arr1), JSON.stringify(expected));
            assert.notEqual(JSON.stringify(arr2), JSON.stringify(expected));
        });
    });

    describe("deepExtend", () => {
        it("null arguments", () => {
            let newObject = deepExtend(null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = deepExtend(null, null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = deepExtend(null, null, null, null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");
        });

        it("undefined arguments", () => {
            let newObject = deepExtend(undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = deepExtend(undefined, undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = deepExtend(undefined, undefined, undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");
        });

        it("null and undefined arguments", () => {
            let newObject = deepExtend(undefined, null);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");

            newObject = deepExtend(null, undefined);
            assert.ok(isObject(newObject), "The returned object is an object");
            assert.equal(0, objKeys(newObject).length, "The object should have no values");
        });

        it("with objects 1 <= 2", () => {
            let obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            let obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            let expected = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            let newObject = deepExtend(obj1, obj2);

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o2.nestedprop1", newObject.prop2.nestedprop1);

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o2.prop1", newObject.prop1);
        });

        it("with objects 2 <= 1", () => {
            let obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            let obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            let expected = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            let newObject = deepExtend(obj2, obj1);

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o1.nestedprop1", newObject.prop2.nestedprop1);

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o1.prop1", newObject.prop1);
        });

        it("with invalid and value arguments", () => {
            let obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            let obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            let expected = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            let newObject = deepExtend(undefined, null, obj1, null, obj2, null) as any;

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o2.nestedprop1", newObject.prop2.nestedprop1);

            // Update the object (which was deep copied), the new object should not be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o2.prop1", newObject.prop1);


            obj1 = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                }
            };
            obj2 = {
                prop1: "o2.prop1",
                prop2: {
                    nestedprop1: "o2.nestedprop1",
                    nestedprop2: ["o2.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
    
            };
    
            expected = {
                prop1: "o1.prop1",
                prop2: {
                    nestedprop1: "o1.nestedprop1",
                    nestedprop2: ["o1.nestedprop2"]
                },
                prop3: [{ prop3_arrayObject1: "prop3_arrayObject1" }, { prop3_arrayObject2: "prop3_arrayObject2" }]
            };

            newObject = deepExtend(null, undefined, obj2, undefined, obj1, null);

            assert.equal(JSON.stringify(newObject), JSON.stringify(expected));

            assert.equal("o1.prop1", newObject.prop1);
            assert.equal("o1.nestedprop1", newObject.prop2.nestedprop1);
            assert.equal("o1.nestedprop2", newObject.prop2.nestedprop2[0]);
            assert.equal("prop3_arrayObject1", newObject.prop3[0].prop3_arrayObject1);
            assert.equal("prop3_arrayObject2", newObject.prop3[1].prop3_arrayObject2);

            // Update the deepn values object (which was copied), the new object should not be altered
            obj2.prop2.nestedprop1 = "Hello!";
            assert.equal("o1.nestedprop1", newObject.prop2.nestedprop1);

            // Update the top level object (which was deep Copied), the new object should be altered
            obj2.prop1 = "p1.Hello!";
            assert.equal("o1.prop1", newObject.prop1);
        });

        it("extend with array", () => {
            let arr1 = [ "Hello", "Darkness" ];
            let arr2 = [ "Goodbye" ];

            let expected = [ "Goodbye", "Darkness" ];

            let result = deepExtend(arr1, arr2);

            assert.equal(result.length, expected.length, "Checking length");
            assert.equal(JSON.stringify(result), JSON.stringify(expected));

            // The original array should have been modified
            assert.ok(arr1 !== result, "Returned array should not be the original target");
            assert.ok(arr2 !== result, "Returned array should not be the passed argument");
            assert.notEqual(JSON.stringify(arr1), JSON.stringify(expected));
            assert.notEqual(JSON.stringify(arr2), JSON.stringify(expected));
        });

    });
});
