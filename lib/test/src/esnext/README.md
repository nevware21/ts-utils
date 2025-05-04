
# ESNext Test Files

This directory contains test files that need to run with modern JavaScript features intact, without TypeScript downleveling them to older JavaScript versions.

## Purpose

When TypeScript compiles code, it transforms modern JavaScript features to be compatible with older runtimes based on your target configuration. These tests specifically need to verify functionality with newer syntax and features preserved exactly as written.

By isolating these tests in this directory, we can configure TypeScript to:
- Skip downleveling of modern JavaScript syntax
- Preserve newer language features
- Test functionality as it would appear in modern environments

## Usage

Tests in this directory should specifically target functionality that depends on ESNext features. Regular tests should be placed in standard test directories.
