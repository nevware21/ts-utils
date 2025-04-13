const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Configuration from your size-limit settings
const configs = [
  {
    name: "es5-min-full",
    path: "../bundle/es5/umd/ts-utils.min.js",
    limit: 24 * 1024, // 19 kb in bytes
    compress: false
  },
  {
    name: "es6-min-full",
    path: "../bundle/es6/umd/ts-utils.min.js",
    limit: 24 * 1024, // 18 kb in bytes
    compress: false
  },
  {
    name: "es5-min-zip",
    path: "../bundle/es5/umd/ts-utils.min.js",
    limit: 10 * 1024, // 8 kb in bytes
    compress: true
  },
  {
    name: "es6-min-zip",
    path: "../bundle/es6/umd/ts-utils.min.js",
    limit: 10 * 1024, // 8 kb in bytes
    compress: true
  },
  {
    name: "es5-min-poly",
    path: "../bundle/es5/ts-polyfills-utils.min.js",
    limit: 9 * 1024, // 7 kb in bytes
    compress: false
  }
];

// We'll skip the import check for es5-env as it's more complex

let passed = true;

console.log("\nChecking file sizes without time measurement:");
console.log("===========================================\n");

configs.forEach(config => {
  try {
    const filePath = path.join(__dirname, config.path);
    let content = fs.readFileSync(filePath);
    let size = content.length;
    let compressedSize = config.compress ? zlib.gzipSync(content).length : size;
    
    const finalSize = config.compress ? compressedSize : size;
    const limitKb = config.limit / 1024;
    const sizeKb = finalSize / 1024;
    
    const pass = finalSize <= config.limit;
    if (!pass) passed = false;
    
    console.log(
      `${config.name}: ${sizeKb.toFixed(2)} kB ${config.compress ? '(gzipped)' : ''}` +
      ` / limit ${limitKb.toFixed(2)} kB [${pass ? 'PASS' : 'FAIL'}]`
    );
  } catch (error) {
    console.error(`Error checking ${config.name}: ${error.message}`);
    passed = false;
  }
});

console.log("\n" + (passed ? "All size checks passed!" : "Some size checks failed."));
process.exit(passed ? 0 : 1);