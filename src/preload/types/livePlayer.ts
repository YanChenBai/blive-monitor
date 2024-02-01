export interface LivePlayer {
  NAME: string
  VERSION: string
  addLoadingPicture: () => void
  appendCtrlItem: () => void
  /** 截图 */
  capturePic: () => string
  changeCtrlIconVisible: () => void
  changeCtrlVisible: () => void
  changeDanmakuExtraConfig: () => void
  changeUIStatus: () => void
  destroy: () => void
  discardFrame: () => void
  featSupport: () => void
  freeze: () => void
  getAudioTracks: () => void
  getOperableElements: () => void
  getP2PTransport: () => void
  getPlayerInfo: () => {
    type: number
    version: string
    playerType: string
    liveStatus: number
    playerStatus: number
    playingStatus: boolean
    playurl: string
    guid: string
    quality: string
    qualityCandidates: { qn: string; desc: string }[]
    timeShift: number
    volume: {
      disabled: boolean
      value: number
    }
  }

  getVideoEl: () => HTMLVideoElement
  init: () => void
  injectInitAPIData: () => void
  loadVideo: () => void
  noticeGift: () => void
  notifyAnnouncement: () => void
  notifyInOperation: () => void
  on: () => void
  once: () => void
  pause: () => void
  play: () => void
  refresh: () => void
  reload: () => void
  remainBufferLength: () => void
  /** 重置弹幕容器大小  */
  resize: () => void
  sendDanmaku: (options: {
    msg: string
    mode?: number
    bubble?: number
    dm_type?: number
    emoticonOptions?: {
      bulgeDisplay: number
      emoji: string
      emoticonUnique: string
      height: number
      inPlayerArea: number
      isDynamic: number
      url: string
      width: number
    }
  }) => Promise<{
    code: number
    data: {
      mode_info: { mode: number; show_player_type: number; extra: string }
      dm_v2: object
    }
    message: string
    msg: string
  }>
  sendGift: () => void
  set: () => void
  setBottomBar: () => void
  setChasingFrameThreshold: () => void
  setDanmaku: () => void
  setFullscreenDanmaku: () => void
  /**
   * 切换全屏状态
   * @param status 0 - 全屏, 1 - 网页全屏
   *  */
  setFullscreenStatus: (status: number) => void
  setToastCssText: () => void
  stopPlayback: () => void
  supportMaskDanmaku: () => void
  switchAudioTrack: () => void
  switchQuality: () => void
  toast: () => void
  updateDMSetting: () => void
  userFeedback: () => void
  volume: (value: number) => void
}
