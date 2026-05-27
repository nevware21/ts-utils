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

    it("cancel prevents callback via Promise fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };

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

    it("refresh reschedules callback via Promise fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };

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

    it("cancel prevents callback via timer-queue fallback", (done) => {
        let theGlobal: any = getGlobal();
        let called = 0;

        theGlobal.process = {
            version: orgProcess && orgProcess.version,
            versions: orgProcess && orgProcess.versions,
            nextTick: null
        };

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
});
