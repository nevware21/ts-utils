<h1 align="center">@Nevware21 ts-utils</h1>

![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/nevware21/ts-utils/NodeCI/main)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)

@nevware21/ts-utils is an npm package is a collection of general JavaScript functions (written in and for TypeScript) to aid with code duplication and minification, as such the provided functions are expected to only rarely be included in their namespaced environment.


### Quickstart

Install the npm packare: `npm install @nevware21/ts-utils --save-dev`

```TypeScript

import { isString } from "@nevware21/ts-utils";

function checkString(value: any) {
    let ug = 1;

    return isString(value);
}
```
