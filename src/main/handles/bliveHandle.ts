import { Menu, type IpcMainInvokeEvent, MenuItem, MenuItemConstructorOptions } from 'electron'
import { IPCHandle, method, handle } from '@main/utils/ipcHandle'
import { getRoomConfig, updateRoomConfig } from '@main/utils/lowdb'
import { Room } from '@main/types/window'
import { ASPECT_RATIO, type ASPECT_RATIO_KEYS } from '@main/windows/blive'

export interface BliveHandleInterface {
  /** 最小化  */
  minWin(): void

  /** 关闭 */
  closeWin(): void

  /** 设置置顶/取消置顶  */
  setAlwaysOnTop(ev: IpcMainInvokeEvent, status: boolean): Promise<void>

  /** 获取置顶状态 */
  getAlwaysOnTop(): Promise<boolean>

  /** 打开右键菜单 */
  openContextMenu(): void

  /** 最大化或取消最大化 */
  switchMaximize(): void

  /** 获取房间信息 */
  getRoomInfo(): Room

  /** 设置比例 */
  setAspectRatio(ev: IpcMainInvokeEvent, value: ASPECT_RATIO_KEYS): void

  /** 设置持久化音量 */
  setVolume(ev: IpcMainInvokeEvent, value: number): Promise<void>

  /** 获取持久化音量 */
  getVolume(): Promise<number>
}

@handle('blive')
export class BliveHandle extends IPCHandle implements BliveHandleInterface {
  maximizeLabel = '最大化'
  unMaximizeLabel = '取消最大化'

  contextMenu: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: '最小化',
      role: 'minimize'
    },
    {
      label: this.maximizeLabel,
      click: () => this.switchMaximize()
    },
    {
      type: 'separator'
    },
    {
      label: '关闭 ಠ_ಠ',
      role: 'close'
    }
  ]

  @method
  minWin() {
    this.window.minimize()
  }

  @method
  closeWin() {
    this.window.close()
  }

  @method
  async setAlwaysOnTop(_ev: IpcMainInvokeEvent, status: boolean) {
    this.window.setAlwaysOnTop(status)

    return await updateRoomConfig({
      roomId: this.window.room.roomId,
      alwaysOnTop: status
    })
  }

  @method
  async getAlwaysOnTop() {
    return getRoomConfig(this.window.room.roomId)?.alwaysOnTop ?? false
  }

  @method
  setAspectRatio(_ev: IpcMainInvokeEvent, value: ASPECT_RATIO_KEYS) {
    this.window.setAspectRatio(ASPECT_RATIO[value])
  }

  @method
  async setVolume(_ev: IpcMainInvokeEvent, value: number) {
    return await updateRoomConfig({
      roomId: this.window.room.roomId,
      volume: value
    })
  }

  @method
  async getVolume(): Promise<number> {
    return getRoomConfig(this.window.room.roomId)?.volume || 30
  }

  @method
  getRoomInfo() {
    return this.window.room
  }

  @method
  switchMaximize() {
    if (this.window.isMaximized()) {
      this.window.unmaximize()
      this.contextMenu[1].label = this.maximizeLabel
    } else {
      this.window.maximize()
      this.contextMenu[1].label = this.unMaximizeLabel
    }
  }

  @method
  openContextMenu() {
    Menu.buildFromTemplate(this.contextMenu).popup()
  }
}
