/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "chai";
import { utcNow } from "../../../../src/helpers/date";
import { elapsedTime, getPerformance, hasPerformance, perfNow } from "../../../../src/helpers/perf";
import { getGlobal } from "../../../../src/helpers/environment";

describe("performance helpers", () => {
    if (performance) {
        it("hasPerformance", () => {
            assert.equal(hasPerformance(), true, "Check has performance")
            assert.equal(getPerformance(), performance, "Check that performance returns the configured global");
        });
    } else {
        it("hasPerformance", () => {
            assert.equal(hasPerformance(), false, "Check has performance does not exist")
            assert.equal(getPerformance(), undefined, "Check that performance returns the configured global");
        });
    }

    describe("Simulate time passing", () => {
        let clock: sinon.SinonFakeTimers;
        let orgPerformance = performance;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
            
            // Invalidate any cached value
            getPerformance(false);
        });

        afterEach(() => {
            clock.restore();
            (<any>getGlobal()).performance = orgPerformance;

            // Invalidate any cached value
            getPerformance(false);
        });

        it("perfNow fallback", () => {
            for (let lp = 0; lp < 500; lp++) {
                // Simulate random passing of time
                clock.tick(Math.floor(Math.random() * 10000));

                assert.equal(performance.now(), perfNow(), "Validate that perfNow equals performance.now");
            }
        });
    });

    describe("remove performance and use fake clock", () => {
        let clock: sinon.SinonFakeTimers;
        let orgPerformance = performance;
        beforeEach(() => {
            clock = sinon.useFakeTimers();
            (<any>getGlobal()).performance = null;

            // Invalidate any cached value
            getPerformance(false);
        });

        afterEach(() => {
            (<any>getGlobal()).performance = orgPerformance;
            clock.restore();

            // Invalidate any cached value
            getPerformance(false);
        });

        it("check performance", () => {
            assert.equal(hasPerformance(), false, "Check has performance does not exist");
            assert.equal(getPerformance(), null, "Check that performance returns the configured global");
        });

        it("perfNow fallback", () => {
            for (let lp = 0; lp < 500; lp++) {
                // Simulate random passing of time
                clock.tick(Math.floor(Math.random() * 10000));

                assert.equal(utcNow(), perfNow(), "Validate that perfNow equals utcNow");
                assert.equal(Date.now(), perfNow(), "Validate that perfNow equals Date.now");
            }
        });

        it("elapsedTime using fallback", () => {
            let startTime = perfNow();
            let expected = 0;
            for (let lp = 0; lp < 500; lp++) {
                assert.equal(expected, elapsedTime(startTime), "Testing startTime");

                let timePassing = Math.floor(Math.random() * 10000);
                // Simulate random passing of time
                clock.tick(timePassing);
                expected += timePassing;
            }
        });
    })
});
