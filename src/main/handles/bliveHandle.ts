import { emoticonsMap, roomMap, userConfig } from '@main/utils/shared'
import { IPCHandle, method, handle } from '@main/utils/ipcHandle'
import { getRoomConfig, updateRoomConfig } from '@main/utils/lowdb'
import { BrowserWindow as BW } from 'electron'
import { ASPECT_RATIO_KEYS, BliveHandleInterface } from '@type/handle'
import { logger } from '@main/utils/logger'
import { SimpleEmoticons } from '@type/emoji'

export const ASPECT_RATIO = {
  [ASPECT_RATIO_KEYS.RATIO_16_9]: 16 / 9,
  [ASPECT_RATIO_KEYS.RATIO_9_16]: 9 / 16
}

@handle('blive')
export class BliveHandle extends IPCHandle implements BliveHandleInterface {
  @method
  minWin(win: BW) {
    win.minimize()
  }

  @method
  showWin(win: BW) {
    win.show()
  }

  @method
  closeWin(win: BW) {
    win.close()
  }

  @method
  async setAlwaysOnTop(win: BW, status: boolean) {
    win.setAlwaysOnTop(status)

    const { roomId } = this.getRoom(win)

    await updateRoomConfig({ roomId, alwaysOnTop: status })
  }

  @method
  getAlwaysOnTop(win: BW) {
    const { roomId } = this.getRoom(win)
    return getRoomConfig(roomId)?.alwaysOnTop ?? false
  }

  @method
  setAspectRatio(win: BW, value: ASPECT_RATIO_KEYS) {
    win.setAspectRatio(ASPECT_RATIO[value])
  }

  @method
  async setVolume(win: BW, volume: number) {
    const { roomId } = this.getRoom(win)
    await updateRoomConfig({ roomId, volume })
  }

  @method
  getVolume(win: BW) {
    const { roomId } = this.getRoom(win)
    return getRoomConfig(roomId)?.volume ?? 30
  }

  @method
  getRoom(win: BW) {
    const room = roomMap.get(win.id)
    if (room) {
      return room
    } else {
      throw new Error('未找到房间信息')
    }
  }

  @method
  log(_win: BW, message: string, ...args: any[]) {
    logger.error(message, ...args)
  }

  @method
  addEmoticons(win: BW, emoticons: SimpleEmoticons[]) {
    if (!emoticonsMap.has(win.id)) emoticonsMap.set(win.id, emoticons)
  }

  @method
  setMaxlen(_win: BW, maxlen: number) {
    if (userConfig.maxlen !== maxlen) userConfig.maxlen = maxlen
  }
}
