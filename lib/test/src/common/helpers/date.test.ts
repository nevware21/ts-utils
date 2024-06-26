/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as sinon from "sinon";
import { assert } from "chai";
import { utcNow, polyUtcNow } from "../../../../src/helpers/date";

describe("date helpers", () => {
    describe("Validate utcNow", () => {
        let orgNow = Date.now;
        let clock: sinon.SinonFakeTimers;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
        });

        afterEach(() => {
            clock.restore();
        });

        describe("Simulate time passing", () => {

            it("Validate utcNow returns same value as Date.now", () => {
                for (let lp = 0; lp < 500; lp++) {
                    // Simulate random passing of time
                    clock.tick(Math.floor(Math.random() * 10000));

                    assert.equal(Date.now(), utcNow(), "Validate that utcNow equals Date.now")
                }
            });

            it("Validate polyUtcNow returns same value as Date.now", () => {
                for (let lp = 0; lp < 500; lp++) {
                    // Simulate random passing of time
                    clock.tick(Math.floor(Math.random() * 10000));

                    assert.equal(Date.now(), polyUtcNow(), "Validate that polyUtcNow equals Date.now")
                }
            });
        });

        describe("remove native now", () => {

            it("Validate utcNow returns same value as Date.now", () => {
                try {
                    Date.now = null;
                    for (let lp = 0; lp < 500; lp++) {
                        // Simulate random passing of time
                        clock.tick(Math.floor(Math.random() * 10000));
    
                        assert.equal(new Date().getTime(), utcNow(), "Validate that utcNow equals Date.now")
                    }
                } finally {
                    Date.now = orgNow;
                }
            });

            it("Validate polyUtcNow returns same value as Date.now", () => {
                try {
                    Date.now = null;
                    for (let lp = 0; lp < 500; lp++) {
                        // Simulate random passing of time
                        clock.tick(Math.floor(Math.random() * 10000));
    
                        assert.equal(new Date().getTime(), polyUtcNow(), "Validate that polyUtcNow equals Date.now")
                    }
                } finally {
                    Date.now = orgNow;
                }
            });

        });
    });
});
