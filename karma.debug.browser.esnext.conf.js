// Default to using edge locally -- choose your own browser as required
process.env.CHROME_BIN = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
//process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        browsers: ["Chromium_without_security"],
        listenAddress: 'localhost',
        hostname: 'localhost',
        frameworks: [ "mocha", "karma-typescript"  ],
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
                instrumentation: false,
                sourceMap: true
            }
        },
        logLevel: config.LOG_INFO,

        reporters: [ "spec" ],

        customLaunchers: {
            Chromium_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security', '--disable-site-isolation-trials']
            }
        }

    });
}