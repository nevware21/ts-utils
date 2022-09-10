/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "chai";
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
        scheduleInterval(() => {
            intervalCalled++;
        }, 100);

        assert.equal(0, intervalCalled, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
        }
        clock.tick(1);
        assert.equal(1, intervalCalled, "Interval should have been called only once");

        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(1, intervalCalled, "Interval should have been called only once");
        }
        clock.tick(1);
        assert.equal(2, intervalCalled, "Interval should have been called twice");
    });

    it("cancel interval", () => {
        let intervalCalled = 0;
        let theInterval = scheduleInterval(() => {
            intervalCalled ++;
        }, 100);

        assert.equal(0, intervalCalled, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
        }
        theInterval.cancel();
        clock.tick(1);
        assert.equal(0, intervalCalled, "Interval should not have been called yet");
        clock.tick(1000);
    });

    it("refresh interval", () => {
        let intervalCalled = 0;
        let theInterval = scheduleInterval(() => {
            intervalCalled ++;
        }, 100);

        assert.equal(0, intervalCalled, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
        }
        theInterval.refresh();
        clock.tick(1);
        assert.equal(0, intervalCalled, "Interval should not have been called yet");

        for (let lp = 0; lp < 98; lp++) {
            clock.tick(1);
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
        }
        clock.tick(1);
        assert.equal(1, intervalCalled, "Interval should have been called yet");

        // reset
        theInterval.refresh();
        assert.equal(1, intervalCalled, "Interval should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(1, intervalCalled, "Interval should not have been called yet");
        }
        clock.tick(1);
        assert.equal(2, intervalCalled, "Interval should have been called yet");

    });

    describe("pass extra arguments", () => {
        it("basic Interval", () => {
            let intervalCalled = 0;
            let theArgs: any = null;
            scheduleInterval(function (a, b) {
                intervalCalled ++;
                theArgs = arguments;
            }, 100, "Hello", "Darkness");
    
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, intervalCalled, "Interval should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }
            clock.tick(1);
            assert.equal(1, intervalCalled, "Interval should have been called yet");
            assert.equal(2, theArgs.length);
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
    
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, intervalCalled, "Interval should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }
            theInterval.refresh();
            clock.tick(1);
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
    
            for (let lp = 0; lp < 98; lp++) {
                clock.tick(1);
                assert.equal(0, intervalCalled, "Interval should not have been called yet");
            }
            clock.tick(1);
            assert.equal(1, intervalCalled, "Interval should have been called yet");
            assert.equal(2, theArgs.length);
            assert.equal("Hello", theArgs[0], "First Arg");
            assert.equal("Darkness", theArgs[1], "Second Arg");
        });
    
        it("refresh after cancel Interval", () => {
            let intervalCalled = 0;
            let theInterval = scheduleInterval(() => {
                intervalCalled ++;
            }, 100);
    
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, intervalCalled, "Interval should not have been called yet");
            }
            theInterval.cancel();
            clock.tick(1);
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
    
            theInterval.refresh();
            assert.equal(0, intervalCalled, "Interval should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, intervalCalled, "Interval should not have been called yet");
            }
            clock.tick(1);
            assert.equal(1, intervalCalled, "Interval should have been called yet");
        });
    });

});
