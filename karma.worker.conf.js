process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    const typescript = require("@rollup/plugin-typescript");
    const plugin = require("@rollup/plugin-node-resolve");
    const commonjs = require("@rollup/plugin-commonjs");
    const istanbul = require("rollup-plugin-istanbul");
    config.set({
        browsers: [ "ChromeHeadless" ],
        listenAddress: 'localhost',
        hostname: 'localhost',
        frameworks: [ "mocha-webworker" ],
        files: [
            { pattern: "lib/test/src/worker/**/*.ts", included: false },
            { pattern: "lib/test/src/common/**/*.ts", included: false }
        ],
        preprocessors: {
            "**/*.ts": [ "rollup" ]
        },
        rollupPreprocessor: {
            plugins: [
                typescript({
                    tsconfig: "./lib/test/tsconfig.worker.karma.json"
                }),
                plugin.nodeResolve({
                    browser: true
                }),
                commonjs(),
                istanbul({
                    exclude: [ "**/test/**", "**/node_modules/**" ]
                })
            ],
            output: {
                format: "iife",
                dir: "../test-dist",
                sourcemap: true
            }
        },
        client: {
            mochaWebWorker: {
                pattern: [
                    "lib/test/**/*.js"
                ]
            }
        },
        coverageReporter: {
            dir: "./coverage/worker",
            includeAllSources: true,
            reporters: [
                { type: "text" },
                { type: "html", subdir: "html" },
                { type: "json", subdir: "./", file: "coverage-final.json" }
            ],
        },
        reporters: ["spec", "coverage" ],

        logLevel: config.LOG_DEBUG
    })
};