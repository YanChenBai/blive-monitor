import { shell, app } from 'electron'
import { join } from 'path'
import { Room } from '@main/types/window'
import { LiveRoomWindow, lveRoomWindowMap } from '@main/utils/liveRoomWindow'
import { BliveHandle } from './../handles/bliveHandle'
import { insertCSS } from './css'
import icon from '../../../resources/icon.png?asset'
import { getRoomConfig, updateRoomConfig } from '@main/utils/lowdb'

export const ASPECT_RATIO = {
  RATIO_16_9: 16 / 9,
  RATIO_9_16: 9 / 16
}

export type ASPECT_RATIO_KEYS = keyof typeof ASPECT_RATIO

const DEF_ASPECT_RATIO: ASPECT_RATIO_KEYS = 'RATIO_16_9'

export async function bliveWindow(room: Room) {
  // 查看是否已经打开过
  const findWin = lveRoomWindowMap.get(room.roomId)
  if (findWin) {
    findWin.show()
    return
  }

  const config = getRoomConfig(room.roomId)

  const size = 180 * ASPECT_RATIO[DEF_ASPECT_RATIO]
  const window = new LiveRoomWindow(room, {
    width: config?.width || size,
    height: config?.height || size,
    x: config?.x,
    y: config?.y,
    minWidth: 180,
    minHeight: 180,
    show: false,
    icon,
    frame: false,
    title: room.name,
    webPreferences: {
      preload: join(__dirname, '../preload/blive.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  window.setAspectRatio(ASPECT_RATIO[DEF_ASPECT_RATIO])
  window.webContents.insertCSS(insertCSS)

  window.on('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    window.loadURL(`https://live.bilibili.com/${room.roomId}?winId=${window.id}`)
  }

  window.on('close', () => {
    const [x, y] = window.getPosition()
    const { width, height } = window.getBounds()
    console.log({
      roomId: room.roomId,
      x,
      y,
      width,
      height
    })

    updateRoomConfig({
      roomId: room.roomId,
      x,
      y,
      width,
      height
    })
  })

  if (config?.alwaysOnTop) window.setAlwaysOnTop(true)

  new BliveHandle(window)

  return window
}
