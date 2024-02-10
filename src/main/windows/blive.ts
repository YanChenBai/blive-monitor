import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import type { Room } from '@type/room'
import { roomMap } from '@main/utils/liveRoomWindow'
import { insertCSS } from './css'
import { getRoomConfig, updateRoomConfig } from '@main/utils/lowdb'
import { getFace } from '@main/utils/getFaceImage'
import { ASPECT_RATIO_KEYS } from '@type/handle'
import { ASPECT_RATIO } from '@main/handles/bliveHandle'

const DEF_ASPECT_RATIO = ASPECT_RATIO_KEYS.RATIO_16_9

export async function bliveWindow(room: Room) {
  // 查看是否已经打开过
  const winId = roomMap.findKey((item) => item.roomId === room.roomId)
  if (winId) {
    const findWin = BrowserWindow.getAllWindows().find((item) => item.id === winId)
    if (findWin) findWin.show()
    return
  }

  const config = getRoomConfig(room.roomId)
  const icon = await getFace(room.face)

  const size = 180 * ASPECT_RATIO[DEF_ASPECT_RATIO]
  const window = new BrowserWindow({
    width: config?.width || size,
    height: config?.height || size,
    x: config?.x,
    y: config?.y,
    minWidth: 180,
    minHeight: 180,
    icon,
    frame: false,
    title: room.name,
    titleBarStyle: 'hidden',
    backgroundColor: '#000',
    webPreferences: {
      preload: join(__dirname, '../preload/blive.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // 添加进win map
  roomMap.set(window.id, room)

  window.setAspectRatio(ASPECT_RATIO[DEF_ASPECT_RATIO])
  window.webContents.insertCSS(insertCSS)

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  window.loadURL(`https://live.bilibili.com/${room.roomId}?winId=${window.id}`)

  window.on('close', () => {
    // 从win map中移除
    roomMap.delete(window.id)

    // 保存关闭前的位置
    const [x, y] = window.getPosition()
    const { width, height } = window.getBounds()

    updateRoomConfig({
      roomId: room.roomId,
      x,
      y,
      width,
      height
    })
  })

  if (config?.alwaysOnTop) window.setAlwaysOnTop(true)

  return window
}
