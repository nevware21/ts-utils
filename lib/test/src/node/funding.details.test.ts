/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import * as fs from "fs";

import { assert } from "@nevware21/tripwire-chai";

describe("funding metadata references", () => {
    function _getFundingUrls(packageJson: any): string[] {
        let funding = packageJson && packageJson.funding;
        if (!funding) {
            return [];
        }

        let fundingEntries = Array.isArray(funding) ? funding : [funding];
        return fundingEntries.map((entry) => {
            return typeof entry === "string" ? entry : entry && entry.url;
        }).filter((entry) => !!entry);
    }

    it("includes funding metadata in root and published package files", () => {
        let rootPackage = JSON.parse(fs.readFileSync("package.json", "utf8"));
        let publishPackage = JSON.parse(fs.readFileSync("lib/package.json", "utf8"));

        let expectedUrls = [
            "https://github.com/sponsors/nevware21",
            "https://buymeacoffee.com/nevware21"
        ];

        expectedUrls.forEach((expectedUrl) => {
            assert.equal(_getFundingUrls(rootPackage).indexOf(expectedUrl) !== -1, true, "Expected root package.json funding to contain " + expectedUrl);
            assert.equal(_getFundingUrls(publishPackage).indexOf(expectedUrl) !== -1, true, "Expected lib/package.json funding to contain " + expectedUrl);
        });
    });

    it("keeps sponsor references in documentation and github funding config", () => {
        let readme = fs.readFileSync("README.md", "utf8");
        let docsReadme = fs.readFileSync("docs/README.md", "utf8");
        let githubFunding = fs.readFileSync(".github/FUNDING.yml", "utf8");

        assert.equal(readme.indexOf("https://github.com/sponsors/nevware21") !== -1, true, "Expected README.md sponsor link to exist");
        assert.equal(docsReadme.indexOf("https://github.com/sponsors/nevware21") !== -1, true, "Expected docs/README.md sponsor link to exist");
        assert.equal(githubFunding.indexOf("github: [nevware21]") !== -1, true, "Expected .github/FUNDING.yml GitHub Sponsors entry to exist");
        assert.equal(githubFunding.indexOf("buy_me_a_coffee: nevware21") !== -1, true, "Expected .github/FUNDING.yml Buy Me a Coffee entry to exist");
    });
});
