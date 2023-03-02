/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "chai";
import { hasIdleCallback, scheduleIdleCallback, setDefaultMaxExecutionTime, setDefaultIdleTimeout } from "../../../../src/timer/idle";
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
    });

    afterEach(() => {
        clock.restore();
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

    describe("remove requestIdleCallback", () => {

        beforeEach(() => {
            setDefaultMaxExecutionTime(50);
            (<any>getGlobal()).requestIdleCallback = null;
        });
    
        afterEach(() => {
            (<any>getGlobal()).requestIdleCallback = theRequestIdleCallback;
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
});
