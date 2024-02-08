import { liveRoomWindowMap } from '@main/utils/liveRoomWindow'
import {
  Menu,
  type IpcMainInvokeEvent,
  MenuItem,
  MenuItemConstructorOptions,
  BrowserWindow
} from 'electron'
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
  setAlwaysOnTop(ev: IpcMainInvokeEvent, status: boolean): void

  /** 获取置顶状态 */
  getAlwaysOnTop(): Promise<boolean>

  /** 打开右键菜单 */
  openContextMenu(): void

  /** 最大化或取消最大化 */
  switchMaximize(): void

  /** 获取房间信息 */
  getRoom(): Room

  /** 设置比例 */
  setAspectRatio(value: ASPECT_RATIO_KEYS): void

  /** 设置持久化音量 */
  setVolume(ev: IpcMainInvokeEvent, value: number): Promise<void>

  /** 获取持久化音量 */
  getVolume(): number
}

@handle('blive')
export class BliveHandle extends IPCHandle implements BliveHandleInterface {
  maximizeLabel = '最大化'
  unMaximizeLabel = '取消最大化'
  room: Room
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

  constructor(window: BrowserWindow) {
    super(window)
    const item = liveRoomWindowMap.find((item) => item.window.id === window.id)
    if (item) {
      this.room = item.room
    } else {
      console.log(12313123123132)

      throw new Error('未找到窗口')
    }
  }

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

    await updateRoomConfig({
      roomId: this.room.roomId,
      alwaysOnTop: status
    })
  }

  @method
  async getAlwaysOnTop() {
    return (await getRoomConfig(this.room.roomId))?.alwaysOnTop ?? false
  }

  @method
  setAspectRatio(value: ASPECT_RATIO_KEYS) {
    this.window.setAspectRatio(ASPECT_RATIO[value])
  }

  @method
  async setVolume(_ev: IpcMainInvokeEvent, value: number) {
    await updateRoomConfig({
      roomId: this.room.roomId,
      volume: value
    })
  }

  @method
  getVolume() {
    return getRoomConfig(this.room.roomId)?.volume ?? 30
  }

  @method
  getRoom() {
    return this.room
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
