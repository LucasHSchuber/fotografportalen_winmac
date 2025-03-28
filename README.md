
## Software - Express Bild
## Photographer Portal
## Programmer - Lucas Schuber

## Introduction
Welcome to the Express Bild software repository. This software is designed to centralize and streamline the workflow for employees at Express Bild. 

## Overview
This is an Express Bild software currently consists of three programs integrated into this desktop platform.
1. Workspace
2. Filetransfer
3. Time Report
4. Backuptransfer
These programs are designed to digitalize and streamline photographer work into a single centralized platform.

## Software Description
The software includes an integrated SQLITE database with several tablea to store and manage essential data related to photo sessions, file uploads and reporting time.

## Database Description
The SQLITE database used in the software comprises several tables, each serving a specific purpose:
- **users:** Stores information about users
- **_projects:** Contains projects/jobs fetched from the company database and stored in this table locally for user to being able to see the projects/jobs even when offline.
- **projects:** Stores detailed information about each project
- **teams:** Stores data about teams, including team name, leader information, team size, and other relevant details.
- **teams_history:** Keeps track of historical data related to teams, allowing users to view past team configurations and changes.
- **ft_projects:** Tracks projects that have files thats's been uploaded to the FTP server
- **ft_files:** A table that stores all files that have been uploading to the FTP server for each corresponding table.
- **bt_projects:** Tracks projects that have files thats's been uploaded in backuptransfer program
- **bt_files:** A table that stores all files that have been uploaded in backuptransfer program
- **news:** Manages news entries, including their content and read status.
- **knowledgebase:** Stores different kind of files (e.g. .pdf) for user to open and download in the application in offline mode.
- **timereport:** Logs time reports for projects, including details on start and end times, expenses, and user association.
- **schema_version:** Tracks database schema versions and their application timestamps fot the autoupdater to keep track of which updates have be applied to the database and not.


## Run software locally
To run the software on your local machine, follow these steps:
1. Clone this repository 
2. Navigate to the project directory
3. Run the command `npm install` to download all necessary npm packages.
4. Once the installation is complete, run the command `npm run dev` to start the application in development mode.

## Secret files:
- .env (in root) containg github token (_token_) and github url (https://api.github.com/repos/LucasHSchuber/fotografportalen_winmac/releases)
 - env.js (in /src/renderer/src/assets/js/)



