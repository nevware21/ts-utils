/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { getValueByIter, getValueByKey, setValueByIter, setValueByKey } from "../../../../src/helpers/get_set_value";
import { encodeAsJson } from "../../../../src/helpers/encode";
import { isNullOrUndefined } from "../../../../src/helpers/base";

describe("getValueByKey", () => {
    it("null/undefined", () => {
        assert.equal(getValueByKey(null as any, null as any, "Hello"), "Hello");
        assert.equal(getValueByKey({ }, null as any, "Hello"), "Hello");
        assert.equal(getValueByKey(null as any, "Hello", "Hello"), "Hello");
    });

    it("example", () => {
        let theValue = {
            Hello: {
                Darkness: {
                    my: "old"
                }
            },
            friend: "I've",
            come: {
                to: {
                    see: "you"
                }
            }
        };

        let seeObj = { see: "you" };
        
        assert.deepEqual(getValueByKey(theValue, "Hello.Darkness.my", "friend"), "old");
        assert.deepEqual(getValueByKey(theValue, "My.Old", "friend"), "friend");
        assert.deepEqual(getValueByKey<any>(theValue, "come.to", "friend"), seeObj);
        assert.deepEqual(getValueByKey(theValue, "friend", "friend"), "I've");
    });
});

describe("setValueByKey", () => {
    it("null/undefined", () => {
        let theValue = { };
        setValueByKey(theValue, null as any, "old");
        setValueByKey(theValue, undefined as any, "old");
        setValueByKey(theValue, "", "old");

        assert.equal(encodeAsJson(theValue), "{}");
    });

    it("example", () => {
        let theValue = { };
        setValueByKey(theValue, "Hello.Darkness.my", "old");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}}}");

        setValueByKey(theValue, "friend", "I've");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}},\"friend\":\"I've\"}");

        setValueByKey(theValue, "come.to.see", "you");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}},\"friend\":\"I've\",\"come\":{\"to\":{\"see\":\"you\"}}}");

        setValueByKey(theValue, "come.to.see", "again");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}},\"friend\":\"I've\",\"come\":{\"to\":{\"see\":\"again\"}}}");
    });

    it("should ignore unsafe path keys", () => {
        let theValue = {} as any;
        let prevPolluted = (Object.prototype as any).polluted;

        try {
            delete (Object.prototype as any).polluted;

            setValueByKey(theValue, "__proto__.polluted", "bad");
            setValueByKey(theValue, "constructor.prototype.polluted", "bad");
            setValueByKey(theValue, "safe.prototype", "bad");

            assert.isUndefined((Object.prototype as any).polluted, "Object prototype should not be polluted");
            assert.isUndefined(theValue.safe, "Unsafe paths should not create intermediate objects");
            assert.equal(encodeAsJson(theValue), "{}");
        } finally {
            if (isNullOrUndefined(prevPolluted)) {
                delete (Object.prototype as any).polluted;
            } else {
                (Object.prototype as any).polluted = prevPolluted;
            }
        }
    });

    it("should rollback a created intermediate key when the path becomes unsafe", () => {
        let theValue = {
            keep: {
                existing: true
            }
        } as any;

        setValueByKey(theValue, "keep.safe.prototype", "bad");

        assert.deepEqual(theValue, {
            keep: {
                existing: true
            }
        }, "The created intermediate key should be removed when the path is rejected");
        assert.isUndefined(theValue.keep.safe, "The unsafe intermediate should not remain on the target");
    });

    it("should not write through unsafe prototype targets", () => {
        let propName = "__ts_utils_polluted_key__";
        let theValue = {
            objectProto: Object.prototype,
            functionProto: Function.prototype,
            arrayProto: Array.prototype,
            dateProto: Date.prototype,
            errorProto: Error.prototype
        } as any;
        let targets = [
            theValue.objectProto,
            theValue.functionProto,
            theValue.arrayProto,
            theValue.dateProto,
            theValue.errorProto
        ];

        try {
            for (let lp = 0; lp < targets.length; lp++) {
                delete targets[lp][propName];
            }

            setValueByKey(theValue, "objectProto." + propName, "bad");
            setValueByKey(theValue, "functionProto." + propName, "bad");
            setValueByKey(theValue, "arrayProto." + propName, "bad");
            setValueByKey(theValue, "dateProto." + propName, "bad");
            setValueByKey(theValue, "errorProto." + propName, "bad");

            for (let lp = 0; lp < targets.length; lp++) {
                assert.isUndefined(targets[lp][propName], "Unsafe prototype target should not be polluted");
                assert.isFalse(Object.prototype.hasOwnProperty.call(targets[lp], propName), "Unsafe prototype target should not gain an own property");
            }
        } finally {
            for (let lp = 0; lp < targets.length; lp++) {
                delete targets[lp][propName];
            }
        }
    });
});

describe("getValueByIter", () => {
    it("null/undefined", () => {
        assert.equal(getValueByIter(null as any, null as any, "Hello"), "Hello");
        assert.equal(getValueByIter({ }, null as any, "Hello"), "Hello");
        assert.equal(getValueByIter(null as any, "Hello", "Hello"), "Hello");
    });

    it("example", () => {
        let theValue = {
            Hello: {
                Darkness: {
                    my: "old"
                }
            },
            friend: "I've",
            come: {
                to: {
                    see: "you"
                }
            }
        };

        let seeObj = { see: "you" };
        
        assert.deepEqual(getValueByIter(theValue, ["Hello", "Darkness", "my"], "friend"), "old");
        assert.deepEqual(getValueByIter(theValue, ["My", "Old"], "friend"), "friend");
        assert.deepEqual(getValueByIter<any>(theValue, ["come", "to"], "friend"), seeObj);
        assert.deepEqual(getValueByIter(theValue, ["friend"], "friend"), "I've");
    });
});

describe("setValueByIter", () => {
    it("null/undefined", () => {
        let theValue = { };
        setValueByIter(theValue, null as any, "old");
        setValueByIter(theValue, undefined as any, "old");
        setValueByIter(theValue, "", "old");

        assert.equal(encodeAsJson(theValue), "{}");
    });

    it("example", () => {
        let theValue = { };
        setValueByIter(theValue, ["Hello", "Darkness", "my"], "old");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}}}");

        setValueByIter(theValue, ["friend"], "I've");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}},\"friend\":\"I've\"}");

        setValueByIter(theValue, ["come", "to", "see"], "you");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}},\"friend\":\"I've\",\"come\":{\"to\":{\"see\":\"you\"}}}");

        setValueByIter(theValue, ["come", "to", "see"], "again");
        assert.equal(encodeAsJson(theValue),
            "{\"Hello\":{\"Darkness\":{\"my\":\"old\"}},\"friend\":\"I've\",\"come\":{\"to\":{\"see\":\"again\"}}}");
    });

    it("should ignore unsafe iterator keys", () => {
        let theValue = {} as any;
        let prevPolluted = (Object.prototype as any).polluted;

        try {
            delete (Object.prototype as any).polluted;

            setValueByIter(theValue, ["__proto__", "polluted"], "bad");
            setValueByIter(theValue, ["constructor", "prototype", "polluted"], "bad");
            setValueByIter(theValue, ["safe", "prototype"], "bad");

            assert.isUndefined((Object.prototype as any).polluted, "Object prototype should not be polluted");
            assert.isUndefined(theValue.safe, "Unsafe paths should not create intermediate objects");
            assert.equal(encodeAsJson(theValue), "{}");
        } finally {
            if (isNullOrUndefined(prevPolluted)) {
                delete (Object.prototype as any).polluted;
            } else {
                (Object.prototype as any).polluted = prevPolluted;
            }
        }
    });

    it("should rollback a created intermediate key when the iterator path becomes unsafe", () => {
        let theValue = {
            keep: {
                existing: true
            }
        } as any;

        setValueByIter(theValue, ["keep", "safe", "prototype"], "bad");

        assert.deepEqual(theValue, {
            keep: {
                existing: true
            }
        }, "The created intermediate key should be removed when the iterator path is rejected");
        assert.isUndefined(theValue.keep.safe, "The unsafe intermediate should not remain on the target");
    });

    it("should not write through unsafe prototype targets", () => {
        let propName = "__ts_utils_polluted_iter__";
        let theValue = {
            objectProto: Object.prototype,
            functionProto: Function.prototype,
            arrayProto: Array.prototype,
            dateProto: Date.prototype,
            errorProto: Error.prototype
        } as any;
        let targets = [
            theValue.objectProto,
            theValue.functionProto,
            theValue.arrayProto,
            theValue.dateProto,
            theValue.errorProto
        ];

        try {
            for (let lp = 0; lp < targets.length; lp++) {
                delete targets[lp][propName];
            }

            setValueByIter(theValue, ["objectProto", propName], "bad");
            setValueByIter(theValue, ["functionProto", propName], "bad");
            setValueByIter(theValue, ["arrayProto", propName], "bad");
            setValueByIter(theValue, ["dateProto", propName], "bad");
            setValueByIter(theValue, ["errorProto", propName], "bad");

            for (let lp = 0; lp < targets.length; lp++) {
                assert.isUndefined(targets[lp][propName], "Unsafe prototype target should not be polluted");
                assert.isFalse(Object.prototype.hasOwnProperty.call(targets[lp], propName), "Unsafe prototype target should not gain an own property");
            }
        } finally {
            for (let lp = 0; lp < targets.length; lp++) {
                delete targets[lp][propName];
            }
        }
    });
});

describe("setValueByIter / getValueByIter with an iterator which throws or whose return() doesn't return an object", () => {
    function _createKeys(keys: string[], returnValue?: any) {
        let idx = 0;
        let returnCalls = 0;
        const iter: any = {
            next: () => idx < keys.length ? { value: keys[idx++], done: false } : { value: undefined, done: true },
            return: () => {
                returnCalls++;
                return returnValue;
            }
        };

        return {
            iter: iter,
            returnCalls: () => returnCalls
        };
    }

    it("setValueByIter removes the objects it added when return() doesn't return an object", () => {
        const target: any = {};
        const keys = _createKeys(["x", "y", "__proto__", "z"]);

        try {
            // Like for...of, the iterator is closed for the unsafe key and its return() result must be an object
            assert.throws(() => setValueByIter(target, keys.iter, 1), TypeError);
            assert.equal(keys.returnCalls(), 1, "return() should be called once");
            assert.deepEqual(target, {}, "The object added for the path should be removed");
            assert.isUndefined(({} as any).z, "Object.prototype should not be changed");
        } finally {
            // So a failure doesn't leave Object.prototype changed for the later tests
            delete (Object.prototype as any).z;
        }
    });

    it("setValueByIter removes the objects it added when the iterator throws", () => {
        const target: any = { a: 1 };
        const error = new Error("next() error");
        let idx = 0;
        const iter: any = {
            next: () => {
                if (idx === 2) {
                    throw error;
                }

                return { value: ["x", "y"][idx++], done: false };
            }
        };

        let caught: any;
        try {
            setValueByIter(target, iter, 1);
        } catch (e) {
            caught = e;
        }

        assert.strictEqual(caught, error, "The iterator's error should be thrown");
        assert.deepEqual(target, { a: 1 }, "The object added for the path should be removed");
    });

    it("setValueByIter removes the objects it added for an unsafe key when return() returns an object", () => {
        const target: any = {};
        const keys = _createKeys(["x", "y", "__proto__", "z"], { done: true });

        setValueByIter(target, keys.iter, 1);
        assert.equal(keys.returnCalls(), 1, "return() should be called once");
        assert.deepEqual(target, {}, "The object added for the path should be removed");
    });

    it("setValueByIter sets the value when the path is valid", () => {
        const target: any = {};
        setValueByIter(target, _createKeys(["x", "y"]).iter, 1);
        assert.deepEqual(target, { x: { y: 1 } });
    });

    it("getValueByIter throws a TypeError (like for...of) when it stops early and return() doesn't return an object", () => {
        assert.throws(() => getValueByIter({ a: null }, _createKeys(["a", "b"]).iter, "def"), TypeError);
        assert.equal(getValueByIter({ a: null }, _createKeys(["a", "b"], {}).iter, "def"), "def");
        assert.equal(getValueByIter<any>({ a: { b: 1 } }, _createKeys(["a", "b"]).iter, "def"), 1, "return() is not called when every key is used");
    });
});

describe("setValueByIter converts each key like a property access", () => {
    it("blocks a key which converts to an unsafe key (eg. from JSON)", () => {
        const savedAssign = Object.assign;
        const savedKeys = Object.keys;
        const results: any = {};
        try {
            setValueByIter({}, JSON.parse("[[\"constructor\"], \"assign\"]"), 1);
            results.assign = Object.assign;

            setValueByIter({}, [{ toString: () => "constructor" } as any, "keys"], 2);
            results.keys = Object.keys;

            const target: any = {};
            setValueByIter(target, JSON.parse("[[\"__proto__\"], \"polluted\"]"), 3);
            results.target = target;
            results.polluted = ({} as any).polluted;
        } finally {
            Object.assign = savedAssign;
            Object.keys = savedKeys;

            // So a failure doesn't leave Object.prototype changed for the later tests
            delete (Object.prototype as any).polluted;
        }

        assert.strictEqual(results.assign, savedAssign, "Object.assign should not be changed");
        assert.strictEqual(results.keys, savedKeys, "Object.keys should not be changed");
        assert.isUndefined(results.polluted, "Object.prototype should not be changed");
        assert.deepEqual(results.target, {});
    });

    it("uses each key once, so a key whose toString() changes can't bypass the check", () => {
        let calls = 0;
        const key: any = {
            toString: () => calls++ === 0 ? "constructor" : "safe"
        };

        const target: any = {};
        setValueByIter(target, [key, "value"], 1);
        assert.equal(calls, 1, "The key should only be converted once");
        assert.deepEqual(target, {}, "The unsafe key is blocked");
    });

    it("uses the converted key, so a key whose toString() changes after the check isn't used again", () => {
        let calls = 0;
        const key: any = {
            toString: () => calls++ === 0 ? "safe" : "constructor"
        };

        const target: any = {};
        let polluted: any;
        try {
            setValueByIter(target, [key, "polluted"], 1);
            polluted = (Object as any).polluted;
        } finally {
            // When the key was converted again (to "constructor") the value was set on Object
            delete (Object as any).polluted;
        }

        assert.equal(calls, 1, "The key should only be converted once");
        assert.isUndefined(polluted, "Object should not be changed");
        assert.deepEqual(target, { safe: { polluted: 1 } }, "The converted key is used");
    });

    it("converts a number key, and still uses a symbol key, like a property access", () => {
        const target: any = {};
        setValueByIter(target, [0, 1] as any, "x");
        assert.deepEqual(target, { 0: { 1: "x" } });

        if (typeof Symbol === "function") {
            const sym = Symbol("test");
            const symTarget: any = {};
            setValueByIter(symTarget, [sym as any, "a"], 1);
            assert.deepEqual(symTarget[sym], { a: 1 });
        }
    });

    it("uses a symbol as the last key, like a property access", function() {
        if (typeof Symbol !== "function") {
            this.skip();
            return;
        }

        const sym = Symbol("test");
        const target: any = {};
        setValueByIter(target, ["a", sym as any], 1);
        assert.equal(target.a[sym], 1, "The value should be set for the symbol key");

        const target2: any = {};
        setValueByIter(target2, [sym as any], 2);
        assert.equal(target2[sym], 2, "The value should be set for the only (symbol) key");
    });

    it("only removes the object it added, rather than a value which replaced it", () => {
        const target: any = {};
        const keys = ["x", "y", "__proto__"];
        let idx = 0;
        const iter: any = {
            next: () => {
                if (idx === 2) {
                    // Replace the object which was added for "x" before the unsafe key
                    target.x = "replaced";
                }

                return idx < keys.length ? { value: keys[idx++], done: false } : { value: undefined, done: true };
            },
            return: () => ({ done: true })
        };

        setValueByIter(target, iter, 1);
        assert.deepEqual(target, { x: "replaced" }, "The replacement should not be removed");
    });

    it("uses a key which is (or converts to) an empty string, like setValueByKey", () => {
        const target1: any = {};
        setValueByIter(target1, ["a", "", "b"], 1);
        assert.deepEqual(target1, { a: { "": { b: 1 } } });

        const target2: any = {};
        setValueByIter(target2, ["a", [] as any, "b"], 1);
        assert.deepEqual(target2, { a: { "": { b: 1 } } }, "An empty array converts to an empty string");

        const target3: any = {};
        setValueByKey(target3, "a..b", 1);
        assert.deepEqual(target3, { a: { "": { b: 1 } } });

        const target4: any = {};
        setValueByIter(target4, ["a", ""], 1);
        assert.deepEqual(target4, { a: { "": 1 } });
    });
});

describe("setValueByKey and setValueByIter replace an inherited function with an own object", () => {
    function _hasOwn(value: any, key: string) {
        // Not using hasOwnProperty.call(), as a failure would have replaced it
        return !!Object.getOwnPropertyDescriptor(value, key);
    }

    it("doesn't add a property to a built-in function (eg. for a path from JSON)", () => {
        const body = JSON.parse("{\"path\":\"hasOwnProperty.call\",\"value\":\"pwned\"}");
        const results: any = {};
        try {
            const target1: any = {};
            setValueByKey(target1, body.path, body.value);
            results.target1 = target1;
            results.hasOwnPropertyCall = _hasOwn(Object.prototype.hasOwnProperty, "call");

            const target2: any = {};
            setValueByIter(target2, ["toString", "call"], "pwned");
            results.target2 = target2;
            results.toStringCall = _hasOwn(Object.prototype.toString, "call");

            setValueByKey({ list: [] }, "list.push.apply", "pwned");
            results.pushApply = _hasOwn(Array.prototype.push, "apply");

            setValueByIter(function () {}, ["call", "x"], "pwned");
            results.callX = _hasOwn(Function.prototype.call, "x");
        } finally {
            // So a failure doesn't leave the built-in functions changed for the later tests
            delete (Object.prototype.hasOwnProperty as any).call;
            delete (Object.prototype.toString as any).call;
            delete (Array.prototype.push as any).apply;
            delete (Function.prototype.call as any).x;
        }

        assert.isFalse(results.hasOwnPropertyCall, "Object.prototype.hasOwnProperty.call should not be replaced");
        assert.isFalse(results.toStringCall, "Object.prototype.toString.call should not be replaced");
        assert.isFalse(results.pushApply, "Array.prototype.push.apply should not be replaced");
        assert.isFalse(results.callX, "Function.prototype.call should not be changed");
        assert.deepEqual(results.target1, { hasOwnProperty: { call: "pwned" } }, "The target's own property should be set");
        assert.deepEqual(results.target2, { toString: { call: "pwned" } }, "The target's own property should be set");
    });

    it("sets an own property of the instance rather than changing an inherited method of a class", () => {
        class Foo {
            public method() {
                return "method";
            }
        }

        const instance: any = new Foo();
        setValueByKey(instance, "method.x", 1);
        setValueByIter(instance, ["method", "y"], 2);

        assert.deepEqual(instance.method, { x: 1, y: 2 }, "The instance's own method should be replaced");
        assert.isFalse(_hasOwn(Foo.prototype.method, "x"), "The class method should not be changed");
        assert.isFalse(_hasOwn(Foo.prototype.method, "y"), "The class method should not be changed");
        assert.equal(new Foo().method(), "method", "Other instances still use the class method");
    });

    it("removes the own object which replaced an inherited function when the value isn't set", () => {
        const target: any = {};
        setValueByKey(target, "hasOwnProperty.__proto__.x", 1);
        setValueByIter(target, ["toString", "a", "constructor"], 1);

        assert.isFalse(_hasOwn(target, "hasOwnProperty"), "The added object should be removed");
        assert.isFalse(_hasOwn(target, "toString"), "The added object should be removed");
        assert.isFalse(target.hasOwnProperty("x"), "The inherited function is used again");
    });

    it("still sets a path through an own function", () => {
        const fn: any = function () {};
        const target: any = { fn: fn };
        setValueByKey(target, "fn.value", 1);
        setValueByIter(target, ["fn", "other"], 2);
        assert.equal(fn.value, 1);
        assert.equal(fn.other, 2);
    });

    it("still walks into an inherited value which isn't a function (eg. a getter of a class)", () => {
        const config: any = {};
        const proto: any = {};
        Object.defineProperty(proto, "config", { get: () => config });
        const target = Object.create(proto);

        setValueByKey(target, "config.value", 1);
        setValueByIter(target, ["config", "other"], 2);
        assert.deepEqual(config, { value: 1, other: 2 });
    });

    it("still walks into the object returned by an inherited getter which also has a setter (keeping its values)", () => {
        class Settings {
            private _config: any = { x: 1 };

            public get config(): any {
                return this._config;
            }

            public set config(value: any) {
                this._config = value;
            }
        }

        const instance: any = new Settings();
        setValueByKey(instance, "config.value", 1);
        assert.deepEqual(instance.config, { x: 1, value: 1 }, "The existing object should be used");
        assert.isFalse(_hasOwn(instance, "config"), "No own property should be added");
    });

    it("doesn't walk into an inherited function which is returned after an object was added (eg. by a getter)", () => {
        const fn: any = function () {};
        let reads = 0;
        const proto: any = {};

        // The inherited getter returns null (so an object is added), and then the function rather than the added object
        Object.defineProperty(proto, "g", {
            get: () => reads++ % 2 ? fn : null,
            set: () => {
                // Ignore the added object
            }
        });

        setValueByIter(Object.create(proto), ["g", "x"], 1);
        reads = 0;
        setValueByKey(Object.create(proto), "g.y", 2);
        assert.isFalse(_hasOwn(fn, "x"), "setValueByIter should not change the function");
        assert.isFalse(_hasOwn(fn, "y"), "setValueByKey should not change the function");
    });
});

describe("setValueByKey and setValueByIter don't walk through an unsafe target", () => {
    it("stops when an intervening value is a built-in prototype, rather than adding an object to it", () => {
        const results: any = {};
        try {
            setValueByIter({ p: Object.prototype }, ["p", "polluted", "x"], 1);
            results.iterPolluted = (Object.prototype as any).polluted;

            setValueByKey({ p: Object.prototype }, "p.pollutedKey.y", 2);
            results.keyPolluted = (Object.prototype as any).pollutedKey;
        } finally {
            // So a failure doesn't leave Object.prototype changed for the later tests
            delete (Object.prototype as any).polluted;
            delete (Object.prototype as any).pollutedKey;
        }

        assert.isUndefined(results.iterPolluted, "setValueByIter should not add an object to Object.prototype");
        assert.isUndefined(results.keyPolluted, "setValueByKey should not add an object to Object.prototype");
    });
});

describe("setValueByKey and setValueByIter remove what they added when the value isn't set", () => {
    it("restores an own null or undefined value which an added object replaced", () => {
        const target1: any = { a: null };
        setValueByIter(target1, ["a", "b", "__proto__", "x"], 1);
        assert.isTrue(Object.prototype.hasOwnProperty.call(target1, "a"), "The own property should be kept");
        assert.isNull(target1.a, "The null value should be restored");

        const target2: any = { a: undefined };
        setValueByKey(target2, "a.b.__proto__.x", 1);
        assert.isTrue(Object.prototype.hasOwnProperty.call(target2, "a"), "The own property should be kept");
        assert.isUndefined(target2.a, "The undefined value should be restored");
    });

    it("removes an added object which replaced an inherited null value", () => {
        const target: any = Object.create({ a: null });
        setValueByIter(target, ["a", "b", "__proto__", "x"], 1);
        assert.isFalse(Object.prototype.hasOwnProperty.call(target, "a"), "The added property should be removed");
        assert.isNull(target.a, "The inherited value is used again");
    });

    it("removes the object added for a symbol key", function() {
        if (typeof Symbol !== "function" || !Object.getOwnPropertySymbols) {
            this.skip();
            return;
        }

        // The object is added for the symbol key when the "a" key is processed, before the unsafe key stops the path
        const sym = Symbol("test");
        const target: any = {};
        setValueByIter(target, [sym as any, "a", "__proto__"], 1);
        assert.equal(Object.getOwnPropertySymbols(target).length, 0, "The object added for the symbol should be removed");
    });

    it("removes every object it added for the path (by removing the first one)", () => {
        const target: any = {};
        setValueByIter(target, ["x", "y", "z", "__proto__"], 1);
        assert.deepEqual(target, {}, "setValueByIter should remove the added objects");

        const target2: any = {};
        setValueByKey(target2, "x.y.z.__proto__", 1);
        assert.deepEqual(target2, {}, "setValueByKey should remove the added objects");
    });

    it("setValueByKey removes the objects it added when setting the value throws", () => {
        const propName = "__ts_utils_throws__";
        const error = new Error("setter error");
        const target: any = {};
        let caught: any;
        try {
            Object.defineProperty(Object.prototype, propName, {
                set: () => {
                    throw error;
                },
                configurable: true
            });

            setValueByKey(target, "x." + propName, 1);
        } catch (e) {
            caught = e;
        } finally {
            delete (Object.prototype as any)[propName];
        }

        assert.strictEqual(caught, error, "The setter's error should be thrown");
        assert.deepEqual(target, {}, "The object added for the path should be removed");
    });
});

describe("setValueByIter blocks a converted unsafe key on a function target", () => {
    it("doesn't change the prototype of a function (eg. a class) for a key from JSON", () => {
        function Foo() {
            // A class
        }

        let polluted: any;
        try {
            setValueByIter(Foo, JSON.parse("[[\"prototype\"], \"polluted\"]"), 1);
            polluted = (Foo.prototype as any).polluted;
        } finally {
            delete (Foo.prototype as any).polluted;
        }

        assert.isUndefined(polluted, "The [\"prototype\"] key should be converted and blocked");
    });
});
