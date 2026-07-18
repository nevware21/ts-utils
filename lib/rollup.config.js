import nodeResolve from "@rollup/plugin-node-resolve";
import cleanup from 'rollup-plugin-cleanup';
import sourcemaps from 'rollup-plugin-sourcemaps';
import MagicStringPkg from 'magic-string';

const UglifyJs = require('uglify-js');
const MagicString = MagicStringPkg.default || MagicStringPkg.MagicString || MagicStringPkg;

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

// Normalize the emitted spacing of PURE annotations that sit inside parentheses.
// (Token sequences are described in prose below rather than written literally so
// Rollup's own annotation scanner does not flag this comment while loading the
// config.) The wrapping parens are kept deliberately - they preserve tree-shaking
// on older Rollup/Webpack/Terser toolchains that only honor the annotation when it
// hugs the call. However TypeScript (and some source sites) emit the annotation
// with whitespace after the open paren - an open paren, a space, then the comment -
// which Rolldown (Vite 8) treats as an invalid annotation location and ignores,
// emitting [INVALID_ANNOTATION] and losing DCE. This rewrites those spaced forms
// (including the inner-space variant and the at-sign spelling) back to the
// canonical form with the comment flush against the open paren, which every
// bundler accepts. Uses magic-string so the generated sourcemap stays valid.
export function fixPureAnnotations() {
    const pureRe = /\(\s{0,5}\/\*\s{0,5}([#@])__PURE__\s{0,5}\*\//g;

    return {
        name: "fix-pure-annotations",
        renderChunk(code) {
            const magic = new MagicString(code);

            for (const match of code.matchAll(pureRe)) {
                const canonical = "(/*" + match[1] + "__PURE__*/";
                if (match[0] !== canonical) {
                    magic.overwrite(match.index, match.index + match[0].length, canonical);
                }
            }

            if (!magic.hasChanged()) {
                return null;
            }

            return {
                code: magic.toString(),
                map: magic.generateMap({ hires: true })
            };
        }
    };
}

function sourcemapTransformer(options) {
    let githubRawUrl = "https://raw.githubusercontent.com/nevware21/ts-utils/refs/tags/" + version + "/";

    return (relativePath, sourceMapPath) => {
        let normalizePath = relativePath.replace(/\\/g, "/");
        let srcPath = normalizePath.replace(/\.\.\//g, "");
        if (srcPath.startsWith("src/")) {
            return githubRawUrl + "lib/" + srcPath;
        }

        return relativePath;
    };
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
            sourcemap: true,
            sourcemapPathTransform: sourcemapTransformer(),
            exports: "named",
        },
        external: [ "fs", "path" ],
        plugins: [
            sourcemaps(),
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

    // Run last so it normalizes the final emitted chunk (after uglify on minified targets)
    taskRollupConfig.plugins.push(fixPureAnnotations());

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
            sourcemap: true,
            sourcemapPathTransform: sourcemapTransformer(),
            exports: "named",
        },
        external: [ "fs", "path" ],
        plugins: [
            sourcemaps(),
            cleanup({
                comments: [
                    /[#@]__/,
                    /^!/,
                    "some",
                    "ts",
                    "eslint"
                ]
            }),
            fixPureAnnotations()
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
            sourcemap: true,
            sourcemapPathTransform: sourcemapTransformer(),
            exports: "named",
        },
        external: [ "fs", "path" ],
        plugins: [
            sourcemaps(),
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

    // Run last so it normalizes the final emitted chunk (after uglify on minified targets)
    taskRollupConfig.plugins.push(fixPureAnnotations());

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

    rollupConfigFactory("build/es5/mod", "bundle/es5", false, "iife", "iife"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", true, "iife", "iife"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", false, "umd", "umd"),
    rollupConfigFactory("build/es5/mod", "bundle/es5", true, "umd", "umd"),

    rollupConfigFactory("build/es6/mod", "bundle/es6", false, "iife", "iife"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", true, "iife", "iife"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", false, "umd", "umd"),
    rollupConfigFactory("build/es6/mod", "bundle/es6", true, "umd", "umd"),
];
