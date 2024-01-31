import { BliveService } from './utils/invoke'
import './components/controlBar'
import './components/controlBtn'
import './components/danmuSend'
import './components/emoji'

import { ControlBar } from './components/controlBar'
import { DanmuSend } from './components/danmuSend'
import { batchAdd, createComponent } from './utils/component'
import { getEmoticons } from './utils/api'

window.onload = async () => {
  const bliveService = new BliveService()

  const room = await bliveService.getRoomInfo()

  const controlBarEl = createComponent(ControlBar)
  const danmuSendEl = createComponent(DanmuSend)

  try {
    const emoticons = await getEmoticons(room.roomId)
    danmuSendEl.data = emoticons
  } catch (error) {
    controlBarEl.hideDanmuBtn.value = true
  }

  batchAdd(document.body, [controlBarEl, danmuSendEl])
}
