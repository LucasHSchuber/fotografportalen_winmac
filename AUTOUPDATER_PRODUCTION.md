### PRODUCTION
### Guide to try autoupdater in production.

### Steps:
#### 1. Change "version" in package.json to a greater version number than prevoius released version
#### 2. Update token in publish section in electron-builder.yml file (after new version later is published remove token to placeholder text to avoid confliction when pushing to git)
#### 4. Set "production" variable in env.js file to TRUE (this make sure that the app-files is published to git and that the uato-updater is scanning github for new releases instead of localhost).
#### 4. Run "npm run build:win" (the update files will be located in dist folder, and published to git together with an app-updater.yml file which is created in the script  create-app-updater-yml.js).
#### 5. Start the installed application on your windows. On start the autoupdater should scan and find the new app-files in git and update the application to the new version.
#### 6. Update token in publish section in electron-builder.yml file to a placeholder text. E.g to "token": (  token: token   )