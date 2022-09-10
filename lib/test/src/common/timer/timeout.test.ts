/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "chai";
import { scheduleTimeout, setTimeoutOverride } from "../../../../src/timer/timeout";

describe("timeout tests", () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it("basic timeout", () => {
        let timeoutCalled = false;
        scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(true, timeoutCalled, "Timeout should have been called yet");
    });

    it("cancel timeout", () => {
        let timeoutCalled = false;
        let theTimeout = scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        }
        theTimeout.cancel();
        clock.tick(1);
        assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
    });

    it("refresh timeout", () => {
        let timeoutCalled = false;
        let theTimeout = scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        }
        theTimeout.refresh();
        clock.tick(1);
        assert.equal(false, timeoutCalled, "Timeout should not have been called yet");

        for (let lp = 0; lp < 98; lp++) {
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(true, timeoutCalled, "Timeout should have been called yet");

        // reset
        theTimeout.refresh();
        timeoutCalled = false;
        assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(true, timeoutCalled, "Timeout should have been called yet");

    });

    describe("pass extra arguments", () => {
        it("basic timeout", () => {
            let timeoutCalled = false;
            let theArgs: any = null;
            scheduleTimeout(function (a, b) {
                timeoutCalled = true;
                theArgs = arguments;
            }, 100, "Hello", "Darkness");
    
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }
            clock.tick(1);
            assert.equal(true, timeoutCalled, "Timeout should have been called yet");
            assert.equal(2, theArgs.length);
            assert.equal("Hello", theArgs[0], "First Arg");
            assert.equal("Darkness", theArgs[1], "Second Arg");
        });
    
        it("timeout with refresh", () => {
            let timeoutCalled = false;
            let theArgs: any = null;
            let theTimeout = scheduleTimeout(function (a, b) {
                timeoutCalled = true;
                theArgs = arguments;
            }, 100, "Hello", "Darkness");
    
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }
            theTimeout.refresh();
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
    
            for (let lp = 0; lp < 98; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(true, timeoutCalled, "Timeout should have been called yet");
            assert.equal(2, theArgs.length);
            assert.equal("Hello", theArgs[0], "First Arg");
            assert.equal("Darkness", theArgs[1], "Second Arg");
        });
    
        it("refresh after cancel timeout", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            }
            theTimeout.cancel();
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
    
            theTimeout.refresh();
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(true, timeoutCalled, "Timeout should have been called yet");
        });
    });

    describe("override timeout", () => {
        let overrideCalled = 0;

        function newSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            overrideCalled++;
            return setTimeout(callback, timeout);
        }

        beforeEach(() => {
            setTimeoutOverride(newSetTimeoutFn);
        });
    
        afterEach(() => {
            setTimeoutOverride(null);
        });

        it("basic timeout", () => {
            let timeoutCalled = false;
            scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            assert.equal(1, overrideCalled, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
                assert.equal(1, overrideCalled, "The override should not have been called yet");
            }
            clock.tick(1);
            assert.equal(true, timeoutCalled, "Timeout should have been called yet");
            assert.equal(1, overrideCalled, "The override should have been called");
        });
    });

    describe("override timeout refresh after cancel", () => {
        let overrideCalled = 0;

        function newSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            overrideCalled ++;
            return setTimeout(callback, timeout);
        }

        beforeEach(() => {
            setTimeoutOverride(newSetTimeoutFn);
        });
    
        afterEach(() => {
            setTimeoutOverride(null);
        });

        it("basic timeout", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            assert.equal(1, overrideCalled, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
                assert.equal(1, overrideCalled, "The override should not have been called yet");
            }

            theTimeout.cancel();
            clock.tick(1);
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            assert.equal(1, overrideCalled, "The override should not have been called yet");

            theTimeout.refresh();
            assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
            assert.equal(2, overrideCalled, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(false, timeoutCalled, "Timeout should not have been called yet");
                assert.equal(2, overrideCalled, "The override should not have been called yet");
            }
            clock.tick(1);
            assert.equal(true, timeoutCalled, "Timeout should have been called yet");
            assert.equal(2, overrideCalled, "The override should have been called");
        });
    });
});