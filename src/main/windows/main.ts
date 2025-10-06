import path, { join } from 'node:path'
import { getMainWindowConfig, updateMainWindowConfig } from '@main/utils/lowdb'
import { serverBootstrap } from '@main/utils/server'
import { app, BrowserWindow, shell } from 'electron'
import icon from '../../../resources/icon.ico?asset'

export async function mainWindow() {
  const config = getMainWindowConfig()

  const window = new BrowserWindow({
    width: 360,
    height: 600,
    resizable: false,
    show: false,
    icon,
    frame: false,
    backgroundColor: '#000',
    webPreferences: {
      preload: join(__dirname, '../preload/main.mjs'),
      contextIsolation: false,
      nodeIntegration: true,
      spellcheck: false,
    },
  })

  window.once('ready-to-show', () => {
    window.show()
    // 初始化位置

    if (config.x !== undefined && config.y !== undefined) {
      window.setPosition(config.x, config.y)
    }
  })

  if (app.isPackaged) {
    window.loadFile(path.join(__dirname, '../', 'renderer/index.html'))
  }
  else {
    window.loadURL('http://localhost:5173')
  }

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  window.on('close', () => {
    const { x, y, width, height } = window.getBounds()
    updateMainWindowConfig({
      x,
      y,
      width,
      height,
    })
    app.quit()
  })

  serverBootstrap()

  return window
}
