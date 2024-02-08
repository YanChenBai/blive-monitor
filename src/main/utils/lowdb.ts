import { JSONFilePreset } from 'lowdb/node'
import { DB_PATH } from './paths'

export interface RoomConfig {
  roomId: string
  alwaysOnTop: boolean
  width?: number
  height?: number
  x?: number
  y?: number
  volume?: number
}

const defaultData: RoomConfig[] = []

export const db = await JSONFilePreset<RoomConfig[]>(DB_PATH, defaultData)

export function getRoomConfig(roomId: string) {
  let room = db.data.find((item) => item.roomId === roomId)
  if (room) {
    return room
  } else {
    room = { roomId, alwaysOnTop: false }
    db.data.push(room)
    db.write()
    return room
  }
}

type UpdateData = Partial<Omit<RoomConfig, 'roomId'>> & { roomId: string }
export async function updateRoomConfig(newData: UpdateData) {
  const index = db.data.findIndex((item) => item.roomId === newData.roomId)
  if (index !== -1) {
    db.data[index] = { ...db.data[index], ...newData }
    await db.write()
  }
}
