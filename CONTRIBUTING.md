## Contributing

Welcome and thank you for your interest in contributing to Grunt Plugins.

If making a large change we request that you open an [issue][GitHubIssue] first.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

[ContribGuide]: https://github.com/nevware21/grunt-plugins/blob/main/CONTRIBUTING.md
[GitHubIssue]: https://github.com/nevware21/grunt-plugins/issues

## Clone and setup

1. Clone the repository and create a new branch
2. Install all dependencies
	```
	npm install -g @microsoft/rush
	npm install
	```
    > Note: The initial ```npm install``` may fail due to SHA-256 signatures, this is because the shrink-wrap is reference local versions that got checked in, to resolve run ```rush update --recheck --purge --full``` to cause the re-linking of the local build -- future ```npm install``` should now work.

3. Navigate to the root folder and update rush dependencies
	```
	rush update
	```
4. Build
	```
	rush build
	```
5. Run Tests  (Currently not working)
    ```
	npm run test
    ```

## Build and test

The root folder contains 8 packages that are components of this next version of the SDK. When making changes in multiple packages, you can build using the following commands in root folder:

1. rush rebuild --verbose

    This will build all packages in order of dependencies. If there are build errors, verbose options is required to view error details.

2. npm run test (TBD)

    This will run tests in all packages.

If you are changing package versions or adding/removing any package dependencies, run> **rush update --purge --recheck --full** or **npm run rupdate** before building. Please check-in any files that change under common\ folder.
