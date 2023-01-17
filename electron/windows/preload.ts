import { generateContextBridge } from "@el3um4s/ipc-for-electron";

declare global {
  interface Window { ipcRenderer: Electron.IpcRenderer; }
}

window.ipcRenderer = require('electron').ipcRenderer;

