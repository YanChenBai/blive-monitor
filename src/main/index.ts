import 'dotenv/config'
import 'reflect-metadata'
import process from 'node:process'
import type { BrowserWindow } from 'electron'
import { app } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import { MainHandle } from '@main/handles/mainHandle'
import { mainWindow } from './windows/main'
import { BliveHandle } from './handles/bliveHandle'
import { initPath } from './utils/paths'
import { getLocalIP } from './utils/getLocalIP'

getLocalIP()
initPath()
let win: BrowserWindow | null
async function startMainWindow() {
  if (win) {
    win.show()
  }
  else {
    win = await mainWindow()
  }
}

function initHandle() {
  return [
    new MainHandle(),
    new BliveHandle(),
  ]
}
async function bootstrap() {
  // 当运行第二个实例时，将焦点聚焦到主窗口
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized())
        win.restore()
      win.focus()
    }
  })

  // 窗口全部关闭时退出主进程
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  initHandle()

  app.whenReady().then(() => {
    app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
    app.commandLine.appendArgument('--headless')
    app.commandLine.appendSwitch('--log-level', '3')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    startMainWindow()
  })
}

if (app.requestSingleInstanceLock()) {
  bootstrap()
}
else {
  app.quit()
}
