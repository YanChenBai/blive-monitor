import { Menu, type IpcMainInvokeEvent, MenuItem, MenuItemConstructorOptions } from 'electron'
import { IPCService, method, service } from '../utils/ipcService'
import { db } from '../utils/lowdb'

export interface BliveInterface {
  minWin(): void
  closeWin(): void
  setAlwaysOnTop(ev: IpcMainInvokeEvent, status: boolean): void
  getAlwaysOnTop(): boolean
  openContextMenu(): void
  moveWin(ev: IpcMainInvokeEvent, x: number, y: number): void
  switchMaximize(): void
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
    console.log(this.contextMenu)

    Menu.buildFromTemplate(this.contextMenu).popup()
  }

  @method
  moveWin(_ev: Electron.IpcMainInvokeEvent, x: number, y: number): void {
    const bounds = this.window.getBounds()
    this.window.setPosition(x + bounds.x, y + bounds.y, true)
  }
}
