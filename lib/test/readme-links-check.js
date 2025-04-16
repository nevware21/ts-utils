// filepath: d:\gith1\tsUtils\lib\test\readme-links-check.js
const fs = require('fs');
const path = require('path');

function _createREgEx(value) {
    let escaped = value.replace(/([-+|^$#\.\?{}()\[\]\\\/\"\'])/g, "\\$1").replace(/\*/g, "(.*)");
    return new RegExp("(" + escaped + "[^\\)\"'\\s]+)", "gi");
}

// Configuration
const readmePath = path.resolve(__dirname, '../../README.md');
const docsBasePath = path.resolve(__dirname, '../../docs');
const baseUrl = 'https://nevware21.github.io/ts-utils/typedoc/';

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

// Extract all links that start with the baseUrl
const linkRegex = _createREgEx(baseUrl);
let match;
const links = new Set();
while ((match = linkRegex.exec(readme)) !== null) {
  links.add(match[1]);
}

console.log(`Found ${links.size} unique links to typedoc documentation.`);

// Process each link
let missingFiles = [];
let validFiles = [];

links.forEach(url => {
  // Convert URL to local file path
  const relativePath = url.substring(baseUrl.length);
  const localPath = path.join(docsBasePath, 'typedoc', relativePath);
  
  // Check if file exists
  if (fs.existsSync(localPath)) {
    validFiles.push({ url, localPath });
  } else {
    missingFiles.push({ url, localPath });
  }
});

// Output results
console.log(`\n${validFiles.length} links are valid.`);

if (missingFiles.length === 0) {
  console.log('\nAll links are valid! 🎉');
} else {
  console.log(`\n❌ Found ${missingFiles.length} missing files:`);
  missingFiles.forEach(({ url, localPath }) => {
    console.log(`  - ${url}`);
    console.log(`    Expected at: ${localPath}`);
  });
}

// Check if there are any HTML files in docs/typedoc that aren't linked in README
const allDocFiles = [];
function collectFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      collectFiles(fullPath);
    } else if (stat.isFile() && item.endsWith('.html')) {
      // Get the relative path from the docs directory
      const relativePath = path.relative(docsBasePath, fullPath)
        .replace(/\\/g, '/'); // Normalize for URL comparison
      allDocFiles.push({
        path: fullPath,
        url: `https://nevware21.github.io/ts-utils/${relativePath}`
      });
    }
  }
}

try {
  collectFiles(path.join(docsBasePath, 'typedoc'));
  
  const linkedUrls = new Set(Array.from(links));
  const unlinkedFiles = allDocFiles.filter(file => !linkedUrls.has(file.url));
  
  if (unlinkedFiles.length > 0) {
    console.log(`\nℹ️ Found ${unlinkedFiles.length} documentation files not linked in README.md`);
    console.log('  (This is just informational, not necessarily an issue)');
    // Uncomment to see unlinked files
    // unlinkedFiles.forEach(file => {
    //   console.log(`  - ${file.url}`);
    // });
  }
} catch (error) {
  console.error(`Error while checking for unlinked files: ${error.message}`);
}

// Return appropriate exit code
if (missingFiles.length > 0) {
  console.log('\n❌ Test failed: Some documentation links in README.md are broken.');
  process.exit(1);
} else {
  console.log('\n✅ Test passed: All documentation links in README.md are valid.');
  process.exit(0);
}
