import type { IpcMainInvokeEvent } from 'electron'
import { IPCService, method, service } from '../utils/ipcService'

import { db } from '../utils/lowdb'

export interface BliveInterface {
  minWin(): void
  closeWin(): void
  setAlwaysOnTop(ev: IpcMainInvokeEvent, status: boolean): void
  getAlwaysOnTop(): boolean
}

@service('blive')
export class BliveService extends IPCService implements BliveInterface {
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
  setAlwaysOnTop(ev: IpcMainInvokeEvent, status: boolean) {
    this.window.setAlwaysOnTop(status)
    this.getRoomChain().update('alwaysOnTop', () => status)
  }

  @method
  getAlwaysOnTop() {
    return this.getRoomChain().value().alwaysOnTop
  }
}
