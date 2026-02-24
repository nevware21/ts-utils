/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * Worker Test Adapter - Runs in main page context
 * Creates Web Worker, loads tests, and reports results to Karma
 */

(function () {
    "use strict";

    function initWorkerAdapter() {
        var karma = window.__karma__;

        if (!karma) {
            console.log("[worker-adapter] __karma__ not available yet, will retry");
            setTimeout(initWorkerAdapter, 50);
            return;
        }

        console.log("[worker-adapter] Starting worker test setup");

        if (window.mocha && typeof window.mocha.run === "function") {
            window.mocha.run = function () {
                console.log("[worker-adapter] Mocha.run intercepted - running tests in worker");
                startWorkerTests();
                return {
                    on: function () { return this; }
                };
            };
        } else {
            console.log("[worker-adapter] Mocha not found");
        }

        function startWorkerTests() {
            console.log("[worker-adapter] Initializing worker tests");

            var bundleFiles = [];
            var moduleShims = [];
            var jsFiles = [];
            var files = karma.files;
            var mochaFile = null;
            var commonjsFile = null;

            console.log("[worker-adapter] Total files from karma: " + Object.keys(files).length);

            for (var file in files) {
                if (!files.hasOwnProperty(file)) {
                    continue;
                }

                if (/karma-typescript-bundle-.*\.js(\?|$)/.test(file)) {
                    bundleFiles.push(file);
                    continue;
                }

                if (!mochaFile && /\/node_modules\/mocha\/mocha\.js(\?|$)/.test(file)) {
                    mochaFile = file;
                    continue;
                }

                if (!commonjsFile && /\/node_modules\/karma-typescript\/dist\/client\/commonjs\.js(\?|$)/.test(file)) {
                    commonjsFile = file;
                    continue;
                }

                if (/\.js(\?|$)/.test(file) && file.indexOf("/base/") === 0) {
                    jsFiles.push(file);
                    continue;
                }
            }

            var testFiles = [];
            var sourceFiles = [];
            var testSupportFiles = [];
            for (var i = 0; i < jsFiles.length; i++) {
                if (/\/lib\/test\/src\/.*\.test\.js(\?|$)/.test(jsFiles[i])) {
                    testFiles.push(jsFiles[i]);
                } else if (/^\/base\/lib\/src\/.*\.js(\?|$)/.test(jsFiles[i])) {
                    sourceFiles.push(jsFiles[i]);
                } else if (/^\/base\/lib\/test\/src\/.*\.js(\?|$)/.test(jsFiles[i])) {
                    testSupportFiles.push(jsFiles[i]);
                }
            }

            console.log("[worker-adapter] Found " + bundleFiles.length + " bundle files, " +
                        sourceFiles.length + " source files, " +
                        testSupportFiles.length + " support files, " +
                        testFiles.length + " test files, and " +
                        moduleShims.length + " module shims");

            var workerScript = null;
            for (var fileName in files) {
                if (files.hasOwnProperty(fileName) && fileName.indexOf("worker-test-runner.js") !== -1) {
                    workerScript = fileName;
                    break;
                }
            }

            if (!workerScript) {
                console.error("[worker-adapter] Could not find worker-test-runner.js");
                karma.error("[worker-test] Worker runner not found");
                karma.complete({});
                return;
            }

            console.log("[worker-adapter] Found worker script at: " + workerScript);

            try {
                var worker = new Worker(workerScript);
                console.log("[worker-adapter] Worker created");

                worker.onmessage = function (event) {
                    var msg = event.data;

                    switch (msg.type) {
                        case "log":
                            console.log("[worker] " + msg.message);
                            break;

                        case "ready":
                            console.log("[worker-adapter] Worker ready, sending files");
                            var filesToSend = bundleFiles.concat(sourceFiles, testSupportFiles, testFiles);
                            console.log("[worker-adapter] Sending " + filesToSend.length + " total files to worker");
                            worker.postMessage({
                                type: "loadTests",
                                files: filesToSend,
                                entrypoints: [],
                                moduleShims: moduleShims,
                                basePath: (karma.config && karma.config.basePath) ? karma.config.basePath : "",
                                mochaUrl: mochaFile || "/base/node_modules/mocha/mocha.js",
                                commonjsUrl: commonjsFile || "/base/node_modules/karma-typescript/dist/client/commonjs.js"
                            });
                            break;

                        case "result":
                            karma.result(msg.result);
                            break;

                        case "complete":
                            karma.complete(msg.coverage ? { coverage: msg.coverage } : {});
                            break;

                        case "error":
                            console.error("[worker-adapter] Worker error: " + msg.error);
                            karma.error("[worker-test] " + msg.error);
                            karma.complete({});
                            break;
                    }
                };

                worker.onerror = function (error) {
                    console.error("[worker-adapter] Worker error event: " + error.message);
                    karma.error("[worker-test] Worker error: " + error.message);
                    karma.complete({});
                };
            } catch (err) {
                console.error("[worker-adapter] Failed to create worker: " + err.message);
                karma.error("[worker-test] Failed to create worker: " + err.message);
                karma.complete({});
            }
        }
    }

    initWorkerAdapter();
})();
