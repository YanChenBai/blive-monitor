import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import { PLUGIN_PATH } from '../../utils/paths'

export default async function () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    transparent: false,
    frame: true,
    show: true,
    backgroundColor: '#101014',
    webPreferences: {
      preload: PLUGIN_PATH
    }
  })

  win.webContents.openDevTools({
    mode: 'detach',
    activate: true
  })

  win.loadURL('https://live.bilibili.com/732')

  Menu.setApplicationMenu(null)
  return win
}
