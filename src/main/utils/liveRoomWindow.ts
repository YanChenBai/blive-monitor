import { EmoticonsMap } from '@type/emoji'
import type { Room } from '@type/room'

class MapPlus<K, T> extends Map<K, T> {
  find(call: (item: T, key: K) => boolean) {
    for (const [key, item] of this) {
      if (call(item, key)) {
        return item
      }
    }
    return undefined
  }

  findKey(call: (item: T, key: K) => boolean) {
    for (const [key, item] of this) {
      if (call(item, key)) {
        return key
      }
    }
    return undefined
  }
}

export const roomMap = new MapPlus<number, Room>()
export const emoticonsMap = new MapPlus<number, EmoticonsMap[]>()
