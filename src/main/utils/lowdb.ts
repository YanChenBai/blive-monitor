import { JSONFileSyncPreset } from 'lowdb/node'
import { DB_PATH } from './paths'
import { randomUUID } from 'crypto'

interface WindowConfig {
  alwaysOnTop: boolean
  width?: number
  height?: number
  x?: number
  y?: number
}

export interface RoomConfig extends WindowConfig {
  roomId: string
  volume?: number
}
type DBType = {
  connectToken?: string
  main: WindowConfig
  config: RoomConfig[]
}

const defaultData: DBType = {
  main: {
    alwaysOnTop: false
  },
  config: []
}

export const db = JSONFileSyncPreset<DBType>(DB_PATH, defaultData)

/** 获取直播间配置 */
export function getRoomConfig(roomId: string) {
  let room = db.data.config.find((item) => item.roomId === roomId)
  if (room) {
    return room
  } else {
    room = { roomId, alwaysOnTop: false }
    db.data.config.push(room)
    db.write()
    return room
  }
}

/** 直播间更新的参数 */
type UpdateData = Partial<Omit<RoomConfig, 'roomId'>> & { roomId: string }

/** 更新直播间配置 */
export async function updateRoomConfig(newData: UpdateData) {
  const index = db.data.config.findIndex((item) => item.roomId === newData.roomId)
  if (index !== -1) {
    db.data.config[index] = { ...db.data.config[index], ...newData }
    db.write()
  }
}

/** 获取主窗口的配置 */
export function getMainWindowConfig() {
  return db.data.main
}

/** 更新主窗口的配置 */
export function updateMainWindowConfig(newData: Partial<WindowConfig>) {
  db.data.main = { ...db.data.main, ...newData }
  db.write()
}

/** 获取连接token */
export function getConnectToken() {
  if (db.data.connectToken) {
    return db.data.connectToken
  } else {
    const connectToken = randomUUID().replaceAll('-', '').substring(0, 10)
    db.data.connectToken = connectToken
    db.write()
    return connectToken
  }
}
