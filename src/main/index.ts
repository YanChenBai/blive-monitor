import { BrowserWindow, app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { mainWindow } from './windows/main'

async function bootstrap() {
  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.byc.blive')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    mainWindow()

    app.on('activate', function () {
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
