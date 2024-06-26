/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { getGlobal, getInst, hasDocument, hasHistory, hasNavigator, hasWindow, isWebWorker } from "../../../../src/helpers/environment";
import { setBypassLazyCache } from "../../../../src/helpers/lazy";

declare let global: Window;
declare let self: any;
declare let window: any;
declare let document: any;
declare let navigator: any;

function tryCatch(cb: () => void) {
    try {
        cb();
    } catch(e) {
        // Node Environment
    }
}

describe("environment helpers", () => {

    let theWindow: any = null;
    let theDocument: any = null;
    let theNavigator: any = null;
    let theHistory: any = null;

    tryCatch(() => theWindow = window);
    tryCatch(() => theDocument = document);
    tryCatch(() => theNavigator = navigator);
    tryCatch(() => theHistory = history);

    it("getGlobal", () => {
        setBypassLazyCache(true);
        let gbl = getGlobal();
        if (hasWindow()) {
            assert.ok(gbl === window, "Global object should be window");
        } else if (isWebWorker()) {
            assert.ok(gbl === self, "Global object should be self");
        } else {
            assert.ok(gbl === global, "Global object should be window");
        }
    });

    it("hasWindow", () => {
        assert.equal(hasWindow(), !!theWindow, "Check if we have a window instance");
    });

    it("hasDocument", () => {
        assert.equal(hasDocument(), !!theDocument, "Check if we have a document instance");
    });

    it("hasNavigator", () => {
        assert.equal(hasNavigator(), !!theNavigator, "Check if we have a navigator instance");
    });

    it("hasHistory", () => {
        assert.equal(hasHistory(), !!theHistory, "Check if we have a history instance");
    });

    it("getInst", () => {
        assert.equal(getInst("window"), theWindow, "Check that the window is returned");
        assert.equal(getInst("document"), theDocument, "Check that the document is returned");
        assert.equal(getInst("navigator"), theNavigator, "Check that the navigator is returned");
        assert.equal(getInst("history"), theHistory, "Check that the history is returned");
    });
});