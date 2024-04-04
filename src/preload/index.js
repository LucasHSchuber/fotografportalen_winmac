import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const os = require("os");


// Custom APIs for renderer
const api = {

  homeDir: () => os.homedir(),

  minimize: () => ipcRenderer.invoke('minimize'), // Minimize The Window
  maximize: () => ipcRenderer.invoke('maximize'), // Maximize The Window

  getUser: (id) => ipcRenderer.invoke('getUser', id), // Pass id to getUser handler in main process

  create_Projects: projects => ipcRenderer.invoke('create_Projects', projects), // Database Call For Create Project
  get_Projects: (user_lang) => ipcRenderer.invoke('get_Projects', user_lang), // Pass workname to getUser handler in main process

  checkProjectExists: (project_uuid) => ipcRenderer.invoke('checkProjectExists', project_uuid), // Database Call For Checking if Project Exists
  createNewProject: args => ipcRenderer.invoke('createNewProject', args), // Database Call For Create new Project
  getLatestProject: (project_uuid) => ipcRenderer.invoke('getLatestProject', project_uuid), // Pass workname to getUser handler in main process

  getAllProjects: (user_id) => ipcRenderer.invoke('getAllProjects', user_id), // Pass user_id to get all projects by user






  createUserToComp: args => ipcRenderer.invoke('createUserToComp', args), // Database Call For Create User
  createUser: args => ipcRenderer.invoke('createUser', args), // Database Call For Create User
  // getUsers: () => ipcRenderer.invoke('getUsers'),
  // getUser: (workname) => ipcRenderer.invoke('getUser', workname), // Pass workname to getUser handler in main process
  createGroup: args => ipcRenderer.invoke('createGroup', args), // Database Call For Create Group
  createNewWindow: (args) => ipcRenderer.invoke('createNewWindow', args), // open new window

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
