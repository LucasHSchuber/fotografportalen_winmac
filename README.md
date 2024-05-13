
## Software - Express bild
## Fotografportal
## Lucas Schuber
## Express Bild Software

## Introduction
Welcome to the Express Bild software repository. This software is designed to centralize and streamline the workflow for employees at Express Bild. By providing a suite of programs, the software aims to digitalize and organize their work, making it easier for them to upload completed work files and collaborate effectively.

## Overview
The Express Bild software consists of multiple programs integrated into a single platform. These programs are designed to cater to different aspects of the company's workflow, including project management, team collaboration, and file management.

## Software Description
The software includes an integrated SQLITE database to store and manage essential data related to projects, teams, and users. With the help of this database, users can access, update, and organize their work efficiently. The software also offers features such as user authentication, project tracking, and team communication to enhance productivity and collaboration.

## Database Description
The SQLITE database used in the software comprises several tables, each serving a specific purpose:
- **Users:** Stores information about users, including their email, name, password, and other relevant details.
- **_Projects:** Contains data related to projects, such as project UUID, name, start date, and language.
- **Projects:** Stores detailed information about each project, including project UUID, project name, photographer name, project date, type, and other project-specific details.
- **Teams:** Stores data about teams, including team name, leader information, team size, and other relevant details.
- **Teams_history:** Keeps track of historical data related to teams, allowing users to view past team configurations and changes.

## Run software locally
To run the software on your local machine, follow these steps:
1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run the command `npm install` to download all necessary npm packages.
4. Once the installation is complete, run the command `npm run dev` to start the application in development mode.

## Installation Instructions
To install and run the software, follow these steps:
1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run the command `npm install` to download all necessary npm packages.
4. Once the installation is complete, run the command `npm run build:mac`, or `npm run build:win` or `npm run build:lin` dependning on what operative system you are on.
5. Navigate to dist folder in the project and instal the installation file located in the mac, win, or lin folder.
6. Start the software 

## Usage
Once the software is installed and running, users can access its features through an intuitive user interface if the user has valid credentials to access your account which is given by Express-bild. Here are some common tasks you can perform with the software:
- Log in with your credentials to access your account.
- Create, edit, or delete projects and teams.
- Upload, download, or delete files associated with projects.
- Communicate with team members via built-in messaging or collaboration tools.
- Track project progress and monitor team performance.

## Log in information
If you dont have any valid log in credentials but still want to access the user interface and try the application, you can use following user log in:
- Email: lucas1@gmail.com  
- Password: test1
(Last updated: 8 of May, 2024)  

Feel free to explore the software and discover its full range of features and capabilities!!

