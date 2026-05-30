/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { getGlobal, isNode } from "../../../../src/helpers/environment";
import { setBypassLazyCache } from "../../../../src/helpers/lazy";
import { scheduleMicrotask, setMicroTaskFallbackOptions } from "../../../../src/timer/microtask";
import { getProcessNextTick, hasProcessNextTick, scheduleNextTick, setNextTickFallbackOptions } from "../../../../src/timer/nextTick";
import { _resetMicrotaskQueueFns } from "../../../../src/timer/microtasks/microtaskQueue";
import { scheduleTimeout } from "../../../../src/timer/timeout";
import { _clearTaskQueues } from "../../../../src/timer/microtasks/taskQueue";
import { _resetSharedTimer } from "../../../../src/timer/microtasks/timerQueue";

describe("nextTick tests", () => {
    let orgProcess: any;
    let orgPromise: any;
    let orgQueueMicrotask: any;
    let orgSetTimeout: any;

    before(() => {
        let theGlobal: any = getGlobal();
        orgProcess = theGlobal.process;
        orgPromise = theGlobal.Promise;
        orgQueueMicrotask = theGlobal.queueMicrotask;
        orgSetTimeout = setTimeout;
    });

    beforeEach(() => {
        let theGlobal: any = getGlobal();
        setBypassLazyCache(true);
        setMicroTaskFallbackOptions();
        setNextTickFallbackOptions();
        _resetMicrotaskQueueFns();
        theGlobal.process = orgProcess;
        theGlobal.Promise = orgPromise;
        theGlobal.queueMicrotask = orgQueueMicrotask;
    });

    afterEach(() => {
        let theGlobal: any = getGlobal();
        theGlobal.process = orgProcess;
        theGlobal.Promise = orgPromise;
        theGlobal.queueMicrotask = orgQueueMicrotask;
        _clearTaskQueues();
        _resetSharedTimer();
        _resetMicrotaskQueueFns();
        setMicroTaskFallbackOptions();
        setNextTickFallbackOptions();
        setBypassLazyCache(false);
    });

    it("hasProcessNextTick", () => {
        let hasNativeNextTick = !!(isNode() && orgProcess && orgProcess.nextTick);
        assert.equal(hasProcessNextTick(), hasNativeNextTick, "Check if we have process.nextTick support");
        assert.equal(!!getProcessNextTick(), hasNativeNextTick, "Check direct process.nextTick getter");
    });

    it("uses process.nextTick when available in Node runtimes", (done) => {
        let calls = 0;
        let theGlobal: any = getGlobal();
        let processInst: any = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions
        };
        theGlobal.process = processInst;

        processInst.nextTick = (callback: () => void) => {
            calls++;
            orgSetTimeout(callback, 0);
        };

        let handler = scheduleNextTick(() => {
            // no-op
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        orgSetTimeout(() => {
            assert.equal(calls, isNode() ? 1 : 0, "Expected process.nextTick usage only in Node runtimes");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("cancel prevents callback with native process.nextTick", (done) => {
        if (!isNode()) {
            done();
            return;
        }

        let theGlobal: any = getGlobal();
        let called = 0;
        let processCalls = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: (callback: () => void) => {
                processCalls++;
                orgSetTimeout(callback, 0);
            }
        };

        let handler = scheduleNextTick(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.cancel();
        assert.equal(handler.enabled, false, "Check that the handler is stopped");

        orgSetTimeout(() => {
            assert.equal(processCalls, 1, "Expected process.nextTick to be called once");
            assert.equal(called, 0, "Expected callback to not run after cancel");
            done();
        }, 10);
    });

    it("refresh reschedules callback with native process.nextTick", (done) => {
        if (!isNode()) {
            done();
            return;
        }

        let theGlobal: any = getGlobal();
        let called = 0;
        let processCalls = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: (callback: () => void) => {
                processCalls++;
                orgSetTimeout(callback, 0);
            }
        };

        let handler = scheduleNextTick(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.refresh();
        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(processCalls, 2, "Expected refresh to enqueue a replacement process.nextTick callback");
            assert.equal(called, 1, "Expected callback to run once after refresh");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("supports callback arguments with native/fallback nextTick", (done) => {
        let calledName: string;
        let calledCount: number;

        let handler = scheduleNextTick((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["nextTick", 21]);

        assert.equal(handler.enabled, true, "Check that the handler is running");
        orgSetTimeout(() => {
            assert.equal(calledName, "nextTick", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 21, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("forwards callback arguments via native process.nextTick implementation", (done) => {
        let theGlobal: any = getGlobal();
        let processCalls = 0;
        let calledName: string;
        let calledCount: number;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: (callback: () => void) => {
                processCalls++;
                orgSetTimeout(callback, 0);
            }
        };

        let handler = scheduleNextTick((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["native", 33]);

        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(processCalls, isNode() ? 1 : 0, "Expected process.nextTick usage only in Node runtimes");
            assert.equal(calledName, "native", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 33, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("executes nextTick before a previously scheduled native setTimeout", (done) => {
        let events: string[] = [];

        orgSetTimeout(() => {
            events.push("timer");
        }, 0);

        scheduleNextTick(() => {
            events.push("nextTick");
        });

        orgSetTimeout(() => {
            assert.deepEqual(events, ["nextTick", "timer"], "Expected nextTick before a previously scheduled native setTimeout");
            done();
        }, 10);
    });

    it("supports custom fallback scheduling function", (done) => {
        let theGlobal: any = getGlobal();
        let scheduleCalls = 0;
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };

        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick(() => {
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

    it("supports callback arguments via Promise fallback", (done) => {
        let theGlobal: any = getGlobal();
        let calledName: string;
        let calledCount: number;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["promise", 5]);

        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(calledName, "promise", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 5, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("supports callback arguments via queueMicrotask fallback", (done) => {
        let theGlobal: any = getGlobal();
        let queueCalls = 0;
        let calledName: string;
        let calledCount: number;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.Promise = null;
        theGlobal.queueMicrotask = (callback: () => void) => {
            queueCalls++;
            orgQueueMicrotask(callback);
        };

        let handler = scheduleNextTick((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["queueMicrotask", 6]);

        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(queueCalls, 1, "Expected native queueMicrotask to be used once");
            assert.equal(calledName, "queueMicrotask", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 6, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("cancel prevents callback via Promise fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.cancel();
        assert.equal(handler.enabled, false, "Check that the handler is stopped");

        orgSetTimeout(() => {
            assert.equal(called, 0, "Expected callback to not run after cancel");
            done();
        }, 10);
    });

    it("cancel prevents callback via queueMicrotask fallback", (done) => {
        let theGlobal: any = getGlobal();
        let queueCalls = 0;
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.Promise = null;
        theGlobal.queueMicrotask = (callback: () => void) => {
            queueCalls++;
            orgQueueMicrotask(callback);
        };

        let handler = scheduleNextTick(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.cancel();
        assert.equal(handler.enabled, false, "Check that the handler is stopped");

        orgSetTimeout(() => {
            assert.equal(queueCalls, 1, "Expected native queueMicrotask to be used once");
            assert.equal(called, 0, "Expected callback to not run after cancel");
            done();
        }, 10);
    });

    it("refresh reschedules callback via Promise fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.refresh();
        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(called, 1, "Expected callback to run once after refresh");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("refresh reschedules callback via queueMicrotask fallback", (done) => {
        let theGlobal: any = getGlobal();
        let queueCalls = 0;
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.Promise = null;
        theGlobal.queueMicrotask = (callback: () => void) => {
            queueCalls++;
            orgQueueMicrotask(callback);
        };

        let handler = scheduleNextTick(() => {
            called++;
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.refresh();
        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.isAtLeast(queueCalls, 1, "Expected native queueMicrotask to be used");
            assert.equal(called, 1, "Expected callback to run once after refresh");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("cancel prevents callback via timer-queue fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick(() => {
            called++;
        }, {
            useTimeout: true
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.cancel();
        assert.equal(handler.enabled, false, "Check that the handler is stopped");

        orgSetTimeout(() => {
            assert.equal(called, 0, "Expected callback to not run after cancel");
            done();
        }, 10);
    });

    it("refresh reschedules callback via timer-queue fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick(() => {
            called++;
        }, {
            useTimeout: true
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        handler.refresh();
        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(called, 1, "Expected callback to run once after refresh");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("supports callback arguments via custom fallback scheduling function", (done) => {
        let theGlobal: any = getGlobal();
        let scheduleCalls = 0;
        let calledName: string;
        let calledCount: number;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["custom", 12], {
            scheduleFn: (cb) => {
                scheduleCalls++;
                orgSetTimeout(cb, 0);
            }
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");

        orgSetTimeout(() => {
            assert.equal(scheduleCalls, 1, "Custom fallback scheduler should be used");
            assert.equal(calledName, "custom", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 12, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("supports callback arguments with options in fallback mode", (done) => {
        let theGlobal: any = getGlobal();
        let calledName: string;
        let calledCount: number;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        let handler = scheduleNextTick((name: string, count: number) => {
            calledName = name;
            calledCount = count;
        }, ["fallback", 8], {
            useTimeout: true
        });

        assert.equal(handler.enabled, true, "Check that the handler is running");
        orgSetTimeout(() => {
            assert.equal(calledName, "fallback", "Expected callback argument 'name' to be passed");
            assert.equal(calledCount, 8, "Expected callback argument 'count' to be passed");
            assert.equal(handler.enabled, false, "Check that the handler is stopped");
            done();
        }, 10);
    });

    it("supports global custom fallback scheduling function", (done) => {
        let theGlobal: any = getGlobal();
        let scheduleCalls = 0;
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        setNextTickFallbackOptions({
            scheduleFn: (cb) => {
                scheduleCalls++;
                orgSetTimeout(cb, 0);
            }
        });

        let handler = scheduleNextTick(() => {
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

    it("executes nextTick scheduled from first microtask before remaining microtasks and before timer", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        // Force the timer-backed fallback path for both microtask and nextTick behavior.
        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;
        theGlobal.Promise = null;

        scheduleMicrotask(() => {
            events.push("microtask-1");
            scheduleNextTick(() => {
                events.push("nextTick");
            });
        });

        scheduleMicrotask(() => {
            events.push("microtask-2");
        });

        scheduleTimeout(() => {
            events.push("timer");
        }, 0);

        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["microtask-1", "nextTick", "microtask-2", "timer"], "Expected nested fallback order microtask-1 -> nextTick -> microtask-2 -> timer");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 20);
    });

    it("uses a single Promise task for mixed nextTick and microtask fallback queues", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];
        let resolveCalls = 0;
        let orgPromiseResolve = orgPromise && orgPromise.resolve;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        if (orgPromise && orgPromiseResolve) {
            theGlobal.Promise = orgPromise;
            theGlobal.Promise.resolve = function() {
                resolveCalls++;
                return orgPromiseResolve.call(orgPromise);
            };
        }

        scheduleNextTick(() => {
            events.push("nextTick");
        });

        scheduleMicrotask(() => {
            events.push("microtask");
        });

        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["nextTick", "microtask"], "Expected nextTick queue to flush before microtask queue");
                assert.equal(resolveCalls, 1, "Expected a single Promise.resolve() call for the mixed Promise fallback batch");
                done();
            } catch (e) {
                done(e as Error);
            } finally {
                if (orgPromise && orgPromiseResolve) {
                    orgPromise.resolve = orgPromiseResolve;
                }
            }
        }, 10);
    });

    it("does not use stale Promise cache after Promise becomes unavailable", (done) => {
        let theGlobal: any = getGlobal();
        let promiseResolveCalls = 0;
        let orgPromiseResolve = orgPromise && orgPromise.resolve;
        let called = 0;

        if (!orgPromise || !orgPromiseResolve) {
            done();
            return;
        }

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        theGlobal.Promise = orgPromise;
        theGlobal.Promise.resolve = function() {
            promiseResolveCalls++;
            return orgPromiseResolve.call(orgPromise);
        };

        scheduleNextTick(() => {
            called++;
        });

        orgSetTimeout(() => {
            try {
                assert.equal(promiseResolveCalls, 1, "Expected Promise fallback to be used for first callback");

                theGlobal.Promise = null;
                scheduleNextTick(() => {
                    called++;
                });

                orgSetTimeout(() => {
                    try {
                        assert.equal(promiseResolveCalls, 1, "Expected no additional Promise.resolve() calls once Promise is unavailable");
                        assert.equal(called, 2, "Expected both callbacks to execute");
                        done();
                    } catch (e) {
                        done(e as Error);
                    }
                }, 10);
            } catch (e) {
                done(e as Error);
            } finally {
                orgPromise.resolve = orgPromiseResolve;
            }
        }, 10);
    });

    it("throws RangeError when maxQueuedTasks is exceeded", () => {
        let theGlobal: any = getGlobal();
        let thrown: Error | undefined;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;
        theGlobal.Promise = {
            resolve: () => ({
                then: () => {
                    // Keep the queue pending so depth can be exceeded synchronously.
                }
            })
        };

        scheduleNextTick(() => {
            // no-op
        }, {
            maxQueuedTasks: 2
        });

        scheduleNextTick(() => {
            // no-op
        }, {
            maxQueuedTasks: 2
        });

        try {
            scheduleNextTick(() => {
                // no-op
            }, {
                maxQueuedTasks: 2
            });
        } catch (e) {
            thrown = e as Error;
        }

        assert.isOk(thrown, "Expected an error when maxQueuedTasks is exceeded");
        assert.equal(thrown && thrown.name, "RangeError", "Expected a RangeError");
        assert.equal(thrown && thrown.message, "scheduleNextTick() queue depth exceeded [2]", "Expected Node-like nextTick depth error message");
    });

    it("uses Node-compatible default maxQueuedTasks depth for nextTick fallback", () => {
        let theGlobal: any = getGlobal();
        let thrown: Error | undefined;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;
        theGlobal.Promise = {
            resolve: () => ({
                then: () => {
                    // Keep the queue pending so depth can be exceeded synchronously.
                }
            })
        };

        for (let lp = 0; lp < 1000; lp++) {
            scheduleNextTick(() => {
                // no-op
            });
        }

        try {
            scheduleNextTick(() => {
                // no-op
            });
        } catch (e) {
            thrown = e as Error;
        }

        assert.isOk(thrown, "Expected an error when default nextTick depth is exceeded");
        assert.equal(thrown && thrown.name, "RangeError", "Expected a RangeError");
        assert.equal(thrown && thrown.message, "scheduleNextTick() queue depth exceeded [1000]", "Expected Node-like nextTick depth error message");
    });

    it("recovers Promise fallback when Promise implementation changes while previous batch is stuck", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        if (!orgPromise || !orgPromise.resolve) {
            done();
            return;
        }

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        // Simulate a Promise implementation that never resolves callbacks, leaving pending state stuck.
        theGlobal.Promise = {
            resolve: () => ({
                then: () => {
                    // Never invoke callback
                }
            })
        };

        scheduleNextTick(() => {
            events.push("first");
        });

        // Switch to a working Promise implementation; scheduling again should recover and flush the queue.
        theGlobal.Promise = orgPromise;
        scheduleNextTick(() => {
            events.push("second");
        });

        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["first", "second"], "Expected queued nextTick callbacks to flush after Promise implementation change");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 10);
    });

    it("executes nextTick before setTimeout when scheduled via Promise fallback - edge case", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        // Force Promise fallback (disable process.nextTick and queueMicrotask)
        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        // Schedule direct setTimeout first - this gets queued as a macrotask
        orgSetTimeout(() => {
            events.push("setTimeout");
        }, 0);

        // Then schedule nextTick - this should run before setTimeout via Promise microtask
        scheduleNextTick(() => {
            events.push("nextTick");
        });

        // Verify that nextTick runs before setTimeout when using Promise fallback
        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["nextTick", "setTimeout"], "Promise fallback: Expected nextTick (microtask) to execute before direct setTimeout (macrotask)");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 10);
    });

    it("handles interleaved nextTick and setTimeout scheduling with Promise fallback", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        // Force Promise fallback
        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;

        // Rapidly interleave scheduling
        orgSetTimeout(() => {
            events.push("timer-1");
        }, 0);

        scheduleNextTick(() => {
            events.push("nextTick-1");
        });

        orgSetTimeout(() => {
            events.push("timer-2");
        }, 0);

        scheduleNextTick(() => {
            events.push("nextTick-2");
        });

        orgSetTimeout(() => {
            events.push("timer-3");
        }, 0);

        scheduleNextTick(() => {
            events.push("nextTick-3");
        });

        // With Promise fallback: all nextTicks (microtasks) execute before any setTimeout (macrotasks)
        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["nextTick-1", "nextTick-2", "nextTick-3", "timer-1", "timer-2", "timer-3"], "Promise fallback: all microtasks (nextTick) execute before macrotasks (setTimeout)");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 15);
    });

    it("executes queued nextTick callbacks through timer-queue fallback", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        // Force timer-queue fallback (disable all native microtask support)
        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;
        theGlobal.Promise = null;

        // Schedule nextTick callbacks using timer-queue fallback
        scheduleNextTick(() => {
            events.push("nextTick-1");
        }, {
            useTimeout: true
        });

        scheduleNextTick(() => {
            events.push("nextTick-2");
        }, {
            useTimeout: true
        });

        scheduleTimeout(() => {
            events.push("timer");
        }, 0);

        // Verify that nextTick callbacks execute and eventually complete before test ends
        orgSetTimeout(() => {
            try {
                assert.isOk(events.includes("nextTick-1"), "Expected nextTick-1 to execute via timer-queue fallback");
                assert.isOk(events.includes("nextTick-2"), "Expected nextTick-2 to execute via timer-queue fallback");
                assert.isOk(events.includes("timer"), "Expected timer callback to execute");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 20);
    });

    it("nextTick should fail to execute before native setTimeout with no promise or microtask support", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        // Force timer-queue fallback (disable all native microtask support)
        // This simulates environments without Promise, queueMicrotask, or process.nextTick
        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };
        theGlobal.queueMicrotask = null;
        theGlobal.Promise = null;

        // User schedules their own setTimeout first
        orgSetTimeout(() => {
            events.push("user-setTimeout");
        }, 0);

        // Then user calls scheduleNextTick.
        // In timer-queue fallback mode this is also timer-backed, so it may run after the user timer.
        scheduleNextTick(() => {
            events.push("scheduleNextTick");
        }, {
            useTimeout: true
        });

        // Verify the execution order
        orgSetTimeout(() => {
            try {
                // This intentionally documents the known limitation of the timer-queue fallback:
                // direct user timers can run before scheduleNextTick when native microtask APIs are unavailable.
                assert.notDeepEqual(events, ["scheduleNextTick", "user-setTimeout"],
                    "Known limitation: with timer-queue fallback, scheduleNextTick may execute after a directly scheduled native setTimeout.");
                done();
            } catch (e) {
                // If this starts failing, fallback ordering behavior changed and this limitation may have been improved.
                done(e as Error);
            }
        }, 10);
    });

    it("scheduleNextTick should execute before direct setTimeout with defaults", (done) => {
        let events: string[] = [];

        // User schedules their own setTimeout first
        orgSetTimeout(() => {
            events.push("user-setTimeout");
        }, 0);

        // Then user calls scheduleNextTick expecting it to run first
        // This should hold true regardless of fallback implementation
        scheduleNextTick(() => {
            events.push("scheduleNextTick");
        });

        // Verify the execution order
        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["scheduleNextTick", "user-setTimeout"],
                    "CRITICAL: scheduleNextTick must always execute before user's direct setTimeout. " +
                    "This ensures consistent microtask-like semantics across all environments and fallbacks.");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 10);
    });


    it("No Promise support scheduleNextTick should still execute before direct setTimeout with defaults", (done) => {
        let theGlobal: any = getGlobal();
        let events: string[] = [];

        // Disable Promise fallback to force timer-queue fallback, but scheduleNextTick should still execute before direct setTimeout
        theGlobal.Promise = null;

        // User schedules their own setTimeout first
        orgSetTimeout(() => {
            events.push("user-setTimeout");
        }, 0);

        // Then user calls scheduleNextTick expecting it to run first
        // This should hold true regardless of fallback implementation
        scheduleNextTick(() => {
            events.push("scheduleNextTick");
        });

        // Verify the execution order
        orgSetTimeout(() => {
            try {
                assert.deepEqual(events, ["scheduleNextTick", "user-setTimeout"],
                    "CRITICAL: scheduleNextTick must always execute before user's direct setTimeout. " +
                    "This ensures consistent microtask-like semantics across all environments and fallbacks.");
                done();
            } catch (e) {
                done(e as Error);
            }
        }, 10);
    });
});
