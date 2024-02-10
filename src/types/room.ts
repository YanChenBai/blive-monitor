export interface Room {
  uid: string // 账号id
  roomId: string // 房间id
  shortId: string // 房间短号, 没有时为0
  name: string // 主播名字
  face: string // 头像
  liveStatus: number // 直播状态, 0 下播, 1 直播, 2 轮播
  tags: string // 主播的标签
  title: string // 直播标题
  medalName: string // 粉丝牌名字
  keyframe: string // 封面
}

export type ManyRoomItem = Omit<Room, 'roomId' | 'medalName'>
