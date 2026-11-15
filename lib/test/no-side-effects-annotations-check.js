/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

// Checks that no function annotated as having no side effects (#__NO_SIDE_EFFECTS__) is called anywhere in the source with
// its result unused. A bundler which honours the annotation (Rollup, esbuild, Terser) removes every such call, so it is either
// a call that does nothing or a function with side effects that must not be annotated. The tests run the source, where the
// annotation does nothing, so only the bundles lose the call: isUnsafeTarget()'s helpers were annotated and the built-in
// prototypes they added were missing from every bundle from v0.14.0 until v0.20.0.

"use strict";

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const srcRoot = path.join(__dirname, "../src");

function collectTsFiles(rootPath, output) {
    fs.readdirSync(rootPath, { withFileTypes: true }).forEach((entry) => {
        const fullPath = path.join(rootPath, entry.name);
        if (entry.isDirectory()) {
            collectTsFiles(fullPath, output);
        } else if (entry.isFile() && entry.name.endsWith(".ts")) {
            output.push(fullPath);
        }
    });

    return output;
}

/**
 * Returns whether the value of the call is unused: it is a statement (directly, or as the left of a comma, the right of a &&
 * or || or a branch of a ?: used as one), a for loop's initializer or incrementor, or the operand of void.
 */
function isResultUnused(call) {
    let node = call;
    let parent = node.parent;
    while (parent) {
        if (ts.isParenthesizedExpression(parent)) {
            // Look through the parentheses
        } else if (ts.isExpressionStatement(parent) || ts.isVoidExpression(parent)) {
            return true;
        } else if (ts.isForStatement(parent)) {
            return parent.initializer === node || parent.incrementor === node;
        } else if (ts.isBinaryExpression(parent)) {
            const op = parent.operatorToken.kind;
            if (op === ts.SyntaxKind.CommaToken && parent.left === node) {
                return true;
            }

            const isLogical = op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken;
            if (!(op === ts.SyntaxKind.CommaToken || (isLogical && parent.right === node))) {
                return false;
            }
        } else if (!(ts.isConditionalExpression(parent) && parent.condition !== node)) {
            return false;
        }

        node = parent;
        parent = parent.parent;
    }

    return false;
}

const sources = collectTsFiles(srcRoot, []).map((file) => ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true));

// The annotated functions, by name
const annotated = new Map();
sources.forEach((source) => {
    const text = source.getFullText();
    (function visit(node) {
        if (ts.isFunctionDeclaration(node) && node.name && /#__NO_SIDE_EFFECTS__/.test(text.substring(node.getFullStart(), node.getStart()))) {
            annotated.set(node.name.text, path.relative(srcRoot, source.fileName));
        }

        ts.forEachChild(node, visit);
    })(source);
});

const failures = [];
sources.forEach((source) => {
    (function visit(node) {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && annotated.has(node.expression.text) && isResultUnused(node)) {
            const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            failures.push(path.relative(srcRoot, source.fileName) + ":" + line + " -> " + node.getText().replace(/\s+/g, " ").substring(0, 100) +
                " (" + node.expression.text + " is annotated in " + annotated.get(node.expression.text) + ")");
        }

        ts.forEachChild(node, visit);
    })(source);
});

if (failures.length > 0) {
    console.error("Found calls to #__NO_SIDE_EFFECTS__ functions whose result is unused, which bundlers remove:");
    failures.forEach((failure) => console.error(" - " + failure));
    process.exit(1);
}

console.log("No side effects annotation check passed for " + annotated.size + " annotated functions.");
