// filepath: d:\gith1\tsUtils\lib\test\readme-links-check.js
const fs = require('fs');
const path = require('path');

function _createRegEx(value) {
    let escaped = value.replace(/([-+|^$#\.\?{}()\[\]\\\/\"\'])/g, "\\$1").replace(/\*/g, "(.*)");
    return new RegExp("(" + escaped + "[^\\)\"'\\s]+)", "gi");
}

function _extractLinks(linkRegex, checkFn) {
    let docSet = new Set();
    let match;
    while ((match = linkRegex.exec(readme)) !== null) {
        let lnk = checkFn(match);
        if (lnk) {
            docSet.add(lnk);
        }
    }

    return docSet;
}

function _hasLink(allDocLinks, url) {
    // Check if the URL is in the set of all documentation links
    for (let lp = 0; lp < allDocLinks.length; lp++) {
        // Check if the URL is in the array of URLs for this link
        for (let idx = 0; idx < allDocLinks[lp].links.length; idx++) {
            if (allDocLinks[lp].links[idx] === url) {
                return true;
            }
        }
    }

    return false;
}

function _checkLinks(allDocLinks, docLinks, resolvePathFn, desc) {
    let results = {
        missing: [],
        valid: []
    };

    docLinks.forEach(url => {
        // Convert URL to local file path
        const localPath = resolvePathFn(url);

        if (_hasLink(allDocLinks, url)) {
            results.valid.push({ url, localPath });
        } else if (fs.existsSync(localPath)) {
            // Check if file exists
            results.valid.push({ url, localPath });
        } else {
            results.missing.push({ url, localPath });
        }
    });

    // Output results
    if (results.missing.length === 0) {
        console.log(`\nAll ${desc} are valid! 🎉`);
    } else {
        console.log(`\n❌ Found ${results.missing.length} missing files:`);
        results.missing.forEach(({ url, localPath }) => {
            console.log(`  - ${url}`);
            console.log(`    Expected: ${localPath}`);
        });
    }

    return results;
}

// Check if there are any HTML files in docs/typedoc that aren't linked in README
function _collectDocsFiles(dir, allDocFiles) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            _collectDocsFiles(fullPath, allDocFiles);
        } else if (stat.isFile() && (item.endsWith('.html') || item.endsWith('.md'))) {
            // Get the relative path from the docs directory
            const relativePath = path.relative(docsBasePath, fullPath)
                .replace(/\\/g, '/'); // Normalize for URL comparison

            let fileLinks = [
                    `https://nevware21.github.io/ts-utils/${relativePath.replace(".md", ".html")}`
                ];
            allDocFiles.push({
                path: fullPath,
                url: `https://nevware21.github.io/ts-utils/${relativePath}`,
                links: fileLinks
            });

            try {
                //console.log(` - ${relativePath}`);
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                // Fincd all links in the markdown fileContent and add them to the list
                const linkRegex = /^#+\s*(.*)$/gm;
                let match; 
                while ((match = linkRegex.exec(fileContent)) !== null) {
                    let link = match[1].replace(/[^\w\d\s\-]/g, "").replace(/[\s]/g, "-").replace(/--/g, "-").toLowerCase();
                    fileLinks.push(`https://nevware21.github.io/ts-utils/${relativePath.replace(".md", ".html") + "#" + link}`);
                    // console.log(`   - #${link}`);
                }
            } catch (error) {
                console.error(`Error reading file ${fullPath}: ${error.message} - ${error.stack}`);
            }
        }
    }

    return allDocFiles;
}

// Configuration
const readmePath = path.resolve(__dirname, '../../README.md');
const docsBasePath = path.resolve(__dirname, '../../docs');
const typedocBaseUrl = 'https://nevware21.github.io/ts-utils/typedoc/';
const docBaseUrl = 'https://nevware21.github.io/ts-utils/';

console.log('\nChecking README.md links to documentation:');
console.log('=========================================\n');

// Read README.md
let readme;
try {
    readme = fs.readFileSync(readmePath, 'utf8');
    console.log(`✓ README.md found and read successfully.`);
} catch (error) {
    console.error(`✗ Error reading README.md: ${error.message}`);
    process.exit(1);
}

let typeDocResults;
let docResults;

try {
    // Change to collect files and then check the links rather than the filename conversion
    const allDocLinks = _collectDocsFiles(path.join(docsBasePath, ""), []);
    console.log(`\nFound ${allDocLinks.length} files in [${path.join(docsBasePath, "")}]`);

    // Extract all typedoc links that start with the baseUrl
    const typeDocLinks = _extractLinks(_createRegEx(typedocBaseUrl), match => {
        if (match[0].indexOf("/typedoc/") !== -1) {
            return match[1];
        }
    });

    const docLinks = _extractLinks(_createRegEx(docBaseUrl), match => {
        if (match[0].indexOf("/typedoc/") === -1) {
            return match[1];
        }
    });

    console.log(`Found ${typeDocLinks.size} unique links to typedoc documentation.`);
    typeDocResults = _checkLinks(allDocLinks, typeDocLinks, url => {
        // console.log(`  - ${url}`);
        // Convert URL to local file path
        const relativePath = url.substring(typedocBaseUrl.length);
        return path.join(docsBasePath, 'typedoc', relativePath);
    }, "typedoc links");

    console.log(`\nFound ${docLinks.size} unique documentation links.`);
    docResults = _checkLinks(allDocLinks, docLinks, url => {
        const relativePath = url.substring(docBaseUrl.length);
        if (url.indexOf(".md") !== -1) {
            // Any markdown files are invalid, they should be .html
            return "[" + url + "] it should be a .html link";
        }
        // console.log(`  - ${url}`);
        // Convert URL to local file path
        return path.join(docsBasePath, relativePath).replace(".html", ".md");
    }, "documentation links");


    const linkedUrls = new Set(Array.from(typeDocLinks).concat(Array.from(docLinks)));
    const unlinkedFiles = allDocLinks.filter((file) => {
        if (!linkedUrls.has(file.url)) {
            // Check if the file is linked in the README.md
            return !(typeDocLinks.has(file.url) && docLinks.indexOf(file.url) === -1);
        }

        return false;
    });

    if (unlinkedFiles.length > 0) {
        console.log(`\nℹ️ Found ${unlinkedFiles.length} documentation files not linked in README.md`);
        console.log('  (This is just informational, not necessarily an issue)');
        // Uncomment to see unlinked files
        unlinkedFiles.forEach(file => {
            if (file.url.indexOf("/functions/") !== -1
                // Don't show polyfilled files
                && file.url.indexOf("/poly") === -1
                // Don't show handlers
                && file.url.indexOf("Handler.html") === -1
            ) {
                console.log(`  - ${file.path}`);
            } else {
                // Uncomment to see unlinked files
                console.log(`  - ${file.url}`);
            }
        });
    }
} catch (error) {
    console.error(`Error while checking for unlinked files: ${error.message} - ${error.stack}`);
    process.exit(2);
}

// Return appropriate exit code
if (typeDocResults.missing.length > 0 || docResults.missing.length > 0) {
    console.log('\n❌ Test failed: Some documentation links in README.md are broken.');
    process.exit(1);
} else {
    console.log('\n✅ Test passed: All documentation links in README.md are valid.');
    process.exit(0);
}
