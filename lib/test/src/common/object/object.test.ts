/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isObject, isString, isUndefined } from "../../../../src/helpers/base";
import { objForEachKey } from "../../../../src/object/for_each_key";
import { objHasOwnProperty } from "../../../../src/object/has_own_prop";
import { objDeepFreeze, objFreeze, objKeys } from "../../../../src/object/object";
import { objDefineAccessors, objDefineGet } from "../../../../src/object/define";
import { FUNCTION } from "../../../../src/internal/constants";
import { objSetPrototypeOf } from "../../../../src/object/set_proto";
import { objCreate, polyObjCreate } from "../../../../src/object/create";

describe("object helpers", () => {
    it("objKeys", () => {
        _checkObjKeys(null);
        _checkObjKeys(undefined);
        _checkObjKeys("null");
        _checkObjKeys("undefined");
        _checkObjKeys("1");
        _checkObjKeys("aa");
        _checkObjKeys(new Date());
        _checkObjKeys(1);
        _checkObjKeys("");
        _checkObjKeys(_dummyFunction);
        _checkObjKeys([]);
        _checkObjKeys(new Array(1));
        _checkObjKeys(true);
        _checkObjKeys(false);
        _checkObjKeys("true");
        _checkObjKeys("false");
        _checkObjKeys(new Boolean(true));
        _checkObjKeys(new Boolean(false));
        _checkObjKeys(new Boolean("true"));
        _checkObjKeys(new Boolean("false"));
        _checkObjKeys(/[a-z]/g);
        _checkObjKeys(new RegExp(""));
        _checkObjKeys(_getFile());
        _checkObjKeys(_getFormData());
        _checkObjKeys(_getBlob());
        _checkObjKeys(new ArrayBuffer(0));
        _checkObjKeys(new Error("Test Error"));
        _checkObjKeys(new TypeError("Test TypeError"));
        _checkObjKeys(new TestError("Test TestError"));
        _checkObjKeys(_dummyError());
        _checkObjKeys(Promise.reject());
        _checkObjKeys(Promise.resolve());
        _checkObjKeys(new Promise(() => {}));
        _checkObjKeys(_simplePromise());
        _checkObjKeys(_simplePromiseLike());
        _checkObjKeys({
            hello: "darkness",
            my: "Old",
            "friend": "."
        });
    });

    it("objForEachKey", () => {
        let src = {
            a: 1,
            b: 2
        };

        let src2 = {
            a: 1,
            b: 2,
            c: 3,
            d: 4
        };
        
        objForEachKey({}, (key) => {
            assert.ok(false, "not expecting any calls");
        });

        let keys: string[] = [];
        objForEachKey(src, (key, value) => {
            if (isString(key)) {
                keys.push(key);
                assert.ok(objHasOwnProperty(src, key));
                assert.equal(value, src[key]);
            }
        });
        assert.equal(keys.length, 2, "Expected 2 keys - " + dumpObj(keys));

        keys = [];
        objForEachKey(src2, (key, value) => {
            keys.push(key);
            assert.ok(objHasOwnProperty(src2, key));
            assert.equal(value, src2[key]);
            if (key === "c") {
                return -1;
            }
        });
        assert.equal(keys.length, 3, "Expected 3 keys - " + dumpObj(keys));
    });

    it("objFreeze", () => {
        let theObject = {
            prop1: "Hello!",
            prop2: "Darkness",
            prop3: {
                my: "Old",
                friend: "!"
            }
        };

        let expected = JSON.stringify(theObject);
        let result = objFreeze(theObject);

        assert.ok(result === theObject, "The returned object should be the same object");
        assert.deepEqual(result, theObject);
        try {
            result.prop1 = "Goodbye";
        } catch (e) {
            assert.equal(e.name, "TypeError", "Check the error type");
        }
        assert.deepEqual(result, theObject);
        assert.equal(JSON.stringify(result), expected);

        // Change a sub object
        result.prop3.friend = ":-)";
        assert.equal(result.prop3.friend, ":-)");

        // We should be able to add to the object
        (result.prop3 as any).ive = "come";
        assert.equal((result.prop3 as any).ive, "come");
    });

    it("objDeepFreeze", () => {
        let theObject = {
            prop1: "Hello!",
            prop2: "Darkness",
            prop3: {
                my: "Old",
                friend: "!"
            }
        };

        let expected = JSON.stringify(theObject);
        let result = objDeepFreeze(theObject);

        assert.ok(result === theObject, "The returned object should be the same object");
        assert.deepEqual(result, theObject);
        try {
            result.prop1 = "Goodbye";
        } catch (e) {
            assert.equal(e.name, "TypeError", "Check the error type");
        }
        assert.deepEqual(result, theObject);
        assert.equal(JSON.stringify(result), expected);

        
        // Try to change a sub object -- it should be frozen also
        try {
            result.prop3.friend = ":-)";
        } catch (e) {
            assert.equal(e.name, "TypeError", "Check the error type");
        }
        assert.equal(result.prop3.friend, "!");

        // We should NOT be able to add to the object
        try {
            (result.prop3 as any).ive = "come";
        } catch (e) {
            assert.equal(e.name, "TypeError", "Check the error type");
        }

        assert.equal((result.prop3 as any).ive, undefined);
    });

    it("objDefineGet value", () => {
        let value: any = {};
        objDefineGet(value, "test", 42);

        assert.equal(value.test, 42, "Expected 42");
        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        // Redefine
        objDefineGet(value, "test", 64);

        assert.equal(value.test, 64, "Expected 64");
    });

    it("objDefineGet value - not configurable", () => {
        let value: any = {};
        objDefineGet(value, "test", 42, false);

        assert.equal(value.test, 42, "Expected 42");
        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        // Redefine
        try {
            objDefineGet(value, "test", 64);
            assert.ok(false, "Expected an exception when attempting to reset a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }
    });

    it("objDefineGet function", () => {
        let value: any = {};
        let result = 42;

        function getFunc() {
            return result;
        }

        objDefineGet(value, "test", getFunc);

        assert.equal(value.test, 42, "Expected 42");

        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        result = 64;
        assert.equal(value.test, 64, "Expected 64");
    });

    it("objDefineGet function - not configurable", () => {
        let value: any = {};
        let result = 42;

        function getFunc() {
            return result;
        }

        objDefineGet(value, "test", getFunc, false);

        assert.equal(value.test, 42, "Expected 42");

        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }
        // Redefine
        try {
            objDefineGet(value, "test", getFunc, true);
            assert.ok(false, "Expected an exception when attempting to reset a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }
    });

    it("objDefineAccessors - getter only", () => {
        let value: any = {};
        let result = 42;
        function getFunc() {
            return result;
        }

        objDefineAccessors(value, "test", getFunc);
        assert.equal(value.test, 42, "Expected 42");

        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set with only a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        result = 64;
        assert.equal(value.test, 64, "Expected 64");
    });

    it("objDefineAccessors - getter only - not configurable", () => {
        let value: any = {};
        let result = 42;
        let result2 = 12;
        function getFunc() {
            return result;
        }

        function getFunc2() {
            return result2;
        }

        objDefineAccessors(value, "test", getFunc, null, false);
        assert.equal(value.test, 42, "Expected 42");

        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set with only a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        result = 64;
        assert.equal(value.test, 64, "Expected 64");

        // Redefine
        try {
            objDefineAccessors(value, "test", getFunc2, null, false);
            assert.ok(false, "Expected an exception when attempting to reset a getter");
        } catch (e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        assert.equal(value.test, 64, "Expected 64");
    });

    it("objDefineAccessors - setter only", () => {
        let value: any = {};
        let result = 42;
        function setFunc(value: any) {
            result = value;
        }

        objDefineAccessors(value, "test", null, setFunc);

        try {
            // @eslint-disable-next-line @typescript-eslint/no-unused-vars
            let theValue = value.test;
            assert.ok(false, "Expected an exception when attempting to get with only a setter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        assert.equal(result, 42, "Pre-condition");
        value.test = 53;
        assert.equal(result, 53, "Expected the value to have been set");
    });

    it("objDefineAccessors - getter and setter", () => {
        let value: any = {};
        let result = 42;

        function getFunc() {
            return result;
        }

        function setFunc(value: any) {
            result = value;
        }

        objDefineAccessors(value, "test", getFunc, setFunc);
        assert.equal(value.test, 42, "Expected a value of 42");
        value.test = 53;
        assert.equal(result, 53, "Expected the value to have been set");
        assert.equal(value.test, 53, "Expected a value of 53");

        result = 64;
        assert.equal(value.test, 64, "Expected a value of ");
    });

    describe("setPrototypeOf", () => {

        it("native setPrototype", () => {
            let orgSetPrototypeOf = Object.setPrototypeOf;
            try {
                let newProto1 = {
                    hello: () => "World"
                };
    
                let newProto2 = {
                    hello: () => "Darkness"
                };
    
                let testObject: any = {
                    friend: "maybe"
                }
    
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.equal(testObject.hello, undefined, "testing prototype function is not present");
    
                objSetPrototypeOf(testObject, newProto1);
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.ok(typeof testObject.hello === FUNCTION, "testing prototype function is a function");
                assert.equal(testObject.hello(), "World", "testing prototype1 function return value");
    
                objSetPrototypeOf(testObject, newProto2);
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.ok(typeof testObject.hello === FUNCTION, "testing prototype function is a function");
                assert.equal(testObject.hello(), "Darkness", "testing prototype1 function return value");
    
                objSetPrototypeOf(testObject, Object.prototype);
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.equal(testObject.hello, undefined, "testing restored prototype");
    
            } finally {
                Object.setPrototypeOf = orgSetPrototypeOf;
            }
        });

        it("removed native setPrototype", () => {
            let orgSetPrototypeOf = Object.setPrototypeOf;
            try {
                let newProto1 = {
                    hello: () => "World"
                };
    
                let newProto2 = {
                    hello: () => "Darkness"
                };
    
                let testObject: any = {
                    friend: "maybe"
                };

                (Object as any)["setPrototypeOf"] = undefined;
    
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.equal(testObject.hello, undefined, "testing prototype function is not present");
    
                objSetPrototypeOf(testObject, newProto1);
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.ok(typeof testObject.hello === FUNCTION, "testing prototype function is a function");
                assert.equal(testObject.hello(), "World", "testing prototype1 function return value");
    
                objSetPrototypeOf(testObject, newProto2);
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.ok(typeof testObject.hello === FUNCTION, "testing prototype function is a function");
                assert.equal(testObject.hello(), "Darkness", "testing prototype1 function return value");
    
                objSetPrototypeOf(testObject, Object.prototype);
                assert.equal(testObject.friend, "maybe", "testing instance property");
                assert.equal(testObject.hello, undefined, "testing restored prototype");
    
            } finally {
                Object.setPrototypeOf = orgSetPrototypeOf;
            }
        });
    });

    describe("objCreate", () => {
        it("native objCreate", () => {
            let newProto1 = {
                hello: () => "World"
            };

            let newProto2 = {
                hello: () => "Darkness"
            };

            let newObj = objCreate(newProto1);
            assert.ok(typeof newObj.hasOwnProperty === FUNCTION, "The object has the hasOwnProperty function inherited from object");
            assert.ok(typeof newObj.hello === FUNCTION, "testing prototype function is a function");
            assert.equal(newObj.hello(), "World", "testing prototype1 function return value");

            newObj = objCreate(newProto2);
            assert.ok(typeof newObj.hasOwnProperty === FUNCTION, "The object has the hasOwnProperty function inherited from object");
            assert.ok(typeof newObj.hello === FUNCTION, "testing prototype function is a function");
            assert.equal(newObj.hello(), "Darkness", "testing prototype1 function return value");

            newObj = objCreate(null);
            assert.equal(newObj.hasOwnProperty, undefined, "The object does not have the hasOwnProperty function");
            assert.equal(newObj.hello, undefined, "testing that the hello prototype function also is not present");


            try {
                newObj = objCreate("Hello" as any);
                assert.ok(false, "An Expected should have been thrown");
            } catch (e) {
                assert.ok(true, "Expected an exception to be thrown");
            }

        });

        it("polyObjCreate", () => {
            let newProto1 = {
                hello: () => "World"
            };

            let newProto2 = {
                hello: () => "Darkness"
            };

            let newObj = polyObjCreate(newProto1);
            assert.ok(typeof newObj.hasOwnProperty === FUNCTION, "The object has the hasOwnProperty function inherited from object");
            assert.ok(typeof newObj.hello === FUNCTION, "testing prototype function is a function");
            assert.equal(newObj.hello(), "World", "testing prototype1 function return value");

            newObj = polyObjCreate(newProto2);
            assert.ok(typeof newObj.hasOwnProperty === FUNCTION, "The object has the hasOwnProperty function inherited from object");
            assert.ok(typeof newObj.hello === FUNCTION, "testing prototype function is a function");
            assert.equal(newObj.hello(), "Darkness", "testing prototype1 function return value");

            newObj = polyObjCreate(null);
            assert.ok(typeof newObj.hasOwnProperty === FUNCTION, "The object will still have the hasOwnProperty as object.prototype will still be used");
            assert.equal(newObj.hasOwnProperty, Object.prototype.hasOwnProperty, "The object does have the hasOwnProperty function");
            assert.equal(newObj.hello, undefined, "testing that the hello prototype function also is not present");

            try {
                newObj = polyObjCreate("Hello");
                assert.ok(false, "An Expected should have been thrown");
            } catch (e) {
                assert.ok(true, "Expected an exception to be thrown");
            }
        });
    });

    function _checkObjKeys(value: any) {
        let objKeysResult: any;
        let nativeResult: any;
        let objKeysThrew: any;
        let nativeThrew: any;
        try {
            objKeysResult = objKeys(value);
        } catch (e) {
            objKeysThrew = e;
        }
        try {
            nativeResult = Object.keys(value);
        } catch (e) {
            nativeThrew = e;
        }

        if (isObject(value)) {
            assert.equal(objKeysResult.length, nativeResult.length, "Checking Native and objKeys result for [" + dumpObj(value) + "]");
        } else {
            if (objKeysThrew) {
                assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                    "Checking whether the Native and objKeys threw or returned undefined [" + dumpObj(objKeysThrew || objKeysResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
            } else if(nativeThrew) {
                assert.ok(false,
                    "Native threw but objKeys didn't [" + dumpObj(objKeysThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
            } else {
                assert.equal(isUndefined(objKeysResult), !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                    "Checking whether the Native and objKeys threw or returned undefined [" + dumpObj(objKeysThrew || objKeysResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(value) + "]");
            }
        }
    }

    function _dummyFunction() {

    }

    function _dummyError(): Error {
        return {
            name: "Dummy Error",
            message: "Dummy Message"
        };
    }

    function _getFile(): File {
        let theFile: File = null;
        try {
            theFile = new File([], "text.txt");
        } catch (e) {
            // Node doesn't have the file class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return theFile;
    }

    function _getFormData(): FormData {
        let formData: FormData = null;
        try {
            formData = new FormData();
        } catch (e) {
            // Node doesn't have the FormData class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return formData;
    }

    function _getBlob(): Blob {
        let blob: Blob = null;
        try {
            blob = new Blob();
        } catch (e) {
            // Node doesn't have the Blob class
            assert.equal(e.name, "ReferenceError", "Expecting the error to be a ReferenceError - " + dumpObj(e));
        }

        return blob;
    }

    function _simplePromise(): any {
        return {
            then: _dummyFunction,
            catch: _dummyFunction
        };
    }

    function _simplePromiseLike(): any {
        return {
            then: _dummyFunction
        };
    }

    class TestError extends Error {
        public constructor(message: string) {
            super(message);
        }
    }
});
