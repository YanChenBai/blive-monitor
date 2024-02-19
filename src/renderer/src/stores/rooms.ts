import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Room } from '@type/room'

export enum ResultMesg {
  /** 成功 */
  OK,
  /** 空的 */
  Empty,
  /** 格式错误 */
  Format,
  /** 重复 */
  Repeat,
  /** 未找到 */
  NotFound,
  /** 错误 */
  Error
}

const regex = /^\d+$/

export const useRoomsStore = defineStore(
  'rooms',
  () => {
    const rooms = ref<Room[]>([])

    /**
     *
     * @param roomId 房间id
     * @returns
     */
    async function add(roomId: string) {
      roomId = roomId.trim()
      if (!regex.test(roomId)) return ResultMesg.Format
      if (roomId.length <= 0) return ResultMesg.Empty

      const room = await window.mainInvoke.getRoomInfo(roomId)
      const index = rooms.value.findIndex((item) => item.roomId === room.roomId)
      room.tags = room.tags.replace(new RegExp(',', 'g'), ' ')

      if (index === -1) {
        rooms.value.push(room)
        return ResultMesg.OK
      } else {
        rooms.value[index] = room
        return ResultMesg.Repeat
      }
    }

    /**
     * 删除房间
     * @param roomId 房间id
     * @returns
     */
    function remove(roomId: string) {
      const findIndex = rooms.value.findIndex((item) => item.roomId === roomId)
      if (findIndex === -1) return ResultMesg.NotFound
      rooms.value.splice(findIndex, 1)
      return ResultMesg.OK
    }

    /**
     * 刷新
     * @returns
     */
    async function refresh() {
      try {
        const uids = rooms.value.map((item) => item.uid)
        const res = await window.mainInvoke.getManyRoomInfo(uids)

        for (const key in res) {
          const findIndex = rooms.value.findIndex((item) => item.uid === key)
          if (findIndex !== -1) {
            const { title, face, name, liveStatus, keyframe, tags } = res[key]
            rooms.value[findIndex] = {
              ...rooms.value[findIndex],
              title,
              face,
              name,
              liveStatus,
              keyframe,
              tags
            }
          }
        }

        return ResultMesg.OK
      } catch (error) {
        return ResultMesg.Error
      }
    }

    return { rooms, add, remove, refresh }
  },
  {
    persist: true
  }
)
