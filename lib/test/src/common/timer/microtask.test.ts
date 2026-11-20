/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "@nevware21/tripwire-chai";
import { getGlobal, getQueueMicrotask, hasQueueMicrotask } from "../../../../src/helpers/environment";
import { setBypassLazyCache } from "../../../../src/helpers/lazy";
import { scheduleMicrotask, setMicroTaskFallbackOptions } from "../../../../src/timer/microtask";
import { _getMicrotaskQueueFn } from "../../../../src/timer/microtasks/microtaskQueue";
import { _addMicrotaskQueue, _resetSharedTimer } from "../../../../src/timer/microtasks/timerQueue";
import { _runMicroTask } from "../../../../src/timer/microtasks/runMicrotask";
import { createTimeout, scheduleTimeout, setTimeoutOverrides } from "../../../../src/timer/timeout";
import { _clearTaskQueues, _eTaskQueueType } from "../../../../src/timer/microtasks/taskQueue";
import { scheduleInterval } from "../../../../src/timer/interval";

describe("microtask tests", () => {
    let orgPromise: any;
    let orgQueueMicrotask: any;
    let orgSetTimeout: any;

    before(() => {
        orgPromise = (<any>getGlobal()).Promise;
        orgQueueMicrotask = (<any>getGlobal()).queueMicrotask;
        orgSetTimeout = setTimeout;
    });

    beforeEach(() => {
        setBypassLazyCache(true);
        setMicroTaskFallbackOptions();
        (<any>getGlobal()).Promise = orgPromise;
        (<any>getGlobal()).queueMicrotask = orgQueueMicrotask;
    });

    afterEach(() => {
        (<any>getGlobal()).Promise = orgPromise;
        (<any>getGlobal()).queueMicrotask = orgQueueMicrotask;
        _clearTaskQueues();
        _resetSharedTimer();
        setTimeoutOverrides();
        setMicroTaskFallbackOptions();
        setBypassLazyCache(false);
    });

    it("hasQueueMicrotask", () => {
        assert.equal(hasQueueMicrotask(), !!orgQueueMicrotask, "Check if we have queueMicrotask support");
        assert.equal(!!getQueueMicrotask(), !!orgQueueMicrotask, "Check direct queueMicrotask getter");
    });

    it("surfaces exceptions thrown by a microtask", (done) => {
        let thrownError: Error | undefined;
        let expectedError = new Error("microtask failure");
        let testTimeoutOverride = ((callback: () => void) => {
            orgSetTimeout(() => {
                try {
                    callback();
                } catch (e) {
                    thrownError = e as Error;
                }
            }, 0);

            return 0;
        }) as any;

        setTimeoutOverrides(testTimeoutOverride);

        _runMicroTask(() => {
            throw expectedError;
        });

        orgSetTimeout(() => {
            assert.equal(thrownError, expectedError, "Expected the microtask error to be re-thrown on a new task");
            done();
        }, 10);
    });

    it("scheduleMicroTask with available microtask queue", (done) => {
        let events: string[] = [];
        let handler = scheduleMicrotask(() => {
            events.push("micro");
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        events.push("sync");

        orgSetTimeout(() => {
            events.push("timeout");
            assert.deepEqual(events, ["sync", "micro", "timeout"], "Expected microtask ordering");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 0);
    });

    it("cancel prevents callback with available microtask queue", (done) => {
        let called = 0;
        let handler = scheduleMicrotask(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.cancel();
        assert.equal(handler.enabled, false, "Check that the handler is stopped");

        orgSetTimeout(() => {
            assert.equal(called, 0, "Expected callback to not run after cancel");
            done();
        }, 0);
    });

    it("refresh reschedules callback with available microtask queue", (done) => {
        let called = 0;
        let handler = scheduleMicrotask(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.refresh();
        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(called, 1, "Expected callback to run once after refresh");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 0);
    });

    it("supports callback arguments with available microtask queue", (done) => {
        let calledName: string;
        let calledCount: number;

        let handler = scheduleMicrotask((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["micro", 42]);

        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(calledName, "micro", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 42, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 0);
    });

    it("forwards callback arguments via native queueMicrotask implementation", (done) => {
        let theGlobal: any = getGlobal();
        let queueCalls = 0;
        let calledName: string;
        let calledCount: number;

        theGlobal.queueMicrotask = (callback: () => void) => {
            queueCalls++;
            orgSetTimeout(callback, 0);
        };

        let handler = scheduleMicrotask((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["native", 101]);

        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(queueCalls, 1, "Expected native queueMicrotask implementation to be used once");
            assert.equal(calledName, "native", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 101, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("enabled=false then enabled=true re-schedules with available microtask queue", (done) => {
        let called = 0;
        let handler = scheduleMicrotask(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.enabled = false;
        assert.equal(handler.enabled, false, "Check that the handler is stopped");
        handler.enabled = true;
        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(called, 1, "Expected callback to run once after enabled toggle");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 0);
    });

    describe("without queueMicrotask", () => {
        beforeEach(() => {
            (<any>getGlobal()).queueMicrotask = null;
        });

        afterEach(() => {
            setMicroTaskFallbackOptions();
        });

        it("refresh reschedules Promise fallback callback", (done) => {
            let called = 0;
            let handler = scheduleMicrotask(() => {
                called++;
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            handler.refresh();
            assert.equal(handler.enabled, true, "Check that the handler is running");

            orgSetTimeout(() => {
                assert.equal(called, 1, "Expected callback to run once after refresh");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 0);
        });

        it("enabled=false then enabled=true re-schedules Promise fallback callback", (done) => {
            let called = 0;
            let handler = scheduleMicrotask(() => {
                called++;
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            handler.enabled = false;
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            handler.enabled = true;
            assert.equal(handler.enabled, true, "Check that the handler is running");

            orgSetTimeout(() => {
                assert.equal(called, 1, "Expected callback to run once after enabled toggle");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 0);
        });

        it("uses Promise fallback", (done) => {
            let events: string[] = [];
            let handler = scheduleMicrotask(() => {
                events.push("micro");
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            events.push("sync");

            orgSetTimeout(() => {
                events.push("timeout");
                assert.deepEqual(events, ["sync", "micro", "timeout"], "Expected Promise microtask ordering");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 0);
        });

        it("cancel prevents Promise fallback callback", (done) => {
            let called = false;
            let handler = scheduleMicrotask(() => {
                called = true;
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            handler.cancel();
            assert.equal(handler.enabled, false, "Check that the handler is stopped");

            orgSetTimeout(() => {
                assert.equal(called, false, "Expected callback to not run after cancel");
                done();
            }, 0);
        });

        it("supports callback arguments via Promise fallback", (done) => {
            let calledName: string;
            let calledCount: number;

            let handler = scheduleMicrotask((name: string, count: number) => {
                calledName = name;
                calledCount = count;
            }, ["promise", 6]);

            assert.equal(handler.enabled, true, "Check that the handler is running");

            orgSetTimeout(() => {
                assert.equal(calledName, "promise", "Expected callback argument 'name' to be passed");
                assert.equal(calledCount, 6, "Expected callback argument 'count' to be passed");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 10);
        });

        it("uses timeout fallback when Promise fallback is disabled", () => {
            let clock = sinon.useFakeTimers();
            try {
                setMicroTaskFallbackOptions({ useTimeout: true });
                let called = 0;
                let handler = scheduleMicrotask(() => {
                    called++;
                });

                assert.equal(handler.enabled, true, "Check that the handler is running");
                assert.equal(called, 0, "Callback should not be called yet");
                clock.tick(0);
                assert.equal(called, 1, "Callback should be called once via timeout fallback");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
            } finally {
                clock.restore();
            }
        });

        it("supports per-call custom fallback scheduling function", (done) => {
            let scheduleCalls = 0;
            let called = 0;
            let handler = scheduleMicrotask(() => {
                called++;
            }, {
                scheduleFn: (cb) => {
                    scheduleCalls++;
                    orgSetTimeout(cb, 0);
                }
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            assert.equal(scheduleCalls, 1, "Custom fallback scheduler should be used");
            assert.equal(called, 0, "Callback should not be called yet");
            orgSetTimeout(() => {
                assert.equal(called, 1, "Callback should be called once via custom fallback scheduler");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 10);
        });

        it("supports callback arguments via custom fallback scheduling function", (done) => {
            let scheduleCalls = 0;
            let calledName: string;
            let calledCount: number;

            let handler = scheduleMicrotask((name: string, count: number) => {
                calledName = name;
                calledCount = count;
            }, ["custom", 9], {
                scheduleFn: (cb) => {
                    scheduleCalls++;
                    orgSetTimeout(cb, 0);
                }
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");

            orgSetTimeout(() => {
                assert.equal(scheduleCalls, 1, "Custom fallback scheduler should be used");
                assert.equal(calledName, "custom", "Expected callback argument 'name' to be passed");
                assert.equal(calledCount, 9, "Expected callback argument 'count' to be passed");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 10);
        });

        it("supports callback arguments with options in fallback mode", (done) => {
            let calledName: string;
            let calledCount: number;

            let handler = scheduleMicrotask((name: string, count: number) => {
                calledName = name;
                calledCount = count;
            }, ["fallback", 7], {
                useTimeout: true
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");

            orgSetTimeout(() => {
                assert.equal(calledName, "fallback", "Expected callback argument 'name' to be passed");
                assert.equal(calledCount, 7, "Expected callback argument 'count' to be passed");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 10);
        });

        it("supports global custom fallback scheduling function", (done) => {
            let scheduleCalls = 0;
            setMicroTaskFallbackOptions({
                scheduleFn: (cb) => {
                    scheduleCalls++;
                    orgSetTimeout(cb, 0);
                }
            });

            let called = 0;
            let handler = scheduleMicrotask(() => {
                called++;
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            assert.equal(scheduleCalls, 1, "Global custom fallback scheduler should be used");
            assert.equal(called, 0, "Callback should not be called yet");
            orgSetTimeout(() => {
                assert.equal(called, 1, "Callback should be called once via global custom fallback scheduler");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 10);
        });

        it("executes microtasks before previously scheduled timers", () => {
            let clock = sinon.useFakeTimers();
            try {
                let events: string[] = [];

                scheduleTimeout(() => {
                    events.push("timer");
                }, 0);

                scheduleMicrotask(() => {
                    events.push("microtask");
                }, {
                    useTimeout: true
                });

                clock.tick(0);

                assert.deepEqual(events, ["microtask", "timer"], "Expected the microtask to run before the existing timer");
            } finally {
                clock.restore();
            }
        });

        it("executes microtasks before a previously scheduled interval", (done) => {
            let events: string[] = [];
            let theInterval = scheduleInterval(() => {
                events.push("interval");
                theInterval.cancel();
            }, 0);

            // Scheduled after the interval, which is due at the same time as the fallback queue's timer
            scheduleMicrotask(() => {
                events.push("microtask");
            }, {
                useTimeout: true
            });

            setTimeout(() => {
                try {
                    assert.deepEqual(events, ["microtask", "interval"], "Expected the microtask to run before the interval");
                    done();
                } catch (e) {
                    done(e);
                }
            }, 20);
        });

        it("a microtask run before an interval's callback which cancels the interval stops the callback", (done) => {
            let calls = 0;
            let theInterval = scheduleInterval(() => {
                calls++;
            }, 0);

            // Run (by the fallback queue) when the interval's callback is about to be called
            scheduleMicrotask(() => {
                theInterval.cancel();
            }, {
                useTimeout: true
            });

            setTimeout(() => {
                try {
                    assert.equal(calls, 0, "The callback of the cancelled interval was not called");
                    assert.equal(theInterval.enabled, false, "The interval is not enabled");
                    done();
                } catch (e) {
                    theInterval.cancel();
                    done(e);
                }
            }, 20);
        });

        it("executes nested microtasks before previously scheduled timers", () => {
            let clock = sinon.useFakeTimers();
            try {
                let events: string[] = [];

                scheduleTimeout(() => {
                    events.push("timer");
                }, 0);

                scheduleMicrotask(() => {
                    events.push("microtask-1");
                    scheduleMicrotask(() => {
                        events.push("microtask-2");
                    }, {
                        useTimeout: true
                    });
                }, {
                    useTimeout: true
                });

                clock.tick(0);

                assert.deepEqual(events, ["microtask-1", "microtask-2", "timer"], "Expected nested microtasks to complete before the existing timer");
            } finally {
                clock.restore();
            }
        });

        it("a microtask run before a timer's callback which refreshes that timer keeps the new timer", () => {
            let clock = sinon.useFakeTimers();
            try {
                let calls = 0;
                let enabledInCallback: boolean[] = [];
                let theTimer = scheduleTimeout(() => {
                    calls++;
                    enabledInCallback.push(theTimer.enabled);

                    // Stops the timer started by the microtask's refresh()
                    theTimer.cancel();
                }, 0);

                // Run (by the fallback queue) when the timer's callback is about to be called
                scheduleMicrotask(() => {
                    theTimer.refresh();
                }, {
                    useTimeout: true
                });

                clock.tick(0);
                clock.tick(10);

                assert.deepEqual(enabledInCallback, [true], "The timer started by the microtask's refresh() is pending while the callback runs");
                assert.equal(calls, 1, "cancel() stopped the timer started by the microtask's refresh()");
            } finally {
                clock.restore();
            }
        });

        it("a microtask run before a timer's callback sees the timer as enabled, so enabling it doesn't run it again", () => {
            let clock = sinon.useFakeTimers();
            try {
                let calls = 0;
                let enabledInMicrotask: boolean[] = [];
                let theTimer = scheduleTimeout(() => {
                    calls++;
                }, 0);

                // Run (by the fallback queue) when the timer's callback is about to be called
                scheduleMicrotask(() => {
                    enabledInMicrotask.push(theTimer.enabled);

                    // Does nothing, as the timer is still pending
                    theTimer.enabled = true;
                }, {
                    useTimeout: true
                });

                clock.tick(0);
                clock.tick(10);

                assert.deepEqual(enabledInMicrotask, [true], "The timer is still enabled while the microtask runs");
                assert.equal(calls, 1, "The callback was only called once");
                assert.equal(theTimer.enabled, false, "The timer is not enabled once its callback has run");
            } finally {
                clock.restore();
            }
        });

        it("a microtask run before a timer's callback which cancels that timer stops the callback, like a native microtask", () => {
            let clock = sinon.useFakeTimers();
            try {
                let calls = 0;
                let theTimer = scheduleTimeout(() => {
                    calls++;
                }, 0);

                // Run (by the fallback queue) when the timer's callback is about to be called
                scheduleMicrotask(() => {
                    theTimer.cancel();
                }, {
                    useTimeout: true
                });

                clock.tick(0);
                clock.tick(10);

                assert.equal(calls, 0, "The callback of the cancelled timer was not called");
                assert.equal(theTimer.enabled, false, "The timer is not enabled");
            } finally {
                clock.restore();
            }
        });

        it("a microtask run before a timer's callback which disables that timer stops the callback", () => {
            let clock = sinon.useFakeTimers();
            try {
                let calls = 0;
                let theTimer = scheduleTimeout(() => {
                    calls++;
                }, 0);

                // Run (by the fallback queue) when the timer's callback is about to be called
                scheduleMicrotask(() => {
                    if (theTimer.enabled) {
                        theTimer.enabled = false;
                    }
                }, {
                    useTimeout: true
                });

                clock.tick(0);
                clock.tick(10);

                assert.equal(calls, 0, "The callback of the disabled timer was not called");
                assert.equal(theTimer.enabled, false, "The timer is not enabled");
            } finally {
                clock.restore();
            }
        });

        it("a microtask run before a timer's callback which cancels and then restarts that timer doesn't stop the callback", () => {
            let clock = sinon.useFakeTimers();
            try {
                let calls = 0;
                let theTimer = scheduleTimeout(() => {
                    calls++;
                }, 0);

                // Run (by the fallback queue) when the timer's callback is about to be called
                scheduleMicrotask(() => {
                    theTimer.cancel();
                    theTimer.refresh();
                }, {
                    useTimeout: true
                });

                clock.tick(0);
                assert.equal(calls, 1, "The callback was called");

                clock.tick(10);
                assert.equal(calls, 2, "The timer restarted by the microtask also called the callback");
                assert.equal(theTimer.enabled, false, "The timer is not enabled once the restarted timer has run");
            } finally {
                clock.restore();
            }
        });

        it("cancel() stops the timer which a pending microtask refreshed while a synchronous setTimeout override ran the callback", () => {
            let pending: number[] = [];
            let timers: { [id: number]: { cb: () => void, live: boolean } } = {};
            let nextId = 1;
            let runNow = false;
            let calls = 0;

            setTimeoutOverrides([
                (function (callback: () => void) {
                    let id = nextId++;
                    if (runNow) {
                        // Runs the callback synchronously (before the id is returned)
                        runNow = false;
                        callback();
                    } else {
                        timers[id] = { cb: callback, live: true };
                        pending.push(id);
                    }

                    return id;
                }) as any,
                function (id: any) {
                    timers[id] && (timers[id].live = false);
                }
            ]);

            let theTimer = createTimeout(() => {
                calls++;
            }, 10);

            // Queued, so the fallback queue is run before the next timer's callback
            scheduleMicrotask(() => {
                theTimer.refresh();
            }, {
                useTimeout: true
            });

            // The override runs the callback synchronously, which first runs the pending microtask (refreshing the timer)
            runNow = true;
            theTimer.refresh();
            assert.equal(calls, 1, "The callback was run synchronously");
            assert.equal(theTimer.enabled, true, "The timer started by the microtask's refresh() is kept");

            theTimer.cancel();

            // Run all of the pending timers
            let due = pending;
            pending = [];
            for (let idx = 0; idx < due.length; idx++) {
                let timer = timers[due[idx]];
                if (timer.live) {
                    timer.live = false;
                    timer.cb();
                }
            }

            assert.equal(calls, 1, "cancel() stopped the timer started by the microtask's refresh()");
        });

        it("later microtasks still run after a flush of the fallback queue throws (when reporting a microtask's error throws)", () => {
            let pending: Array<() => void> = [];
            let failNext = false;
            let failed = false;
            let mt2Calls = 0;
            let mt3Calls = 0;

            setTimeoutOverrides([
                (function (callback: () => void) {
                    if (failNext) {
                        failNext = false;
                        throw new Error("setTimeout failed");
                    }

                    pending.push(callback);
                    return pending.length;
                }) as any,
                function () {
                    // The callbacks which have run are removed from pending
                }
            ]);

            function _runPending() {
                let due = pending;
                pending = [];
                for (let idx = 0; idx < due.length; idx++) {
                    try {
                        due[idx]();
                    } catch (e) {
                        // The error of the flush which failed
                    }
                }
            }

            scheduleMicrotask(() => {
                if (!failed) {
                    // Its error is reported (re-thrown) using a timeout, which fails
                    failed = true;
                    failNext = true;
                    throw new Error("microtask failed");
                }
            }, {
                useTimeout: true
            });

            scheduleMicrotask(() => {
                mt2Calls++;
            }, {
                useTimeout: true
            });

            _runPending();
            _runPending();

            scheduleMicrotask(() => {
                mt3Calls++;
            }, {
                useTimeout: true
            });

            _runPending();
            _runPending();

            assert.equal(failed, true, "The first microtask failed");
            assert.equal(mt2Calls, 1, "The microtask queued after the one which failed was run");
            assert.equal(mt3Calls, 1, "A microtask scheduled after the failed flush was run");
        });

        it("a microtask run before a timer's callback which restarts and then cancels that timer stops the callback", () => {
            let clock = sinon.useFakeTimers();
            try {
                let refreshCalls = 0;
                let refreshTimer = scheduleTimeout(() => {
                    refreshCalls++;
                }, 0);

                let enabledCalls = 0;
                let enabledTimer = scheduleTimeout(() => {
                    enabledCalls++;
                }, 0);

                // Run (by the fallback queue) when the timers' callbacks are about to be called
                scheduleMicrotask(() => {
                    refreshTimer.refresh();
                    refreshTimer.cancel();

                    enabledTimer.enabled = false;
                    enabledTimer.enabled = true;
                    enabledTimer.enabled = false;
                }, {
                    useTimeout: true
                });

                clock.tick(0);
                clock.tick(10);

                assert.equal(refreshCalls, 0, "The callback of the timer which was refreshed and then cancelled was not called");
                assert.equal(refreshTimer.enabled, false, "The refreshed and then cancelled timer is not enabled");
                assert.equal(enabledCalls, 0, "The callback of the timer which was enabled again and then disabled was not called");
                assert.equal(enabledTimer.enabled, false, "The enabled and then disabled timer is not enabled");
            } finally {
                clock.restore();
            }
        });

        describe("with a setTimeout override which can run the callback synchronously", () => {
            let runNow: boolean;
            let runPendingFirst: boolean;

            /**
             * Sets a setTimeout override which runs the callback synchronously (before the id is returned) when runNow is
             * set (after running the pending timers when runPendingFirst is also set), and returns a function which runs
             * the pending timers
             */
            function _setSyncOverride() {
                let timers: { [id: number]: () => void } = {};
                let nextId = 1;

                function _runPending() {
                    let due = timers;
                    timers = {};
                    Object.keys(due).forEach((id) => {
                        due[id as any]();
                    });
                }

                runNow = false;
                runPendingFirst = false;
                setTimeoutOverrides([
                    (function (callback: () => void) {
                        let id = nextId++;
                        if (runNow) {
                            runNow = false;
                            if (runPendingFirst) {
                                runPendingFirst = false;
                                _runPending();
                            }

                            callback();
                        } else {
                            timers[id] = callback;
                        }

                        return id;
                    }) as any,
                    function (id: any) {
                        delete timers[id];
                    }
                ]);

                return _runPending;
            }

            it("a microtask which cancels a running timer doesn't stop the callback which its refresh() runs synchronously", () => {
                let runPending = _setSyncOverride();
                let calls = 0;
                let theTimer = scheduleTimeout(() => {
                    calls++;
                }, 10);

                // Queued, so the fallback queue is run before the next timer's callback
                scheduleMicrotask(() => {
                    theTimer.cancel();
                }, {
                    useTimeout: true
                });

                // The override runs the callback of the new timer synchronously, which first runs the pending microtask
                runNow = true;
                theTimer.refresh();
                assert.equal(calls, 1, "The callback of the timer started by refresh() was called");
                assert.equal(theTimer.enabled, false, "The timer is not enabled once its callback has run");

                runPending();
                runPending();
                assert.equal(calls, 1, "The callback was only called once");
            });

            it("a microtask which cancels the timer doesn't stop the callback which its first start runs synchronously", () => {
                let runPending = _setSyncOverride();
                let calls = 0;
                let theTimer = createTimeout(() => {
                    calls++;
                }, 10);

                // Queued, so the fallback queue is run before the next timer's callback
                scheduleMicrotask(() => {
                    theTimer.cancel();
                }, {
                    useTimeout: true
                });

                // The override runs the callback synchronously, which first runs the pending microtask
                runNow = true;
                theTimer.refresh();
                assert.equal(calls, 1, "The callback of the timer being started was called");
                assert.equal(theTimer.enabled, false, "The timer is not enabled once its callback has run");

                runPending();
                runPending();
                assert.equal(calls, 1, "The callback was only called once");
            });

            it("a microtask which cancels the timer doesn't stop the callback which its refresh() runs synchronously after a nested start", () => {
                let runPending = _setSyncOverride();
                let calls = 0;
                let theTimer = createTimeout(() => {
                    calls++;
                }, 10);

                // Run by the override (before the timer's callback) while the timer is being started, it starts the timer
                // again (a nested start) and queues a microtask which cancels it
                scheduleTimeout(() => {
                    theTimer.refresh();
                    scheduleMicrotask(() => {
                        theTimer.cancel();
                    }, {
                        useTimeout: true
                    });
                }, 10);

                // The override runs the pending timer and then the callback synchronously, which first runs the microtask
                runNow = true;
                runPendingFirst = true;
                theTimer.refresh();
                assert.equal(calls, 1, "The callback of the timer being started was called");
                assert.equal(theTimer.enabled, false, "The microtask cancelled the timer started by the nested start");

                runPending();
                runPending();
                assert.equal(calls, 1, "The callback was only called once");
            });

            it("a microtask which refreshes the timer about to run (whose callback the override runs synchronously) runs the callback once", () => {
                let runPending = _setSyncOverride();
                let calls = 0;
                let theTimer = scheduleTimeout(() => {
                    calls++;
                }, 10);

                // Run (by the fallback queue) when the timer's callback is about to be called, the refresh() runs the
                // callback synchronously, so the fallback queue must not be run again (by that callback)
                scheduleMicrotask(() => {
                    runNow = true;
                    theTimer.refresh();
                }, {
                    useTimeout: true
                });

                runPending();
                runPending();

                assert.equal(calls, 1, "The callback was only called once");
                assert.equal(theTimer.enabled, false, "The timer is not enabled once its callback has run");
            });
        });
    });

    describe("without queueMicrotask and Promise", () => {
        beforeEach(() => {
            setMicroTaskFallbackOptions();
            (<any>getGlobal()).queueMicrotask = null;
            (<any>getGlobal()).Promise = null;
            _clearTaskQueues();
            _resetSharedTimer();
        });

        it("uses scheduleTimeout fallback", (done) => {
            let called = 0;
            let handler = scheduleMicrotask(() => {
                called++;
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            assert.equal(called, 0, "Callback should not be called yet");
            orgSetTimeout(() => {
                assert.equal(called, 1, "Callback should be called once");
                assert.equal(handler.enabled, false, "Check that the handler is stopped");
                done();
            }, 10);
        });

        it("cancel prevents scheduleTimeout fallback callback", (done) => {
            let called = 0;
            let handler = scheduleMicrotask(() => {
                called++;
            });

            assert.equal(handler.enabled, true, "Check that the handler is running");
            handler.cancel();
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            orgSetTimeout(() => {
                assert.equal(called, 0, "Callback should not be called after cancel");
                done();
            }, 10);
        });

        it("executes multiple microtask batches on different ticks", (done) => {
            let flushedBatches: string[] = [];
            let enabled = false;
            let pendingCallback: (() => void) | undefined;
            let fakeHandler: any;

            function _fail(err: Error) {
                done(err);
            }

            fakeHandler = {
                cancel: () => {
                    enabled = false;
                },
                refresh: () => {
                    enabled = true;
                    orgSetTimeout(() => {
                        pendingCallback && pendingCallback();
                    }, 0);
                    return fakeHandler;
                },
                ref: () => {
                    return fakeHandler;
                },
                unref: () => {
                    return fakeHandler;
                },
                hasRef: () => {
                    return true;
                }
            };

            Object.defineProperty(fakeHandler, "enabled", {
                get: () => enabled,
                set: (value: boolean) => {
                    enabled = value;
                }
            });

            setTimeoutOverrides([
                ((callback: () => void) => {
                    pendingCallback = callback;
                    enabled = true;
                    orgSetTimeout(() => {
                        callback();
                    }, 0);
                    return fakeHandler;
                }) as any,
                () => {
                    enabled = false;
                }
            ]);

            _addMicrotaskQueue(() => {
                flushedBatches.push("batch-1");
            });

            orgSetTimeout(() => {
                _addMicrotaskQueue(() => {
                    flushedBatches.push("batch-2");
                });

                orgSetTimeout(() => {
                    try {
                        assert.deepEqual(flushedBatches, ["batch-1", "batch-2"], "Expected both microtask batches to flush in order");
                        done();
                    } catch (e) {
                        _fail(e as Error);
                    }
                }, 10);
            }, 10);
        });
    });

    describe("internal microtaskQueue helper", () => {
        it("reschedules when pending queueMicrotask implementation changes across queue types", () => {
            let theGlobal: any = getGlobal();
            let firstSchedulerBatches: Array<() => void> = [];
            let secondSchedulerBatches: Array<() => void> = [];
            let events: string[] = [];

            theGlobal.queueMicrotask = (cb: () => void) => {
                firstSchedulerBatches.push(cb);
            };

            let nextTickQueueFn = _getMicrotaskQueueFn(_eTaskQueueType.nextTick);
            assert.isOk(nextTickQueueFn, "Expected nextTick queue helper to be returned");

            nextTickQueueFn(() => {
                events.push("nextTick");
            });

            assert.equal(firstSchedulerBatches.length, 1, "Expected first scheduler to receive one batch callback");

            theGlobal.queueMicrotask = (cb: () => void) => {
                secondSchedulerBatches.push(cb);
            };

            let microtaskQueueFn = _getMicrotaskQueueFn(_eTaskQueueType.microtask);
            assert.isOk(microtaskQueueFn, "Expected microtask queue helper to be returned");

            microtaskQueueFn(() => {
                events.push("microtask");
            });

            assert.equal(secondSchedulerBatches.length, 1, "Expected second scheduler to receive a fresh batch callback");

            secondSchedulerBatches[0]();
            assert.deepEqual(events, ["nextTick", "microtask"], "Expected nextTick queue to flush before microtask queue");

            firstSchedulerBatches[0]();
            assert.deepEqual(events, ["nextTick", "microtask"], "Expected stale first scheduler callback to have no additional effect");
        });
    });
});

describe("microtask handler enabled state", () => {
    let orgQueueMicrotask: any;

    beforeEach(() => {
        orgQueueMicrotask = (<any>getGlobal()).queueMicrotask;
        (<any>getGlobal()).queueMicrotask = undefined;
        setBypassLazyCache(true);
    });

    afterEach(() => {
        (<any>getGlobal()).queueMicrotask = orgQueueMicrotask;
        setBypassLazyCache(false);
    });

    it("keeps the task started by a refresh() from the scheduleFn, which then rejects the task it was asked to schedule", () => {
        let queue: Array<() => void> = [];
        let calls = 0;
        let scheduleCalls = 0;
        let handler: any;

        handler = scheduleMicrotask(() => {
            calls++;
        }, {
            scheduleFn: (callback: () => void) => {
                scheduleCalls++;
                if (scheduleCalls === 2) {
                    // Re-entrantly refresh the handler (which schedules a new task), then reject this task
                    handler.refresh();
                    return false;
                }

                queue.push(callback);
                return true;
            }
        });

        handler.refresh();
        assert.equal(handler.enabled, true, "The task started by the nested refresh() is enabled");

        handler.cancel();
        for (let idx = 0; idx < queue.length; idx++) {
            queue[idx]();
        }

        assert.equal(calls, 0, "cancel() stopped the task started by the nested refresh()");
    });

    it("is not enabled when the scheduleFn rejects the task", () => {
        let called = 0;
        const handler = scheduleMicrotask(() => {
            called++;
        }, {
            scheduleFn: () => false
        });

        assert.equal(handler.enabled, false, "The rejected task is not active");
        assert.equal(called, 0, "The callback was not called");
    });

    it("is not enabled when the scheduleFn runs the task synchronously", () => {
        let called = 0;
        const handler = scheduleMicrotask(() => {
            called++;
        }, {
            scheduleFn: (cb) => {
                cb();
            }
        });

        assert.equal(called, 1, "The callback was called");
        assert.equal(handler.enabled, false, "The completed task is not active");
    });

    it("is enabled until a queued task has run", () => {
        const queue: Array<() => void> = [];
        let called = 0;
        const handler = scheduleMicrotask(() => {
            called++;
        }, {
            scheduleFn: (cb) => {
                queue.push(cb);
            }
        });

        assert.equal(handler.enabled, true, "The task is waiting to run");
        queue[0]();
        assert.equal(called, 1, "The callback was called");
        assert.equal(handler.enabled, false, "The task has run");
    });

    it("stays enabled when a synchronous callback schedules another task", () => {
        const queue: Array<() => void> = [];
        let runNow = false;
        let called = 0;
        const handler = scheduleMicrotask(() => {
            called++;
            if (called === 1) {
                handler.refresh();
            }
        }, {
            scheduleFn: (cb) => {
                if (runNow) {
                    runNow = false;
                    cb();
                } else {
                    queue.push(cb);
                }
            }
        });

        runNow = true;
        handler.refresh();

        assert.equal(called, 1, "The callback was called synchronously");
        assert.equal(handler.enabled, true, "The new task is waiting to run");

        queue[queue.length - 1]();
        assert.equal(called, 2, "The new task ran");
        assert.equal(handler.enabled, false, "There is nothing left to run");
    });
});
