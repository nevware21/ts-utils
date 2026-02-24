/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Worker Test Runner - Runs in Web Worker context
 * Loads and executes test files in worker environment
 */

(function () {
    "use strict";

    function sendMessage(msg) {
        self.postMessage(msg);
    }

    function workerLog(message) {
        sendMessage({
            type: "log",
            message: message
        });
    }

    self.onmessage = function (event) {
        var msg = event.data;

        if (msg.type === "loadTests") {
            loadAndRunTests(msg);
        }
    };

    function loadAndRunTests(payload) {
        var files = payload.files || [];
        var requestedEntrypoints = payload.entrypoints || [];
        var moduleShims = payload.moduleShims || [];
        var basePath = payload.basePath || "";
        var mochaUrl = payload.mochaUrl;
        var commonjsUrl = payload.commonjsUrl;

        workerLog("Loading " + files.length + " files and running " + requestedEntrypoints.length + " entrypoints");

        if (!mochaUrl || !commonjsUrl) {
            sendMessage({
                type: "error",
                error: "Missing mocha or commonjs runtime URL"
            });
            return;
        }

        try {
            // Polyfill process for karma-typescript commonjs runtime
            if (typeof self.process === "undefined") {
                self.process = {
                    env: { NODE_ENV: "test" },
                    cwd: function () { return "/"; },
                    browser: true
                };
            }

            importScripts(mochaUrl);
            if (!self.mocha || !self.mocha.setup) {
                throw new Error("Mocha did not load in worker");
            }
            self.mocha.setup({
                ui: "bdd",
                reporter: function () {}
            });

            self.wrappers = self.wrappers || {};

            moduleShims.forEach(function (shim) {
                importScripts(shim.file);
                registerShimWrapper(shim.name, shim.file, basePath);
            });

            for (var i = 0; i < files.length; i++) {
                importScripts(files[i]);
                if (i % 50 === 0 || i === files.length - 1) {
                    workerLog("Loaded " + (i + 1) + "/" + files.length + " files");
                }
            }

            var wrapperKeys = Object.keys(self.wrappers || {});
            workerLog("Available wrappers: " + wrapperKeys.length);
            if (wrapperKeys.length > 0) {
                workerLog("Sample wrappers: " + wrapperKeys.slice(0, 3).join(", "));
            }

            var resolvedEntrypoints = wrapperKeys.filter(function (key) {
                return /\/lib\/test\/src\/.*\.test\.(ts|js)$/.test(key);
            });
            workerLog("Found " + resolvedEntrypoints.length + " test wrappers");
            if (resolvedEntrypoints.length === 0 && requestedEntrypoints.length > 0) {
                workerLog("No wrapper entrypoints found; falling back to requested entrypoints");
                self.entrypointFilenames = requestedEntrypoints.slice();
            } else {
                self.entrypointFilenames = resolvedEntrypoints;
            }

            importScripts(commonjsUrl);

            var runner = self.mocha.run();

            function getSuiteTitles(test) {
                var titles = [];
                var parent = test && test.parent;

                while (parent) {
                    if (parent.title) {
                        titles.unshift(parent.title);
                    }
                    parent = parent.parent;
                }

                return titles;
            }

            runner.on("pass", function (test) {
                var suiteTitles = getSuiteTitles(test);
                sendMessage({
                    type: "result",
                    result: {
                        description: test.title,
                        suite: suiteTitles,
                        success: true,
                        skipped: false,
                        time: test.duration,
                        log: []
                    }
                });
            });

            runner.on("pending", function (test) {
                var suiteTitles = getSuiteTitles(test);
                sendMessage({
                    type: "result",
                    result: {
                        description: test.title,
                        suite: suiteTitles,
                        success: true,
                        skipped: true,
                        log: []
                    }
                });
            });

            runner.on("fail", function (test, err) {
                var suiteTitles = getSuiteTitles(test);
                sendMessage({
                    type: "result",
                    result: {
                        description: test.title,
                        suite: suiteTitles,
                        success: false,
                        skipped: false,
                        log: [err && err.message ? err.message : "Test failed"],
                        time: test.duration
                    }
                });
            });

            runner.on("end", function () {
                sendMessage({
                    type: "complete",
                    coverage: self.__coverage__
                });
            });
        } catch (err) {
            sendMessage({
                type: "error",
                error: err.message || String(err)
            });
        }
    }

    function registerShimWrapper(name, file, basePath) {
        var exportsObj = resolveShimExport(name);
        if (!exportsObj) {
            workerLog("Shim export not found for " + name);
            return;
        }
        var absPath = toAbsolutePath(basePath, file);

        self.wrappers[absPath] = [function (require, module, exports) {
            module.exports = exportsObj;
        }, absPath, {}];
    }

    function resolveShimExport(name) {
        if (name === "ts-utils") {
            return self.nevware21 && self.nevware21["ts-utils"];
        }
        if (name === "ts-async") {
            return self.nevware21 && self.nevware21["ts-async"];
        }
        if (name === "chromacon") {
            return self.nevware21 && self.nevware21.chromacon;
        }
        return null;
    }

    function toAbsolutePath(basePath, file) {
        if (!basePath) {
            return file;
        }
        var normalizedBase = basePath.replace(/\\/g, "/").replace(/\/$/, "");
        if (file.indexOf("/base/") === 0) {
            return normalizedBase + file.substring("/base".length);
        }
        return file;
    }

    sendMessage({ type: "ready" });
})();
