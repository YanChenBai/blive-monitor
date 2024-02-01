import { BliveService } from '@preload/utils/invoke'
import '@preload/components/controlBar'
import '@preload/components/controlBtn'
import '@preload/components/danmuSend'
import '@preload/components/emoji'

import { ControlBar } from '@preload/components/controlBar'
import { DanmuSend } from '@preload/components/danmuSend'
import { batchAdd, createComponent } from '@preload/utils/component'
import { getEmoticons } from '@preload/utils/api'

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
