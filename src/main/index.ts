import 'dotenv/config'
import { BrowserWindow, app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { mainWindow } from './windows/main'
import { MainHandle } from '@main/handles/mainHandle'
import { BliveHandle } from './handles/bliveHandle'
import { initPath } from './utils/paths'

initPath()
let win: BrowserWindow | null
async function startMainWindow() {
  if (win) {
    win.show()
  } else {
    win = await mainWindow()
  }
}
async function bootstrap() {
  // 防止运行错误无法正常退出
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    process.exit(1)
  })

  app.whenReady().then(() => {
    app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
    app.commandLine.appendArgument('--headless')
    app.commandLine.appendSwitch('--log-level', '3')
    electronApp.setAppUserModelId('com.byc.blive')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    startMainWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) startMainWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // 获取id
  ipcMain.handle('getWinId', (event) => event.sender.id)
  new MainHandle()
  new BliveHandle()
}

bootstrap()
