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
import { awaitLivePlayer, awaitVideoEl } from './utils/livePlayer'
import { randomMouseMove } from './utils/randomMouseMove'
import { ChangeVolume } from '@preload/components/changeVolume'
import { autoLottery } from './utils/autoLottery'
import { UserInfo } from '@preload/components/userInfo'
import { Emoticon } from '@type/emoji'
import { fullScreenStyle } from '@preload/components/css'

const bliveInvoke = new BliveInvoke()
const controlBarEl = createComponent(ControlBar)
const danmuSendEl = createComponent(DanmuSend)
const userInfoEl = createComponent(UserInfo)
const changeVolume = createComponent(ChangeVolume)

/** 移除播放器日志的悬浮框显示状态 */
window.localStorage.removeItem('web-player-show-log')
window.localStorage.removeItem('web-player-show-videoinfo')

function getKeyField(emoticons: Emoticon[]) {
  return emoticons.map(({ perm, emoticon_unique, emoji, url }) => ({
    perm,
    emoticon_unique,
    emoji,
    url
  }))
}

function insertCSSOnStyle() {
  const style = document.createElement('style')
  style.innerHTML = fullScreenStyle
  document.head.appendChild(style)
}

function hiddenHtml() {
  document.body.style['-webkit-app-region'] = 'drag'
  const htmlElement = document.documentElement
  htmlElement.style.overflow = 'hidden'
  htmlElement.style.filter = 'brightness(0)'
}

function showHtml() {
  document.body.style['-webkit-app-region'] = ''
  const htmlElement = document.documentElement
  htmlElement.style.overflow = ''
  htmlElement.style.filter = ''
}

document.addEventListener('DOMContentLoaded', () => hiddenHtml())

window.addEventListener('load', async () => {
  batchAdd(document.body, [controlBarEl, changeVolume])

  awaitLivePlayer().then(async (livePlayer) => {
    try {
      const { liveStatus } = livePlayer.getPlayerInfo()
      if (liveStatus === 0) {
        insertCSSOnStyle()
      } else {
        await awaitVideoEl().then(() => {
          livePlayer.refresh()
          insertCSSOnStyle()
        })
      }

      // 关闭弹幕侧边栏
      document.body.classList.add('hide-aside-area')
      // 启用网页全屏
      livePlayer.setFullscreenStatus(1)
    } finally {
      showHtml()
    }
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
    danmuSendEl.room = room

    document.body.appendChild(danmuSendEl)

    bliveInvoke.setMaxlen(danmuSendEl.maxlen.value)
    bliveInvoke.addEmoticons(
      emoticons.map(
        ({ emoticons, pkg_id, pkg_name, current_cover, pkg_type, recently_used_emoticons }) => ({
          pkg_id,
          pkg_name,
          current_cover,
          pkg_type,
          used: getKeyField(recently_used_emoticons),
          emoticons: getKeyField(emoticons)
        })
      )
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
