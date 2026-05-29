const fs = require("fs");
const path = require("path");

const outputRoots = [
    path.join(__dirname, "../bundle"),
    path.join(__dirname, "../dist")
];

const invalidPureAnnotationRe = /\(\s+\/\*\s*([#@])__PURE__\s*\*\//g;

function collectJsFiles(rootPath, output) {
    if (!fs.existsSync(rootPath)) {
        return;
    }

    fs.readdirSync(rootPath).forEach((name) => {
        const fullPath = path.join(rootPath, name);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            collectJsFiles(fullPath, output);
            return;
        }

        if (stat.isFile() && path.extname(name) === ".js") {
            output.push(fullPath);
        }
    });
}

function getLineNumber(content, index) {
    let line = 1;
    for (let lp = 0; lp < index; lp++) {
        if (content.charCodeAt(lp) === 10) {
            line++;
        }
    }

    return line;
}

const jsFiles = [];
outputRoots.forEach((rootPath) => collectJsFiles(rootPath, jsFiles));

if (jsFiles.length === 0) {
    console.error("No generated JavaScript files were found under lib/bundle or lib/dist");
    process.exit(1);
}

const failures = [];

console.log("Scanning generated JavaScript files for PURE annotation spacing...");
console.log("Files discovered: " + jsFiles.length);

jsFiles.forEach((filePath) => {
    const relativeFilePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
    console.log(" - Processing " + relativeFilePath);
    const content = fs.readFileSync(filePath, "utf8");
    let match;

    invalidPureAnnotationRe.lastIndex = 0;
    while ((match = invalidPureAnnotationRe.exec(content))) {
        failures.push({
            filePath: relativeFilePath,
            line: getLineNumber(content, match.index),
            sample: match[0]
        });
    }
});

if (failures.length > 0) {
    console.error("Found invalid PURE annotations with leading whitespace after '(':");
    failures.forEach((failure) => {
        console.error(" - " + failure.filePath + ":" + failure.line + " -> " + failure.sample);
    });
    process.exit(1);
}

console.log("PURE annotation spacing check passed for generated bundle/dist JavaScript files.");
