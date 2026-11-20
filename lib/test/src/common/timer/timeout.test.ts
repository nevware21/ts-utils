/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "@nevware21/tripwire-chai";
import { createTimeout, createTimeoutWith, scheduleTimeout, scheduleTimeoutWith, setTimeoutOverrides, setGlobalTimeoutOverrides, TimeoutOverrideFuncs } from "../../../../src/timer/timeout";

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

        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
    });

    it("cancel timeout", () => {
        let timeoutCalled = false;
        let theTimeout = scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }
        theTimeout.cancel();
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        clock.tick(1);
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
    });

    it("cancel timeout via enabled", () => {
        let timeoutCalled = false;
        let theTimeout = scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }
        theTimeout.enabled = false;
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        clock.tick(1);
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
    });

    it("refresh timeout", () => {
        let timeoutCalled = false;
        let theTimeout = scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        theTimeout.refresh();
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        clock.tick(1);
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");

        for (let lp = 0; lp < 98; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        // reset
        theTimeout.refresh();
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        timeoutCalled = false;
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        // reset
        theTimeout.refresh();
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        timeoutCalled = false;
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        theTimeout.refresh();
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        clock.tick(1);
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 98; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
    });

    it("refresh timeout via enabled", () => {
        let timeoutCalled = false;
        let theTimeout = scheduleTimeout(() => {
            timeoutCalled = true;
        }, 100);

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        // Doesn't reset the timer
        theTimeout.enabled = true;
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        // restart the timer
        theTimeout.enabled = true;
        timeoutCalled = false;
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }
        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        // reset
        theTimeout.enabled = true;
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        timeoutCalled = false;
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");
        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

        // reset the timer
        theTimeout.enabled = true;
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        timeoutCalled = false;
        assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        for (let lp = 0; lp < 99; lp++) {
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
        }

        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        // Should not refresh the timer
        theTimeout.enabled = true;
        assert.equal(theTimeout.enabled, true, "Check that the handler is running");

        clock.tick(1);
        assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
    });

    describe("pass extra arguments", () => {
        it("basic timeout", () => {
            let timeoutCalled = false;
            let theArgs: any = null;
            let theTimeout = scheduleTimeout(function (a, b) {
                timeoutCalled = true;
                theArgs = arguments;
            }, 100, "Hello", "Darkness");
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
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
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(null, theArgs, "No arguments");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(null, theArgs, "No arguments");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            theTimeout.refresh();
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");

            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
    
            for (let lp = 0; lp < 98; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(2, theArgs.length);
            assert.equal("Hello", theArgs[0], "First Arg");
            assert.equal("Darkness", theArgs[1], "Second Arg");
        });
    
        it("refresh after cancel timeout", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            theTimeout.cancel();
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
    
            theTimeout.refresh();
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
        });
    });

    describe("override timeout", () => {
        let overrideCalled = 0;

        function newSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            overrideCalled++;
            return setTimeout(callback, timeout);
        }

        it("basic timeout", () => {
            let timeoutCalled = false;
            let timerId = setTimeout(() => {
                // no-op
            }, 1);
            let supportsTimerRefresh = !!(timerId && (timerId as any).refresh);
            clearTimeout(timerId);

            let theTimeout = scheduleTimeoutWith(newSetTimeoutFn, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 1, "The override should not have been called yet");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, 1, "The override should have been called");

            clock.tick(200);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, 1, "The override should have been called");

            // Restart the timeout
            timeoutCalled = false;
            theTimeout.refresh();
            clock.tick(99);
            assert.equal(theTimeout.enabled, true, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should have been called yet");
            assert.equal(overrideCalled, 2, "The override should have been called");

            // Restart it again while still running
            theTimeout.refresh();
            clock.tick(1);
            assert.equal(theTimeout.enabled, true, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should have been called yet");
            assert.equal(overrideCalled, supportsTimerRefresh ? 2 : 3, "The override should have been called");

            clock.tick(98);

            assert.equal(theTimeout.enabled, true, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should have been called yet");
            assert.equal(overrideCalled, supportsTimerRefresh ? 2 : 3, "The override should have been called");

            clock.tick(1);

            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, supportsTimerRefresh ? 2 : 3, "The override should have been called");
        });
    });

    describe("override timeout using array override", () => {
        let overrideCalled = 0;
        let clearCalled = 0;

        function newSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            overrideCalled++;
            return setTimeout(callback, timeout);
        }

        function clearSetTimeoutFn(timeoutId: any) {
            clearCalled++;
            return clearTimeout(timeoutId);
        }

        it("basic timeout no clear", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([newSetTimeoutFn, clearSetTimeoutFn], () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 1, "The override should not have been called yet");
                assert.equal(clearCalled, 0, "The clear override should not have been called");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, 1, "The override should have been called");
            assert.equal(clearCalled, 0, "The clear override should not have been called");
        });
    });

    describe("override set and clear timeout refresh after cancel", () => {
        let overrideCalled = 0;
        let clearCalled = 0;

        function newSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            overrideCalled ++;
            return setTimeout(callback, timeout);
        }

        function clearSetTimeoutFn(timeoutId: any) {
            clearCalled++;
            return clearTimeout(timeoutId);
        }

        it("basic timeout", () => {
            let timeoutCalled = false;
            overrideCalled = 0;
            clearCalled = 0;
            
            let theTimeout = scheduleTimeoutWith([newSetTimeoutFn, clearSetTimeoutFn], () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 1, "The override should not have been called yet");
                assert.equal(clearCalled, 0, "The clear override should not have been called");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            theTimeout.cancel();
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

            assert.equal(clearCalled, 1, "The clear override should have been called");
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            assert.equal(clearCalled, 1, "The clear override should have been called");

            theTimeout.refresh();
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 2, "The override should not have been called yet");
            assert.equal(clearCalled, 1, "The clear override should have been called once");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 2, "The override should not have been called yet");
                assert.equal(clearCalled, 1, "The clear override should have been called once");
            }
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, 2, "The override should have been called");
            assert.equal(clearCalled, 1, "The clear override should have been called once");
        });

        it("basic timeout using enabled", () => {
            let timeoutCalled = false;
            overrideCalled = 0;
            clearCalled = 0;
            
            let theTimeout = scheduleTimeoutWith([newSetTimeoutFn, clearSetTimeoutFn], () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 1, "The override should not have been called yet");
                assert.equal(clearCalled, 0, "The clear override should not have been called");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            
            // Stop the timer
            theTimeout.enabled = false;
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

            assert.equal(clearCalled, 1, "The clear override should have been called");
            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            assert.equal(clearCalled, 1, "The clear override should have been called");

            // Start the timer
            theTimeout.enabled = true;
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 2, "The override should not have been called yet");
            assert.equal(clearCalled, 1, "The clear override should have been called once");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 2, "The override should not have been called yet");
                assert.equal(clearCalled, 1, "The clear override should have been called once");
            }
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, 2, "The override should have been called");
            assert.equal(clearCalled, 1, "The clear override should have been called once");
        });
    });

    describe("override set but not clear timeout refresh after cancel", () => {
        let overrideCalled = 0;

        function newSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            overrideCalled ++;
            return setTimeout(callback, timeout);
        }

        it("basic timeout", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([newSetTimeoutFn, null], () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 1, "The override should not have been called yet");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            theTimeout.cancel();
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");

            clock.tick(1);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 1, "The override should not have been called yet");

            theTimeout.refresh();
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(overrideCalled, 2, "The override should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
                assert.equal(overrideCalled, 2, "The override should not have been called yet");
            }
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, 2, "The override should have been called");
        });
    });

    describe("override timeout with no override", () => {
        it("basic timeout", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith(null as any, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            clock.tick(1);
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
        });
    });

    describe("override timeout with no overrides", () => {
        it("basic timeout", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([null, null], () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
        });

        it("basic timeout with empty array", () => {
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([] as unknown as TimeoutOverrideFuncs, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
        });

        it("basic create timeout", () => {
            let timeoutCalled = false;
            let timer = createTimeoutWith([null, null], () => {
                timeoutCalled = true;
            }, 100);

            assert.equal(timer.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            clock.tick(500);
            assert.equal(timeoutCalled, false, "Timeout should still not have been called yet");

            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");
    
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(timer.enabled, false, "Check that the handler is stopped");
        });

        it("basic timeout with empty array", () => {
            let timeoutCalled = false;
            let timer = createTimeoutWith([] as unknown as TimeoutOverrideFuncs, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(timer.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            clock.tick(500);
            assert.equal(timeoutCalled, false, "Timeout should still not have been called yet");

            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");

            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(timer.enabled, false, "Check that the handler is stopped");
        });
    });

    describe("validate ref, unref and hasRef usage", () => {
        it("basic timeout", () => {
            let timeoutCalled = false;
            let timer = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(timer.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(timer.hasRef(), true, "Check that the default for creating and scheduling a new timer is referenced");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact");

            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(timer.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");

            assert.equal(timer.hasRef(), true, "Check that the timer is still considered referenced even after the timeout function has been called");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd even after the timeout function has been called");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd even after the timeout function has been called");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact even after the timeout function has been called");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact even after the timeout function has been called");
        });

        it("basic create timeout", () => {
            let timeoutCalled = false;
            let timer = createTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(timer.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(timer.hasRef(), true, "Check that the default for creating and scheduling a new timer is referenced");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact");

            clock.tick(500);
            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");

            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(timer.hasRef(), true, "Check that the default for creating and scheduling a new timer is referenced");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact");
            
            clock.tick(99);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            timer.cancel();
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");

            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(timer.hasRef(), true, "Check that the default for creating and scheduling a new timer is referenced");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact");
            
            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");

            clock.tick(99);
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");

            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(timer.hasRef(), true, "Check that the default for creating and scheduling a new timer is referenced");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact");

            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }
            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(timer.enabled, false, "Check that the handler is stopped");

            assert.equal(timer.hasRef(), true, "Check that the timer is still considered referenced even after the timeout function has been called");
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd even after the timeout function has been called");
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that the timer can be re-ref'd even after the timeout function has been called");

            timer.ref();
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that calling ref multiple times has no impact even after the timeout function has been called");

            timer.unref();
            timer.unref();
            timer.ref();
            assert.equal(timer.hasRef(), true, "Check that calling unref multiple times has no impact even after the timeout function has been called");
        });
    });
    
    describe("Timeout overrides", () => {
        let globalSetTimeoutCalled = 0;
        let globalClearTimeoutCalled = 0;

        function globalSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            globalSetTimeoutCalled++;
            return setTimeout(callback, timeout);
        }

        function globalClearTimeoutFn(timeoutId: any) {
            globalClearTimeoutCalled++;
            return clearTimeout(timeoutId);
        }

        beforeEach(() => {
            globalSetTimeoutCalled = 0;
            globalClearTimeoutCalled = 0;
            // Reset overrides before each test
            setTimeoutOverrides(undefined);
        });
        
        it("should use package override functions when set", () => {
            // Set package overrides
            setTimeoutOverrides(globalSetTimeoutFn);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global override should have been called once");
            
            for (let lp = 0; lp < 99; lp++) {
                clock.tick(1);
                assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            }

            clock.tick(1);
            assert.equal(timeoutCalled, true, "Timeout should have been called");
            assert.equal(globalSetTimeoutCalled, 1, "The global override should still have been called once");
            assert.equal(globalClearTimeoutCalled, 0, "The global clear override should not have been called");
        });
        
        it("should use both set and clear override functions when set as array", () => {
            // Set overrides as array
            setTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called once");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 1, "The global clear override should have been called once");
            
            clock.tick(100);
            assert.equal(timeoutCalled, false, "Timeout should not have been called after cancel");
            
            // Refresh and start again
            theTimeout.refresh();
            assert.equal(globalSetTimeoutCalled, 2, "The global set override should have been called twice");
            
            for (let lp = 0; lp < 100; lp++) {
                clock.tick(1);
            }
            assert.equal(timeoutCalled, true, "Timeout should have been called after refresh");
            assert.equal(globalSetTimeoutCalled, 2, "The global set override should have been called twice");
        });
        
        it("should reset overrides when undefined is passed", () => {
            // Set overrides
            setTimeoutOverrides(globalSetTimeoutFn);
            
            // Now reset them by passing undefined
            setTimeoutOverrides(undefined);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 0, "The global override should not have been called");
            
            clock.tick(100);
            assert.equal(timeoutCalled, true, "Timeout should have been called");
            assert.equal(globalSetTimeoutCalled, 0, "The global override should not have been called");
        });
        
        it("should override timeouts used with scheduleTimeoutWith", () => {
            // Set package overrides
            setTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // This should still use the provided override, not the global one
            let customSetTimeoutCalled = 0;
            function customSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
                customSetTimeoutCalled++;
                return setTimeout(callback, timeout);
            }
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith(customSetTimeoutFn, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(customSetTimeoutCalled, 1, "The custom override should have been called");
            assert.equal(globalSetTimeoutCalled, 0, "The global override should not have been called");
            
            clock.tick(100);
            assert.equal(timeoutCalled, true, "Timeout should have been called");
            assert.equal(customSetTimeoutCalled, 1, "The custom override should have been called");
            assert.equal(globalSetTimeoutCalled, 0, "The global override should not have been called");
        });
        
        it("should use package fallback for null override functions", () => {
            // Set package overrides
            setTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            // Use null for override, which should fall back to global
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith(null as any, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called");
            
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 1, "The global clear override should have been called");
        });
        
        it("should handle empty array override falling back to package overrides", () => {
            // Set package overrides
            setTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // Use empty array for override, which should fall back to global
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([] as unknown as TimeoutOverrideFuncs, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called");
            
            clock.tick(100);
            assert.equal(timeoutCalled, true, "Timeout should have been called");
        });
        
        it("should use package clearTimeout when only setTimeout is provided", () => {
            // Set package overrides
            setTimeoutOverrides([null, globalClearTimeoutFn]);
            
            // Only provide a single setTimeout function, no clearTimeout
            let customSetTimeoutCalled = 0;
            function customSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
                customSetTimeoutCalled++;
                return setTimeout(callback, timeout);
            }
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith(customSetTimeoutFn, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(customSetTimeoutCalled, 1, "The custom setTimeout override should have been called");
            assert.equal(globalSetTimeoutCalled, 0, "The global setTimeout override should not have been called");
            assert.equal(globalClearTimeoutCalled, 0, "The global clearTimeout override should not have been called yet");
            
            // Cancel the timeout, which should use the global clear override
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 1, "The global clearTimeout override should have been called");
            
            clock.tick(100);
            assert.equal(timeoutCalled, false, "Timeout should not have been called after cancel");
        });
        
        it("should use package clearTimeout when only setTimeout is provided, but the package set override is defined", () => {
            // Set package overrides
            setTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // Only provide a single setTimeout function, no clearTimeout
            let customSetTimeoutCalled = 0;
            function customSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
                customSetTimeoutCalled++;
                return setTimeout(callback, timeout);
            }
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith(customSetTimeoutFn, () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(customSetTimeoutCalled, 1, "The custom setTimeout override should have been called");
            assert.equal(globalSetTimeoutCalled, 0, "The global setTimeout override should not have been called");
            assert.equal(globalClearTimeoutCalled, 0, "The global clearTimeout override should not have been called yet");
            
            // Cancel the timeout, which should use the global clear override
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 1, "The global clearTimeout override should have been called");
            
            clock.tick(100);
            assert.equal(timeoutCalled, false, "Timeout should not have been called after cancel");
        });
    });

    describe("Global Timeout Override Tests", () => {
        let packageSetTimeoutCalled = 0;
        let packageClearTimeoutCalled = 0;
        let globalSetTimeoutCalled = 0;
        let globalClearTimeoutCalled = 0;
        
        function packageSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            packageSetTimeoutCalled++;
            return setTimeout(callback, timeout);
        }

        function packageClearTimeoutFn(timeoutId: any) {
            packageClearTimeoutCalled++;
            return clearTimeout(timeoutId);
        }

        function globalSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
            globalSetTimeoutCalled++;
            return setTimeout(callback, timeout);
        }

        function globalClearTimeoutFn(timeoutId: any) {
            globalClearTimeoutCalled++;
            return clearTimeout(timeoutId);
        }

        beforeEach(() => {
            // Reset counters and clear any overrides before each test
            packageSetTimeoutCalled = 0;
            packageClearTimeoutCalled = 0;
            globalSetTimeoutCalled = 0;
            globalClearTimeoutCalled = 0;
            
            // Reset package and global overrides
            setTimeoutOverrides(undefined);
            setGlobalTimeoutOverrides(undefined);
        });

        it("should use global overrides when no package overrides are set", () => {
            // Set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called once");
            assert.equal(packageSetTimeoutCalled, 0, "The package override should not have been called");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 1, "The global clear override should have been called once");
            assert.equal(packageClearTimeoutCalled, 0, "The package clear override should not have been called");
            
            // Check that the timeout doesn't execute
            clock.tick(100);
            assert.equal(timeoutCalled, false, "Timeout should not have been called after cancel");
        });

        it("should prefer package overrides over global overrides", () => {
            // Set both package and global overrides
            setTimeoutOverrides([packageSetTimeoutFn, packageClearTimeoutFn]);
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(packageSetTimeoutCalled, 1, "The package set override should have been called once");
            assert.equal(globalSetTimeoutCalled, 0, "The global override should not have been called");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(packageClearTimeoutCalled, 1, "The package clear override should have been called once");
            assert.equal(globalClearTimeoutCalled, 0, "The global clear override should not have been called");
            
            // Check that the timeout doesn't execute
            clock.tick(100);
            assert.equal(timeoutCalled, false, "Timeout should not have been called after cancel");
        });

        it("should use global setTimeout when package setTimeout is not provided", () => {
            // Set only package clearTimeout but not setTimeout
            setTimeoutOverrides([null, packageClearTimeoutFn]);
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called once");
            assert.equal(packageSetTimeoutCalled, 0, "The package set override should not have been called");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(packageClearTimeoutCalled, 1, "The package clear override should have been called once");
            assert.equal(globalClearTimeoutCalled, 0, "The global clear override should not have been called");
        });

        it("should use global clearTimeout when package clearTimeout is not provided", () => {
            // Set only package setTimeout but not clearTimeout
            setTimeoutOverrides([packageSetTimeoutFn, null]);
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(packageSetTimeoutCalled, 1, "The package set override should have been called once");
            assert.equal(globalSetTimeoutCalled, 0, "The global set override should not have been called");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(packageClearTimeoutCalled, 0, "The package clear override should not have been called");
            assert.equal(globalClearTimeoutCalled, 1, "The global clear override should have been called once");
        });

        it("should use single function global override for setTimeout only", () => {
            // Set only global setTimeout (as single function)
            setGlobalTimeoutOverrides(globalSetTimeoutFn);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called once");
            
            // Run the timer
            for (let lp = 0; lp < 100; lp++) {
                clock.tick(1);
            }
            
            assert.equal(timeoutCalled, true, "Timeout should have been called");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called once");
        });

        it("should reset global overrides when undefined is passed", () => {
            // Set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // Now reset them by passing undefined
            setGlobalTimeoutOverrides(undefined);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 0, "The global set override should not have been called");
            
            clock.tick(100);
            assert.equal(timeoutCalled, true, "Timeout should have been called");
            assert.equal(globalSetTimeoutCalled, 0, "The global set override should not have been called");
        });

        it("should use global overrides with createTimeout", () => {
            // Set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            let timeoutCalled = false;
            let theTimeout = createTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            // Timer not started yet
            assert.equal(theTimeout.enabled, false, "Check that the handler is not running");
            assert.equal(globalSetTimeoutCalled, 0, "The global set override should not have been called yet");
            
            // Start the timer
            theTimeout.refresh();
            assert.equal(theTimeout.enabled, true, "Check that the handler is now running");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called once");
            
            // Cancel the timer
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 1, "The global clear override should have been called once");
            
            // Start the timer again
            theTimeout.refresh();
            assert.equal(globalSetTimeoutCalled, 2, "The global set override should have been called twice");
            
            // Let the timer complete
            clock.tick(100);
            assert.equal(timeoutCalled, true, "Timeout should have been called");
        });

        it("should use global overrides with specific overrides in scheduleTimeoutWith", () => {
            // Set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // Define local overrides for this specific timeout
            let localSetTimeoutCalled = 0;
            let localClearTimeoutCalled = 0;
            
            function localSetTimeoutFn<TArgs extends any[]>(callback: (...args: TArgs) => void, timeout?: number, ...args: TArgs) {
                localSetTimeoutCalled++;
                return setTimeout(callback, timeout);
            }
            
            function localClearTimeoutFn(timeoutId: any) {
                localClearTimeoutCalled++;
                return clearTimeout(timeoutId);
            }
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([localSetTimeoutFn, localClearTimeoutFn], () => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(localSetTimeoutCalled, 1, "The local set override should have been called once");
            assert.equal(globalSetTimeoutCalled, 0, "The global set override should not have been called");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(localClearTimeoutCalled, 1, "The local clear override should have been called once");
            assert.equal(globalClearTimeoutCalled, 0, "The global clear override should not have been called");
        });

        it("should handle null values in global override array", () => {
            // Set global overrides with null clearTimeout
            setGlobalTimeoutOverrides([globalSetTimeoutFn, null]);
            
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
    
            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
            assert.equal(timeoutCalled, false, "Timeout should not have been called yet");
            assert.equal(globalSetTimeoutCalled, 1, "The global set override should have been called");
            
            // Cancel the timeout - should use native clearTimeout since global clearTimeout is null
            theTimeout.cancel();
            assert.equal(globalClearTimeoutCalled, 0, "The global clear override should not have been called");
            
            // Make sure the timeout doesn't fire after cancel
            clock.tick(100);
            assert.equal(timeoutCalled, false, "Timeout should not have been called after cancel");
        });

        it("should handle complex scenario with package and global overrides", () => {
            // First set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // Call a timeout to verify global overrides are used
            let timeout1Called = false;
            let timeout1 = scheduleTimeout(() => {
                timeout1Called = true;
            }, 100);
            
            assert.equal(globalSetTimeoutCalled, 1, "Global set timeout should have been called");
            assert.equal(packageSetTimeoutCalled, 0, "Package set timeout should not have been called");
            assert.equal(timeout1Called, false, "Timeout 1 should not have been called yet");
            
            // Now set package overrides
            setTimeoutOverrides([packageSetTimeoutFn, packageClearTimeoutFn]);
            
            // Call another timeout to verify package overrides are now used
            let timeout2Called = false;
            let timeout2 = scheduleTimeout(() => {
                timeout2Called = true;
            }, 100);
            
            assert.equal(globalSetTimeoutCalled, 1, "Global set timeout should not have been called again");
            assert.equal(packageSetTimeoutCalled, 1, "Package set timeout should have been called");
            assert.equal(timeout2Called, false, "Timeout 2 should not have been called yet");
            
            // Cancel both timeouts
            timeout1.cancel();
            timeout2.cancel();
            
            assert.equal(globalClearTimeoutCalled, 1, "Global clear timeout should have been called once");
            assert.equal(packageClearTimeoutCalled, 1, "Package clear timeout should have been called once");
            
            // Now reset package overrides
            setTimeoutOverrides(undefined);
            
            // Call a third timeout to verify we're back to using global overrides
            let timeout3Called = false;
            scheduleTimeout(() => {
                timeout3Called = true;
            }, 100);
            
            assert.equal(globalSetTimeoutCalled, 2, "Global set timeout should have been called again");
            assert.equal(packageSetTimeoutCalled, 1, "Package set timeout count should not change");
            assert.equal(timeout3Called, false, "Timeout 3 should not have been called yet");
            
            // Let this timeout complete
            clock.tick(100);
            assert.equal(timeout3Called, true, "Timeout 3 should have completed");
            
            // Finally reset global overrides
            setGlobalTimeoutOverrides(undefined);
            
            // Call a fourth timeout to verify we're using native functions
            let timeout4Called = false;
            scheduleTimeout(() => {
                timeout4Called = true;
            }, 100);
            
            assert.equal(globalSetTimeoutCalled, 2, "Global set timeout count should not change");
            assert.equal(packageSetTimeoutCalled, 1, "Package set timeout count should not change");
            
            // Let this timeout complete
            clock.tick(100);
            assert.equal(timeout4Called, true, "Timeout 4 should have completed");
        });
        
        it("should handle interleaved changes to package and global overrides", () => {
            // First set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutFn, globalClearTimeoutFn]);
            
            // Then set package overrides
            setTimeoutOverrides([packageSetTimeoutFn, packageClearTimeoutFn]);
            
            // Create a timeout - should use package overrides
            let timeoutCalled = false;
            let theTimeout = scheduleTimeout(() => {
                timeoutCalled = true;
            }, 100);
            
            assert.equal(packageSetTimeoutCalled, 1, "Package set timeout should be called");
            assert.equal(globalSetTimeoutCalled, 0, "Global set timeout should not be called");
            
            // Reset package overrides
            setTimeoutOverrides(undefined);
            
            // Create another timeout - should now use global overrides
            let timeout2Called = false;
            let timeout2 = scheduleTimeout(() => {
                timeout2Called = true;
            }, 100);
            
            assert.equal(packageSetTimeoutCalled, 1, "Package set timeout count should not change");
            assert.equal(globalSetTimeoutCalled, 1, "Global set timeout should be called");
            
            // Change global overrides to only have setTimeout but not clearTimeout
            setGlobalTimeoutOverrides([globalSetTimeoutFn, null]);
            
            // Cancel the first timeout
            theTimeout.cancel();

            // Original timeout had package override when created
            assert.equal(packageClearTimeoutCalled, 1, "Package clear timeout should be called since we reset package overrides");
            assert.equal(globalClearTimeoutCalled, 0, "Global clear timeout should not yet");

            // Cancel the second timeout
            timeout2.cancel();
            
            // Original timeout had package override when created
            assert.equal(packageClearTimeoutCalled, 1, "Package clear timeout should not be called since we reset package overrides");
            assert.equal(globalClearTimeoutCalled, 1, "Global clear timeout should be called once for the second timeout");
            
            // Verify timeouts don't fire
            clock.tick(200);
            assert.equal(timeoutCalled, false, "First timeout should not fire after cancel");
            assert.equal(timeout2Called, false, "Second timeout should not fire after cancel");
        });
    });

    describe("Timer ID with refresh method", () => {
        it("should use timer ID's refresh method when available", () => {
            // Create a custom setTimeout that returns an object with a refresh method
            let refreshCalled = 0;
            let timerIdRefreshed = false;
            let timerCreationCount = 0;
            
            function customSetTimeoutWithRefresh<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
                timerCreationCount++;
                const id = setTimeout(callback, ms);
                return {
                    _id: id,
                    refresh: () => {
                        refreshCalled++;
                        timerIdRefreshed = true;
                        clearTimeout(id); // Clear the old timeout
                        const newId = setTimeout(callback, ms); // Create a new timeout
                        return {
                            _id: newId,
                            refresh: () => {
                                refreshCalled++;
                                timerIdRefreshed = true;
                                clearTimeout(newId);
                                return setTimeout(callback, ms);
                            }
                        };
                    }
                };
            }
            
            function customClearTimeout(timerId: any) {
                if (timerId && timerId._id) {
                    clearTimeout(timerId._id);
                } else {
                    clearTimeout(timerId);
                }
            }
            
            // Use custom setTimeout and clearTimeout
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([customSetTimeoutWithRefresh, customClearTimeout], () => {
                timeoutCalled = true;
            }, 100);
            
            // Initial state
            assert.equal(theTimeout.enabled, true, "The timeout should be enabled");
            assert.equal(timeoutCalled, false, "The callback should not have been called yet");
            assert.equal(timerCreationCount, 1, "Timer should have been created once");
            assert.equal(refreshCalled, 0, "Refresh should not have been called yet");
            
            // Advance the clock but not enough to trigger the timeout
            clock.tick(50);
            assert.equal(timeoutCalled, false, "The callback should not have been called yet");
            
            // Refresh the timeout
            theTimeout.refresh();
            assert.equal(refreshCalled, 1, "The timer ID's refresh method should have been called");
            assert.equal(timerIdRefreshed, true, "The timer ID should have been refreshed");
            assert.equal(timeoutCalled, false, "The callback should still not have been called");
            
            // Advance the clock by the initial time - should not trigger as it was refreshed
            clock.tick(50);
            assert.equal(timeoutCalled, false, "The callback should not be called after original deadline");
            
            // Advance to the new deadline
            clock.tick(50);
            assert.equal(timeoutCalled, true, "The callback should be called after the new deadline");
            assert.equal(theTimeout.enabled, false, "The timeout should be disabled after firing");
        });
        
        it("should handle multiple refreshes with timer ID's refresh method", () => {
            // Create a custom setTimeout that returns an object with a refresh method
            let refreshCallCount = 0;
            
            function customSetTimeoutWithRefresh<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
                const id = setTimeout(callback, ms);
                return {
                    _id: id,
                    refresh: function() {
                        refreshCallCount++;
                        clearTimeout(this._id);
                        const newId = setTimeout(callback, ms);
                        this._id = newId;
                        return this;
                    }
                };
            }
            
            // Use custom setTimeout
            let timeoutCallCount = 0;
            let theTimeout = scheduleTimeoutWith(customSetTimeoutWithRefresh, () => {
                timeoutCallCount++;
            }, 100);
            
            // Initial state
            assert.equal(theTimeout.enabled, true, "The timeout should be enabled");
            assert.equal(timeoutCallCount, 0, "The callback should not have been called yet");
            assert.equal(refreshCallCount, 0, "Refresh should not have been called yet");
            
            // First refresh at 50ms
            clock.tick(50);
            theTimeout.refresh();
            assert.equal(refreshCallCount, 1, "The refresh method should have been called once");
            assert.equal(timeoutCallCount, 0, "The callback should not have been called yet");
            
            // Second refresh at 100ms (50ms since first refresh)
            clock.tick(50);
            theTimeout.refresh();
            assert.equal(refreshCallCount, 2, "The refresh method should have been called twice");
            assert.equal(timeoutCallCount, 0, "The callback should not have been called yet");
            
            // Third refresh at 150ms (50ms since second refresh)
            clock.tick(50);
            theTimeout.refresh();
            assert.equal(refreshCallCount, 3, "The refresh method should have been called three times");
            assert.equal(timeoutCallCount, 0, "The callback should not have been called yet");
            
            // Let the timeout complete
            clock.tick(100);
            assert.equal(timeoutCallCount, 1, "The callback should have been called once");
            assert.equal(theTimeout.enabled, false, "The timeout should be disabled after firing");
        });
        
        it("should handle enabled property with timer ID's refresh method", () => {
            // Create a custom setTimeout that returns an object with a refresh method
            let refreshCallCount = 0;
            let clearCallCount = 0;
            
            function customSetTimeoutWithRefresh<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
                const id = setTimeout(callback, ms);
                return {
                    _id: id,
                    refresh: function() {
                        refreshCallCount++;
                        clearTimeout(id);
                        const newId = setTimeout(callback, ms);
                        this._id = newId;
                        return this;
                    }
                };
            }
            
            function customClearTimeout(timerId: any) {
                clearCallCount++;
                if (timerId && timerId._id) {
                    clearTimeout(timerId._id);
                } else {
                    clearTimeout(timerId);
                }
            }
            
            // Use custom setTimeout and clearTimeout
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([customSetTimeoutWithRefresh, customClearTimeout], () => {
                timeoutCalled = true;
            }, 100);
            
            // Initial state
            assert.equal(theTimeout.enabled, true, "The timeout should be enabled");
            
            // Disable the timeout
            theTimeout.enabled = false;
            assert.equal(theTimeout.enabled, false, "The timeout should be disabled");
            assert.equal(clearCallCount, 1, "Clear should have been called once");
            
            // Advance the clock - should not trigger the callback
            clock.tick(100);
            assert.equal(timeoutCalled, false, "The callback should not have been called");
            
            // Re-enable the timeout
            theTimeout.enabled = true;
            assert.equal(theTimeout.enabled, true, "The timeout should be re-enabled");
            assert.equal(refreshCallCount, 0, "Refresh should not have been called directly");
            
            // Advance the clock - should trigger the callback
            clock.tick(100);
            assert.equal(timeoutCalled, true, "The callback should have been called");
            assert.equal(theTimeout.enabled, false, "The timeout should be disabled after firing");
        });
        
        it("should properly handle cancel with timer ID's refresh method", () => {
            // Create a custom setTimeout that returns an object with a refresh method
            let refreshCallCount = 0;
            let clearCallCount = 0;
            
            function customSetTimeoutWithRefresh<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
                const id = setTimeout(callback, ms);
                return {
                    _id: id,
                    refresh: function() {
                        refreshCallCount++;
                        clearTimeout(id);
                        const newId = setTimeout(callback, ms);
                        this._id = newId;
                        return this;
                    }
                };
            }
            
            function customClearTimeout(timerId: any) {
                clearCallCount++;
                if (timerId && timerId._id) {
                    clearTimeout(timerId._id);
                } else {
                    clearTimeout(timerId);
                }
            }
            
            // Use custom setTimeout and clearTimeout
            let timeoutCalled = false;
            let theTimeout = scheduleTimeoutWith([customSetTimeoutWithRefresh, customClearTimeout], () => {
                timeoutCalled = true;
            }, 100);
            
            // Initial state
            assert.equal(theTimeout.enabled, true, "The timeout should be enabled");
            
            // Refresh the timeout
            clock.tick(50);
            theTimeout.refresh();
            assert.equal(refreshCallCount, 1, "The refresh method should have been called once");
            
            // Cancel the timeout
            theTimeout.cancel();
            assert.equal(theTimeout.enabled, false, "The timeout should be disabled");
            assert.equal(clearCallCount, 1, "Clear should have been called once");
            
            // Advance the clock - should not trigger the callback
            clock.tick(100);
            assert.equal(timeoutCalled, false, "The callback should not have been called after cancel");
        });
        
        it("should work with global overrides that provide timers with refresh method", () => {
            // Create a custom setTimeout that returns an object with a refresh method
            let globalRefreshCalled = 0;
            
            function globalSetTimeoutWithRefresh<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
                const id = setTimeout(callback, ms);
                return {
                    _id: id,
                    refresh: function() {
                        globalRefreshCalled++;
                        clearTimeout(id);
                        const newId = setTimeout(callback, ms);
                        this._id = newId;
                        return this;
                    }
                };
            }
            
            function globalClearTimeout(timerId: any) {
                if (timerId && timerId._id) {
                    clearTimeout(timerId._id);
                } else {
                    clearTimeout(timerId);
                }
            }
            
            // Set global overrides
            setGlobalTimeoutOverrides([globalSetTimeoutWithRefresh, globalClearTimeout]);
            
            try {
                // Use global setTimeout and clearTimeout implicitly
                let timeoutCalled = false;
                let theTimeout = scheduleTimeout(() => {
                    timeoutCalled = true;
                }, 100);
                
                // Initial state
                assert.equal(theTimeout.enabled, true, "The timeout should be enabled");
                assert.equal(timeoutCalled, false, "The callback should not have been called yet");
                
                // Advance the clock but not enough to trigger the timeout
                clock.tick(50);
                assert.equal(timeoutCalled, false, "The callback should not have been called yet");
                
                // Refresh the timeout
                theTimeout.refresh();
                assert.equal(globalRefreshCalled, 1, "The timer ID's refresh method should have been called");
                assert.equal(timeoutCalled, false, "The callback should still not have been called");
                
                // Advance the clock by the initial time - should not trigger as it was refreshed
                clock.tick(50);
                assert.equal(timeoutCalled, false, "The callback should not be called after original deadline");
                
                // Advance to the new deadline
                clock.tick(50);
                assert.equal(timeoutCalled, true, "The callback should be called after the new deadline");
                assert.equal(theTimeout.enabled, false, "The timeout should be disabled after firing");
            } finally {
                // Reset global overrides
                setGlobalTimeoutOverrides(undefined);
            }
        });
        
        it("should work with package overrides that provide timers with refresh method", () => {
            // Create a custom setTimeout that returns an object with a refresh method
            let packageRefreshCalled = 0;
            
            function packageSetTimeoutWithRefresh<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
                const id = setTimeout(callback, ms);
                return {
                    _id: id,
                    refresh: function() {
                        packageRefreshCalled++;
                        clearTimeout(id);
                        const newId = setTimeout(callback, ms);
                        this._id = newId;
                        return this;
                    }
                };
            }
            
            function packageClearTimeout(timerId: any) {
                if (timerId && timerId._id) {
                    clearTimeout(timerId._id);
                } else {
                    clearTimeout(timerId);
                }
            }
            
            // Set package overrides
            setTimeoutOverrides([packageSetTimeoutWithRefresh, packageClearTimeout]);
            
            try {
                // Use package setTimeout and clearTimeout implicitly
                let timeoutCalled = false;
                let theTimeout = scheduleTimeout(() => {
                    timeoutCalled = true;
                }, 100);
                
                // Initial state
                assert.equal(theTimeout.enabled, true, "The timeout should be enabled");
                assert.equal(timeoutCalled, false, "The callback should not have been called yet");
                
                // Advance the clock but not enough to trigger the timeout
                clock.tick(50);
                assert.equal(timeoutCalled, false, "The callback should not have been called yet");
                
                // Refresh the timeout
                theTimeout.refresh();
                assert.equal(packageRefreshCalled, 1, "The timer ID's refresh method should have been called");
                assert.equal(timeoutCalled, false, "The callback should still not have been called");
                
                // Advance the clock by the initial time - should not trigger as it was refreshed
                clock.tick(50);
                assert.equal(timeoutCalled, false, "The callback should not be called after original deadline");
                
                // Advance to the new deadline
                clock.tick(50);
                assert.equal(timeoutCalled, true, "The callback should be called after the new deadline");
                assert.equal(theTimeout.enabled, false, "The timeout should be disabled after firing");
            } finally {
                // Reset package overrides
                setTimeoutOverrides(undefined);
            }
        });
    });

    describe("override timeout which calls the callback synchronously", () => {
        function syncSetTimeout(callback: (...args: any[]) => void) {
            callback();
            return 1;
        }

        function noopClearTimeout() {
            // no-op
        }

        it("scheduleTimeoutWith runs the callback and the handler is not enabled", () => {
            let timeoutCalled = 0;
            let theTimeout = scheduleTimeoutWith([syncSetTimeout, noopClearTimeout] as any, () => {
                timeoutCalled++;
            }, 0);

            assert.equal(timeoutCalled, 1, "The callback was called synchronously");
            assert.equal(theTimeout.enabled, false, "The handler is not enabled as the callback has already run");

            theTimeout.refresh();
            assert.equal(timeoutCalled, 2, "The callback was called again by refresh()");
            assert.equal(theTimeout.enabled, false, "The handler is still not enabled");
        });

        it("createTimeoutWith runs the callback when enabled and the handler is not enabled", () => {
            let timeoutCalled = 0;
            let theTimeout = createTimeoutWith([syncSetTimeout, noopClearTimeout] as any, () => {
                timeoutCalled++;
            }, 0);

            assert.equal(timeoutCalled, 0, "The callback has not been called as the timer is not started");
            assert.equal(theTimeout.enabled, false, "The handler is not enabled");

            theTimeout.enabled = true;
            assert.equal(timeoutCalled, 1, "The callback was called synchronously");
            assert.equal(theTimeout.enabled, false, "The handler is not enabled as the callback has already run");
        });

        it("scheduleTimeout with setTimeoutOverrides runs the callback and the handler is not enabled", () => {
            let timeoutCalled = 0;

            setTimeoutOverrides([syncSetTimeout, noopClearTimeout] as any);
            try {
                let theTimeout = scheduleTimeout(() => {
                    timeoutCalled++;
                }, 0);

                assert.equal(timeoutCalled, 1, "The callback was called synchronously");
                assert.equal(theTimeout.enabled, false, "The handler is not enabled as the callback has already run");
            } finally {
                setTimeoutOverrides(undefined);
            }
        });
    });

    describe("override timeout which only calls the first callback synchronously", () => {
        let timerCalls: number;
        let clearedIds: any[];

        // The first timer calls the callback synchronously, later timers are left pending (and are never run). Each
        // timer returns its own id (not the count after the callback has run, which may have started another timer)
        function firstSyncSetTimeout(callback: (...args: any[]) => void) {
            let timerId = ++timerCalls;
            if (timerId === 1) {
                callback();
            }

            return timerId;
        }

        function recordClearTimeout(timerId: any) {
            clearedIds.push(timerId);
        }

        beforeEach(() => {
            timerCalls = 0;
            clearedIds = [];
        });

        it("a callback which calls refresh() while it is run synchronously keeps the timer started by refresh()", () => {
            let timeoutCalled = 0;
            let theTimeout = createTimeoutWith([firstSyncSetTimeout, recordClearTimeout] as any, () => {
                timeoutCalled++;
                if (timeoutCalled === 1) {
                    theTimeout.refresh();
                }
            }, 0);

            theTimeout.refresh();
            assert.equal(timeoutCalled, 1, "The callback was called synchronously");
            assert.equal(timerCalls, 2, "The callback's refresh() started a second timer");
            assert.equal(theTimeout.enabled, true, "The handler is enabled as the second timer is pending");

            theTimeout.cancel();
            assert.deepEqual(clearedIds, [2], "cancel() clears the second (pending) timer");
            assert.equal(theTimeout.enabled, false, "The handler is not enabled once it is cancelled");
        });

        it("a callback which calls refresh() and then cancel() while it is run synchronously is not enabled", () => {
            let timeoutCalled = 0;
            let theTimeout = createTimeoutWith([firstSyncSetTimeout, recordClearTimeout] as any, () => {
                timeoutCalled++;
                theTimeout.refresh();
                theTimeout.cancel();
            }, 0);

            theTimeout.refresh();
            assert.equal(timeoutCalled, 1, "The callback was called synchronously");
            assert.equal(timerCalls, 2, "The callback's refresh() started a second timer");
            assert.deepEqual(clearedIds, [2], "The callback's cancel() cleared the second timer");
            assert.equal(theTimeout.enabled, false, "The handler is not enabled as the second timer was cancelled");
        });
    });

    describe("override timeout which runs the pending timers when a timer is started", () => {
        let pending: Array<{ id: number, cb: () => void }>;
        let nextId: number;

        // Like a fake clock which runs the timers that are due whenever a new timer is set, so the callback of another
        // timer runs while a timer is being started
        function runPendingSetTimeout(callback: () => void) {
            let due = pending;
            let timerId = nextId++;

            pending = [];
            due.forEach((timer) => {
                timer.cb();
            });

            pending.push({ id: timerId, cb: callback });

            return timerId;
        }

        function removePendingClearTimeout(timerId: number) {
            pending = pending.filter((timer) => timer.id !== timerId);
        }

        beforeEach(() => {
            pending = [];
            nextId = 1;
        });

        it("a cancel() made by another timer's callback while the timer is started keeps the new timer", () => {
            let aCalled = 0;
            let timerA = createTimeoutWith([runPendingSetTimeout, removePendingClearTimeout] as any, () => {
                aCalled++;
            }, 10);
            let timerB = createTimeoutWith([runPendingSetTimeout, removePendingClearTimeout] as any, () => {
                timerA.cancel();
            }, 10);

            timerB.refresh();

            // Runs B's callback (which cancels A, which isn't running yet) before A's new timer is set
            timerA.refresh();
            assert.equal(timerA.enabled, true, "A's new timer is pending");
            assert.equal(pending.length, 1, "Only A's new timer is pending");

            timerA.cancel();
            assert.equal(timerA.enabled, false, "A is not enabled once it is cancelled");
            assert.equal(pending.length, 0, "cancel() cleared A's new timer");
            assert.equal(aCalled, 0, "A's callback was not called");
        });
    });
});