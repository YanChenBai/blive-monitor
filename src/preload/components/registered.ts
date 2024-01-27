import { ControlBtn } from './controlBtn'
import { ControlBar } from './controlBar'
import { EmojiItem, EmojiTabs, EmojiTab, EmojiTabHeader } from './emoji'
import { DanmuSend } from './danmuSend'

interface Register {
  name: string
  component: typeof HTMLElement
}

// 注册组件
const registerList: Register[] = [
  {
    name: 'emoji-tabs',
    component: EmojiTabs
  },
  {
    name: 'emoji-tab',
    component: EmojiTab
  },
  {
    name: 'emoji-item',
    component: EmojiItem
  },
  {
    name: 'emoji-tab-header',
    component: EmojiTabHeader
  },
  {
    name: 'control-bar',
    component: ControlBar
  },
  {
    name: 'control-btn',
    component: ControlBtn
  },
  {
    name: 'danmu-send',
    component: DanmuSend
  }
]

export function registerComponent() {
  registerList.forEach((item) => {
    customElements.define(item.name, item.component)
  })
}
