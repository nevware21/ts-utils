import nodeResolve from "@rollup/plugin-node-resolve";
import cleanup from 'rollup-plugin-cleanup';

const UglifyJs = require('uglify-js');

const version = require("./package.json").version;
const outputName = "ts-utils";
const polyFillOutputName = "ts-polyfills-utils";
const banner = [
    `/*! https://github.com/nevware21/ts-utils v${version} */`,
    "/*",
    " * Copyright (c) NevWare21 Solutions LLC and contributors. All rights reserved.",
    " * Licensed under the MIT license.",
    " */"
].join("\n");

const polyFillBanner = [
    "/*",
    ` * NevWare21 Solutions LLC - ts-utils Polyfills, v${version}`,
    " * https://github.com/nevware21/ts-utils",
    " * Copyright (c) NevWare21 Solutions LLC and contributors. All rights reserved.",
    " * Licensed under the MIT license.",
    " */"
].join("\n");

function isSourceMapEnabled(options) {
    if (options) {
        return options.sourceMap !== false && options.sourcemap !== false;
    }

    return false;
}

function _doMinify(code, filename, options, chunkOptions) {
    var theCode = {};
    theCode[filename] = code;

    let theOptions = Object.assign({}, options);
    if (theOptions.hasOwnProperty("sourcemap")) {
        delete theOptions.sourcemap;
    }

    if (isSourceMapEnabled(options)) {
        theOptions.sourceMap = {
            filename: filename
        };
        if (filename) {
            theOptions.sourceMap.url = filename + ".map";
        }
    }

    var result = UglifyJs.minify(theCode, theOptions);

    if (result.error) {
        throw new Error(JSON.stringify(result.error));
    }

    var transform = {
        code: result.code
    };

    if (isSourceMapEnabled(options) && result.map) {
        transform.map = result.map;
    }

    return transform;
}

export function uglify3(options = {}) {

    return {
        name: "internal-rollup-uglify-js",
        renderChunk(code, chunk, chkOpt) {
            return _doMinify(code, chunk.filename, options, chkOpt);
        }
    }
}

  
const rollupConfigFactory = (srcPath, destPath, isMinified, path, format = "iife", postfix = "") => {
    const taskRollupConfig = {
        input: `lib/${srcPath}/index.js`,
        output: {
            file: `lib/${destPath}/${path}/${outputName}${postfix}.js`,
            banner: banner,
            format: format,
            name: "nevware21.ts-utils",
            freeze: false,
            sourcemap: true
        },
        external: [ "fs", "path" ],
        plugins: [
            nodeResolve({
                module: true,
                browser: false,
                preferBuiltins: true
            }),
            cleanup({
                comments: [
                    /[#@]__/,
                    /^!/
                ]
            })
        ]
    };

    if (isMinified) {
        taskRollupConfig.output.file = `lib/${destPath}/${path}/${outputName}${postfix}.min.js`;
        taskRollupConfig.plugins.push(
            uglify3({
                toplevel: true,
                compress: {
                    passes:3,
                    unsafe: true
                },
                output: {
                    comments: /^!/,
                    webkit:true
                }
            })
        );
    }

    return taskRollupConfig;
};

const rollupConfigMainEntry = (srcPath, destPath, path, format = "umd") => {
    const taskRollupConfig = {
        input: `lib/${srcPath}/index.js`,
        output: {
            file: `lib/${destPath}/${path}/${outputName}.js`,
            banner: banner,
            format: format,
            name: "nevware21.ts-utils",
            freeze: false,
            sourcemap: true
        },
        external: [ "fs", "path" ],
        plugins: [
            cleanup({
                comments: [
                    /[#@]__/,
                    /^!/,
                    "some",
                    "ts",
                    "eslint"
                ]
            })
        ]
    };

    return taskRollupConfig;
};

const polyfillRollupConfigFactory = (srcPath, destPath, isMinified, format = "iife", postfix = "") => {
    const taskRollupConfig = {
        input: `lib/${srcPath}/polyfills.js`,
        output: {
            file: `lib/${destPath}/${polyFillOutputName}${postfix}.js`,
            banner: polyFillBanner,
            format: format,
            name: "nevware21.ts-utils",
            freeze: false,
            sourcemap: true
        },
        external: [ "fs", "path" ],
        plugins: [
            cleanup({
                comments: [
                    /[#@]__/,
                    /^!/
                ]
            })
        ]
    };

    if (isMinified) {
        taskRollupConfig.output.file = `lib/${destPath}/${polyFillOutputName}${postfix}.min.js`;
        taskRollupConfig.plugins.push(
            uglify3({
                toplevel: true,
                compress: {
                    passes:3,
                    unsafe: true
                },
                output: {
                    comments: /^!/,
                    webkit:true
                }
            })
        );
    }

    return taskRollupConfig;
};

export default [
    //rollupModule("build/es5", "dist-es5", false),
    //rollupModule("build/es6", "dist-es6", false),

    polyfillRollupConfigFactory("build/es5/mod", "bundle/es5", true),
    polyfillRollupConfigFactory("build/es5/mod", "bundle/es5", false),

    // Set the "main" entry point for the package as a commonjs module
    rollupConfigMainEntry("build/es5/mod", "dist/es5", "main", "umd"),
    rollupConfigMainEntry("build/es6/mod", "dist/es6", "main", "umd"),

    rollupConfigMainEntry("build/es5/mod", "dist/es5", "mod", "es"),
    rollupConfigMainEntry("build/es6/mod", "dist/es6", "mod", "es"),

    // rollupConfigFactory("build/es5/mod", "bundle/es5", false, "node", "umd"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", true, "node", "umd"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", false, "esm", "esm"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", true, "esm", "esm"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", false, "amd", "amd"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", true, "amd", "amd"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", false, "cjs", "cjs"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", true, "cjs", "cjs"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", false, "iife", "iife"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", true, "iife", "iife"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", false, "umd", "umd"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", true, "umd", "umd"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", false, "system", "system"),
    // rollupConfigFactory("build/es5/mod", "bundle/es5", true, "system", "system"),

    // rollupConfigFactory("build/es6/mod", "bundle/es6", false, "node", "umd"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", true, "node", "umd"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", false, "esm", "esm"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", true, "esm", "esm"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", false, "amd", "amd"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", true, "amd", "amd"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", false, "cjs", "cjs"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", true, "cjs", "cjs"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", false, "iife", "iife"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", true, "iife", "iife"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", false, "umd", "umd"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", true, "umd", "umd"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", false, "system", "system"),
    // rollupConfigFactory("build/es6/mod", "bundle/es6", true, "system", "system")
];
