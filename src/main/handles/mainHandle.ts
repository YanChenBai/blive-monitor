import { IPCHandle, method, handle } from '@main/utils/ipcHandle'
import type { Room } from '@type/room'
import { getRoomInfo, getManyRoomInfo } from '@main/utils/api'
import { bliveWindow } from '@main/windows/blive'
import { biliHomeWindew } from '@main/windows/biliHome'
import { BrowserWindow as BW } from 'electron'
import { MainHandleInterface } from '@type/handle'
import { ip } from 'address'
import { getConnectToken } from '@main/utils/lowdb'

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
    return BW.getAllWindows().filter((w) => w !== win).length
  }

  @method
  getConnectInfo() {
    return {
      ip: ip(),
      token: getConnectToken()
    }
  }
}
