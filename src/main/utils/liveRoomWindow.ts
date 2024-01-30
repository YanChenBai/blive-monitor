import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { Room } from '../types/window'

export class LiveRoomWindow extends BrowserWindow {
  room: Room
  constructor(room: Room, options: BrowserWindowConstructorOptions) {
    super(options)
    this.room = room
  }
}
