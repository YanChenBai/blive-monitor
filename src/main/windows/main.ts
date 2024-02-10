import { shell, BrowserWindow, app } from 'electron'
import { join } from 'path'
import icon from '../../../resources/icon.ico?asset'
import { getRoomConfig, updateRoomConfig } from '@main/utils/lowdb'
import { RENDER_PATH } from '@main/utils/paths'

const ID = '@main'
export async function mainWindow() {
  const config = getRoomConfig(ID)

  const window = new BrowserWindow({
    width: 400,
    height: 600,
    x: config?.x,
    y: config?.y,
    resizable: false,
    show: false,
    icon,
    frame: false,
    backgroundColor: '#000',
    webPreferences: {
      preload: join(__dirname, '../preload/main.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  window.on('close', () => {
    const { x, y, width, height } = window.getBounds()
    updateRoomConfig({
      roomId: ID,
      x,
      y,
      width,
      height
    })
    app.quit()
  })

  window.loadURL(RENDER_PATH)

  return window
}
