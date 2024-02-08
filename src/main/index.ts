import 'dotenv/config'
import { BrowserWindow, app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { mainWindow } from './windows/main'
import { bliveWindow } from './windows/blive'

let win: BrowserWindow | null

const mockRoom = {
  uid: '194484313',
  roomId: '6154037', // 房间id
  shortId: '732', // 房间短号, 没有时为0
  name: '鹿瑶Clover_桃桃冠', // 主播名字
  face: 'https://i1.hdslb.com/bfs/face/599178b1ec42a679096517f7130c6873db9aedfb.jpg@100w_100h.webp', // 头像
  liveStatus: 2, // 直播状态, 0 下播, 1 直播, 2 轮播
  tags: 'zhuzhu', // 主播的标签
  title: '直播标题', // 直播标题
  medalName: 'aski', // 粉丝牌名字
  keyframe:
    'https://i1.hdslb.com/bfs/face/6741c2cd6a9983a1d4dfa3ff690a8b9d5ae127b5.jpg@100w_100h.webp' // 封面
}
async function startMainWindow() {
  if (win) {
    win.show()
  } else {
    win = await mainWindow()
  }
}
async function bootstrap() {
  app.whenReady().then(() => {
    app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
    app.commandLine.appendArgument('--headless')
    app.commandLine.appendSwitch('--log-level', '3')
    electronApp.setAppUserModelId('com.byc.blive')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    bliveWindow(mockRoom)
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
}

bootstrap()
