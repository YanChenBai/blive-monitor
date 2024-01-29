import { BrowserWindow, app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { mainWindow } from './windows/main'

async function bootstrap() {
  app.whenReady().then(() => {
    app.commandLine.appendSwitch('ignore-certificate-errors')
    electronApp.setAppUserModelId('com.byc.blive')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    mainWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) mainWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

bootstrap()
