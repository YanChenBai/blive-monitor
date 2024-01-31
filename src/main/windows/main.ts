import { shell, app } from 'electron'
import { join } from 'path'
import icon from '../../../resources/icon.png?asset'
import { BliveService } from '../services/blive.service'
import { Room } from '../types/window'
import { LiveRoomWindow } from '../utils/liveRoomWindow'
import { insertCSS } from './css'

export async function mainWindow(room: Room) {
  const window = new LiveRoomWindow(room, {
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  window.webContents.insertCSS(insertCSS)

  window.on('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    window.loadURL(`https://live.bilibili.com/732?winId=${window.id}`)
  }

  new BliveService(window)

  return window
}
