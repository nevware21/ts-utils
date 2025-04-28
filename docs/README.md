
<h1 align="center">@nevware21/ts-utils Documentation</h1>
<h2 align="center">Common JavaScript/TypeScript helper functions for better minification</h2>

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

### Advanced Topics
- **[Advanced Deep Copy Functionality](./advanced-deep-copy.md)** - Using custom handlers with deep copy operations
- **[Performance and Minification Benefits](./usage-guide.md#performance-and-minification-benefits)** - Understanding how the library optimizes for performance
- **[Bundle Size Optimization](./size-optimization.md)** - Detailed byte-level measurements and strategies for reducing bundle size

## Library Features

- TypeScript-first design with full type definitions
- Polyfill support for older environments (ES3/IE8)
- Comprehensive test coverage across Node.js, browsers, and web workers
- Optimized for tree-shaking and minification
- Zero dependencies

## Polyfill Information

Some polyfills are provided for simple backward compatibility to enable the utility functions in older environments (such as ES3 / IE8). These polyfills are **not exported** as part of the main module. If you need them, you will need to:

1. Import the "polyfill" file directly
2. Host and load the provided `bundle/ts-polyfills-utils.min.js` 
3. Or provide your own alternative implementations
