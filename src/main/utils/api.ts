import axios from 'axios'
import { RoomInfo, UserInfo, ManyUserInfo } from '../types/bili'
import lodash from 'lodash'
import { Room } from '@main/types/window'

/**
 * 获取直播间信息
 * @param room_id 房间号, 支持短号
 */
export async function getRoomInfo(room_id: string): Promise<Room> {
  const { uid, short_id, tags, live_status, title, keyframe } = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/get_info?id=${room_id}`
  )
    .then((res) => res.json() as Promise<RoomInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: res.data.uid,
          short_id: res.data.short_id,
          tags: res.data.tags,
          live_status: res.data.live_status,
          title: res.data.title,
          keyframe: res.data.keyframe
        }
      } else {
        return Promise.reject(res)
      }
    })

  return await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`)
    .then((res) => res.json() as Promise<UserInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: String(uid),
          roomId: String(res.data.room_id),
          shortId: String(short_id),
          name: res.data.info.uname,
          face: res.data.info.face,
          liveStatus: live_status,
          tags: tags,
          title,
          medalName: res.data.medal_name,
          keyframe
        }
      } else {
        return Promise.reject(res)
      }
    })
}

export type ManyRoomItem = Omit<Room, 'roomId' | 'medalName'>
export async function getManyRoomInfo(uids: string[]): Promise<Record<string, ManyRoomItem>> {
  const chunks = lodash.chunk(uids, 20)
  return Promise.all(
    chunks.map((item) =>
      axios
        .get<ManyUserInfo>('https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids', {
          params: {
            uids: item
          }
        })
        .then((res) => {
          if (res.data.code === 0) {
            const entries = Object.entries(res.data.data).map(([key, room]) => {
              const data: ManyRoomItem = {
                uid: String(room.uid),
                shortId: String(room.short_id),
                name: room.uname,
                face: room.face,
                liveStatus: room.live_status,
                tags: room.tags,
                title: room.title,
                keyframe: room.keyframe
              }

              return [key, data]
            })

            return Object.fromEntries(entries)
          } else {
            return Promise.reject(new Error(res.data.message))
          }
        })
    )
  ).then((res) =>
    res.reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {})
  )
}
