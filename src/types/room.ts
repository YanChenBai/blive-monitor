export interface Room {
  /** 账号id */
  uid: string

  /** 房间id */
  roomId: string

  /** 房间短号, 没有时为0 */
  shortId: string

  /** 主播名字 */
  name: string

  /** 主播头像 */
  face: string

  /** 直播状态, 0 下播, 1 直播, 2 轮播 */
  liveStatus: number

  /** 主播的标签 */
  tags: string

  /** 直播标题 */
  title: string

  /** 粉丝牌名字 */
  medalName: string

  /** 封面 */
  keyframe: string
}

export type ManyRoomItem = Omit<Room, 'roomId' | 'medalName'>
