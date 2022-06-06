// Default to using edge locally -- choose your own browser as required
// This is using 
process.env.CHROME_BIN = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

module.exports = function (config) {
    config.set({
        browsers: ["Chromium_without_security"],
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
            tsconfig: "./ts-utils/test/tsconfig.test.json",
            compilerOptions: {
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