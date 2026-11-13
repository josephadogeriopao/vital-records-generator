"use strict";
const electron = require("electron");
const channels = {
  open: "records:open",
  dropped: "records:dropped",
  recent: "records:recent",
  reload: "records:reload",
  removeRecent: "records:remove-recent",
  clearRecent: "records:clear-recent",
  save: "records:save",
  activity: "records:activity",
  log: "records:log",
  command: "records:command"
};
const api = {
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  openFiles: () => electron.ipcRenderer.invoke(channels.open),
  openDroppedFiles: (files) => electron.ipcRenderer.invoke(channels.dropped, files.map((file) => electron.webUtils.getPathForFile(file))),
  recentFiles: () => electron.ipcRenderer.invoke(channels.recent),
  reloadFile: (path) => electron.ipcRenderer.invoke(channels.reload, path),
  removeRecentFile: (path) => electron.ipcRenderer.invoke(channels.removeRecent, path),
  clearRecentFiles: () => electron.ipcRenderer.invoke(channels.clearRecent),
  saveFile: (name, format, bytes) => electron.ipcRenderer.invoke(channels.save, name, format, bytes),
  activity: () => electron.ipcRenderer.invoke(channels.activity),
  logActivity: (action, detail) => electron.ipcRenderer.invoke(channels.log, action, detail),
  onCommand: (callback) => {
    const handler = (_event, command) => callback(command);
    electron.ipcRenderer.on(channels.command, handler);
    return () => {
      electron.ipcRenderer.removeListener(channels.command, handler);
    };
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
