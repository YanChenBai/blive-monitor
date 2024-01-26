import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    getWinid: () => Promise<string>
    electron: ElectronAPI
    blive: unknown
  }
}

export {}
