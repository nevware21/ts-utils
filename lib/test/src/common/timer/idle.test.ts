/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "@nevware21/tripwire-chai";
import {
    hasIdleCallback,
    scheduleIdleCallback,
    setDefaultMaxExecutionTime,
    setDefaultIdleTimeout,
    getIdleCallback,
    getCancelIdleCallback
} from "../../../../src/timer/idle";
import { getGlobal } from "../../../../src/helpers/environment";
import { elapsedTime, perfNow } from "../../../../src/helpers/perf";
import { dumpObj } from "../../../../src/helpers/diagnostics";
import { setBypassLazyCache } from "../../../../src/helpers/lazy";

function tryCatch(cb: () => void) {
    try {
        cb();
    } catch(e) {
        // Node Environment
    }
}

describe("idle tests", () => {
    let orgTimeout = setTimeout;
    let orgClearTimeout = clearTimeout;
    let clock: sinon.SinonFakeTimers;
    let theRequestIdleCallback: any = null;

    tryCatch(() => theRequestIdleCallback = requestIdleCallback);

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        setBypassLazyCache(true);
    });

    afterEach(() => {
        clock.restore();
        setBypassLazyCache(false);
    });

    it("hasIdleCallback", () => {
        assert.equal(hasIdleCallback(), !!theRequestIdleCallback, "Check if we have a window instance");
    });

    if (theRequestIdleCallback) {
        it("basic idle with real requestIdleCallback", (done) => {
            let idleCalled = 0;
            let isDone = false;
            let waitTimeout: any;
    
            assert.ok(hasIdleCallback(), "Expected the requestIdleCallback to exist");
            let handler = scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.equal(deadline.didTimeout, false, "Expected the deadline to not be timedout - " + dumpObj(deadline));
                isDone = true;
                done();
                if (waitTimeout) {
                    orgClearTimeout(waitTimeout);
                }
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            assert.equal(idleCalled, 0, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(idleCalled, 0, "Idle should not have been called yet");
            }
            clock.tick(1);
            assert.equal(idleCalled, 0, "Idle should not yet have been called");

            waitTimeout = orgTimeout(() => {
                if (!isDone) {
                    assert.equal(idleCalled, 1, "Idle should have been called only once");
                    done();
                }
            }, 1000);

            assert.equal(handler.enabled, false, "Check that the handler is stopped");
        });

        it("cancel idle with real requestIdleCallback", (done) => {
            let idleCalled = 0;
    
            assert.ok(hasIdleCallback(), "Expected the requestIdleCallback to exist");
            let theIdle = scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.ok(false, "should not have been called");
            });

            assert.equal(theIdle.enabled, true, "Check that the handler is running");
            theIdle.cancel();
            assert.equal(theIdle.enabled, false, "Check that the handler is stopped");

            assert.equal(idleCalled, 0, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(idleCalled, 0, "Idle should not have been called yet");
            }
            clock.tick(1);
            assert.equal(idleCalled, 0, "Idle should not have been called");

            orgTimeout(() => {
                assert.equal(idleCalled, 0, "Idle should still not have been called");
                done();
            }, 1000);
        });

        it("cancel and refresh idle with real requestIdleCallback", (done) => {
            let idleCalled = 0;
            let isDone = true;
            let waitTimeout: any;
    
            assert.ok(hasIdleCallback(), "Expected the requestIdleCallback to exist");
            let theIdle = scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.equal(deadline.didTimeout, false, "Expected the deadline to not be timedout - " + dumpObj(deadline));
                isDone = true;
                done();
                if (waitTimeout) {
                    orgClearTimeout(waitTimeout);
                }
            });

            assert.equal(theIdle.enabled, true, "Check that the handler is running");
            theIdle.cancel();
            assert.equal(theIdle.enabled, false, "Check that the handler is stopped");
    
            assert.equal(idleCalled, 0, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(idleCalled, 0, "Idle should not have been called yet");
            }
            clock.tick(1);
            assert.equal(idleCalled, 0, "Idle should still not have been called");

            assert.equal(theIdle.enabled, false, "Check that the handler is stopped");
            theIdle.refresh();
            assert.equal(theIdle.enabled, true, "Check that the handler is running");
            clock.tick(99);
            waitTimeout = orgTimeout(() => {
                if (!isDone) {
                    assert.equal(idleCalled, 0, "Idle should have been called only once");
                    done();
                }
            }, 1000);
        });
    }

    it("getIdleCallback and getCancelIdleCallback", () => {
        // Test the getIdleCallback function directly
        const requestIdleFn = getIdleCallback();
        assert.equal(!!requestIdleFn, !!theRequestIdleCallback, "getIdleCallback should match environment capabilities");
        
        // Test the getCancelIdleCallback function directly
        const cancelIdleFn = getCancelIdleCallback();
        assert.equal(!!cancelIdleFn, !!theRequestIdleCallback, "getCancelIdleCallback should match environment capabilities");
    });

    describe("remove requestIdleCallback", () => {

        beforeEach(() => {
            setDefaultMaxExecutionTime(50);
            (<any>getGlobal()).requestIdleCallback = null;
            setBypassLazyCache(true);
        });
    
        afterEach(() => {
            (<any>getGlobal()).requestIdleCallback = theRequestIdleCallback;
            setBypassLazyCache(false);
        });

        describe("Disable performance", () => {
            let orgPerformance = performance;

            beforeEach(() => {
                (<any>getGlobal()).performance = null;
                // Disable lazy caching
                setBypassLazyCache(true);
            });
    
            afterEach(() => {
                (<any>getGlobal()).performance = orgPerformance;
                // Re-enable lazy caching
                setBypassLazyCache(false);
            });
    
            it("basic idle", () => {
                let startTime = perfNow();
                let idleCalled = 0;
                let idleIterations = 0;

                assert.ok(!hasIdleCallback(), "Expected the requestIdleCallback to not exist");
                let handler = scheduleIdleCallback((deadline) => {
                    idleCalled++;
                    assert.equal(deadline.didTimeout, true, "Expected the timeout to have timed out");
                    while (deadline.timeRemaining() > 0) {
                        idleIterations++;
                        clock.tick(1);
                    }
                }, {
                    timeout: 100
                });

                assert.equal(handler.enabled, true, "Check that the handler is running");
                assert.equal(idleCalled, 0, "Idle should not have been called yet");
                for (let lp = 0; lp < 99; lp++) {
                    clock.tick(1);
                    assert.equal(idleCalled, 0, "Idle should not have been called yet");
                }
                assert.equal(elapsedTime(startTime), 99, "Calculated passed time");
                clock.tick(1);
                assert.equal(idleCalled, 1, "Idle should have been called only once");
                assert.equal(idleIterations, 50, "Idle should have been called only once");
                assert.equal(elapsedTime(startTime), 150, "Calculated passed time including the deadline and max execution");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
            });

            it("set default timeout and execution time", () => {
                let startTime = perfNow();
                let idleCalled = 0;
                let idleIterations = 0;

                assert.ok(!hasIdleCallback(), "Expected the requestIdleCallback to not exist");
                setDefaultIdleTimeout(150);
                setDefaultMaxExecutionTime(42);
                let handler = scheduleIdleCallback((deadline) => {
                    idleCalled++;
                    assert.equal(deadline.didTimeout, true, "Expected the timeout to have timed out");
                    while (deadline.timeRemaining() > 0) {
                        idleIterations++;
                        clock.tick(1);
                    }
                });

                assert.equal(handler.enabled, true, "Check that the handler is running");
                assert.equal(idleCalled, 0, "Idle should not have been called yet");
                for (let lp = 0; lp < 149; lp++) {
                    clock.tick(1);
                    assert.equal(idleCalled, 0, "Idle should not have been called yet");
                }
                assert.equal(elapsedTime(startTime), 149, "Calculated passed time");
                clock.tick(1);
                assert.equal(idleCalled, 1, "Idle should have been called only once");
                assert.equal(idleIterations, 42, "Idle should have been called only once");
                assert.equal(elapsedTime(startTime), 192, "Calculated passed time including the deadline and max execution");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
            });
        });

        it("cancel idle", () => {
            let idleCalled = 0;
            let theIdle = scheduleIdleCallback(() => {
                idleCalled ++;
            }, {
                timeout: 100
            });
    
            assert.equal(theIdle.enabled, true, "Check that the handler is running");
            assert.equal(idleCalled, 0, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(idleCalled, 0, "Idle should not have been called yet");
            }
            theIdle.cancel();
            assert.equal(theIdle.enabled, false, "Check that the handler is stopped");

            clock.tick(1);
            assert.equal(idleCalled, 0, "Idle should not have been called yet");
            clock.tick(1000);
        });
    });

    describe("setDefaultIdleTimeout tests", () => {
        // Store the original state to restore it later
        let originalRequestIdleCallback: any;

        beforeEach(() => {
            originalRequestIdleCallback = (<any>getGlobal()).requestIdleCallback;
            (<any>getGlobal()).requestIdleCallback = null;
            setBypassLazyCache(true);
        });

        afterEach(() => {
            (<any>getGlobal()).requestIdleCallback = originalRequestIdleCallback;
            setBypassLazyCache(false);
        });

        it("should use the set default timeout when no timeout provided", () => {
            let idleCalled = 0;
            setDefaultIdleTimeout(200); // Setting a different timeout value

            const handler = scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.equal(deadline.didTimeout, true, "Expected the deadline to be timed out");
            });

            assert.ok(!!handler, "Expected the handler to be created");

            // Should not be called before the timeout period
            clock.tick(199);
            assert.equal(idleCalled, 0, "Callback should not be called before timeout");

            // Should be called exactly at the timeout
            clock.tick(1);
            assert.equal(idleCalled, 1, "Callback should be called after timeout");
        });

        it("should respect the provided timeout over default timeout", () => {
            let idleCalled = 0;
            setDefaultIdleTimeout(500); // Setting default to 500ms

            const handler = scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.equal(deadline.didTimeout, true, "Expected the deadline to be timed out");
            }, { timeout: 150 }); // But requesting 150ms timeout

            assert.ok(!!handler, "Expected the handler to be created");

            // Should not be called before the provided timeout
            clock.tick(149);
            assert.equal(idleCalled, 0, "Callback should not be called before provided timeout");

            // Should be called at the provided timeout, not the default
            clock.tick(1);
            assert.equal(idleCalled, 1, "Callback should be called after provided timeout");
        });
    });

    describe("fallback implementation refresh tests", () => {
        let originalRequestIdleCallback: any;

        beforeEach(() => {
            originalRequestIdleCallback = (<any>getGlobal()).requestIdleCallback;
            (<any>getGlobal()).requestIdleCallback = null;
            setBypassLazyCache(true);
        });

        afterEach(() => {
            (<any>getGlobal()).requestIdleCallback = originalRequestIdleCallback;
            setBypassLazyCache(false);
        });

        it("should restart the timer when refresh is called", () => {
            let callCount = 0;
            setDefaultIdleTimeout(100);
            
            const handler = scheduleIdleCallback(() => {
                callCount++;
            });

            assert.ok(!!handler, "Expected the handler to be created");
            
            // Advance time to just before the timeout
            clock.tick(90);
            assert.equal(callCount, 0, "Callback should not be called yet");
            
            // Refresh the timer, which should reset the countdown
            handler.refresh();
            
            // Advance time to cover the original timeout
            clock.tick(20);
            assert.equal(callCount, 0, "Callback should not be called yet because timer was refreshed");
            
            // Now advance to the new timeout
            clock.tick(80);
            assert.equal(callCount, 1, "Callback should be called after the new timeout period");
        });

        it("should enable the timer when refresh is called after cancel", () => {
            let callCount = 0;
            setDefaultIdleTimeout(100);
            
            const handler = scheduleIdleCallback(() => {
                callCount++;
            });
            
            // Cancel the timer
            handler.cancel();
            assert.equal(handler.enabled, false, "Timer should be disabled after cancel");
            
            // Advance time - nothing should happen
            clock.tick(150);
            assert.equal(callCount, 0, "Callback should not be called after cancel");
            
            // Refresh the timer, which should re-enable it
            handler.refresh();
            assert.equal(handler.enabled, true, "Timer should be enabled after refresh");
            
            // Advance time to the new timeout
            clock.tick(100);
            assert.equal(callCount, 1, "Callback should be called after refresh and timeout");
        });
    });
});
