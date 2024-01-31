import { Menu, type IpcMainInvokeEvent, MenuItem, MenuItemConstructorOptions } from 'electron'
import { IPCService, method, service } from '../utils/ipcService'
import { db } from '../utils/lowdb'
import { Room } from '../types/window'

export interface BliveInterface {
  /** 最小化  */
  minWin(): void

  /** 关闭 */
  closeWin(): void

  /** 设置置顶/取消置顶  */
  setAlwaysOnTop(ev: IpcMainInvokeEvent, status: boolean): void

  /** 获取置顶状态 */
  getAlwaysOnTop(): boolean

  /** 打开右键菜单 */
  openContextMenu(): void

  /** 移动窗口 */
  moveWin(ev: IpcMainInvokeEvent, x: number, y: number): void

  /** 最大化或取消最大化 */
  switchMaximize(): void

  /** 获取房间信息 */
  getRoomInfo(): Room
}

@service('blive')
export class BliveService extends IPCService implements BliveInterface {
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

  private getRoomChain() {
    return db.chain.get('config').findLast({ roomId: this.window.room.roomId })
  }

  @method
  setAlwaysOnTop(_ev: IpcMainInvokeEvent, status: boolean) {
    this.window.setAlwaysOnTop(status)
    this.getRoomChain().update('alwaysOnTop', () => status)
  }

  @method
  getAlwaysOnTop() {
    return this.getRoomChain().value().alwaysOnTop
  }

  @method
  getRoomInfo() {
    console.log(this.window.room.roomId)

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

  @method
  moveWin(_ev: Electron.IpcMainInvokeEvent, x: number, y: number): void {
    const bounds = this.window.getBounds()
    this.window.setPosition(x + bounds.x, y + bounds.y, false)
  }
}
