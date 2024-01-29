import './components/controlBar'
import './components/controlBtn'
import './components/danmuSend'
import './components/emoji'

// import { electronAPI } from '@electron-toolkit/preload'

import { ControlBar } from './components/controlBar'
import { DanmuSend } from './components/danmuSend'
import { batchAdd, createComponent } from './utils/component'

window.onload = () => {
  const controlBarEl = createComponent(ControlBar)
  const danmuSendEl = createComponent(DanmuSend)

  batchAdd(document.body, [controlBarEl, danmuSendEl])
}
