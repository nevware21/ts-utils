/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { isFunction, isObject, isString, isUndefined } from "../../../../src/helpers/base";
import { objForEachKey } from "../../../../src/object/for_each_key";
import { objHasOwnProperty } from "../../../../src/object/has_own_prop";
import { objDeepFreeze, objEntries, objFreeze, objKeys, objSeal } from "../../../../src/object/object";
import { objDefine, objDefineAccessors, objDefineGet, objDefineProps } from "../../../../src/object/define";
import { FUNCTION } from "../../../../src/internal/constants";
import { objSetPrototypeOf } from "../../../../src/object/set_proto";
import { objCreate, polyObjCreate } from "../../../../src/object/create";
import { objHasOwn, polyObjHasOwn } from "../../../../src/object/has_own";
import { isPlainObject } from "../../../../src/object/is_plain_object";
import { getWindow } from "../../../../src/helpers/environment";
import { objGetOwnPropertyDescriptor } from "../../../../src/object/get_own_prop_desc";
import { getLazy, getWritableLazy, ILazyValue } from "../../../../src/helpers/lazy";

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

        let src3 = {
            e: 8,
            get z() {
                return 42;
            }
        };

        objDefineGet(src3, "f", 9, true);
        
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

        keys = [];
        objForEachKey(src3, (key, value) => {
            keys.push(key);
            assert.ok(objHasOwn(src3, key));
            assert.equal(value, src3[key]);
        });
        assert.equal(keys.length, 3, "Expected 3 keys - " + dumpObj(keys));
        assert.ok(keys.indexOf("e") !== -1, "contains e");
        assert.ok(keys.indexOf("f") !== -1, "contains f");
        assert.ok(keys.indexOf("z") !== -1, "contains z");
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

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, true, "It should be configurable");
        assert.equal(desc?.enumerable, true, "It should be enumerable");
        assert.equal(desc?.writable, false, "It should not be writable");

        // Redefine
        objDefineGet(value, "test", 64);

        assert.equal(value.test, 64, "Expected 64");

        let desc2 = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc2, "The descriptor must be defined");
        assert.equal(desc2?.configurable, true, "It should be configurable");
        assert.equal(desc2?.enumerable, true, "It should be enumerable");
        assert.equal(desc2?.writable, false, "It should not be writable");
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

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, false, "It should not be configurable");
        assert.equal(desc?.enumerable, true, "It should be enumerable");
        assert.equal(desc?.writable, false, "It should not be writable");

        // Redefine
        try {
            objDefineGet(value, "test", 64);
            assert.ok(false, "Expected an exception when attempting to reset a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        let desc2 = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc2, "The descriptor must be defined");
        assert.equal(desc2?.configurable, false, "It should still not be configurable");
        assert.equal(desc2?.enumerable, true, "It should still be enumerable");
        assert.equal(desc2?.writable, false, "It should not be writable");
    });

    it("objDefineGet value - configurable and not enumerable", () => {
        let value: any = {};
        objDefineGet(value, "test", 42, undefined, false);

        assert.equal(value.test, 42, "Expected 42");
        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, true, "It should be configurable");
        assert.equal(desc?.enumerable, false, "It should not be enumerable");
        assert.equal(desc?.writable, false, "It should not be writable");

        // Redefine
        objDefineGet(value, "test", 64);

        assert.equal(value.test, 64, "Expected 64");

        let desc2 = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc2, "The descriptor must be defined");
        assert.equal(desc2?.configurable, true, "It should be configurable");
        assert.equal(desc2?.enumerable, true, "It should now be enumerable");
        assert.equal(desc2?.writable, false, "It should not be writable");
    });

    it("objDefineGet value - not configurable or enumerable", () => {
        let value: any = {};
        objDefineGet(value, "test", 42, false, false);

        assert.equal(value.test, 42, "Expected 42");
        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, false, "It should not be configurable");
        assert.equal(desc?.enumerable, false, "It should not be enumerable");
        assert.equal(desc?.writable, false, "It should not be writable");

        // Redefine
        try {
            objDefineGet(value, "test", 64);
            assert.ok(false, "Expected an exception when attempting to reset a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        let desc2 = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc2, "The descriptor must be defined");
        assert.equal(desc2?.configurable, false, "It should still not be configurable");
        assert.equal(desc2?.enumerable, false, "It should still not be enumerable");
        assert.equal(desc2?.writable, false, "It should not be writable");
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

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, true, "It should be configurable");
        assert.equal(desc?.enumerable, true, "It should be enumerable");
        assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
    });

    it("objDefineGet function - configurable and not enumerable", () => {
        let value: any = {};
        let result = 42;

        function getFunc() {
            return result;
        }

        objDefineGet(value, "test", getFunc, true, false);

        assert.equal(value.test, 42, "Expected 42");

        try {
            value.test = 53;
            assert.ok(false, "Expected an exception when attempting to set a getter");
        } catch(e) {
            assert.ok(true, "Expected exception - " + dumpObj(e));
        }

        result = 64;
        assert.equal(value.test, 64, "Expected 64");

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, true, "It should be configurable");
        assert.equal(desc?.enumerable, false, "It should not be enumerable");
        assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
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

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, false, "It should not be configurable");
        assert.equal(desc?.enumerable, true, "It should be enumerable");
        assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
    });

    it("objDefineGet function - not configurable or enumerable", () => {
        let value: any = {};
        let result = 42;

        function getFunc() {
            return result;
        }

        objDefineGet(value, "test", getFunc, false, false);

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

        let desc = objGetOwnPropertyDescriptor(value, "test");
        assert.ok(!!desc, "The descriptor must be defined");
        assert.equal(desc?.configurable, false, "It should not be configurable");
        assert.equal(desc?.enumerable, false, "It should not be enumerable");
        assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
    });

    describe("objDefine", () => {
        it("objDefine with get/set", () => {
            let value: any = {};
            let result = 42;

            function getFunc() {
                return result;
            }

            objDefine(value, "test", {
                g: getFunc,
                s: getFunc
            });

            result = 64;
            assert.equal(value.test, 64, "Expected 64");

            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });

        it("objDefine with writable value", () => {
            let value: any = {};
            let result = 42;

            function getFunc() {
                return result;
            }

            objDefine(value, "test", {
                g: getFunc,
                s: getFunc
            });

            result = 64;
            assert.equal(value.test, 64, "Expected 64");

            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");

            objDefine(value, "test", {
                v: 42,
                w: true
            });

            result = 64;
            assert.equal(value.test, 42, "Expected 42");

            desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, true, "It should writable");
        });

        it("objDefine with redonly lazy value", () => {
            let value: any = {};
            let lazyCalled = 0;
            let lazyValue: ILazyValue<any> = getLazy(() => {
                lazyCalled++;
                return 64;
            });

            objDefine(value, "test", {
                l: lazyValue
            });

            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
            assert.notEqual(desc?.get, undefined, "A getter should exist");
            assert.equal(desc?.set, undefined, "A setter should no longer exist");
            assert.equal(lazyCalled, 0);

            // Cause the value to be evaluated
            assert.equal(value.test, 64, "Expected 64");
            assert.equal(lazyCalled, 1);

            desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
            assert.notEqual(desc?.get, undefined, "A getter should exist");

            _expectThrow(() => {
                value.test = 42;
            });

            assert.equal(lazyCalled, 1);
        });

        it("objDefine with writable lazy value", () => {
            let value: any = {};
            let lazyCalled = 0;
            let lazyValue: ILazyValue<any> = getWritableLazy(() => {
                lazyCalled++;
                return 64;
            });

            objDefine(value, "test", {
                l: lazyValue
            });

            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
            assert.notEqual(desc?.get, undefined, "A getter should exist");
            assert.notEqual(desc?.set, undefined, "A setter should exist");
            assert.equal(lazyCalled, 0);

            // Cause the value to be evaluated
            assert.equal(value.test, 64, "Expected 64");
            assert.equal(lazyCalled, 1);

            desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
            assert.notEqual(desc?.get, undefined, "A getter should exist");
            assert.notEqual(desc?.set, undefined, "A setter should exist");

            value.test = 42;
            assert.equal(value.test, 42, "Expected 42");
            assert.equal(lazyCalled, 1);
        });

        it("objDefine with writable lazy value set before read", () => {
            let value: any = {};
            let lazyCalled = 0;
            let lazyValue: ILazyValue<any> = getWritableLazy(() => {
                lazyCalled++;
                return 64;
            });

            objDefine(value, "test", {
                l: lazyValue
            });

            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
            assert.notEqual(desc?.get, undefined, "A getter should exist");
            assert.notEqual(desc?.set, undefined, "A setter should exist");
            assert.equal(lazyCalled, 0);

            value.test = 53;

            // Cause the value to be evaluated
            assert.equal(value.test, 53, "Expected 53");
            assert.equal(lazyCalled, 0);

            desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
            assert.notEqual(desc?.get, undefined, "A getter should exist");
            assert.notEqual(desc?.set, undefined, "A setter should exist");

            value.test = 42;
            assert.equal(value.test, 42, "Expected 42");
            assert.equal(lazyCalled, 0);
        });
    });

    describe("objDefineAccessors", () => {
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
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
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
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, false, "It should not be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });
    
        it("objDefineAccessors - setter only", () => {
            let value: any = {};
            let result = 42;
            function setFunc(value: any) {
                result = value;
            }
    
            objDefineAccessors(value, "test", null, setFunc);
    
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                let theValue = value.test;
                assert.ok(false, "Expected an exception when attempting to get with only a setter");
            } catch(e) {
                assert.ok(true, "Expected exception - " + dumpObj(e));
            }
    
            assert.equal(result, 42, "Pre-condition");
            value.test = 53;
            assert.equal(result, 53, "Expected the value to have been set");
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
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
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });
    });

    describe("objDefineProps", () => {
        it("getter only", () => {
            let value: any = {};
            let result = 42;
            function getFunc() {
                return result;
            }
    
            objDefineProps(value, { test: { g: getFunc } });
            assert.equal(value.test, 42, "Expected 42");
    
            try {
                value.test = 53;
                assert.ok(false, "Expected an exception when attempting to set with only a getter");
            } catch(e) {
                assert.ok(true, "Expected exception - " + dumpObj(e));
            }
    
            result = 64;
            assert.equal(value.test, 64, "Expected 64");
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });
    
        it("getter only - not configurable", () => {
            let value: any = {};
            let result = 42;
            let result2 = 12;
            function getFunc() {
                return result;
            }
    
            function getFunc2() {
                return result2;
            }
    
            objDefineProps(value, { test: { g: getFunc, c: false }});
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
                objDefineProps(value, { test: { g: getFunc2, c: false } });
                assert.ok(false, "Expected an exception when attempting to reset a getter");
            } catch (e) {
                assert.ok(true, "Expected exception - " + dumpObj(e));
            }
    
            assert.equal(value.test, 64, "Expected 64");
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, false, "It should not be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });
    
        it("setter only", () => {
            let value: any = {};
            let result = 42;
            function setFunc(value: any) {
                result = value;
            }
    
            objDefineProps(value, { test: { s: setFunc } });
    
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                let theValue = value.test;
                assert.ok(false, "Expected an exception when attempting to get with only a setter");
            } catch(e) {
                assert.ok(true, "Expected exception - " + dumpObj(e));
            }
    
            assert.equal(result, 42, "Pre-condition");
            value.test = 53;
            assert.equal(result, 53, "Expected the value to have been set");
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });
    
        it("getter and setter", () => {
            let value: any = {};
            let result = 42;
    
            function getFunc() {
                return result;
            }
    
            function setFunc(value: any) {
                result = value;
            }
    
            objDefineProps(value, { test: { g: getFunc, s: setFunc } });
            assert.equal(value.test, 42, "Expected a value of 42");
            value.test = 53;
            assert.equal(result, 53, "Expected the value to have been set");
            assert.equal(value.test, 53, "Expected a value of 53");
    
            result = 64;
            assert.equal(value.test, 64, "Expected a value of ");
    
            let desc = objGetOwnPropertyDescriptor(value, "test");
            assert.ok(!!desc, "The descriptor must be defined");
            assert.equal(desc?.configurable, true, "It should be configurable");
            assert.equal(desc?.enumerable, true, "It should be enumerable");
            assert.equal(desc?.writable, undefined, "It should be undefined with get/set functions");
        });
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

    describe("Object.seal", () => {

        it("native", () => {
            let testObject: any = {
                hello: () => "World",
                friend: "..."
            }

            assert.equal(testObject.friend, "...", "testing instance property");
            assert.ok(isFunction(testObject.hello), "hello is still a function");
            assert.equal(testObject.my, undefined, "Should not have a value");

            let sealed = objSeal(testObject);
            assert.equal(sealed, testObject, "Sealed object should be the same as he test object");
            assert.equal(sealed.friend, "...", "testing instance property");
            assert.ok(isFunction(sealed.hello), "hello is still a function");
            assert.equal(sealed.my, undefined, "my should not have a value");

            // Try and change / add
            sealed.hello = "Darkness";
            _expectThrow(() => {
                sealed.my = "old";
            });
            assert.equal(sealed.hello, "Darkness", "hello is was changed");
            assert.equal(sealed.my, undefined, "my should not have a value");
        });

        // This test is commented out because the objSeal caches the result of Object.seal || _doNothing
        // So to test this would require and additional test hook to un-cache the result during initialization
        // it("removed native", () => {
        //     let orgSeal = Object.seal;
        //     try {
        //         let testObject: any = {
        //             hello: () => "World",
        //             friend: "maybe"
        //         };

        //         (Object as any)["seal"] = undefined;
    
        //         assert.equal(testObject.friend, "...", "testing instance property");
        //         assert.ok(isFunction(testObject.hello), "hello is still a function");
        //         assert.equal(testObject.my, undefined, "Should not have a value");
    
        //         let sealed = objSeal(testObject);
        //         assert.equal(sealed, testObject, "Sealed object should be the same as he test object");
        //         assert.equal(sealed.friend, "...", "testing instance property");
        //         assert.ok(isFunction(sealed.hello), "hello is still a function");
        //         assert.equal(sealed.my, undefined, "Should not have a value");
    
        //         // Try and change / add
        //         sealed.hello = "Darkness";
        //         sealed.my = "old";
        //         assert.equal(sealed.hello, "Darkness", "hello is was changed");
        //         assert.equal(sealed.my, "old", "my is was added");

        //     } finally {
        //         Object.seal = orgSeal;
        //     }
        // });
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

    describe("objHasOwn", () => {

        it("native hasOwn", () => {
            let obj1 = {
                hello: () => "World"
            };

            assert.equal(objHasOwn(obj1, "hello"), true);
            assert.equal(objHasOwn(obj1, "Friend"), false);

            let obj2 = {
                hello: () => "Darkness",
                get Friend() {
                    return "...";
                }
            };

            objDefineGet(obj2, "My", "...", true);

            assert.equal(objHasOwn(obj1, "hello"), true);
            assert.equal(objHasOwn(obj2, "Friend"), true, "Expected Friend to be true");
            assert.equal(objHasOwn(obj2, "My"), true, "Expected My to be true");
            assert.equal(objHasOwn(obj2, "..."), false, "Expected ... to be false");
            assert.equal(objHasOwn(obj2, "Darkness"), false, "Expected Darkness to be false");
        });

        it("polyObjHasOwn", () => {
            let obj1 = {
                hello: () => "World"
            };

            let obj2 = {
                hello: () => "Darkness",
                get Friend() {
                    return "...";
                }
            };

            objDefineGet(obj2, "My", "...", true);

            let cnt = 0;
            objForEachKey(obj1, (key) => {
                cnt++;
                _checkPolyHasOwn(obj1, key);
            });

            assert.equal(cnt, 1, "Expected 1 key");

            assert.ok(objHasOwn(obj2, "Friend"), "Expected Friend to be true");
            assert.ok(objHasOwn(obj2, "My"), "Expected My to be true");

            cnt = 0;
            objForEachKey(obj2, (key) => {
                cnt++;
                _checkPolyHasOwn(obj2, key);
            });

            assert.equal(cnt, 3, "Expected 3 key");
        });
    });

    describe("isPlainObject", () => {
        it("check different types", () => {
            _checkIsPlainObject(null, false);
            _checkIsPlainObject(undefined, false);
            _checkIsPlainObject("null", false);
            _checkIsPlainObject("undefined", false);
            _checkIsPlainObject("1", false);
            _checkIsPlainObject("aa", false);
            _checkIsPlainObject(new Date(), false);
            _checkIsPlainObject(1, false);
            _checkIsPlainObject("", false);
            _checkIsPlainObject(_dummyFunction, false);
            _checkIsPlainObject([], false);
            _checkIsPlainObject(new Array(1), false);
            _checkIsPlainObject(true, false);
            _checkIsPlainObject(false, false);
            _checkIsPlainObject("true", false);
            _checkIsPlainObject("false", false);
            _checkIsPlainObject(new Boolean(true), false);
            _checkIsPlainObject(new Boolean(false), false);
            _checkIsPlainObject(new Boolean("true"), false);
            _checkIsPlainObject(new Boolean("false"), false);
            _checkIsPlainObject(/[a-z]/g, false);
            _checkIsPlainObject(new RegExp(""), false);
            _checkIsPlainObject(_getFile(), false);
            _checkIsPlainObject(_getFormData(), false);
            _checkIsPlainObject(_getBlob(), false);
            _checkIsPlainObject(new ArrayBuffer(0), false);
            _checkIsPlainObject(new Error("Test Error"), false);
            _checkIsPlainObject(new TypeError("Test TypeError"), false);
            _checkIsPlainObject(new TestError("Test TestError"), false);
            _checkIsPlainObject(_dummyError(), true);           // _dummyError just returns an object that looks like an error
            _checkIsPlainObject(Promise.reject(), false);
            _checkIsPlainObject(Promise.resolve(), false);
            _checkIsPlainObject(new Promise(() => {}), false);
            _checkIsPlainObject(_simplePromise(), true);        // _simplePromise is returning a plain object that looks like a promise
            _checkIsPlainObject(_simplePromiseLike(), true);    // _simplePromiseLike is returning a plain object that looks PromiseLike
            // _fakePromise is still returning an object (created as an object)
            // even though the returned object has a constructor the returned object was still created as an object
            _checkIsPlainObject(_fakePromise(), true);
            _checkIsPlainObject(Object.create(null), true);
            _checkIsPlainObject({
                hello: "darkness",
                my: "Old",
                "friend": "."
            }, true);
            _checkIsPlainObject({}, true);
            _checkIsPlainObject(getWindow(), false);
        });
    });

    describe("objEntries", () => {
        it("examples", () => {
            assert.deepEqual(objEntries({ Hello: "Darkness", my: "old", friend: "." }), [ [ "Hello", "Darkness" ], [ "my", "old"], [ "friend", "." ] ]);

            // Array-like object
            assert.deepEqual(objEntries({ 0: "a", 1: "b", 2: "c" }), [ ["0", "a"], ["1", "b"], ["2", "c"] ]);

            // Array-like object with random key ordering
            assert.deepEqual(objEntries({ 100: "a", 2: "b", 7: "c" }), [ ["2", "b"], ["7", "c"], ["100", "a"] ]);
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

    function _checkPolyHasOwn(target: any, key: PropertyKey) {
        let polyResult: any;
        let nativeResult: any;
        let polyThrew: any;
        let nativeThrew: any;
        try {
            polyResult = polyObjHasOwn(target, key);
        } catch (e) {
            polyThrew = e;
        }
        try {
            nativeResult = Object["hasOwn"](target, key);
        } catch (e) {
            nativeThrew = e;
        }

        if (isObject(target)) {
            assert.equal(polyResult.length, nativeResult.length, "Checking Native and objKeys result for [" + dumpObj(target) + "]");
        } else {
            if (polyThrew) {
                assert.equal(true, !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                    "Checking whether the Native and poly threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(target) + "]");
            } else if(nativeThrew) {
                assert.ok(false,
                    "Native threw but poly didn't [" + dumpObj(polyThrew) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(target) + "]");
            } else {
                assert.equal(isUndefined(polyResult), !!nativeThrew || isUndefined(nativeResult) || !!nativeResult,
                    "Checking whether the Native and poly threw or returned undefined [" + dumpObj(polyThrew || polyResult) + "] - [" + dumpObj(nativeThrew || nativeResult) + "] for [" + dumpObj(target) + "]");
            }
        }
    }

    function _checkIsPlainObject(value: any, expected: boolean) {
        assert.equal(isPlainObject(value), expected, "Checking - " + dumpObj(value));
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

    function _fakePromise(): any {
        return {
            constructor: Promise,
            then: _dummyFunction,
            catch: _dummyFunction
        };
    }

    function _expectThrow(cb: () => void): undefined | Error {
        try {
            cb();
        } catch (e) {
            assert.ok(true, "Expected an exception to be thrown");
            return e;
        }
    }

    class TestError extends Error {
        public constructor(message: string) {
            super(message);
        }
    }
});
