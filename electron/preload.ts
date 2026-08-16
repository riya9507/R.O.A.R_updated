import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("roar", {
  selectIngestFolder: (): Promise<string | null> =>
    ipcRenderer.invoke("roar:selectIngestFolder"),
  startRun: (folderPath: string): Promise<{ started: boolean; folderPath: string }> =>
    ipcRenderer.invoke("roar:startRun", folderPath),
});
