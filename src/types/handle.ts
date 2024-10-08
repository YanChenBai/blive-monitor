import type { BrowserWindow as BW } from 'electron'
import type { ManyRoomItem, Room } from './room'
import type { SimpleEmoticons } from './emoji'

export enum ASPECT_RATIO_KEYS {
  RATIO_16_9 = 'RATIO_16_9',
  RATIO_9_16 = 'RATIO_9_16',
}

export interface BliveHandleInterface {
  /** 最小化  */
  minWin: (win: BW) => void

  /** 显示  */
  showWin: (win: BW) => void

  /** 关闭 */
  closeWin: (win: BW) => void

  /** 设置置顶/取消置顶  */
  setAlwaysOnTop: (win: BW, status: boolean) => void

  /** 获取置顶状态 */
  getAlwaysOnTop: (win: BW) => boolean

  /** 获取房间信息 */
  getRoom: (win: BW) => Room

  /** 设置比例 */
  setAspectRatio: (win: BW, value: ASPECT_RATIO_KEYS) => void

  /** 设置持久化音量 */
  setVolume: (win: BW, volume: number) => Promise<void>

  /** 获取持久化音量 */
  getVolume: (win: BW) => number

  /** 输出持久化日志 */
  log: (win: BW, message: string, ...args: any[]) => void

  /** 把表情包存进map */
  addEmoticons: (win: BW, emoticons: SimpleEmoticons[]) => void

  /** 设置最大可输入的弹幕长度 */
  setMaxlen: (win: BW, maxlen: number) => void
}

export interface MainHandleInterface {
  /** 最小化  */
  minWin: (win: BW) => void

  /** 关闭 */
  closeWin: (win: BW) => void

  /** 获取房间信息 */
  getRoomInfo: (win: BW, roomId: string) => Promise<Room>

  /** 批量获取直播间信息 */
  getManyRoomInfo: (win: BW, uids: string[]) => Promise<Record<string, ManyRoomItem>>

  /** 打开直播间 */
  openLiveRoom: (win: BW, room: Room) => void

  /** 打开b站直播主页 */
  openBiliHome: (win: BW) => void

  /** 获取窗口数量 */
  winCount: (win: BW) => number

  /** 获取连接信息 */
  getConnectInfo: () => {
    ip?: string
    token: string
  }

  /** 重新设置窗口位置 */
  resetBliveWinPosition: (win: BW, room: Room) => void
}
