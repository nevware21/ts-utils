process.env.CHROME_BIN = require('puppeteer').executablePath();

const path = require('path');

module.exports = function (config) {
    config.set({
        browsers: [ "ChromeHeadless" ],
        listenAddress: 'localhost',
        hostname: 'localhost',
        frameworks: [ "mocha", "karma-typescript" ],
        files: [
            { pattern: "lib/src/**/*.ts" },
            { pattern: "lib/test/src/browser/**/*.ts" },
            { pattern: "lib/test/src/common/**/*.ts" }
        ],
        preprocessors: {
            "lib/src/**/*.ts": [ "karma-typescript" ],
            "lib/test/src/**/*.ts": [ "karma-typescript" ]
        },
        karmaTypescriptConfig: {
            tsconfig: "./lib/test/tsconfig.test.karma.json",
            compilerOptions: {
                sourceMap: true
            },
            bundlerOptions: {
                sourceMap: true
            },
            coverageOptions: {
                instrumentation: true,
                sourceMap: true,
                exclude: [
                    /\.(d|spec|test)\.ts$/i,
                    /index.ts$/i,
                    /polyfills.ts$/i
                ]
            },
            reports: {
                "html-spa":  {
                    "directory": "./coverage",
                    "subdirectory": "browser"
                },
                "json": {
                    "directory": "./coverage",
                    "subdirectory": "browser",
                    "filename": "coverage-final.json"
                },
                "text": ""
            }
        },

        reporters: [ "spec", "karma-typescript" ],

        logLevel: config.LOG_INFO
    })
};