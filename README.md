
## Software - Express Bild
## Fotografportal
## Programmer - Lucas Schuber
## Express Bild Software

## Introduction
Welcome to the Express Bild software repository. This software is designed to centralize and streamline the workflow for employees at Express Bild. 

## Overview
This is an Express Bild software currently consists of three programs integrated into this desktop platform.
1. Teamleader
2. Filetransfer
3. Time Report. A program where users can report their worked time and correlating data
These programs are designed to digitalize and streamline photographer work into a single centralized platform.

## Software Description
The software includes an integrated SQLITE database with several tablea to store and manage essential data related to photo sessions, file uploads and reporting time.

## Database Description
The SQLITE database used in the software comprises several tables, each serving a specific purpose:
- **Users:** Stores information about users, including their email, name, password, and other relevant details.
- **_Projects:** Contains data related to projects, such as project UUID, name, start date, and language.
- **Projects:** Stores detailed information about each project, including project UUID, project name, photographer name, project date, type, and other project-specific details.
- **Teams:** Stores data about teams, including team name, leader information, team size, and other relevant details.
- **Teams_history:** Keeps track of historical data related to teams, allowing users to view past team configurations and changes.

## Run software locally
To run the software on your local machine, follow these steps:
1. Clone this repository 
2. Navigate to the project directory
3. Run the command `npm install` to download all necessary npm packages.
4. Once the installation is complete, run the command `npm run dev` to start the application in development mode.

## Secret files:
- .env (in root) containg github token (_token_) and github url (https://api.github.com/repos/LucasHSchuber/fotografportalen_winmac/releases)
 - env.js (in /src/renderer/src/assets/js/)


