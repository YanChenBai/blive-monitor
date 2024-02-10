import 'dotenv/config'
import { BrowserWindow, app } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
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
  // 当运行第二个实例时，将焦点聚焦到主窗口
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // 窗口全部关闭时退出主进程
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  new MainHandle()
  new BliveHandle()

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
} else {
  app.quit()
}
