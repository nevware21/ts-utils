process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    config.set({
        browsers: ["ChromeHeadless"],
        listenAddress: 'localhost',
        hostname: 'localhost',
        frameworks: ["mocha", "karma-typescript"],
        files: [
            { pattern: "ts-utils/src/**/*.ts" },
            { pattern: "ts-utils/test/src/**/*.ts" }
        ],
        preprocessors: {
            "ts-utils/src/**/*.ts": [ "karma-typescript" ],
            "ts-utils/test/src/**/*.ts": [ "karma-typescript" ]
        },
        karmaTypescriptConfig: {
            tsconfig: "./ts-utils/test/tsconfig.test.json"
        },
        coverageIstanbulReporter: {
            reports: ["html", "json"],
            dir: ".nyc_output"
        },

        reporters: [ "spec", "coverage-istanbul" ],

        logLevel: config.LOG_INFO
    })
};