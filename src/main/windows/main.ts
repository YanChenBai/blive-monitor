import { BrowserWindow, shell, app, ipcMain } from 'electron'
import { join } from 'path'
import icon from '../../../resources/icon.png?asset'
import { MessageChannel } from '../utils/messageChannel'
export async function mainWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  window.on('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    window.loadURL('https://live.bilibili.com/23369901')
    // window.loadURL('http://localhost:5173')
  }

  ipcMain.handle('GetWinid', () => window.id)
  const msgChannel = new MessageChannel(window)

  msgChannel.registerHandler('openExternal', (_e, url: string) => shell.openExternal(url))

  return window
}
