import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";

const isDev = !app.isPackaged;

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#0D1310",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    // No network access at runtime — load the built renderer from disk.
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// Native directory picker so field staff can point the app at the raw
// SD card dump exactly as it comes off the camera — no pre-sorting.
ipcMain.handle("roar:selectIngestFolder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select raw camera trap folder",
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// Placeholder for the local processing pipeline. In production this
// should spawn/call the local Python (FastAPI or subprocess) service
// that does blank filtering, stripe-pattern matching, etc., all on
// localhost with no external network call.
ipcMain.handle("roar:startRun", async (_event, folderPath: string) => {
  return { started: true, folderPath };
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
