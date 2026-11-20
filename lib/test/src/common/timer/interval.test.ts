/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "@nevware21/tripwire-chai";
import { scheduleInterval } from "../../../../src/timer/interval";

describe("interval tests", () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it("basic interval", () => {
        let intervalCalled = 0;
        let handler = scheduleInterval(() => {
            intervalCalled++;
        }, 100);

        assert.equal(handler.enabled, true, "Check that the handler is running");
        assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        }
        clock.tick(1);
        assert.equal(intervalCalled, 1, "Interval should have been called only once");
        assert.equal(handler.enabled, true, "Check that the handler is running");

        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(intervalCalled, 1, "Interval should have been called only once");
        }
        clock.tick(1);
        assert.equal(intervalCalled, 2, "Interval should have been called twice");
        assert.equal(handler.enabled, true, "Check that the handler is running");
    });

    it("cancel interval", () => {
        let intervalCalled = 0;
        let theInterval = scheduleInterval(() => {
            intervalCalled ++;
        }, 100);

        assert.equal(theInterval.enabled, true, "Check that the handler is running");
        assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        }
        theInterval.cancel();
        assert.equal(theInterval.enabled, false, "Check that the handler is stopped");

        clock.tick(1);
        assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        clock.tick(1000);
    });

    it("refresh interval", () => {
        let intervalCalled = 0;
        let theInterval = scheduleInterval(() => {
            intervalCalled ++;
        }, 100);

        assert.equal(theInterval.enabled, true, "Check that the handler is running");
        assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        }
        theInterval.refresh();
        assert.equal(theInterval.enabled, true, "Check that the handler is running");

        clock.tick(1);
        assert.equal(intervalCalled, 0, "Interval should not have been called yet");

        for (let lp = 0; lp < 98; lp++) {
            clock.tick(1);
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
        }
        clock.tick(1);
        assert.equal(intervalCalled, 1, "Interval should have been called yet");
        assert.equal(theInterval.enabled, true, "Check that the handler is running");

        // reset
        theInterval.refresh();
        assert.equal(theInterval.enabled, true, "Check that the handler is running");
        assert.equal(intervalCalled, 1, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(intervalCalled, 1, "Interval should not have been called yet");
        }
        clock.tick(1);
        assert.equal(intervalCalled, 2, "Interval should have been called yet");
        assert.equal(theInterval.enabled, true, "Check that the handler is running");
    });

    describe("pass extra arguments", () => {
        it("basic Interval", () => {
            let intervalCalled = 0;
            let theArgs: any = null;
            let theInterval = scheduleInterval(function (a, b) {
                intervalCalled ++;
                theArgs = arguments;
            }, 100, "Hello", "Darkness");
    
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(intervalCalled, 0, "Interval should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }
            clock.tick(1);
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
            assert.equal(intervalCalled, 1, "Interval should have been called yet");
            assert.equal(theArgs.length, 2);
            assert.equal("Hello", theArgs[0], "First Arg");
            assert.equal("Darkness", theArgs[1], "Second Arg");
        });
    
        it("Interval with refresh", () => {
            let intervalCalled = 0;
            let theArgs: any = null;
            let theInterval = scheduleInterval(function (a, b) {
                intervalCalled ++;
                theArgs = arguments;
            }, 100, "Hello", "Darkness");
    
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(intervalCalled, 0, "Interval should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }
            theInterval.refresh();
            assert.equal(theInterval.enabled, true, "Check that the handler is running");

            clock.tick(1);
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
    
            for (let lp = 0; lp < 98; lp++) {
                clock.tick(1);
                assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            }
            clock.tick(1);
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
            assert.equal(intervalCalled, 1, "Interval should have been called yet");
            assert.equal(2, theArgs.length);
            assert.equal("Hello", theArgs[0], "First Arg");
            assert.equal("Darkness", theArgs[1], "Second Arg");
        });
    
        it("refresh after cancel Interval", () => {
            let intervalCalled = 0;
            let theInterval = scheduleInterval(() => {
                intervalCalled ++;
            }, 100);
    
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            }
            theInterval.cancel();
            assert.equal(theInterval.enabled, false, "Check that the handler is stopped");

            clock.tick(1);
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
    
            theInterval.refresh();
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
            assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(intervalCalled, 0, "Interval should not have been called yet");
            }
            clock.tick(1);
            assert.equal(intervalCalled, 1, "Interval should have been called yet");
            assert.equal(theInterval.enabled, true, "Check that the handler is running");
        });
    });
});

// Real timers (the fake timers are only used by the "interval tests" above)
describe("scheduleInterval callback this", () => {
    it("calls the callback with the this which setInterval passes (eg. Node's Timeout)", (done) => {
        let nativeThis: any = "not called";
        let libThis: any = "not called";
        let nativeId = setInterval(function (this: any) {
            nativeThis = this;
            clearInterval(nativeId);
        }, 1);

        let handler = scheduleInterval(function (this: any) {
            libThis = this;
            handler.cancel();
        }, 1);

        setTimeout(() => {
            handler.cancel();
            clearInterval(nativeId);
            try {
                assert.notEqual(libThis, "not called", "The callback was called");
                assert.equal(typeof libThis, typeof nativeThis, "The same kind of this as a callback passed to setInterval directly");
                if (nativeThis && typeof nativeThis.unref === "function") {
                    // Node, where it is the interval's Timeout
                    assert.isFunction(libThis.unref);
                }

                done();
            } catch (e) {
                done(e);
            }
        }, 50);
    });

    it("a callback which calls clearInterval(this) stops the interval when setInterval passes its timer (eg. Node)", (done) => {
        // Find out whether the runtime passes the timer as this (eg. Node's Timeout, while a browser passes the window)
        let probeThis: any;
        let probeId = setInterval(function (this: any) {
            probeThis = this;
            clearInterval(probeId);
        }, 1);

        setTimeout(() => {
            clearInterval(probeId);
            if (!probeThis || typeof probeThis.unref !== "function") {
                done();
                return;
            }

            let calls = 0;
            let handler = scheduleInterval(function (this: any) {
                calls++;
                clearInterval(this);
            }, 1);

            setTimeout(() => {
                handler.cancel();
                try {
                    assert.equal(calls, 1, "clearInterval(this) stopped the interval");
                    done();
                } catch (e) {
                    done(e);
                }
            }, 60);
        }, 20);
    });
});
