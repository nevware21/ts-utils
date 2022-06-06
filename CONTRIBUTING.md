## Contributing

Welcome and thank you for your interest in contributing to Grunt Plugins.

If making a large change we request that you open an [issue][GitHubIssue] first.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

[ContribGuide]: https://github.com/nevware21/ts-utils/blob/main/CONTRIBUTING.md
[GitHubIssue]: https://github.com/nevware21/ts-utils/issues

## Clone and setup

1. Clone the repository and create a new branch
	```
	git clone https://github.com/nevware21/ts-utils.git
	```

2. Install all dependencies
	```
	npm install
	```

3. Build
	```
	npm run rebuild
	```

4. Run Tests  (Currently not working)
    ```
	npm run test
    ```

5. Generate typedoc
	```
	npm run docs
	```

6. Debugging failing tests in a browser

This runs karma in "watch" mode to avoid the browser automatically closing, to debug process the Debug button in the corner.

As this uses watch mode you can also just leave this running as you make code changes, however, if there is a compile error this can cause the browser to be closed.

Terminating the debug session can require several CTRL-C's in the terminal window used to start the debug session.

	```
	npm run test:debug
	```

By default this is configured to run using chromiumn based Edge, you can change the `process.env.CHROME_BIN = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";` at the top of the `karma.debug.conf.js` file to use a different chromium based browser.


## Build, test and generate typedoc docs

This will build and run all of the tests in node and in headless chromium.

	```
	npm run rebuild
	```


If you are changing package versions or adding/removing any package dependencies, run> **npm install** before building. Please check-in any files that change under docs\ folder.
