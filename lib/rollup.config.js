import nodeResolve from "@rollup/plugin-node-resolve";
//import minify from 'rollup-plugin-minify-es';

const UglifyJs = require('uglify-js');

const version = require("./package.json").version;
const outputName = "ts-utils";
const polyFillOutputName = "ts-polyfills-utils";
const banner = [
    "/*!",
    ` * NevWare21 - ts-utils, ${version}`,
    " * https://github.com/nevware21/ts-utils",
    " * Copyright (c) NevWare21 and contributors. All rights reserved.",
    " * Licensed under the MIT license.",
    " */"
].join("\n");

const polyFillBanner = [
    "/*!",
    ` * NevWare21 - ts-utils Polyfills, ${version}`,
    " * https://github.com/nevware21/ts-utils",
    " * Copyright (c) NevWare21 and contributors. All rights reserved.",
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
            file: `lib/dist/${destPath}/${path}/${outputName}${postfix}.js`,
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
            })
        ]
    };

    if (isMinified) {
        taskRollupConfig.output.file = `lib/dist/${destPath}/${path}/${outputName}${postfix}.min.js`;
        taskRollupConfig.plugins.push(
            uglify3({
                ie8: true,
                toplevel: true,
                compress: {
                    passes:3,
                    unsafe: true
                },
                output: {
                    preamble: banner,
                    webkit:true
                }
            })
        );
    }

    return taskRollupConfig;
};

const polyfillRollupConfigFactory = (srcPath, destPath, isMinified, format = "iife", postfix = "") => {
    const taskRollupConfig = {
        input: `lib/${srcPath}/polyfills.js`,
        output: {
            file: `lib/dist/${destPath}/${polyFillOutputName}${postfix}.js`,
            banner: polyFillBanner,
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
            })
        ]
    };

    if (isMinified) {
        taskRollupConfig.output.file = `lib/dist/${destPath}/${polyFillOutputName}${postfix}.min.js`;
        taskRollupConfig.plugins.push(
            uglify3({
                ie8: true,
                toplevel: true,
                compress: {
                    passes:3,
                    unsafe: true
                },
                output: {
                    preamble: banner,
                    webkit:true
                }
            })
        );
    }

    return taskRollupConfig;
};

export default [
    polyfillRollupConfigFactory("dist-es5", "es5", true),
    polyfillRollupConfigFactory("dist-es5", "es5", false),
    rollupConfigFactory("dist-es5", "es5", false, "node", "umd"),
    rollupConfigFactory("dist-es5", "es5", true, "node", "umd"),
    rollupConfigFactory("dist-es5", "es5", false, "esm", "esm"),
    rollupConfigFactory("dist-es5", "es5", true, "esm", "esm"),
    rollupConfigFactory("dist-es5", "es5", false, "amd", "amd"),
    rollupConfigFactory("dist-es5", "es5", true, "amd", "amd"),
    rollupConfigFactory("dist-es5", "es5", false, "cjs", "cjs"),
    rollupConfigFactory("dist-es5", "es5", true, "cjs", "cjs"),
    rollupConfigFactory("dist-es5", "es5", false, "iife", "iife"),
    rollupConfigFactory("dist-es5", "es5", true, "iife", "iife"),
    rollupConfigFactory("dist-es5", "es5", false, "umd", "umd"),
    rollupConfigFactory("dist-es5", "es5", true, "umd", "umd"),
    rollupConfigFactory("dist-es5", "es5", false, "system", "system"),
    rollupConfigFactory("dist-es5", "es5", true, "system", "system"),

    rollupConfigFactory("dist-es6", "es6", false, "node", "umd"),
    rollupConfigFactory("dist-es6", "es6", true, "node", "umd"),
    rollupConfigFactory("dist-es6", "es6", false, "esm", "esm"),
    rollupConfigFactory("dist-es6", "es6", true, "esm", "esm"),
    rollupConfigFactory("dist-es6", "es6", false, "amd", "amd"),
    rollupConfigFactory("dist-es6", "es6", true, "amd", "amd"),
    rollupConfigFactory("dist-es6", "es6", false, "cjs", "cjs"),
    rollupConfigFactory("dist-es6", "es6", true, "cjs", "cjs"),
    rollupConfigFactory("dist-es6", "es6", false, "iife", "iife"),
    rollupConfigFactory("dist-es6", "es6", true, "iife", "iife"),
    rollupConfigFactory("dist-es6", "es6", false, "umd", "umd"),
    rollupConfigFactory("dist-es6", "es6", true, "umd", "umd"),
    rollupConfigFactory("dist-es6", "es6", false, "system", "system"),
    rollupConfigFactory("dist-es6", "es6", true, "system", "system")
];
