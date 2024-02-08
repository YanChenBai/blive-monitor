import { type IpcMainInvokeEvent } from 'electron'
import { IPCHandle, method, handle } from '@main/utils/ipcHandle'
import type { Room } from '@main/types/window'
import { getRoomInfo, getManyRoomInfo, ManyRoomItem } from '@main/utils/api'
import { bliveWindow } from '@main/windows/blive'
import { biliHomeWindew } from '@main/windows/biliHome'
export interface MainHandleInterface {
  /** 最小化  */
  minWin(): void

  /** 关闭 */
  closeWin(): void

  /** 获取房间信息 */
  getRoomInfo(ev: IpcMainInvokeEvent, room_id: string): Promise<Room>

  /** 批量获取直播间信息 */
  getManyRoomInfo(ev: IpcMainInvokeEvent, uids: string[]): Promise<Record<string, ManyRoomItem>>

  /** 打开直播间 */
  openLiveRoom(_ev: Electron.IpcMainInvokeEvent, room: Room): void

  /** 打开b站直播主页 */
  openBiliHome(): void
}

@handle('main')
export class MainHandle extends IPCHandle implements MainHandleInterface {
  @method
  minWin() {
    this.window.minimize()
  }

  @method
  closeWin() {
    this.window.close()
  }

  @method
  async getRoomInfo(_ev: Electron.IpcMainInvokeEvent, room_id: string) {
    return await getRoomInfo(room_id)
  }

  @method
  async getManyRoomInfo(_ev: Electron.IpcMainInvokeEvent, uids: string[]) {
    return await getManyRoomInfo(uids)
  }

  @method
  openLiveRoom(_ev: Electron.IpcMainInvokeEvent, room: Room) {
    bliveWindow(room)
  }

  @method
  openBiliHome() {
    biliHomeWindew()
  }
}
