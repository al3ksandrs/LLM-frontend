import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for the renderer
const electronAPI = {
  openDirectory: (): Promise<string | undefined> => ipcRenderer.invoke('dialog:openDirectory')
}

// Use `contextBridge` to expose the API to the renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electronAPI = electronAPI
}