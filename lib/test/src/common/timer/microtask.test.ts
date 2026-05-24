/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "@nevware21/tripwire-chai";
import { getGlobal } from "../../../../src/helpers/environment";
import { setBypassLazyCache } from "../../../../src/helpers/lazy";
import { getQueueMicrotask, hasQueueMicrotask, scheduleMicrotask, setMicroTaskFallbackOptions } from "../../../../src/timer/microtask";
import { _addMicrotaskToQueue, _resetMicrotaskQueue } from "../../../../src/timer/microtasks/timerMicrotask";
import { _runMicroTask } from "../../../../src/timer/microtasks/runMicrotask";
import { scheduleTimeout, setTimeoutOverrides } from "../../../../src/timer/timeout";

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
        _resetMicrotaskQueue();
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
    });

    describe("without queueMicrotask and Promise", () => {
        beforeEach(() => {
            setMicroTaskFallbackOptions();
            (<any>getGlobal()).queueMicrotask = null;
            (<any>getGlobal()).Promise = null;
            _resetMicrotaskQueue();
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

            _addMicrotaskToQueue(() => {
                flushedBatches.push("batch-1");
            });

            orgSetTimeout(() => {
                _addMicrotaskToQueue(() => {
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
});
