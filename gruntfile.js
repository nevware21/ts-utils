/*
 * ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                "Gruntfile.js",
                "<%= nodeunit.tests %>"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ["tmp"]
        },

        // Unit tests.
        nodeunit: {
            tests: ["test/*_test.js"]
        },
        ts: {
            options: {
                debug: true,
                logOutput: true
            },
            "ts_utils": {
                // Default ES5
                tsconfig: "./lib/tsconfig.json",
                outDir: "./lib/build/es5/mod"
            },
            "ts_utils_es6": {
                tsconfig: "./lib/tsconfig.es6.json",
                outDir: "./lib/build/es6/mod"
            },
            "ts_utils-test": {
                tsconfig: "./lib/test/tsconfig.test.json",
                outDir: "./lib/test/build-es5"
            }
        },
        "lint": {
            options: {
                format: "codeframe",
                suppressWarnings: false
            },
            "ts_utils": {
                tsconfig: "./lib/tsconfig.json",
                ignoreFailures: true
            },
            "ts_utils-test": {
                tsconfig: "./lib/test/tsconfig.test.json",
                ignoreFailures: true
            },
            "ts_utils-fix": {
                options: {
                    tsconfig: "./lib/tsconfig.json",
                    fix: true
                }
            },
            "ts_utils-test-fix": {
                options: {
                    tsconfig: "./lib/test/tsconfig.test.json",
                    fix: true
                }
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadNpmTasks("@nevware21/grunt-ts-plugin");
    grunt.loadNpmTasks("@nevware21/grunt-eslint-ts");

    grunt.registerTask("rollupuglify", ["ts:rollupuglify" ]);
    grunt.registerTask("ts_utils", [ "lint:ts_utils-fix", "lint:ts_utils-test-fix", "ts:ts_utils", "ts:ts_utils_es6" ]);
    grunt.registerTask("ts_utils-lint", [ "lint:ts_utils-fix", "lint:ts_utils-test-fix" ]);
    grunt.registerTask("dolint", [ "lint:ts_utils", "lint:ts_utils-test" ]);
    grunt.registerTask("lint-fix", [ "lint:ts_utils-fix", "lint:ts_utils-test-fix" ]);
    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    // grunt.registerTask('ts_utils_test', ['clean', 'ts_utils']);

    // By default, lint and run all tests.
    grunt.registerTask("default", ["jshint" ]);
};
