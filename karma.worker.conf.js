process.env.CHROME_BIN = require('puppeteer').executablePath()

// var tests = [];
// for (var file in window.__karma__.files) {
//   if (window.__karma__.files.hasOwnProperty(file)) {          
//     if (/test\.js$/.test(file)) {
//       tests.push(file);
//     }
//   }
// }

module.exports = function (config) {
    const typescript = require("@rollup/plugin-typescript");
    const plugin = require("@rollup/plugin-node-resolve");
    const commonjs = require("@rollup/plugin-commonjs");
    config.set({
        browsers: ["ChromeHeadless"],
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
        evaluate: {
            //beforeMochaImport: 'self.assert = require("assert")'
        },

        logLevel: config.LOG_INFO
    })
};