const fs = require("fs");
const glob = require("glob");

const istanbulCoverage = require("istanbul-lib-coverage");
const istanbulReport = require("istanbul-lib-report");
const istanbulReportGenerator = require("istanbul-reports");

// Helper to load a json blob from a .json file
const getJson = (fileName) => {
    const data = fs.readFileSync(fileName);
    return JSON.parse(data);
};

// Find any files named "coverage-final.json" (excluding any existing merged one)
let jsonFiles = glob.sync("./coverage/**/coverage-final.json")
    .filter(possibleFile => (possibleFile.indexOf("report") === -1 && possibleFile.indexOf("coverage/coverage-final.json") === -1));

jsonFiles.forEach(file => console.log(`merging: ${file}`));

// Load the json blobs from the discovered .json files
var jsonBlobs = jsonFiles.map(file => getJson(file));

// Create an empty map and merge in all the loaded maps
let mergedMap = istanbulCoverage.createCoverageMap();
jsonBlobs.forEach(jsonBlob => {
    mergedMap.merge(istanbulCoverage.createCoverageMap(jsonBlob));
});

// Create an empty coverage summary and merge in a file coverage
//  summary for each of files in the merged map
const mergedSummary = istanbulCoverage.createCoverageSummary();
mergedMap.files().forEach((file) => {
    const coverageFile = mergedMap.fileCoverageFor(file);
    const coverageSummary = coverageFile.toSummary();
    mergedSummary.merge(coverageSummary);
});

// Generate the report
const reportGenerationContext = istanbulReport.createContext({
    dir: "./coverage/report",
    defaultSummarizer: "nested",
    coverageMap: mergedMap
});

// call execute to synchronously create and write the report to disk
const report = istanbulReportGenerator.create("html-spa");
report.execute(reportGenerationContext);

const txtReport = istanbulReportGenerator.create("text");
txtReport.execute(istanbulReport.createContext({
    coverageMap: mergedMap
}));

const jsonReport = istanbulReportGenerator.create("json");
jsonReport.execute(istanbulReport.createContext({
    dir: "./coverage",

    coverageMap: mergedMap
}));


console.log("Merged coverage generated in ./coverage/report");