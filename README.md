# Extension Import Steps.
1) go to chrome extension page (chrome://extensions/). Enable Developer mode.
2) Click Load unpacked and select the location of the folder 'ChromeAutofill' from the downloaded repository.

This should successfully import the extension in Chrome.


# Running WebFormsProject and Running Logger server
1) Download and install Nodejs in the system (https://nodejs.org/en/). The node package manager (npm) should install by default with Nodejs.
2) In terminal check, if npm installed in the path or not with the following command: npm -v
3) If npm is present then open terminal under folder path 'WebFormsProject' and run 'npm install'. This should create two folders 'dist' and 'node_modules'.
4) run 'npm run dev'. This should start the web application in the localhost and on port 4200. (http://localhost:4200/) And the backend python logger server on port 8080 (make sure Python is installed in the system and present in path variable).
