import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const os = require("os");


// Custom APIs for renderer
const api = {

  homeDir: () => os.homedir(),

  minimize: () => ipcRenderer.invoke('minimize'), // Minimize The Window
  maximize: () => ipcRenderer.invoke('maximize'), // Maximize The Window

  createUser: args => ipcRenderer.invoke('createUser', args), // Database Call For Create User
  createUserToComp: args => ipcRenderer.invoke('createUserToComp', args), // Database Call For Create User

  getUsers: () => ipcRenderer.invoke('getUsers'),
  getUser: (workname) => ipcRenderer.invoke('getUser', workname), // Pass workname to getUser handler in main process

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
