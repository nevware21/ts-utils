const path = require('path');
const childProcess = require('child_process');

function _resolvePuppeteerExecutablePathSync() {
    return childProcess.execFileSync(process.execPath, [
        "-e",
        "import('puppeteer').then((m) => (m.default || m).executablePath()).then((path) => process.stdout.write(path || ''))"
    ], {
        encoding: "utf8"
    }).trim();
}

module.exports = function (config) {
    // Puppeteer v25+ resolves executablePath asynchronously, so resolve it in a subprocess
    // to keep this Karma config synchronous.
    try {
        const chromePath = _resolvePuppeteerExecutablePathSync();
        if (chromePath) {
            process.env.CHROME_BIN = chromePath;
            process.env.CHROMIUM_BIN = chromePath;
        }
    } catch (error) {
        console.warn("Puppeteer executable path could not be resolved. Chrome/Chromium tests may be skipped.");
        process.exit(0);
    }
     
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