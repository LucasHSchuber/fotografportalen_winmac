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

  //PLATTFORM
  getPlatform: () => os.platform(), //NOT EXIST??
  homeDir: () => os.homedir(),
  shell: () => shell.shell(),
  app: () => app.getVersion(),
  quit: () => ipcRenderer.invoke("quit"),

  // RESTART
  restartApplication: () => ipcRenderer.invoke("restartApplication"),

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

  create_news: (news, user_id) => ipcRenderer.invoke('create_news', news, user_id), // Database Call For Create News
  get_news: user_id => ipcRenderer.invoke('get_news', user_id), // Database Call For Get News
  confirmNewsToSqlite: (news_id, user_id) => ipcRenderer.invoke('confirmNewsToSqlite', news_id, user_id), // Database Call For Confriming News
  getAllUnsentNews: user_id => ipcRenderer.invoke('getAllUnsentNews', user_id), // Database Call For getting all unsent news from news table
  addSentDateToNews: (news_id, user_id) => ipcRenderer.invoke('addSentDateToNews', news_id, user_id), // Database Call For adding is_sent_date in News table

  checkProjectExists: (project_uuid, user_id) => ipcRenderer.invoke('checkProjectExists', project_uuid, user_id), // Database Call For Checking if Project Exists
  createNewProject: args => ipcRenderer.invoke('createNewProject', args), // Database Call For Create new Project
  getLatestProject: (user_id, project_uuid) => ipcRenderer.invoke('getLatestProject', user_id, project_uuid), // Pass workname to getUser handler in main process
  getAllProjects: (user_id) => ipcRenderer.invoke('getAllProjects', user_id), // Pass user_id to get all projects by user
  getAllCurrentProjects: (user_id) => ipcRenderer.invoke('getAllCurrentProjects', user_id), // Pass user_id to get all projects by user
  getAllPreviousProjects: (user_id) => ipcRenderer.invoke('getAllPreviousProjects', user_id), // Pass user_id to get all projects by user
  getAllPreviousProjectsBySearch: (user_id, searchString) => ipcRenderer.invoke('getAllPreviousProjectsBySearch', user_id, searchString), // Pass user_id and searchStringto get all projects by user and by search
  getProjectById: (project_id) => ipcRenderer.invoke('getProjectById', project_id), // Pass project_id to get projects by project_id
  deleteProject: (project_id, user_id) => ipcRenderer.invoke('deleteProject', project_id, user_id), // Pass project_id to delete projects by project_id
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
  
  // downloadKnowledgebaseFile: (filepath, filename) => ipcRenderer.invoke('downloadKnowledgebaseFile', filepath, filename), // download knowledgebase file
  getKnowledgebaseArticles: (user_lang) => ipcRenderer.invoke('getKnowledgebaseArticles', user_lang), // get all articles in knowledgebase table based on user language
  createKnowledgebaseArticles: data => ipcRenderer.invoke('createKnowledgebaseArticles', data), // Database Call For Create articles for knowledge base
  donwloadKnowledgeBaseFiles: data => ipcRenderer.invoke('donwloadKnowledgeBaseFiles', data), // Donwloading files in knowledge base to locale computer
  openLocallyKnowledgeBaseFile: filename => ipcRenderer.invoke('openLocallyKnowledgeBaseFile', filename), // Pass filename to open knowledge base file 
  downloadLocallyKnowledgeBaseFile: filename => ipcRenderer.invoke('downloadLocallyKnowledgeBaseFile', filename), // Pass filename to download knowledge base file 

  // FILETRANSFER
  uploadFile: (filePath, lang, filesize) => ipcRenderer.invoke('uploadFile', filePath, lang, filesize),
  createNewFTProject: (data) => ipcRenderer.invoke('createNewFTProject', data),
  addFTFile: (fileData) => ipcRenderer.invoke('addFTFile', fileData),
  getAllFTData: (user_id) => ipcRenderer.invoke('getAllFTData', user_id), // Pass user_id to get all FT projects and files by user
  getUnsentFTProjects: (user_id) => ipcRenderer.invoke('getUnsentFTProjects', user_id), // Pass user_id to get all unsent Filestransfer projects
  cancelFtpUpload: () => ipcRenderer.invoke('cancelFtpUpload'), // Cancel ftp server upload

  // BACKUPTRANSFER
  uploadFileToTus: (filePath, fileName, projectUuid, token) => ipcRenderer.invoke("uploadFileToTus", { filePath, fileName, projectUuid, token }),
  createNewBTProject: (data) => ipcRenderer.invoke('createNewBTProject', data),
  deleteBTProject: (bt_project_id, user_id) => ipcRenderer.invoke('deleteBTProject', bt_project_id, user_id), // Pass bt_project_id and user_id to delete in bt_projects
  createNewBTFile: (fileData) => ipcRenderer.invoke('createNewBTFile', fileData),
  createNewFailedBTFile: (fileData) => ipcRenderer.invoke('createNewFailedBTFile', fileData),
  getBackuptransferData: (user_id) => ipcRenderer.invoke('getBackuptransferData', user_id),
  cancelTus: () => ipcRenderer.invoke('cancelTus'),

  // TIME REPORT
  getAllTimereports: (user_id) => ipcRenderer.invoke('getAllTimereports', user_id), // Pass user_id to get all Timereport data
  getUnsubmittedTimeReport: (user_id) => ipcRenderer.invoke('getUnsubmittedTimeReport', user_id), // Pass user_id to get all Timereport data where is_sent_permanent = 0
  getLastReportPeriodProjects: (user_id) => ipcRenderer.invoke('getLastReportPeriodProjects', user_id), // Pass user_id to get all projects from last time report period
  markActivityAsCompleted: (data) => ipcRenderer.invoke('markActivityAsCompleted', data), // insert tupple into timereport table with new data
  changeCompleted: (data) => ipcRenderer.invoke('changeCompleted', data), // Pass user_id and project_id to update is_sent in timereport table to 0
  markAsCompletedPermanent: (project_id, user_id) => ipcRenderer.invoke('markAsCompletedPermanent', project_id, user_id), // update is_sent_permantent in timereport table
  deleteTimereportRow: (project_id, user_id) => ipcRenderer.invoke('deleteTimereportRow', { project_id, user_id }),



  on: (channel, callback) => {
    const validChannels = ["upload-progress", "update-not-available", "update-available", "download-progress", "update-downloaded", "update-error", "upload-error", "upload-tus-progress", "success", "upload-canceled"]; 
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  removeAllListeners: (channel) => { ipcRenderer.removeAllListeners(channel);},
}


// Use `contextBridge` APIs to expose Electron APIs to renderer only if context isolation is enabled, otherwise just add to the DOM global.
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
