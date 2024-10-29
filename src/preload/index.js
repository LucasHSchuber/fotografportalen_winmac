import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const os = require("os");
const electron = require("electron");
const app = electron.app;
const shell = electron.shell;


// Custom APIs for renderer
const api = {
  
  //TOKEN 
  updateUserToken: (token, user_id) => ipcRenderer.invoke('updateUserToken', token, user_id), 

  //PLTTFORM
  getPlatform: () => os.platform(), //NOT EXIST??
  homeDir: () => os.homedir(),
  shell: () => shell.shell(),
  app: () => app.getVersion(),
  quit: () => ipcRenderer.invoke("quit"),

  //UPDATES TEAMLEADER
  applyUpdates: (downloadUrl) => ipcRenderer.invoke("applyUpdates", downloadUrl),
  getCurrentAppVersion: () => ipcRenderer.invoke('getCurrentAppVersion'), 
  installLatestVersion: (args) => ipcRenderer.invoke('installLatestVersion', args), 

  minimize: () => ipcRenderer.invoke('minimize'), // Minimize The Window
  maximize: () => ipcRenderer.invoke('maximize'), // Maximize The Window

  // TEAMLEADER
  createUser: args => ipcRenderer.invoke('createUser', args),  // create user
  loginUser: args => ipcRenderer.invoke('loginUser', args),  // login user
  getUser: args => ipcRenderer.invoke('getUser', args), // Pass id to getUser 
  getAllUsers: args => ipcRenderer.invoke('getAllUsers', args), // getAllUsers 
  editUser: args => ipcRenderer.invoke('editUser', args), // Edit user

  create_Projects: projects => ipcRenderer.invoke('create_Projects', projects), // Database Call For Create Project
  get_Projects: (user_lang) => ipcRenderer.invoke('get_Projects', user_lang), // Pass workname to getUser handler in main process

  create_news: news => ipcRenderer.invoke('create_news', news), // Database Call For Create News
  get_news: (args) => ipcRenderer.invoke('get_news', args), // Database Call For Get News
  confirmNewsToSqlite: (news_id) => ipcRenderer.invoke('confirmNewsToSqlite', news_id), // Database Call For Confriming News
  getAllUnsentNews: () => ipcRenderer.invoke('getAllUnsentNews'), // Database Call For getting all unsent news from news table
  addSentDateToNews: (news_id) => ipcRenderer.invoke('addSentDateToNews', news_id), // Database Call For adding is_sent_date in News table

  checkProjectExists: (project_uuid, user_id) => ipcRenderer.invoke('checkProjectExists', project_uuid, user_id), // Database Call For Checking if Project Exists
  createNewProject: args => ipcRenderer.invoke('createNewProject', args), // Database Call For Create new Project
  getLatestProject: (user_id, project_uuid) => ipcRenderer.invoke('getLatestProject', user_id, project_uuid), // Pass workname to getUser handler in main process
  getAllProjects: (user_id) => ipcRenderer.invoke('getAllProjects', user_id), // Pass user_id to get all projects by user
  getAllCurrentProjects: (user_id) => ipcRenderer.invoke('getAllCurrentProjects', user_id), // Pass user_id to get all projects by user
  getAllPreviousProjects: (user_id) => ipcRenderer.invoke('getAllPreviousProjects', user_id), // Pass user_id to get all projects by user
  getAllPreviousProjectsBySearch: (user_id, searchString) => ipcRenderer.invoke('getAllPreviousProjectsBySearch', user_id, searchString), // Pass user_id and searchStringto get all projects by user and by search
  getProjectById: (project_id) => ipcRenderer.invoke('getProjectById', project_id), // Pass project_id to get projects by project_id
  deleteProject: (project_id) => ipcRenderer.invoke('deleteProject', project_id), // Pass project_id to delete projects by project_id
  sendProjectToDb: (project_id, alertSale, responseId) => ipcRenderer.invoke('sendProjectToDb', project_id, alertSale, responseId), // Pass project_id to sned project to DB

  createNewClass: args => ipcRenderer.invoke('createNewClass', args), // Database Call For Create new Class

  getTeamsByProjectId: (project_id) => ipcRenderer.invoke('getTeamsByProjectId', project_id), // Pass project_id to get teams by project_id
  createNewTeam: args => ipcRenderer.invoke('createNewTeam', args), // Database Call For Create new Team
  addDataToTeam: args => ipcRenderer.invoke('addDataToTeam', args), // Database Call For adding data to Team
  addTeamDataToTeam: args => ipcRenderer.invoke('addTeamDataToTeam', args), // Database Call For adding MORE data to Team
  getTeam: (team_id) => ipcRenderer.invoke('getTeam', team_id), // Pass team_id to get team by team_id
  deleteTeam: (team_id) => ipcRenderer.invoke('deleteTeam', team_id), // Pass team_id to delete team by team_id
  editTeam: (args) => ipcRenderer.invoke('editTeam', args), // Pass args to edit team by team_id

  addAnomalyToProject: args => ipcRenderer.invoke('addAnomalyToProject', args), // Database Call For adding anomaly data to Project

  getProjectsAndTeamsByUserId: (user_id) => ipcRenderer.invoke('getProjectsAndTeamsByUserId', user_id), // Pass user_id to get all projects and teams by user

  gdprProtection: () => ipcRenderer.invoke('gdprProtection'), // gdpr protection - protecting data
  gdprProtection_teamshistory: () => ipcRenderer.invoke('gdprProtection_teamshistory'), // gdpr protection - protecting data in teams_history table

  createLoginWindow: (args) => ipcRenderer.invoke('createLoginWindow', args), // create login window
  createMainWindow: (args) => ipcRenderer.invoke('createMainWindow', args), // create main window
  createNewuserWindow: () => ipcRenderer.invoke('createNewuserWindow'), // NOT EXISTS??? create main window
  createKnowledgebaseWindow: (url) => ipcRenderer.invoke('createknowledgebasewindow', url), // create knowledgebase window
  
  downloadKnowledgebaseFile: (filepath, filename) => ipcRenderer.invoke('downloadKnowledgebaseFile', filepath, filename), // download knowledgebase file
  getKnowledgebaseArticles: (user_lang) => ipcRenderer.invoke('getKnowledgebaseArticles', user_lang), // get all articles in knowledgebase table based on user language
  createKnowledgebaseArticles: data => ipcRenderer.invoke('createKnowledgebaseArticles', data), // Database Call For Create articles for knowledge base



  // FILETRANSFER
  uploadFile: (filePath, lang, filesize) => ipcRenderer.invoke('uploadFile', filePath, lang, filesize),
  createNewFTProject: (data) => ipcRenderer.invoke('createNewFTProject', data),
  addFTFile: (fileData) => ipcRenderer.invoke('addFTFile', fileData),
  getAllFTData: (user_id) => ipcRenderer.invoke('getAllFTData', user_id), // Pass user_id to get all FT projects and files by user
  getAllFTDataBySearch: (user_id ,searchString) => ipcRenderer.invoke('getAllFTDataBySearch', user_id, searchString), // Pass user_id to get all FT projects and files by user and search

  
  // TIME REPORT
  getAllTimereports: (user_id) => ipcRenderer.invoke('getAllTimereports', user_id), // Pass user_id to get all Timereport data
  getProjectsAndTimereport: (args) => ipcRenderer.invoke('getProjectsAndTimereport', args), // Pass user_id to get all Timereport data
  markActivityAsCompleted: (data) => ipcRenderer.invoke('markActivityAsCompleted', data),





  // navigateBack: () => ipcRenderer.send('navigateBack'), // Send a message to Electron's main process to navigate back
  // createUserToComp: args => ipcRenderer.invoke('createUserToComp', args), // Database Call For Create User
  // createUser: args => ipcRenderer.invoke('createUser', args), // Database Call For Create User
  // getUsers: () => ipcRenderer.invoke('getUsers'),
  // getUser: (workname) => ipcRenderer.invoke('getUser', workname), // Pass workname to getUser handler in main process
  // createGroup: args => ipcRenderer.invoke('createGroup', args), // Database Call For Create Group
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
