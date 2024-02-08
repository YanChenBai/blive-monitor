import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { Room } from '@main/types/window'

export const lveRoomWindowMap: Map<string, LiveRoomWindow> = new Map()

export class LiveRoomWindow extends BrowserWindow {
  room: Room

  constructor(room: Room, options: BrowserWindowConstructorOptions) {
    super(options)
    this.room = room

    // 维护窗口实例
    lveRoomWindowMap.set(this.room.roomId, this)
    this.addListener('close', () => lveRoomWindowMap.delete(this.room.roomId))
  }
}
