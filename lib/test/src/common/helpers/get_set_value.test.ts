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
});