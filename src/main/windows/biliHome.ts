import { join } from 'path'
import icon from '../../../resources/icon.ico?asset'
import { BrowserWindow } from 'electron'
export async function biliHomeWindew() {
  const window = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    icon,
    frame: true,
    webPreferences: {
      preload: join(__dirname, '../preload/biliHome.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  window.on('ready-to-show', () => window.show())
  window.loadURL(`https://live.bilibili.com`)

  return window
}
