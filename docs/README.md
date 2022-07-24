
<h1 align="center">@nevware21 ts-utils</h1>
<h2 align="center">Common JavaScript/TypeScript helper functions for better minification</h2>


![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/nevware21/ts-utils/NodeCI/main)
[![codecov](https://codecov.io/gh/nevware21/ts-utils/branch/main/graph/badge.svg?token=8YCAMUA7VB)](https://codecov.io/gh/nevware21/ts-utils)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)

## Description

This is a collection of general JavaScript functions (written in and for TypeScript) to aid with removing code duplication to assist with minification, the provided functions are expected to only rarely be included in their namespaced environment.

Support for standard JavaScript functions (ES5+) that are not support in all environments will be backed by internal polyfill implementations when not available. All of the polyfill functions are tested against the standard native implementations for node, browser and web-worker to ensure compatibility.

## Documentation

Documentation [generated from source code](https://nevware21.github.io/ts-utils/typedoc/index.html) via typedoc

Some polyfills are provided for simple backward compatability to enable the utility functions in older environments (such as ES3 / IE8), you don't have to use or include the provided polyfils (AND they are NOT exported as part of the main module). If you need them you will need to import the "polyfill" file directly or host and load the provided `bundle/ts-polyfills-utils.min.js` or provide your own alternatives.
