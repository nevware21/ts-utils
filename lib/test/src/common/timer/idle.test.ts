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
            scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.equal(false, deadline.didTimeout, "Expected the deadline to not be timedout - " + dumpObj(deadline));
                isDone = true;
                done();
                if (waitTimeout) {
                    orgClearTimeout(waitTimeout);
                }
            });
    
            assert.equal(0, idleCalled, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, idleCalled, "Idle should not have been called yet");
            }
            clock.tick(1);
            assert.equal(0, idleCalled, "Idle should not yet have been called");

            waitTimeout = orgTimeout(() => {
                if (!isDone) {
                    assert.equal(1, idleCalled, "Idle should have been called only once");
                    done();
                }
            }, 1000);
        });

        it("cancel idle with real requestIdleCallback", (done) => {
            let idleCalled = 0;
    
            assert.ok(hasIdleCallback(), "Expected the requestIdleCallback to exist");
            let theIdle = scheduleIdleCallback((deadline) => {
                idleCalled++;
                assert.ok(false, "should not have been called");
            });
            theIdle.cancel();
    
            assert.equal(0, idleCalled, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, idleCalled, "Idle should not have been called yet");
            }
            clock.tick(1);
            assert.equal(0, idleCalled, "Idle should not have been called");

            orgTimeout(() => {
                assert.equal(0, idleCalled, "Idle should still not have been called");
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
                assert.equal(false, deadline.didTimeout, "Expected the deadline to not be timedout - " + dumpObj(deadline));
                isDone = true;
                done();
                if (waitTimeout) {
                    orgClearTimeout(waitTimeout);
                }
            });
            theIdle.cancel();
    
            assert.equal(0, idleCalled, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, idleCalled, "Idle should not have been called yet");
            }
            clock.tick(1);
            assert.equal(0, idleCalled, "Idle should still not have been called");

            theIdle.refresh();
            clock.tick(99);
            waitTimeout = orgTimeout(() => {
                if (!isDone) {
                    assert.equal(1, idleCalled, "Idle should have been called only once");
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
            });
    
            afterEach(() => {
                (<any>getGlobal()).performance = orgPerformance;
            });
    
            it("basic idle", () => {
                let startTime = perfNow();
                let idleCalled = 0;
                let idleIterations = 0;

                assert.ok(!hasIdleCallback(), "Expected the requestIdleCallback to not exist");
                scheduleIdleCallback((deadline) => {
                    idleCalled++;
                    assert.equal(true, deadline.didTimeout, "Expected the timeout to have timed out");
                    while (deadline.timeRemaining() > 0) {
                        idleIterations++;
                        clock.tick(1);
                    }
                }, {
                    timeout: 100
                });
        
                assert.equal(0, idleCalled, "Idle should not have been called yet");
                for (let lp = 0; lp < 99; lp++) {
                    clock.tick(1);
                    assert.equal(0, idleCalled, "Idle should not have been called yet");
                }
                assert.equal(99, elapsedTime(startTime), "Calculated passed time");
                clock.tick(1);
                assert.equal(1, idleCalled, "Idle should have been called only once");
                assert.equal(50, idleIterations, "Idle should have been called only once");
                assert.equal(150, elapsedTime(startTime), "Calculated passed time including the deadline and max execution");
            });

            it("set default timeout and execution time", () => {
                let startTime = perfNow();
                let idleCalled = 0;
                let idleIterations = 0;

                assert.ok(!hasIdleCallback(), "Expected the requestIdleCallback to not exist");
                setDefaultIdleTimeout(150);
                setDefaultMaxExecutionTime(42);
                scheduleIdleCallback((deadline) => {
                    idleCalled++;
                    assert.equal(true, deadline.didTimeout, "Expected the timeout to have timed out");
                    while (deadline.timeRemaining() > 0) {
                        idleIterations++;
                        clock.tick(1);
                    }
                });
        
                assert.equal(0, idleCalled, "Idle should not have been called yet");
                for (let lp = 0; lp < 149; lp++) {
                    clock.tick(1);
                    assert.equal(0, idleCalled, "Idle should not have been called yet");
                }
                assert.equal(149, elapsedTime(startTime), "Calculated passed time");
                clock.tick(1);
                assert.equal(1, idleCalled, "Idle should have been called only once");
                assert.equal(42, idleIterations, "Idle should have been called only once");
                assert.equal(192, elapsedTime(startTime), "Calculated passed time including the deadline and max execution");
            });
        });

        it("cancel idle", () => {
            let idleCalled = 0;
            let theIdle = scheduleIdleCallback(() => {
                idleCalled ++;
            }, {
                timeout: 100
            });
    
            assert.equal(0, idleCalled, "Idle should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(0, idleCalled, "Idle should not have been called yet");
            }
            theIdle.cancel();
            clock.tick(1);
            assert.equal(0, idleCalled, "Idle should not have been called yet");
            clock.tick(1000);
        });
    });
});
