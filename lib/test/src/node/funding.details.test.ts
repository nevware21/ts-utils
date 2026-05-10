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
    function _hasGitHubSponsorLink(content: string): boolean {
        const markdownLinkRegex = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/g;
        let match: RegExpExecArray | null;
        while ((match = markdownLinkRegex.exec(content))) {
            const linkUrl = match[1];
            try {
                let parsed = new URL(linkUrl);
                if (parsed.hostname === "github.com" && parsed.pathname === "/sponsors/nevware21") {
                    return true;
                }
            } catch (e) {
                // Ignore invalid URLs while scanning links
            }
        }

        return false;
    }

    function _getFundingUrls(packageJson: any): string[] {
        let funding = packageJson && packageJson.funding;
        if (!funding) {
            return [];
        }

        const fundingEntries = Array.isArray(funding) ? funding : [funding];
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
            assert.equal(_getFundingUrls(rootPackage).includes(expectedUrl), true, "Expected root package.json funding to contain " + expectedUrl);
            assert.equal(_getFundingUrls(publishPackage).includes(expectedUrl), true, "Expected lib/package.json funding to contain " + expectedUrl);
        });
    });

    it("keeps sponsor references in documentation and github funding config", () => {
        let readme = fs.readFileSync("README.md", "utf8");
        let docsReadme = fs.readFileSync("docs/README.md", "utf8");
        let githubFunding = fs.readFileSync(".github/FUNDING.yml", "utf8");

        assert.equal(_hasGitHubSponsorLink(readme), true, "Expected README.md sponsor link to exist");
        assert.equal(_hasGitHubSponsorLink(docsReadme), true, "Expected docs/README.md sponsor link to exist");
        assert.equal(githubFunding.includes("github: [nevware21]"), true, "Expected .github/FUNDING.yml GitHub Sponsors entry to exist");
        assert.equal(githubFunding.includes("buy_me_a_coffee: nevware21"), true, "Expected .github/FUNDING.yml Buy Me a Coffee entry to exist");
    });
});
