import { electronAPI } from '@electron-toolkit/preload'
import { ControlBar } from './components/controlBar'
import { registerComponent } from './components/registered'
import { DanmuSend } from './components/danmuSend'

window['electron'] = electronAPI

// const

// 注册组件
registerComponent()

window.onload = () => {
  const controlBarEl = document.createElement('control-bar') as ControlBar

  const danmuSendEl = document.createElement('danmu-send') as DanmuSend

  document.onmousemove = () => {
    controlBarEl.status.value = true
  }

  document.onmouseleave = () => {
    if (!danmuSendEl.isFocus) {
      controlBarEl.status.value = false
      danmuSendEl.status.value = false
    }
  }

  // 输入框打开时同时打开控制栏
  danmuSendEl.onShow = () => (controlBarEl.status.value = true)

  controlBarEl.switchDanmu = () => {
    const { status } = danmuSendEl
    status.value = !status.value
  }

  // 添加进body
  const els = [controlBarEl, danmuSendEl]
  els.forEach((dom) => document.body.appendChild(dom))
}
