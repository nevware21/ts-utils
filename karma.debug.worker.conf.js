process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    const typescript = require("@rollup/plugin-typescript");
    const plugin = require("@rollup/plugin-node-resolve");
    const commonjs = require("@rollup/plugin-commonjs");
    config.set({
        browsers: ["Chromium_without_security"],
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
                    tsconfig: "./lib/test/tsconfig.test.karma.json"
                }),
                plugin.nodeResolve({
                    browser: true
                }),
                commonjs()
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
        coverageIstanbulReporter: {
            reports: ["html", "json"],
            dir: ".nyc_output"
        },

        reporters: [ "spec", "coverage-istanbul" ],

        logLevel: config.LOG_INFO,

        customLaunchers: {
            Chromium_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security', '--disable-site-isolation-trials']
            }
        }
    })
};