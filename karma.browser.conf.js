process.env.CHROME_BIN = require('puppeteer').executablePath();

const path = require('path');

module.exports = function (config) {
    config.set({
        browsers: ["ChromeHeadless"],
        listenAddress: 'localhost',
        hostname: 'localhost',
        frameworks: [ "mocha", "karma-typescript" ],
        files: [
            { pattern: "ts-utils/src/**/*.ts" },
            { pattern: "ts-utils/test/src/browser/**/*.ts" },
            { pattern: "ts-utils/test/src/common/**/*.ts" }
        ],
        preprocessors: {
            "ts-utils/src/**/*.ts": [ "karma-typescript" ],
            "ts-utils/test/src/**/*.ts": [ "karma-typescript" ]
        },
        karmaTypescriptConfig: {
            tsconfig: "./ts-utils/test/tsconfig.test.karma.json",
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
                    /index.ts$/i
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
        // coverageIstanbulReporter: {
        //     reports: {
        //         "html-spa":  {
        //             "directory": "./coverage",
        //             "subdirectory": "browser"
        //         }, 
        //         "json": {
        //             "directory": "./nyc_output"
        //         },
        //         "text-summary": ""
        //     },

        //     // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
        //     //dir: path.join(__dirname, "coverage/browser"),

        //     // Combines coverage information from multiple browsers into one report rather than outputting a report
        //     // for each browser.
        //     combineBrowserReports: true
        // },

        reporters: [ "spec", "karma-typescript" ],

        logLevel: config.LOG_INFO
    })
};