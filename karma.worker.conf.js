process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
    config.set({
        browsers: ["Chromium_without_security"],
        listenAddress: "localhost",
        hostname: "localhost",

        frameworks: ["mocha", "karma-typescript"],
        files: [
            { pattern: "lib/src/**/*.ts" },
            { pattern: "common/test/worker-adapter.js" },
            { pattern: "lib/test/src/!(browser|node|esnext)/**/*.ts" },
            { pattern: "common/test/worker-test-runner.js", included: false, served: true, watched: false }
        ],
        preprocessors: {
            "lib/src/**/*.ts": ["karma-typescript"],
            "lib/test/src/**/*.ts": ["karma-typescript"]
        },
        karmaTypescriptConfig: {
            tsconfig: "./lib/test/tsconfig.worker.karma.json",
            compilerOptions: {
                sourceMap: false,
                inlineSourceMap: false,
                inlineSources: false,
                module: "commonjs"
            },
            bundlerOptions: {
                sourceMap: false
            },
            coverageOptions: {
                instrumentation: true,
                exclude: [
                    /\.(d|spec|test)\.ts$/i,
                    /index\.ts$/i,
                    /checkError\.ts$/i,
                    /\/node_modules\//i
                ]
            },
            reports: {
                "html": {
                    "directory": "./coverage/worker",
                    "subdirectory": "./html"
                },
                "json": {
                    "directory": "./coverage/worker",
                    "subdirectory": "./",
                    "filename": "coverage-final.json"
                },
                "text": ""
            }
        },

        reporters: ["spec", "karma-typescript"],

        customLaunchers: {
            Chromium_without_security: {
                base: "ChromeHeadless",
                flags: ["--disable-web-security", "--disable-site-isolation-trials", "--no-sandbox"]
            }
        },

        logLevel: config.LOG_INFO,
        captureTimeout: 60000,
        browserNoActivityTimeout: 60000
    });
};