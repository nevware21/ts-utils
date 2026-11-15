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
//
// It also checks that an annotated overload signature has an annotated implementation, as TypeScript doesn't emit the
// overload signatures (or their comments), so only the annotation on the implementation reaches the bundles.
//
// The calls are resolved with the TypeScript type checker, so a call through an import (including a renamed import), a
// namespace import (ns.fn()) or an alias (const alias = fn) is found, while a local variable or parameter with the same
// name as an annotated function is not.
//
// Usage: node lib/test/no-side-effects-annotations-check.js [srcFolder]   (defaults to lib/src)

"use strict";

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const srcRoot = path.resolve(process.argv[2] || path.join(__dirname, "../src"));

// An annotation is a block comment containing only #__NO_SIDE_EFFECTS__ (or @__NO_SIDE_EFFECTS__)
const ANNOTATION = /^\/\*\s*[#@]__NO_SIDE_EFFECTS__\s*\*\/$/;

function collectTsFiles(rootPath, output) {
    fs.readdirSync(rootPath, { withFileTypes: true }).forEach((entry) => {
        const fullPath = path.join(rootPath, entry.name);
        if (entry.isDirectory()) {
            collectTsFiles(fullPath, output);
        } else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
            output.push(fullPath);
        }
    });

    return output;
}

/**
 * Returns whether one of the comments which follow any of the positions is the annotation, both the comments on the same
 * line (the "trailing" comments, eg. after `export` or `=`) and those on the following lines (the "leading" comments)
 */
function hasAnnotationAt(text, positions) {
    return positions.some((pos) => (ts.getTrailingCommentRanges(text, pos) || []).concat(ts.getLeadingCommentRanges(text, pos) || [])
        .some((range) => ANNOTATION.test(text.substring(range.pos, range.end))));
}

/**
 * Returns the positions where an annotation of the declaration may start: before the declaration (or statement) and
 * after each of its modifiers, eg. `export /*#__NO_SIDE_EFFECTS__*\/ function`
 */
function annotationPositions(node) {
    return [node.getFullStart()].concat((node.modifiers || []).map((modifier) => modifier.end));
}

/**
 * Removes any parentheses and type assertions (`(fn)`, `fn as any`, `<any>fn`, `fn!`) from the expression
 */
function skipOuter(node) {
    while (node && (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node) ||
            ts.isNonNullExpression(node) || (ts.isSatisfiesExpression && ts.isSatisfiesExpression(node)))) {
        node = node.expression;
    }

    return node;
}

/**
 * Returns the symbol the expression refers to, following any imports and export aliases
 */
function resolveSymbol(checker, expr) {
    expr = skipOuter(expr);
    let symbol;
    if (ts.isIdentifier(expr)) {
        symbol = checker.getSymbolAtLocation(expr);
    } else if (ts.isPropertyAccessExpression(expr)) {
        // A namespace import, eg. ns.fn()
        symbol = checker.getSymbolAtLocation(expr.name);
    }

    if (symbol && (symbol.flags & ts.SymbolFlags.Alias)) {
        symbol = checker.getAliasedSymbol(symbol);
    }

    return symbol;
}

const program = ts.createProgram(collectTsFiles(srcRoot, []), {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.ES2015,
    moduleResolution: ts.ModuleResolutionKind.Node10 || ts.ModuleResolutionKind.NodeJs,
    lib: ["lib.es2020.d.ts", "lib.dom.d.ts"],
    types: [],
    noEmit: true,
    skipLibCheck: true
});
const checker = program.getTypeChecker();
const sources = program.getSourceFiles().filter((source) => !source.isDeclarationFile && path.resolve(source.fileName).startsWith(srcRoot));

const relName = (source) => path.relative(srcRoot, source.fileName).replace(/\\/g, "/");
const lineOf = (source, node) => source.getLineAndCharacterOfPosition(node.getStart()).line + 1;

// The annotated functions (their symbols), with where each is annotated
const annotated = new Map();
const failures = [];

// The variables (and where) which may be aliases of an annotated function, resolved once all of the functions are known
const aliasCandidates = [];

sources.forEach((source) => {
    const text = source.getFullText();
    const overloads = new Map();

    (function visit(node) {
        if (ts.isFunctionDeclaration(node) && node.name) {
            const isAnnotated = hasAnnotationAt(text, annotationPositions(node));
            const symbol = checker.getSymbolAtLocation(node.name);
            if (!node.body) {
                // An overload signature
                if (isAnnotated) {
                    overloads.set(symbol, node);
                }
            } else if (isAnnotated) {
                annotated.set(symbol, relName(source) + ":" + lineOf(source, node));
                overloads.delete(symbol);
            } else if (overloads.has(symbol)) {
                failures.push(relName(source) + ":" + lineOf(source, node) + " -> " + node.name.text + "() has an annotated overload but the implementation " +
                    "is not annotated, TypeScript doesn't emit the overload signatures so the annotation is lost");
                overloads.delete(symbol);
            }
        } else if (ts.isVariableStatement(node)) {
            const statementAnnotated = hasAnnotationAt(text, annotationPositions(node));
            node.declarationList.declarations.forEach((decl, idx) => {
                const init = decl.initializer && skipOuter(decl.initializer);
                if (!ts.isIdentifier(decl.name) || !init) {
                    return;
                }

                const symbol = checker.getSymbolAtLocation(decl.name);
                if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
                    // eg. /*#__NO_SIDE_EFFECTS__*/ const fn = () => {} or const fn = /*#__NO_SIDE_EFFECTS__*/ () => {}
                    if ((statementAnnotated && idx === 0) || hasAnnotationAt(text, [decl.initializer.getFullStart(), init.getFullStart()])) {
                        annotated.set(symbol, relName(source) + ":" + lineOf(source, decl));
                    }
                } else if (ts.isIdentifier(init) || ts.isPropertyAccessExpression(init)) {
                    aliasCandidates.push({ symbol: symbol, init: init, where: relName(source) + ":" + lineOf(source, decl) });
                }
            });
        }

        ts.forEachChild(node, visit);
    })(source);
});

// An alias of an annotated function (eg. export const polyObjIsFrozen = polyObjIsSealed) is treated as annotated, as a
// bundler can see that it is the same function. Repeat until no more are found, as an alias may be of another alias.
let added = true;
while (added) {
    added = false;
    aliasCandidates.forEach((candidate) => {
        const target = resolveSymbol(checker, candidate.init);
        if (!annotated.has(candidate.symbol) && target && annotated.has(target)) {
            annotated.set(candidate.symbol, candidate.where + " (alias)");
            added = true;
        }
    });
}

/**
 * Returns whether the variable is never read, so a value assigned to it is unused (and is removed with it)
 */
function isUnusedVariable(source, decl) {
    const statement = decl.parent && decl.parent.parent;
    if (!ts.isIdentifier(decl.name) || !statement || !ts.isVariableStatement(statement) ||
            (statement.modifiers || []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
        return false;
    }

    const symbol = checker.getSymbolAtLocation(decl.name);
    let used = false;
    (function visit(node) {
        if (!used) {
            if (ts.isIdentifier(node) && node !== decl.name && checker.getSymbolAtLocation(node) === symbol) {
                used = true;
            } else if (ts.isShorthandPropertyAssignment(node) && checker.getShorthandAssignmentValueSymbol(node) === symbol) {
                used = true;
            } else if (ts.isExportSpecifier(node) && checker.getExportSpecifierLocalTargetSymbol(node) === symbol) {
                used = true;
            } else {
                ts.forEachChild(node, visit);
            }
        }
    })(source);

    return !used;
}

/**
 * Returns whether the value of the call is unused: it is a statement (directly, or as the left of a comma, the right of a
 * &&, || or ?? or a branch of a ?: used as one), a for loop's initializer or incrementor, the operand of an operator whose
 * result is unused (void, !, typeof, -, + or ~), or the value of a variable which is never read. Parentheses and type
 * assertions are looked through.
 */
function isResultUnused(source, call) {
    let node = call;
    let parent = node.parent;
    while (parent) {
        if (ts.isParenthesizedExpression(parent) || ts.isAsExpression(parent) || ts.isTypeAssertionExpression(parent) ||
                ts.isNonNullExpression(parent) || (ts.isSatisfiesExpression && ts.isSatisfiesExpression(parent))) {
            // Look through the parentheses and type assertions
        } else if (ts.isExpressionStatement(parent) || ts.isVoidExpression(parent)) {
            return true;
        } else if (ts.isPrefixUnaryExpression(parent) || ts.isTypeOfExpression(parent)) {
            // The result of !fn(), -fn(), typeof fn() etc, is unused if the result of the operator is unused
        } else if (ts.isForStatement(parent)) {
            return parent.initializer === node || parent.incrementor === node;
        } else if (ts.isVariableDeclaration(parent)) {
            return parent.initializer === node && isUnusedVariable(source, parent);
        } else if (ts.isBinaryExpression(parent)) {
            const op = parent.operatorToken.kind;
            if (op === ts.SyntaxKind.CommaToken && parent.left === node) {
                return true;
            }

            const isLogical = op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken;
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

sources.forEach((source) => {
    (function visit(node) {
        if (ts.isCallExpression(node)) {
            const symbol = resolveSymbol(checker, node.expression);
            if (symbol && annotated.has(symbol) && isResultUnused(source, node)) {
                failures.push(relName(source) + ":" + lineOf(source, node) + " -> " + node.getText().replace(/\s+/g, " ").substring(0, 100) +
                    " (" + symbol.name + " is annotated in " + annotated.get(symbol) + ")");
            }
        }

        ts.forEachChild(node, visit);
    })(source);
});

if (failures.length > 0) {
    console.error("Found #__NO_SIDE_EFFECTS__ annotation issues, a bundler removes a call to an annotated function whose result is unused:");
    failures.forEach((failure) => console.error(" - " + failure));
    process.exit(1);
}

console.log("No side effects annotation check passed for " + annotated.size + " annotated functions in " + sources.length + " files.");
