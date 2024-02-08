import { BrowserWindow } from 'electron'
import { Room } from '@main/types/window'

class WindowMap<K, T> extends Map<K, T> {
  find(call: (item: T, key: K) => boolean) {
    for (const [key, item] of this) {
      if (call(item, key)) {
        return item
      }
    }
    return undefined
  }
}

export const liveRoomWindowMap = new WindowMap<string, { window: BrowserWindow; room: Room }>()
