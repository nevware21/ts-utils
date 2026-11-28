/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
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

        it("updates the target itself, keeping the values (and their objects) which no argument replaces", () => {
            let inner = { value: 1 };
            let list = [1, 2];
            let target: any = { a: inner, b: list, c: "keep" };

            let result = objExtend(target, { c: "replaced" }, { d: { value: 2 } });

            assert.ok(result === target, "The target is returned");
            assert.ok(target.a === inner, "The target's own object isn't replaced by a copy of itself");
            assert.ok(target.b === list, "The target's own array isn't replaced by a copy of itself");
            assert.equal(target.c, "replaced");
            assert.deepEqual(target.d, { value: 2 });
        });

        it("doesn't read or assign the target's own properties, eg. one with a getter and no setter", () => {
            let reads = 0;
            let target: any = { b: 1 };
            Object.defineProperty(target, "a", {
                get: () => {
                    reads++;
                    return "getter";
                },
                enumerable: true,
                configurable: true
            });

            let result = objExtend(target, { b: 2 });

            assert.ok(result === target, "The target is returned");
            assert.equal(reads, 0, "The target's getter isn't read");
            assert.equal(target.a, "getter");
            assert.equal(target.b, 2);
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

        it("reads each of the target's getters once (only for the copy)", () => {
            let reads = 0;
            let target: any = {};
            Object.defineProperty(target, "a", {
                get: () => {
                    reads++;
                    return "getter";
                },
                enumerable: true,
                configurable: true
            });

            let result = deepExtend(target, { b: 2 });

            assert.ok(result !== target, "A copy of the target is returned");
            assert.equal(reads, 1, "The target's getter is read once");
            assert.deepEqual(result, { a: "getter", b: 2 });
        });

        it("makes a reference to the target within its copy a reference to the copy", () => {
            let target: any = { a: 1 };
            target.self = target;

            let result = deepExtend(target, { b: 2 });

            assert.ok(result !== target, "A copy of the target is returned");
            assert.ok(result.self === result, "The reference to the target is the copy (not a second copy)");
            assert.equal(result.b, 2);
        });

        it("extends and returns a target which objDeepCopy doesn't copy (eg. a class instance), keeping its own objects", () => {
            class Foo {
                public a: any = { x: 1 };
            }

            let target: any = new Foo();
            let inner = target.a;

            let result = deepExtend(target, { b: 2 });

            assert.ok(result === target, "The class instance itself is extended and returned");
            assert.ok(target.a === inner, "Its own object isn't replaced by a copy of itself");
            assert.equal(target.b, 2);
        });

    });
});
