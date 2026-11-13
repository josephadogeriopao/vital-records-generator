"use strict";
const electron = require("electron");
const node_path = require("node:path");
const promises = require("node:fs/promises");
const utils = require("@electron-toolkit/utils");
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
async function readStore(directory2) {
  try {
    const value = JSON.parse(await promises.readFile(node_path.join(directory2, "activity-v2.json"), "utf8"));
    return {
      recent: Array.isArray(value.recent) ? value.recent.slice(0, 10) : [],
      activity: Array.isArray(value.activity) ? value.activity.slice(0, 200) : []
    };
  } catch {
    return { recent: [], activity: [] };
  }
}
let pending = Promise.resolve();
function updateStore(directory2, update) {
  const next = pending.then(async () => {
    const store = await readStore(directory2);
    update(store);
    await promises.mkdir(directory2, { recursive: true });
    const temporary = node_path.join(directory2, "activity-v2.tmp");
    await promises.writeFile(temporary, JSON.stringify(store), { mode: 384 });
    await promises.rename(temporary, node_path.join(directory2, "activity-v2.json"));
  });
  pending = next.catch(() => {
  });
  return next;
}
async function removeRecentFile(directory2, path) {
  if (typeof path !== "string" || !path || path.length > 32768) throw new Error("Invalid history file.");
  let recent = [];
  await updateStore(directory2, (store) => {
    store.recent = store.recent.filter((file) => file.path !== path);
    recent = store.recent;
  });
  return recent;
}
async function clearRecentFiles(directory2) {
  await updateStore(directory2, (store) => {
    store.recent = [];
  });
  return [];
}
const formats = ["xlsx", "csv", "json", "pdf"];
const directory = () => electron.app.getPath("userData");
async function rememberFiles(files) {
  await updateStore(directory(), (store) => {
    files.forEach((file) => {
      store.recent = [
        { path: file.path, name: file.name, importedAt: (/* @__PURE__ */ new Date()).toISOString() },
        ...store.recent.filter((r) => r.path !== file.path)
      ].slice(0, 10);
    });
  });
}
async function readInput(path) {
  if (![".txt", ".csv"].includes(node_path.extname(path).toLowerCase())) {
    throw new Error("Only TXT and CSV files are supported.");
  }
  if ((await promises.stat(path)).size > 25 * 1024 * 1024) {
    throw new Error(`${node_path.basename(path)} exceeds the 25 MB file limit.`);
  }
  return { path, name: node_path.basename(path), text: await promises.readFile(path, "utf8") };
}
function registerIPC() {
  electron.ipcMain.handle(channels.open, async (event) => {
    const window = electron.BrowserWindow.fromWebContents(event.sender);
    if (!window) return [];
    const result = await electron.dialog.showOpenDialog(window, {
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Vital record files", extensions: ["txt", "csv"] }]
    });
    if (result.canceled) return [];
    const files = await Promise.all(result.filePaths.map(readInput));
    await rememberFiles(files);
    return files;
  });
  electron.ipcMain.handle(channels.dropped, async (_event, paths) => {
    if (!Array.isArray(paths) || paths.length > 100 || !paths.every((path) => typeof path === "string" && path.length > 0)) {
      throw new Error("Invalid dropped files.");
    }
    const files = await Promise.all(paths.map(readInput));
    await rememberFiles(files);
    return files;
  });
  electron.ipcMain.handle(channels.recent, async () => (await readStore(directory())).recent);
  electron.ipcMain.handle(channels.removeRecent, async (_event, path) => removeRecentFile(directory(), path));
  electron.ipcMain.handle(channels.clearRecent, async () => clearRecentFiles(directory()));
  electron.ipcMain.handle(channels.reload, async (_event, path) => {
    const store = await readStore(directory());
    if (typeof path !== "string" || !store.recent.some((r) => r.path === path)) {
      throw new Error("File is not in recent history.");
    }
    return readInput(path);
  });
  electron.ipcMain.handle(channels.activity, async () => (await readStore(directory())).activity);
  electron.ipcMain.handle(channels.log, async (_event, action, detail) => {
    if (typeof action !== "string" || typeof detail !== "string" || action.length > 80 || detail.length > 500) {
      throw new Error("Invalid activity entry.");
    }
    await updateStore(directory(), (store) => {
      store.activity = [{ at: (/* @__PURE__ */ new Date()).toISOString(), action, detail }, ...store.activity].slice(0, 200);
    });
  });
  electron.ipcMain.handle(channels.save, async (event, name, format, bytes) => {
    if (typeof name !== "string" || !formats.includes(format) || !Array.isArray(bytes) || bytes.length > 100 * 1024 * 1024 || !bytes.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) {
      throw new Error("Invalid export payload.");
    }
    const window = electron.BrowserWindow.fromWebContents(event.sender);
    if (!window) return false;
    const result = await electron.dialog.showSaveDialog(window, {
      defaultPath: `${node_path.basename(name).replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")}.${format}`,
      filters: [{ name: String(format).toUpperCase(), extensions: [String(format)] }]
    });
    if (result.canceled || !result.filePath) return false;
    await promises.writeFile(result.filePath, Buffer.from(bytes));
    return true;
  });
}
function createWindow() {
  const { width: screenWidth, height: screenHeight } = electron.screen.getPrimaryDisplay().workAreaSize;
  const appIcon = process.platform === "win32" ? node_path.join(__dirname, "../../resources/icon.ico") : node_path.join(__dirname, "../../resources/logo.png");
  const mainWindow = new electron.BrowserWindow({
    width: Math.min(1e3, screenWidth),
    height: Math.min(800, screenHeight),
    minWidth: 600,
    minHeight: 500,
    maxWidth: Math.round(screenWidth / 1.5),
    maxHeight: screenHeight,
    center: true,
    // Set resizable: false if you want to lock the window size like your old version
    resizable: true,
    icon: appIcon,
    webPreferences: {
      preload: node_path.join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.split("#")[0] !== mainWindow.webContents.getURL().split("#")[0]) event.preventDefault();
  });
  const command = (value) => mainWindow.webContents.send(channels.command, value);
  electron.Menu.setApplicationMenu(
    electron.Menu.buildFromTemplate([
      ...process.platform === "darwin" ? [{ label: electron.app.name, submenu: [{ role: "about" }, { role: "quit" }] }] : [],
      {
        label: "File",
        submenu: [
          { label: "Open records…", accelerator: "CmdOrCtrl+O", click: () => command("open") },
          { label: "Export Excel…", accelerator: "CmdOrCtrl+S", click: () => command("export") },
          { type: "separator" },
          { role: "quit" }
        ]
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectAll" },
          { label: "Find records", accelerator: "CmdOrCtrl+F", click: () => command("search") }
        ]
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "toggleDevTools" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" }
        ]
      }
    ])
  );
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.center();
  } else {
    mainWindow.loadFile(node_path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.josephadogeri.vitalrecords");
  electron.ipcMain.handle("get-app-version", () => electron.app.getVersion());
  registerIPC();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
