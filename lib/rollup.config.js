import nodeResolve from "@rollup/plugin-node-resolve";
import minify from 'rollup-plugin-minify-es';

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

  
const rollupConfigFactory = (isMinified, path, format = "iife", postfix = "") => {
    const taskRollupConfig = {
        input: `ts-utils/dist-esm/index.js`,
        output: {
            file: `ts-utils/dist/${path}/${outputName}${postfix}.js`,
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
        taskRollupConfig.output.file = `ts-utils/dist/${path}/${outputName}${postfix}.min.js`;
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

const polyfillRollupConfigFactory = (isMinified, format = "iife", postfix = "") => {
    const taskRollupConfig = {
        input: `ts-utils/dist-esm/polyfills.js`,
        output: {
            file: `ts-utils/bundle/${polyFillOutputName}${postfix}.js`,
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
        taskRollupConfig.output.file = `ts-utils/bundle/${polyFillOutputName}${postfix}.min.js`;
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
    polyfillRollupConfigFactory(true),
    polyfillRollupConfigFactory(false),
    rollupConfigFactory(false, "node", "umd"),
    rollupConfigFactory(true, "node", "umd"),
    rollupConfigFactory(false, "esm", "esm"),
    rollupConfigFactory(true, "esm", "esm"),
    rollupConfigFactory(false, "amd", "amd"),
    rollupConfigFactory(true, "amd", "amd"),
    rollupConfigFactory(false, "cjs", "cjs"),
    rollupConfigFactory(true, "cjs", "cjs"),
    rollupConfigFactory(false, "iife", "iife"),
    rollupConfigFactory(true, "iife", "iife"),
    rollupConfigFactory(false, "umd", "umd"),
    rollupConfigFactory(true, "umd", "umd"),
    rollupConfigFactory(false, "system", "system"),
    rollupConfigFactory(true, "system", "system")
];
