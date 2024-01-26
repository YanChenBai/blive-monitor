import { ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { html } from './utils/createComponent'
import { ControlBtn } from './components/controlBtn'
import { ControlBar } from './components/controlBar'
import { EmojiItem, EmojiWrap } from './components/emoji'
import { mockGetEmoticons } from './mock'

window['electron'] = electronAPI
window['getWinid'] = () => ipcRenderer.invoke('GetWinid')

customElements.define('control-bar', ControlBar)
customElements.define('control-btn', ControlBtn)
customElements.define('emoji-wrap', EmojiWrap)
customElements.define('emoji-item', EmojiItem)

window.onload = () => {
  const controlBarEl = document.createElement('control-bar') as ControlBar
  const emojiWrapEl = document.createElement('emoji-wrap') as EmojiWrap
  emojiWrapEl.data = mockGetEmoticons.data.data

  controlBarEl.innerHTML = html` <div id="control-wrap" slot="content">
    <control-btn color="rgb(243, 59, 99)" content="关闭" title="关闭窗口"></control-btn>
    <control-btn color="#00aeec" content="最小" title="窗口最小化"></control-btn>
    <control-btn color="#f288a6ff" content="弹幕" title="弹幕快捷发送"></control-btn>
    <control-btn color="#64d496" content="置顶" title="窗口置顶"></control-btn>
    <control-btn color="#fbc94b" content="比例" title="窗口比例锁定"></control-btn>
  </div>`

  document.onmousemove = () => {
    controlBarEl.status.value = true
  }

  document.onmouseleave = () => {
    controlBarEl.status.value = true
  }

  console.log(emojiWrapEl.getEmojiList(0))

  const els = [controlBarEl, emojiWrapEl]
  els.forEach((item) => document.body.appendChild(item))
}
