import '@preload/components/controlBar'
import '@preload/components/controlBtn'
import '@preload/components/danmuSend'
import '@preload/components/emoji'
import '@preload/components/userInfo'
import '@preload/components/dragNav'

import { BliveInvoke } from '@preload/utils/invoke'
import { ControlBar } from '@preload/components/controlBar'
import { DanmuSend } from '@preload/components/danmuSend'
import { batchAdd, createComponent } from '@preload/utils/component'
import { getEmoticons } from '@preload/utils/api'
import { awaitLivePlayer, awaitVideoEl } from './utils/livePlayer'
import { DragNav } from '@preload/components/dragNav'

const bliveInvoke = new BliveInvoke()
const controlBarEl = createComponent(ControlBar)
const danmuSendEl = createComponent(DanmuSend)
const dragNav = createComponent(DragNav)

batchAdd(document.body, [controlBarEl, dragNav])

awaitLivePlayer().then((livePlayer) => {
  // 关闭弹幕侧边栏
  document.body.classList.add('hide-aside-area')
  // 启用网页全屏
  livePlayer.setFullscreenStatus(1)
})

awaitVideoEl().then((videoEl) => {
  console.log(videoEl)
})

const room = await bliveInvoke.getRoomInfo()

// 看看是否需要添加弹幕输入框
try {
  const emoticons = await getEmoticons(room.roomId)
  danmuSendEl.data = emoticons
  document.body.appendChild(danmuSendEl)
} catch (error) {
  controlBarEl.hideDanmuBtn.value = true
}
