// Ensures TypeScript knows about the API exposed by the preload script
export interface IElectronAPI {
  openDirectory: () => Promise<string | undefined>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}