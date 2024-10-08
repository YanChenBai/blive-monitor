import { IPCHandle, handle, method } from '@main/utils/ipcHandle'
import type { Room } from '@type/room'
import { getManyRoomInfo, getRoomInfo } from '@main/utils/api'
import { bliveWindow } from '@main/windows/blive'
import { biliHomeWindew } from '@main/windows/biliHome'
import { BrowserWindow as BW, BrowserWindow } from 'electron'
import type { MainHandleInterface } from '@type/handle'
import { getConnectToken } from '@main/utils/lowdb'
import { getLocalIP } from '@main/utils/getLocalIP'
import { roomMap } from '@main/utils/shared'

@handle('main')
export class MainHandle extends IPCHandle implements MainHandleInterface {
  @method
  minWin(win: BW) {
    win.minimize()
  }

  @method
  closeWin(win: BW) {
    win.close()
  }

  @method
  async getRoomInfo(_win: BW, roomId: string) {
    return await getRoomInfo(roomId)
  }

  @method
  async getManyRoomInfo(_win: BW, uids: string[]) {
    return await getManyRoomInfo(uids)
  }

  @method
  openLiveRoom(_win: BW, room: Room) {
    bliveWindow(room)
  }

  @method
  openBiliHome() {
    biliHomeWindew()
  }

  @method
  winCount(win: BW) {
    return BW.getAllWindows().filter(w => w !== win).length
  }

  @method
  getConnectInfo() {
    return {
      ip: getLocalIP(),
      token: getConnectToken(),
    }
  }

  @method
  resetBliveWinPosition(_win: BW, room: Room) {
    const winId = roomMap.findKey(item => item.roomId === room.roomId)

    if (!winId)
      return

    const win = BrowserWindow.getAllWindows().find(item => item.id === winId)
    if (!win)
      return

    win.setPosition(10, 10)
  }
}
