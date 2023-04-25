/*
 * @nevware21/ts-async
 * https://github.com/nevware21/ts-async
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";

const publishGroupDef = "../npm-publish.json";
let repoRoot: string = "";
let publishGroup: string;
let dryRun: string = "";

function showHelp() {
    let scriptParts: string[];
    let scriptName = process.argv[1];
    if (scriptName.indexOf("\\") !== -1) {
        scriptParts = scriptName.split("\\");
        scriptName = scriptParts[scriptParts.length - 1];
    } else if (scriptName.indexOf("/") !== -1) {
        scriptParts = scriptName.split("/");
        scriptName = scriptParts[scriptParts.length - 1];
    }

    console.log("");
    console.log(scriptName + " <group> ");
    console.log("--------------------------");
    console.log(" <group>      - Identifies the group to publish, identifies folders");
}

function parseArgs(): boolean {
    if (process.argv.length < 2) {
        console.error("!!! Invalid number of arguments -- " + process.argv.length);
        return false;
    }

    let idx = 2;
    while (idx < process.argv.length) {
        let theArg = process.argv[idx];
        if (theArg.startsWith("-")) {
            if (theArg === "-test") {
                dryRun = "--dry-run";
                console.info(" - Test Mode");
            } else {
                console.error("!!! Unknown switch [" + theArg + "] detected");
                return false;
            }
        } else if (!publishGroup) {
            publishGroup = theArg;
        } else {
            console.error("!!! Invalid Argument [" + theArg + "] detected");
            return false;
        }

        idx++;
    }

    return true;
}

function removeTrailingComma(text: string): string {
    return text.replace(/,(\s*[}\],])/g, "$1");
}

function removeComments(text: string): string {
    return text.replace(/^\s*\/\/\s.*$/gm, "");
}

function getNpmPackageName(packageJsonFile: string) {
    var packageText = removeTrailingComma(fs.readFileSync(packageJsonFile, "utf-8"));

    let packageJson = JSON.parse(packageText);
    let packageName = packageJson.name;
    let packageVersion = packageJson.version;

    let theNpmPackageName = packageName + "-" + packageVersion;

    theNpmPackageName = theNpmPackageName.replace("@", "").replace("/", "-");

    return theNpmPackageName + ".tgz";
}

function getGroupProjects() {
    if (!fs.existsSync(publishGroupDef)) {
        console.error("!!! Unable to locate publish group definitions [" + path.join(process.cwd(), publishGroupDef) + "]");
        throw new Error("!!! Unable to locate publish group definitions.");
    }

    var groupText = removeComments(removeTrailingComma(fs.readFileSync(publishGroupDef, "utf-8")));

    let groupJson = JSON.parse(groupText);
    repoRoot = path.join(process.cwd(), (groupJson.repoRoot || "")).replace(/\\/g, "/");
    console.log("Repo: " + repoRoot);

    if (!publishGroup) {
        publishGroup = groupJson.default || "";
    }

    return (groupJson.groups || {})[publishGroup] || [];
}

console.log("cwd: " + process.cwd());
if (parseArgs()) {
    var packages = getGroupProjects();

    console.log(`Publishing [${publishGroup}] packages => ${packages.length}`);
    packages.forEach((packageRoot) => {
        let packageJsonFile = path.join(repoRoot, packageRoot + "/package.json");

        if (!fs.existsSync(packageJsonFile)) {
            console.error("!!! Source package.json doesn't exist [" + packageJsonFile + "] - [" + repoRoot + ", " + packageRoot + "]");
            throw new Error("!!! Source package.json doesn't exist [" + packageJsonFile + "] - [" + repoRoot + ", " + packageRoot + "]");
        }

        console.log("\n\n##################################################################");
        console.log("Publishing - " + getNpmPackageName(packageJsonFile));
        console.log("##################################################################");
        let npmPackageName = path.join(repoRoot, packageRoot + "/" + getNpmPackageName(packageJsonFile));
        if (!fs.existsSync(npmPackageName)) {
            console.error("!!! NPM Package not found [" + npmPackageName + "] - [" + repoRoot + ", " + packageRoot + "]");
            throw new Error("!!! NPM Package not found [" + npmPackageName + "] - [" + repoRoot + ", " + packageRoot + "]");
        }
        
        console.log(`npm package present ${npmPackageName}`);
        let npmCmd = `npm publish ${npmPackageName} --access public ${dryRun}`;
        console.log(`Running: \"${npmCmd}\"`);
        child_process.execSync(npmCmd);
    });
} else {
    showHelp();
    process.exit(1);
}
