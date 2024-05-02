import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import type { Room } from '@type/room'
import { emoticonsMap, roomMap } from '@main/utils/shared'
import { getRoomConfig, updateRoomConfig } from '@main/utils/lowdb'
import { getFace } from '@main/utils/getFaceImage'
import { ASPECT_RATIO_KEYS } from '@type/handle'
import { ASPECT_RATIO } from '@main/handles/bliveHandle'
import { getRoomPlayInfo } from '@main/utils/api'
import { css } from '@preload/utils/component'

const DEF_ASPECT_RATIO = ASPECT_RATIO_KEYS.RATIO_16_9
const getSize = (aspectRatio: ASPECT_RATIO_KEYS) => {
  switch (aspectRatio) {
    case ASPECT_RATIO_KEYS.RATIO_16_9:
      return {
        width: 640,
        height: 320,
        minWidth: 320,
        minHeight: 180
      }
    case ASPECT_RATIO_KEYS.RATIO_9_16:
      return {
        width: 320,
        height: 640,
        minWidth: 180,
        minHeight: 320
      }
  }
}

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

  const size = getSize(DEF_ASPECT_RATIO)

  const window = new BrowserWindow({
    width: config?.width || size.width,
    height: config?.height || size.height,
    minWidth: size.minWidth,
    minHeight: size.minHeight,
    icon,
    frame: false,
    title: room.name,
    backgroundColor: '#000',
    // show: false,
    webPreferences: {
      devTools: true,
      preload: join(__dirname, '../preload/blive.mjs'),
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  if (config.x !== undefined && config.y !== undefined) window.setPosition(config.x, config.y)

  // 添加进win map
  roomMap.set(window.id, room)

  // 默认16:9
  window.setAspectRatio(ASPECT_RATIO[DEF_ASPECT_RATIO])

  // 获取直播间信息看看是否是竖屏
  getRoomPlayInfo(room.roomId).then(({ data }) => {
    if (data.is_portrait) {
      const verticalSize = getSize(ASPECT_RATIO_KEYS.RATIO_9_16)

      window.setMinimumSize(verticalSize.minWidth, verticalSize.minHeight)

      window.setAspectRatio(ASPECT_RATIO.RATIO_9_16, {
        width: config?.width || verticalSize.width,
        height: config?.height || verticalSize.height
      })
    }
  })

  window.webContents.insertCSS(css`
    /** 拖拽栏 */
    body::after {
      content: '';
      -webkit-app-region: drag;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999999999;
      width: 100vw;
      height: 40px;
      opacity: 0;
    }

    html {
      background: #000;
    }
  `)

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  window.loadURL(`https://live.bilibili.com/blanc/${room.roomId}?winId=${window.id}`, {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
  })

  window.on('close', () => {
    // 从win map中移除
    roomMap.delete(window.id)
    emoticonsMap.delete(window.id)

    // 保存关闭前的位置
    const { width, height, x, y } = window.getBounds()

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
