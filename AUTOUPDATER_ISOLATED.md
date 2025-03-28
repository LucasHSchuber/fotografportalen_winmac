### ISOLATED
### Guide to try autoupdater in isolated environment.

### Steps:
#### 1. Run "node local-server.js" to start the local server on port 3000
#### 2. Change "version" in package.json to a newer one than the one you have installed on your computer (make sure the installed appplication version is built in development mode - with env.js variable "const production = false;").
#### 4. Run "npm run build:win:test" (the update files will be located in dist folder, and server will look for those when later updating the application). Make sure the package.json version is greater than your installed application.
#### 5. Start the installed application. If installation files is located in dist folder, and server is running on port 3000, then the autoupdater should find the files and run an update of the application locally.