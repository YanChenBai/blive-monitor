import '@preload/components/controlBar'
import '@preload/components/controlBtn'
import '@preload/components/danmuSend'
import '@preload/components/emoji'
import '@preload/components/userInfo'
import '@preload/components/changeVolume'

import { BliveInvoke } from '@preload/utils/invoke'
import { ControlBar } from '@preload/components/controlBar'
import { DanmuSend } from '@preload/components/danmuSend'
import { batchAdd, createComponent } from '@preload/utils/component'
import { getEmoticons } from '@preload/utils/api'
import { awaitLivePlayer } from './utils/livePlayer'
import { randomMouseMove } from './utils/randomMouseMove'
import { ChangeVolume } from '@preload/components/changeVolume'
import { autoLottery } from './utils/autoLottery'
import { UserInfo } from '@preload/components/userInfo'

const bliveInvoke = new BliveInvoke()
const controlBarEl = createComponent(ControlBar)
const danmuSendEl = createComponent(DanmuSend)
const userInfoEl = createComponent(UserInfo)
const changeVolume = createComponent(ChangeVolume)

/** 移除播放器日志的悬浮框显示状态 */
window.localStorage.removeItem('web-player-show-log')
window.localStorage.removeItem('web-player-show-videoinfo')

window.addEventListener('DOMContentLoaded', async () => {
  batchAdd(document.body, [controlBarEl, changeVolume])

  awaitLivePlayer().then((livePlayer) => {
    // 关闭弹幕侧边栏
    document.body.classList.add('hide-aside-area')
    // 启用网页全屏
    livePlayer.setFullscreenStatus(1)
  })

  // 获取直播间信息
  const room = await bliveInvoke.getRoom()

  // 添加主播信息展示
  userInfoEl.room = room
  document.body.append(userInfoEl)

  // 看看是否需要添加弹幕输入框
  try {
    const emoticons = await getEmoticons(room.roomId)

    danmuSendEl.data = emoticons
    document.body.appendChild(danmuSendEl)

    bliveInvoke.addEmoticons(
      emoticons.map(({ emoticons, pkg_id, pkg_name, current_cover, pkg_type }) => ({
        pkg_id,
        pkg_name,
        current_cover,
        pkg_type,
        emoticons: emoticons.map(({ perm, emoticon_unique, emoji, url }) => ({
          perm,
          emoticon_unique,
          emoji,
          url
        }))
      }))
    )

    // 自动抽奖
    autoLottery()
  } catch (error) {
    // 没有登入的话隐藏弹幕输入框按钮
    controlBarEl.setHideDanmuBtn = true
  }
})

// 5分钟随机触发鼠标移动事件, 防止b站的检测
setInterval(() => randomMouseMove(), 1000 * 60 * 5)
