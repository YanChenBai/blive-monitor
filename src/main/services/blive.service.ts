import { IPCService, method } from '../utils/ipcService'
import { LiveRoomWindow } from '../utils/liveRoomWindow'
import { db } from '../utils/lowdb'

export interface BliveInterface {
  name: string
  minWin(): void
  closeWin(): void
  setAlwaysOnTop(status: boolean): void
  getAlwaysOnTop(): boolean
  // setKeepAspectRatio(status: boolean): void
  // getKeepAspectRatio(): boolean
}

export class BliveService extends IPCService implements BliveInterface {
  constructor(window: LiveRoomWindow) {
    super('blive', window)
  }
  name = '1'

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
  setAlwaysOnTop(status: boolean) {
    this.window.setAlwaysOnTop(status)
    this.getRoomChain().update('alwaysOnTop', () => status)
  }

  @method
  getAlwaysOnTop() {
    return this.getRoomChain().value().alwaysOnTop
  }
}
