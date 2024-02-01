import { shell, app } from 'electron'
import { join } from 'path'
import { Room } from '@main/types/window'
import { LiveRoomWindow } from '@main/utils/liveRoomWindow'
import { BliveHandle } from './../handles/bliveHandle'
import { insertCSS } from './css'

import icon from '../../../resources/icon.png?asset'

export async function bliveWindow(room: Room) {
  const window = new LiveRoomWindow(room, {
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/blive.mjs'),
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
    window.loadURL(`https://live.bilibili.com/31843613?winId=${window.id}`)
  }

  new BliveHandle(window)

  return window
}