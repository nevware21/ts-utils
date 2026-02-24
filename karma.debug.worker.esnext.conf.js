// Default to using edge locally -- choose your own browser as required
process.env.CHROME_BIN = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
//process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
    config.set({
        browsers: ["Chromium_without_security"],
        listenAddress: "localhost",
        hostname: "localhost",

        frameworks: ["mocha", "karma-typescript"],
        files: [
            { pattern: "lib/src/**/*.ts" },
            { pattern: "common/test/worker-adapter.js" },
            { pattern: "lib/test/src/!(browser|node)/**/*.ts" },
            { pattern: "common/test/worker-test-runner.js", included: false, served: true, watched: false }
        ],
        preprocessors: {
            "lib/src/**/*.ts": ["karma-typescript"],
            "lib/test/src/**/*.ts": ["karma-typescript"]
        },
        karmaTypescriptConfig: {
            tsconfig: "./lib/test/tsconfig.worker.karma.json",
            compilerOptions: {
                target: "ESNext",
                sourceMap: false,
                inlineSourceMap: true,
                inlineSources: true,
                module: "commonjs"
            },
            bundlerOptions: {
                sourceMap: false
            },
            coverageOptions: {
                instrumentation: false,
                sourceMap: true
            }
        },

        reporters: ["spec"],

        customLaunchers: {
            Chromium_without_security: {
                base: "Chrome",
                flags: ["--disable-web-security", "--disable-site-isolation-trials", "--no-sandbox"]
            }
        },

        logLevel: config.LOG_INFO,
        captureTimeout: 60000,
        browserNoActivityTimeout: 60000
    });
};