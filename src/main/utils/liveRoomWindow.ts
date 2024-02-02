import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { Room } from '@main/types/window'

export const windowMap: Map<number, LiveRoomWindow> = new Map()

export class LiveRoomWindow extends BrowserWindow {
  room: Room

  constructor(room: Room, options: BrowserWindowConstructorOptions) {
    super(options)
    this.room = room

    // 维护窗口实例
    this.addListener('close', () => {
      windowMap.delete(this.id)
    })

    windowMap.set(this.id, this)
  }
}
