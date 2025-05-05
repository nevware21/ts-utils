
const path = require('path');

module.exports = function (config) {
    const process = require('process');
    process.env.CHROME_BIN = require('puppeteer').executablePath();
    process.env.CHROMIUM_BIN = require('puppeteer').executablePath();
     
    config.set({
        browsers: [ "ChromeHeadlessNoSandbox" ],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: "ChromeHeadless",
                flags: [
                    "--no-sandbox",
                    "--disable-gpu",
                    "--disable-web-security",
                    "--disable-dev-shm-usage"
                ]
            }
        },
        listenAddress: 'localhost',
        hostname: 'localhost',
        frameworks: [ "mocha", "karma-typescript" ],
        files: [
            { pattern: "lib/src/**/*.ts" },
            { pattern: "lib/test/src/browser/**/*.ts" },
            { pattern: "lib/test/src/common/**/*.ts" },
            { pattern: "lib/test/src/esnext/**/*.ts" }
        ],
        preprocessors: {
            "lib/src/**/*.ts": [ "karma-typescript" ],
            "lib/test/src/**/*.ts": [ "karma-typescript" ]
        },
        karmaTypescriptConfig: {
            tsconfig: "./lib/test/tsconfig.test.karma.json",
            compilerOptions: {
                target: "ESNext",
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
                    "subdirectory": "browser_esnext"
                },
                "json": {
                    "directory": "./coverage",
                    "subdirectory": "browser_esnext",
                    "filename": "coverage-final.json"
                },
                "text": ""
            }
        },

        reporters: [ "spec", "karma-typescript" ],

        logLevel: config.LOG_INFO
    })
};