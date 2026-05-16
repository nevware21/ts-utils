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