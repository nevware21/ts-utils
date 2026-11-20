/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { scheduleTimeout, scheduleTimeoutWith, setGlobalTimeoutOverrides, setTimeoutOverrides } from "../../../src/timer/timeout";

// Only run with Node, where the global setTimeout and clearTimeout can be removed (and restored) safely
describe("timeout overrides for a runtime without setTimeout and clearTimeout", () => {
    const theGlobal: any = global;
    const nativeSetTimeout = theGlobal.setTimeout;
    const nativeClearTimeout = theGlobal.clearTimeout;

    /**
     * Removes the global setTimeout and clearTimeout, calls the callback and then restores them. The callback must
     * capture any results, as the assertions (and mocha) may use the native functions.
     */
    function _withoutTimers(cb: () => void) {
        try {
            delete theGlobal.setTimeout;
            delete theGlobal.clearTimeout;
            cb();
        } finally {
            theGlobal.setTimeout = nativeSetTimeout;
            theGlobal.clearTimeout = nativeClearTimeout;
        }
    }

    /**
     * Returns the [setTimeout, clearTimeout] overrides, which record their calls in calls
     */
    function _createOverrides(calls: string[]): [any, any] {
        return [
            function (callback: () => void, timeout: number) {
                calls.push("set " + timeout);
                return 42;
            },
            function (timerId: any) {
                calls.push("clear " + timerId);
            }
        ];
    }

    afterEach(() => {
        setTimeoutOverrides(undefined);
        setGlobalTimeoutOverrides(undefined);
    });

    it("the global functions are removed by the test", () => {
        let results: any = {};
        _withoutTimers(() => {
            results.setTimeoutType = typeof theGlobal.setTimeout;
            results.clearTimeoutType = typeof theGlobal.clearTimeout;
        });

        assert.equal(results.setTimeoutType, "undefined");
        assert.equal(results.clearTimeoutType, "undefined");
        assert.strictEqual(theGlobal.setTimeout, nativeSetTimeout, "The native function was restored");
    });

    it("scheduleTimeoutWith uses the overrides without reading the global functions", () => {
        let calls: string[] = [];
        let error: any;
        _withoutTimers(() => {
            try {
                let timer = scheduleTimeoutWith(_createOverrides(calls), () => {}, 10);
                timer.cancel();
            } catch (e) {
                error = e;
            }
        });

        assert.isUndefined(error, "No error was thrown: " + error);
        assert.deepEqual(calls, ["set 10", "clear 42"]);
    });

    it("scheduleTimeout uses the package overrides without reading the global functions", () => {
        let calls: string[] = [];
        let error: any;
        setTimeoutOverrides(_createOverrides(calls));
        _withoutTimers(() => {
            try {
                let timer = scheduleTimeout(() => {}, 20);
                timer.cancel();
            } catch (e) {
                error = e;
            }
        });

        assert.isUndefined(error, "No error was thrown: " + error);
        assert.deepEqual(calls, ["set 20", "clear 42"]);
    });

    it("scheduleTimeout uses the global overrides without reading the global functions", () => {
        let calls: string[] = [];
        let error: any;
        setGlobalTimeoutOverrides(_createOverrides(calls));
        _withoutTimers(() => {
            try {
                let timer = scheduleTimeout(() => {}, 30);
                timer.cancel();
            } catch (e) {
                error = e;
            }
        });

        assert.isUndefined(error, "No error was thrown: " + error);
        assert.deepEqual(calls, ["set 30", "clear 42"]);
    });
});
