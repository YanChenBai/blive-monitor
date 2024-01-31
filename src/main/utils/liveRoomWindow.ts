import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { Room } from '../types/window'

export const windowInstances: LiveRoomWindow[] = []

export class LiveRoomWindow extends BrowserWindow {
  room: Room

  constructor(room: Room, options: BrowserWindowConstructorOptions) {
    super(options)
    this.room = room

    // 维护窗口实例
    this.addListener('close', () => {
      const index = windowInstances.findIndex((item) => item.id === this.id)
      if (index !== -1) {
        console.log(windowInstances.splice(index, 1))
      }
    })

    windowInstances.push(this)
  }
}
