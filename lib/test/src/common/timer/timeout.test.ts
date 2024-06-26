/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "chai";
import { createTimeout, createTimeoutWith, scheduleTimeout, scheduleTimeoutWith, TimeoutOverrideFuncs } from "../../../../src/timer/timeout";
import { isNode } from "../../../../src/helpers/environment";

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
            assert.equal(overrideCalled, isNode() ? 2 : 3, "The override should have been called");

            clock.tick(98);

            assert.equal(theTimeout.enabled, true, "Check that the handler is stopped");
            assert.equal(timeoutCalled, false, "Timeout should have been called yet");
            assert.equal(overrideCalled, isNode() ? 2 : 3, "The override should have been called");

            clock.tick(1);

            assert.equal(theTimeout.enabled, false, "Check that the handler is stopped");
            assert.equal(timeoutCalled, true, "Timeout should have been called yet");
            assert.equal(overrideCalled, isNode() ? 2 : 3, "The override should have been called");
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

            assert.equal(theTimeout.enabled, true, "Check that the handler is running");
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

        it("check ref with create timeout", () => {
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
            timer.unref();
            assert.equal(timer.hasRef(), false, "Check that the timer can be unref'd");

            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");
            assert.equal(timer.hasRef(), false, "Check that the timer is unref'd after refresh");

            timer.cancel();
            assert.equal(timer.enabled, false, "Check that the handler is stopped");
            assert.equal(timer.hasRef(), false, "Check that the timer is unref'd after refresh");

            timer.refresh();
            assert.equal(timer.enabled, true, "Check that the handler is running");
            assert.equal(timer.hasRef(), false, "Check that the timer is unref'd after refresh");
        });
    });
});