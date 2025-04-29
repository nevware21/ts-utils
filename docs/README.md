
<h1 align="center">@nevware21/ts-utils Documentation</h1>
<h2 align="center">Comprehensive TypeScript/JavaScript Utility Library</h2>

![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/nevware21/ts-utils/ci.yml?branch=main)
[![codecov](https://codecov.io/gh/nevware21/ts-utils/branch/main/graph/badge.svg?token=8YCAMUA7VB)](https://codecov.io/gh/nevware21/ts-utils)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![Sponsor](https://img.shields.io/badge/Sponsor-444444?logo=githubsponsors
)](https://github.com/sponsors/nevware21)

## Overview

This documentation site provides comprehensive guides and reference materials for `@nevware21/ts-utils`, a collection of general JavaScript functions written in TypeScript. These utilities help reduce code duplication, improve minification, and provide consistent functionality across different JavaScript environments.

If you find this library useful, please consider [sponsoring @nevware21](https://github.com/sponsors/nevware21) to support ongoing development and maintenance.

## Documentation Resources

### Getting Started
- **[Usage Guide](./usage-guide.md)** - Comprehensive guide with examples for using the library's features
- **[Installation and Setup](./usage-guide.md#installation)** - How to install and configure the library in your projects

### Reference
- **[API Documentation](./typedoc/index.html)** - Complete API reference generated from source code via TypeDoc
- **[Function Categories](https://github.com/nevware21/ts-utils/blob/main/README.md#documentation--api-reference)** - Categorized list of all functions with documentation links

### Advanced Topics
- **[Advanced Deep Copy Functionality](./advanced-deep-copy.md)** - Using custom handlers with deep copy operations
- **[Performance and Minification Benefits](./usage-guide.md#performance-and-minification-benefits)** - Understanding how the library optimizes for performance
- **[Timeout Overrides](./timeout-overrides.md)** - Using Timeout overrides for custom scheduling behavior
- **[Bundle Size Optimization](./size-optimization.md)** - Detailed byte-level measurements and strategies for reducing bundle size

## Library Features

- TypeScript-first design with full type definitions
- Polyfill support for older environments (ES3/IE8)
- Comprehensive test coverage across Node.js, browsers, and web workers
- Optimized for tree-shaking and minification
- Zero dependencies
- Cross-environment compatibility (Browser, Node.js, Web Workers)
- Extensive type checking utilities
- Modern ECMAScript features with backward compatibility

## Polyfill Information

Some polyfills are provided for simple backward compatibility to enable the utility functions in older environments (such as ES3 / IE8). These polyfills are **not exported** as part of the main module. If you need them, you will need to:

1. Import the "polyfill" file directly
2. Host and load the provided `bundle/ts-polyfills-utils.min.js` 
3. Or provide your own alternative implementations

## Frequently Asked Questions

### When should I use ts-utils instead of native methods?

You should consider using ts-utils when:
- You need consistent cross-environment behavior
- You want better minification for repeated operations
- You need backward compatibility with older browsers
- You're working with a large codebase and want consistent utility functions

### Does using ts-utils increase my bundle size?

No, ts-utils is designed with tree-shaking in mind. You only pay for what you import, and the minified versions of these functions are typically smaller than their native counterparts when used repeatedly.

### How do I contribute to ts-utils?

See our [Contributing Guide](https://github.com/nevware21/ts-utils/blob/main/CONTRIBUTING.md) for information on how to contribute.

## Support and Community

- **[GitHub Issues](https://github.com/nevware21/ts-utils/issues)** - Report bugs or request new features
- **[GitHub Discussions](https://github.com/nevware21/ts-utils/discussions)** - Discuss usage and ideas
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/nevware21-ts-utils)** - Ask questions with the tag `nevware21-ts-utils`
